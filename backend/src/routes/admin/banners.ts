import { Router } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// 所有路由需要认证
router.use(authenticateToken);

const createBannerSchema = z.object({
  title: z.string().optional().nullable(),
  imageUrl: z.string().min(1, "图片地址不能为空"),
  linkUrl: z.string().optional().nullable(),
  sort: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

// GET / - 轮播列表
router.get("/", async (_req, res) => {
  try {
    const data = await prisma.banner.findMany({
      orderBy: { sort: "asc" },
    });
    success(res, data);
  } catch (error) {
    console.error("获取轮播图列表失败:", error);
    fail(res, "获取轮播图列表失败");
  }
});

// GET /:id - 详情
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      fail(res, "无效的ID", 400);
      return;
    }

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      fail(res, "轮播图不存在", 404);
      return;
    }

    success(res, banner);
  } catch (error) {
    console.error("获取轮播图详情失败:", error);
    fail(res, "获取轮播图详情失败");
  }
});

// POST / - 新增
router.post("/", async (req, res) => {
  try {
    const result = createBannerSchema.safeParse(req.body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const banner = await prisma.banner.create({ data: result.data });
    success(res, banner, undefined, 201);
  } catch (error) {
    console.error("创建轮播图失败:", error);
    fail(res, "创建轮播图失败");
  }
});

// PUT /:id - 编辑
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      fail(res, "无效的ID", 400);
      return;
    }

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "轮播图不存在", 404);
      return;
    }

    const result = createBannerSchema.partial().safeParse(req.body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: result.data,
    });

    success(res, banner);
  } catch (error) {
    console.error("更新轮播图失败:", error);
    fail(res, "更新轮播图失败");
  }
});

// DELETE /:id - 删除
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      fail(res, "无效的ID", 400);
      return;
    }

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "轮播图不存在", 404);
      return;
    }

    await prisma.banner.delete({ where: { id } });
    success(res, { message: "删除成功" });
  } catch (error) {
    console.error("删除轮播图失败:", error);
    fail(res, "删除轮播图失败");
  }
});

export default router;
