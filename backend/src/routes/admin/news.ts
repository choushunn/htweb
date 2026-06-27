import { Router } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { success, fail } from "../../lib/response.js";
import { indexDocument, removeDocument } from "../../lib/search.js";
import { cacheDel } from "../../lib/cache.js";

const router = Router();

// 所有路由需要认证
router.use(authenticateToken);

const createNewsSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200, "标题不能超过200个字符"),
  summary: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  isPublished: z.boolean().optional().default(false),
});

// GET / - 新闻列表（所有，含未发布的），支持分页
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.news.count(),
    ]);

    success(res, data, { page, pageSize, total });
  } catch (error) {
    console.error("获取新闻列表失败:", error);
    fail(res, "获取新闻列表失败");
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

    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) {
      fail(res, "新闻不存在", 404);
      return;
    }

    success(res, news);
  } catch (error) {
    console.error("获取新闻详情失败:", error);
    fail(res, "获取新闻详情失败");
  }
});

// POST / - 新增
router.post("/", async (req, res) => {
  try {
    const result = createNewsSchema.safeParse(req.body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const news = await prisma.news.create({ data: result.data });

    // 索引到 MeiliSearch
    if (news.isPublished) {
      await indexDocument("news", {
        id: news.id,
        title: news.title,
        summary: news.summary || "",
        content: news.content || "",
        isPublished: news.isPublished,
        createdAt: news.createdAt.getTime(),
      });
    }

    // 清除缓存
    await cacheDel("news:*");

    success(res, news, undefined, 201);
  } catch (error) {
    console.error("创建新闻失败:", error);
    fail(res, "创建新闻失败");
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

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "新闻不存在", 404);
      return;
    }

    const result = createNewsSchema.partial().safeParse(req.body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const news = await prisma.news.update({
      where: { id },
      data: result.data,
    });

    // 同步搜索索引
    if (news.isPublished) {
      await indexDocument("news", {
        id: news.id,
        title: news.title,
        summary: news.summary || "",
        content: news.content || "",
        isPublished: news.isPublished,
        createdAt: news.createdAt.getTime(),
      });
    } else {
      await removeDocument("news", news.id);
    }

    // 清除缓存
    await cacheDel("news:*");

    success(res, news);
  } catch (error) {
    console.error("更新新闻失败:", error);
    fail(res, "更新新闻失败");
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

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "新闻不存在", 404);
      return;
    }

    await prisma.news.delete({ where: { id } });

    // 从搜索索引移除
    await removeDocument("news", id);
    // 清除缓存
    await cacheDel("news:*");

    success(res, { message: "删除成功" });
  } catch (error) {
    console.error("删除新闻失败:", error);
    fail(res, "删除新闻失败");
  }
});

export default router;
