/**
 * 索引现有数据到 MeiliSearch
 * 运行: npx tsx scripts/index-search.ts
 */
import { PrismaClient } from "@prisma/client";
import { Meilisearch } from "meilisearch";

const prisma = new PrismaClient();

const MEILI_HOST = process.env.MEILI_HOST || "http://localhost:7700";
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || "dev-master-key";

const meili = new Meilisearch({
  host: MEILI_HOST,
  apiKey: MEILI_MASTER_KEY,
});

async function initIndexes() {
  try {
    // 创建/更新索引配置
    const newsIndex = meili.index("news");
    await newsIndex.updateSettings({
      searchableAttributes: ["title", "summary", "content"],
      sortableAttributes: ["createdAt"],
      filterableAttributes: ["isPublished"],
    });

    const productsIndex = meili.index("products");
    await productsIndex.updateSettings({
      searchableAttributes: ["name", "description", "detail"],
      sortableAttributes: ["sort", "createdAt"],
      filterableAttributes: ["isPublished", "categoryId"],
    });

    console.log("索引配置已更新");
  } catch (err) {
    console.error("配置索引失败:", err);
  }
}

async function indexNews() {
  const news = await prisma.news.findMany({
    where: { isPublished: true },
  });

  if (news.length === 0) {
    console.log("没有需要索引的新闻");
    return;
  }

  const documents = news.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary || "",
    content: item.content || "",
    isPublished: item.isPublished,
    createdAt: item.createdAt.getTime(),
  }));

  try {
    await meili.index("news").addDocuments(documents);
    console.log(`已索引 ${documents.length} 条新闻`);
  } catch (err) {
    console.error("索引新闻失败:", err);
  }
}

async function indexProducts() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
  });

  if (products.length === 0) {
    console.log("没有需要索引的产品");
    return;
  }

  const documents = products.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    detail: item.detail || "",
    categoryId: item.categoryId,
    isPublished: item.isPublished,
    sort: item.sort,
    createdAt: item.createdAt.getTime(),
  }));

  try {
    await meili.index("products").addDocuments(documents);
    console.log(`已索引 ${documents.length} 个产品`);
  } catch (err) {
    console.error("索引产品失败:", err);
  }
}

async function main() {
  console.log("开始索引数据到 MeiliSearch...\n");

  await initIndexes();
  await indexNews();
  await indexProducts();

  console.log("\n索引完成！");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
