import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { success, fail } from "../../lib/response.js";
import { indexDocument, removeDocument, getClient } from "../../lib/search.js";

const router = Router();

// 所有路由需要认证
router.use(authenticateToken);

/**
 * 重新索引所有产品和新闻到搜索服务
 * POST /api/admin/search/reindex
 */
router.post("/reindex", async (req, res) => {
  try {
    const c = getClient();
    if (!c) {
      fail(res, "搜索服务未配置", 500);
      return;
    }

    let productsIndexed = 0;
    let newsIndexed = 0;
    let productsRemoved = 0;
    let newsRemoved = 0;

    // 获取所有已发布的产品
    const products = await prisma.product.findMany({
      where: { isPublished: true },
    });

    // 获取所有未发布的产品（需要从索引中删除）
    const unpublishedProducts = await prisma.product.findMany({
      where: { isPublished: false },
    });

    // 获取所有已发布的新闻
    const news = await prisma.news.findMany({
      where: { isPublished: true },
    });

    // 索引产品
    for (const product of products) {
      await indexDocument("products", {
        id: product.id,
        name: product.name,
        description: product.description || "",
        detail: product.detail || "",
        categoryId: product.categoryId,
        isPublished: product.isPublished,
        sort: product.sort,
        createdAt: product.createdAt.getTime(),
      });
      productsIndexed++;
    }

    // 从索引中删除未发布的产品
    for (const product of unpublishedProducts) {
      await removeDocument("products", product.id);
      productsRemoved++;
    }

    // 索引新闻
    for (const item of news) {
      await indexDocument("news", {
        id: item.id,
        title: item.title,
        summary: item.summary || "",
        content: item.content || "",
        isPublished: item.isPublished,
        createdAt: item.createdAt.getTime(),
      });
      newsIndexed++;
    }

    success(res, {
      message: "索引重建完成",
      productsIndexed,
      productsRemoved,
      newsIndexed,
    });
  } catch (error) {
    console.error("重建搜索索引失败:", error);
    fail(res, "重建搜索索引失败");
  }
});

/**
 * 获取搜索索引状态
 * GET /api/admin/search/status
 */
router.get("/status", async (req, res) => {
  try {
    const c = getClient();
    if (!c) {
      fail(res, "搜索服务未配置", 500);
      return;
    }

    // 获取数据库中的数量
    const [dbProductsCount, dbNewsCount, publishedProductsCount, publishedNewsCount] = await Promise.all([
      prisma.product.count(),
      prisma.news.count(),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.news.count({ where: { isPublished: true } }),
    ]);

    // 获取索引中的数量
    let indexProductsCount = 0;
    let indexNewsCount = 0;
    try {
      const productsStats = await c.index("products").getStats();
      const newsStats = await c.index("news").getStats();
      indexProductsCount = productsStats.numberOfDocuments;
      indexNewsCount = newsStats.numberOfDocuments;
    } catch {
      // 索引可能不存在
    }

    success(res, {
      database: {
        totalProducts: dbProductsCount,
        publishedProducts: publishedProductsCount,
        totalNews: dbNewsCount,
        publishedNews: publishedNewsCount,
      },
      searchIndex: {
        products: indexProductsCount,
        news: indexNewsCount,
      },
      inSync: indexProductsCount === publishedProductsCount && indexNewsCount === publishedNewsCount,
    });
  } catch (error) {
    console.error("获取搜索状态失败:", error);
    fail(res, "获取搜索状态失败");
  }
});

export default router;
