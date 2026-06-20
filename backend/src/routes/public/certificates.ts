import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// GET / - 所有资质列表，按 sort asc 排序，只返回 isPublished=true
router.get("/", async (_req, res) => {
  try {
    const data = await prisma.certificate.findMany({
      where: { isPublished: true },
      orderBy: { sort: "asc" },
    });
    success(res, data);
  } catch (error) {
    console.error("获取资质证书列表失败:", error);
    fail(res, "获取资质证书列表失败");
  }
});

export default router;
