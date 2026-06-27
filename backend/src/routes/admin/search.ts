import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// 所有路由需要认证
router.use(authenticateToken);

/**
 * 获取搜索数据状态
 * GET /api/admin/search/status
 */
router.get("/status", async (req, res) => {
  try {
    const [dbProductsCount, dbNewsCount, publishedProductsCount, publishedNewsCount] = await Promise.all([
      prisma.product.count(),
      prisma.news.count(),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.news.count({ where: { isPublished: true } }),
    ]);

    success(res, {
      database: {
        totalProducts: dbProductsCount,
        publishedProducts: publishedProductsCount,
        totalNews: dbNewsCount,
        publishedNews: publishedNewsCount,
      },
      searchMode: "mysql-like",
    });
  } catch (error) {
    console.error("获取搜索状态失败:", error);
    fail(res, "获取搜索状态失败");
  }
});

export default router;
