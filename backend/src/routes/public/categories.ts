import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// GET / - 所有分类列表，按 sort asc 排序
router.get("/", async (_req, res) => {
  try {
    const data = await prisma.category.findMany({
      orderBy: { sort: "asc" },
      include: {
        _count: {
          select: { products: { where: { isPublished: true } } },
        },
      },
    });
    success(res, data);
  } catch (error) {
    console.error("获取分类列表失败:", error);
    fail(res, "获取分类列表失败");
  }
});

export default router;
