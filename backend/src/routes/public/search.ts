import { Router } from "express";
import { searchDocuments } from "../../lib/search.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// GET /api/search - 全文搜索
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q as string || "").trim();
    const type = (req.query.type as string) || "all"; // all | news | products
    const limit = Math.min(20, parseInt(req.query.limit as string) || 10);
    const offset = parseInt(req.query.offset as string) || 0;

    if (!q) {
      fail(res, "请输入搜索关键词", 400);
      return;
    }

    const results: Record<string, unknown> = {};

    if (type === "all" || type === "news") {
      const news = await searchDocuments("news", q, {
        limit: type === "all" ? 5 : limit,
        offset: type === "all" ? 0 : offset,
        filter: "isPublished = true",
      });
      results.news = news;
    }

    if (type === "all" || type === "products") {
      const products = await searchDocuments("products", q, {
        limit: type === "all" ? 5 : limit,
        offset: type === "all" ? 0 : offset,
        filter: "isPublished = true",
      });
      results.products = products;
    }

    success(res, results);
  } catch (error) {
    console.error("搜索失败:", error);
    fail(res, "搜索失败");
  }
});

export default router;
