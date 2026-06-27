import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { success, fail } from "../../lib/response.js";
import { withCache } from "../../lib/cache.js";

const router = Router();

// GET / - 产品列表，支持分类筛选和分页
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = { isPublished: true };
    const categoryId = req.query.category_id;
    if (categoryId) {
      where.categoryId = parseInt(categoryId as string, 10);
    }

    const cacheKey = `products:list:${page}:${pageSize}:${categoryId || "all"}`;

    const result = await withCache(cacheKey, async () => {
      const [data, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy: { sort: "asc" },
          skip,
          take: pageSize,
          include: { category: true },
        }),
        prisma.product.count({ where }),
      ]);
      return { data, pagination: { page, pageSize, total } };
    });

    success(res, result.data, result.pagination);
  } catch (error) {
    console.error("获取产品列表失败:", error);
    fail(res, "获取产品列表失败");
  }
});

// GET /:id - 产品详情
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      fail(res, "无效的ID", 400);
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product || !product.isPublished) {
      fail(res, "产品不存在", 404);
      return;
    }

    success(res, product);
  } catch (error) {
    console.error("获取产品详情失败:", error);
    fail(res, "获取产品详情失败");
  }
});

export default router;
