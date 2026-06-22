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

    // 3. 最近4周留言趋势（按周统计）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 27);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const recentMessages = await prisma.message.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // 获取日期所在周的周一
    function getMonday(date: Date): Date {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    // 构建最近4周的周映射
    const weekMap: Record<string, { week: string; count: number }> = {};
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - (3 - i) * 7);
      const monday = getMonday(d);
      const key = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
      weekMap[key] = {
        week: `${String(monday.getMonth() + 1).padStart(2, "0")}/${String(monday.getDate()).padStart(2, "0")}`,
        count: 0,
      };
    }

    recentMessages.forEach((item) => {
      const monday = getMonday(item.createdAt);
      const key = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
      if (weekMap[key]) weekMap[key].count++;
    });

    const messageTrend = Object.values(weekMap);

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
