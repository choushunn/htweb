import { Router } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// 所有路由需要认证
router.use(authenticateToken);

const createCertificateSchema = z.object({
  title: z.string().min(1, "证书标题不能为空").max(200, "证书标题不能超过200个字符"),
  imageUrl: z.string().min(1, "图片地址不能为空"),
  sort: z.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
});

// GET / - 所有资质列表
router.get("/", async (_req, res) => {
  try {
    const data = await prisma.certificate.findMany({
      orderBy: { sort: "asc" },
    });
    success(res, data);
  } catch (error) {
    console.error("获取资质证书列表失败:", error);
    fail(res, "获取资质证书列表失败");
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

    const certificate = await prisma.certificate.findUnique({ where: { id } });
    if (!certificate) {
      fail(res, "资质证书不存在", 404);
      return;
    }

    success(res, certificate);
  } catch (error) {
    console.error("获取资质证书详情失败:", error);
    fail(res, "获取资质证书详情失败");
  }
});

// POST / - 新增
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const body: Record<string, unknown> = { ...req.body };
    if (req.file) {
      body.imageUrl = `/uploads/${req.file.filename}`;
    }
    if (body.sort) body.sort = parseInt(body.sort as string, 10);
    if (body.isPublished === "true" || body.isPublished === true) body.isPublished = true;
    else if (body.isPublished === "false") body.isPublished = false;

    const result = createCertificateSchema.safeParse(body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const certificate = await prisma.certificate.create({ data: result.data });
    success(res, certificate, undefined, 201);
  } catch (error) {
    console.error("创建资质证书失败:", error);
    fail(res, "创建资质证书失败");
  }
});

// PUT /:id - 编辑
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      fail(res, "无效的ID", 400);
      return;
    }

    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "资质证书不存在", 404);
      return;
    }

    const body: Record<string, unknown> = { ...req.body };
    if (req.file) {
      body.imageUrl = `/uploads/${req.file.filename}`;
    }
    if (body.sort) body.sort = parseInt(body.sort as string, 10);
    if (body.isPublished === "true" || body.isPublished === true) body.isPublished = true;
    else if (body.isPublished === "false") body.isPublished = false;

    const result = createCertificateSchema.partial().safeParse(body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const certificate = await prisma.certificate.update({
      where: { id },
      data: result.data,
    });

    success(res, certificate);
  } catch (error) {
    console.error("更新资质证书失败:", error);
    fail(res, "更新资质证书失败");
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

    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "资质证书不存在", 404);
      return;
    }

    await prisma.certificate.delete({ where: { id } });
    success(res, { message: "删除成功" });
  } catch (error) {
    console.error("删除资质证书失败:", error);
    fail(res, "删除资质证书失败");
  }
});

export default router;
