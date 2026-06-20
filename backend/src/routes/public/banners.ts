import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// GET / - 轮播列表，按 sort asc 排序，只返回 isActive=true
router.get("/", async (_req, res) => {
  try {
    const data = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sort: "asc" },
    });
    success(res, data);
  } catch (error) {
    console.error("获取轮播图列表失败:", error);
    fail(res, "获取轮播图列表失败");
  }
});

export default router;
