import { Router } from "express";
import prisma from "../../lib/prisma.js";
import sanitizeHtml from "sanitize-html";
import { success, fail } from "../../lib/response.js";
import { withCache } from "../../lib/cache.js";

const router = Router();

// GET / - 新闻列表，支持分页
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
    const skip = (page - 1) * pageSize;

    const where = { isPublished: true };
    const cacheKey = `news:list:${page}:${pageSize}`;

    const result = await withCache(cacheKey, async () => {
      const [data, total] = await Promise.all([
        prisma.news.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.news.count({ where }),
      ]);
      return { data, pagination: { page, pageSize, total } };
    });

    success(res, result.data, result.pagination);
  } catch (error) {
    console.error("获取新闻列表失败:", error);
    fail(res, "获取新闻列表失败");
  }
});

// GET /:id - 新闻详情
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      fail(res, "无效的ID", 400);
      return;
    }

    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news || !news.isPublished) {
      fail(res, "新闻不存在", 404);
      return;
    }

    // 过滤 content 字段
    if (news.content) {
      news.content = sanitizeHtml(news.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "p", "h2", "h3", "strong", "em", "u", "s",
          "ul", "ol", "li", "blockquote", "pre", "code",
          "hr", "a", "img", "br",
        ]),
        allowedAttributes: {
          a: ["href", "target", "rel"],
          img: ["src", "alt", "width", "height"],
          code: ["class"],
          pre: ["class"],
        },
      });
    }

    success(res, news);
  } catch (error) {
    console.error("获取新闻详情失败:", error);
    fail(res, "获取新闻详情失败");
  }
});

export default router;
