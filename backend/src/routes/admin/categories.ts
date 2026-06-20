import { Router } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// 所有路由需要认证
router.use(authenticateToken);

const createCategorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空").max(50, "分类名称不能超过50个字符"),
  sort: z.number().int().optional().default(0),
});

// GET / - 所有分类列表
router.get("/", async (_req, res) => {
  try {
    const data = await prisma.category.findMany({
      orderBy: { sort: "asc" },
      include: { _count: { select: { products: true } } },
    });
    success(res, data);
  } catch (error) {
    console.error("获取分类列表失败:", error);
    fail(res, "获取分类列表失败");
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

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      fail(res, "分类不存在", 404);
      return;
    }

    success(res, category);
  } catch (error) {
    console.error("获取分类详情失败:", error);
    fail(res, "获取分类详情失败");
  }
});

// POST / - 新增
router.post("/", async (req, res) => {
  try {
    const result = createCategorySchema.safeParse(req.body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const category = await prisma.category.create({ data: result.data });
    success(res, category, undefined, 201);
  } catch (error) {
    console.error("创建分类失败:", error);
    fail(res, "创建分类失败");
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

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "分类不存在", 404);
      return;
    }

    const result = createCategorySchema.partial().safeParse(req.body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const category = await prisma.category.update({
      where: { id },
      data: result.data,
    });

    success(res, category);
  } catch (error) {
    console.error("更新分类失败:", error);
    fail(res, "更新分类失败");
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

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!existing) {
      fail(res, "分类不存在", 404);
      return;
    }

    if (existing._count.products > 0) {
      fail(res, "该分类下还有产品，无法删除", 400);
      return;
    }

    await prisma.category.delete({ where: { id } });
    success(res, { message: "删除成功" });
  } catch (error) {
    console.error("删除分类失败:", error);
    fail(res, "删除分类失败");
  }
});

export default router;
