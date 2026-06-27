import { Router } from "express";
import { searchNews, searchProducts } from "../../lib/search.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// GET /api/search - 全文搜索（MySQL LIKE）
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
      results.news = await searchNews(q, type === "all" ? 5 : limit, 0);
    }

    if (type === "all" || type === "products") {
      results.products = await searchProducts(q, type === "all" ? 5 : limit, 0);
    }

    success(res, results);
  } catch (error) {
    console.error("搜索失败:", error);
    fail(res, "搜索失败");
  }
});

export default router;
