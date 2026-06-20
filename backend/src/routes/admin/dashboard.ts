import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

router.use(authenticateToken);

// GET / - 仪表盘统计图表数据
router.get("/", async (_req, res) => {
  try {
    // 1. 按月统计新闻和产品创建数量（最近12个月）
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const [allNews, allProducts] = await Promise.all([
      prisma.news.findMany({
        where: { createdAt: { gte: twelveMonthsAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.product.findMany({
        where: { createdAt: { gte: twelveMonthsAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // 构建月份映射
    const monthMap: Record<string, { month: string; news: number; products: number }> = {};
    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (11 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap[key] = { month: key, news: 0, products: 0 };
    }

    allNews.forEach((item) => {
      const d = item.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthMap[key]) monthMap[key].news++;
    });

    allProducts.forEach((item) => {
      const d = item.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthMap[key]) monthMap[key].products++;
    });

    const monthlyContent = Object.values(monthMap);

    // 2. 产品分类分布
    const [categoryGroups, categories] = await Promise.all([
      prisma.product.groupBy({
        by: ["categoryId"],
        _count: { id: true },
      }),
      prisma.category.findMany({ select: { id: true, name: true } }),
    ]);

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    const categoryDistribution = categoryGroups
      .map((g) => ({
        name: categoryMap.get(g.categoryId) || `分类#${g.categoryId}`,
        count: g._count.id,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);

    // 3. 最近7天留言趋势
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentMessages = await prisma.message.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const dayMap: Record<string, { date: string; count: number }> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dayMap[key] = { date: key, count: 0 };
    }

    recentMessages.forEach((item) => {
      const d = item.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (dayMap[key]) dayMap[key].count++;
    });

    const messageTrend = Object.values(dayMap);

    success(res, {
      monthlyContent,
      categoryDistribution,
      messageTrend,
    });
  } catch (error) {
    console.error("获取仪表盘数据失败:", error);
    fail(res, "获取仪表盘数据失败");
  }
});

export default router;
