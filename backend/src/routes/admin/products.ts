import { Router } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import { success, fail } from "../../lib/response.js";
import { indexDocument, removeDocument } from "../../lib/search.js";
import { cacheDel } from "../../lib/cache.js";

const router = Router();

// 所有路由需要认证
router.use(authenticateToken);

const createProductSchema = z.object({
  name: z.string().min(1, "产品名称不能为空").max(200, "产品名称不能超过200个字符"),
  categoryId: z.number().int().positive("请选择分类"),
  description: z.string().optional().nullable(),
  detail: z.string().optional().nullable(),
  images: z.any().optional(),
  sort: z.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
});

// GET / - 产品列表（所有），支持分页
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        orderBy: { sort: "asc" },
        skip,
        take: pageSize,
        include: { category: true },
      }),
      prisma.product.count(),
    ]);

    success(res, data, { page, pageSize, total });
  } catch (error) {
    console.error("获取产品列表失败:", error);
    fail(res, "获取产品列表失败");
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

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      fail(res, "产品不存在", 404);
      return;
    }

    success(res, product);
  } catch (error) {
    console.error("获取产品详情失败:", error);
    fail(res, "获取产品详情失败");
  }
});

// POST / - 新增
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const body: Record<string, unknown> = {
      ...req.body,
      categoryId: req.body.categoryId ? parseInt(req.body.categoryId, 10) : undefined,
      sort: req.body.sort ? parseInt(req.body.sort, 10) : 0,
      isPublished: req.body.isPublished === "true" || req.body.isPublished === true,
    };

    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      body.images = files.map((f) => `/uploads/${f.filename}`);
    }

    const result = createProductSchema.safeParse(body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const product = await prisma.product.create({ data: result.data as any });

    // 索引到 MeiliSearch
    if (product.isPublished) {
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
    }

    // 清除缓存
    await cacheDel("products:*");

    success(res, product, undefined, 201);
  } catch (error) {
    console.error("创建产品失败:", error);
    fail(res, "创建产品失败");
  }
});

// PUT /:id - 编辑
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      fail(res, "无效的ID", 400);
      return;
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "产品不存在", 404);
      return;
    }

    const body: Record<string, unknown> = { ...req.body };
    if (body.categoryId) body.categoryId = parseInt(body.categoryId as string, 10);
    if (body.sort) body.sort = parseInt(body.sort as string, 10);
    if (body.isPublished === "true" || body.isPublished === true) body.isPublished = true;
    else if (body.isPublished === "false" || body.isPublished === false) body.isPublished = false;

    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      body.images = files.map((f) => `/uploads/${f.filename}`);
    }

    const result = createProductSchema.partial().safeParse(body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: result.data as any,
    });

    // 同步搜索索引
    if (product.isPublished) {
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
    } else {
      await removeDocument("products", product.id);
    }

    // 清除缓存
    await cacheDel("products:*");

    success(res, product);
  } catch (error) {
    console.error("更新产品失败:", error);
    fail(res, "更新产品失败");
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

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "产品不存在", 404);
      return;
    }

    await prisma.product.delete({ where: { id } });

    // 从搜索索引移除
    await removeDocument("products", id);
    // 清除缓存
    await cacheDel("products:*");

    success(res, { message: "删除成功" });
  } catch (error) {
    console.error("删除产品失败:", error);
    fail(res, "删除产品失败");
  }
});

export default router;
