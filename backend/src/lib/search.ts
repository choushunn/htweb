import prisma from "./prisma.js";

/**
 * MySQL LIKE 搜索：新闻
 */
export async function searchNews(query: string, limit = 10, offset = 0) {
  const like = `%${query.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;
  const [hits, total] = await Promise.all([
    prisma.news.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: like } },
          { summary: { contains: like } },
          { content: { contains: like } },
        ],
      },
      select: { id: true, title: true, summary: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.news.count({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: like } },
          { summary: { contains: like } },
          { content: { contains: like } },
        ],
      },
    }),
  ]);

  return { hits, total };
}

/**
 * MySQL LIKE 搜索：产品
 */
export async function searchProducts(query: string, limit = 10, offset = 0) {
  const like = `%${query.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;
  const [hits, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: like } },
          { description: { contains: like } },
          { detail: { contains: like } },
        ],
      },
      select: { id: true, name: true, description: true, categoryId: true, sort: true, createdAt: true },
      orderBy: { sort: "asc" },
      take: limit,
      skip: offset,
    }),
    prisma.product.count({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: like } },
          { description: { contains: like } },
          { detail: { contains: like } },
        ],
      },
    }),
  ]);

  return { hits, total };
}
