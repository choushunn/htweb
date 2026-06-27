import { Meilisearch } from "meilisearch";

const MEILI_HOST = process.env.MEILI_HOST || "http://localhost:7700";
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || "dev-master-key";

let client: Meilisearch | null = null;
let enabled = true;

export function getClient(): Meilisearch | null {
  if (!enabled) return null;
  if (!client) {
    try {
      client = new Meilisearch({
        host: MEILI_HOST,
        apiKey: MEILI_MASTER_KEY,
      });
    } catch (err) {
      console.error("MeiliSearch 初始化失败:", err);
      enabled = false;
      return null;
    }
  }
  return client;
}

/**
 * 初始化索引和搜索设置
 */
export async function initSearchIndexes() {
  const c = getClient();
  if (!c) return;

  try {
    // 新闻索引
    const newsIndex = c.index("news");
    await newsIndex.updateSettings({
      searchableAttributes: ["title", "summary", "content"],
      sortableAttributes: ["createdAt"],
      filterableAttributes: ["isPublished"],
      // 模糊搜索配置：允许拼写错误
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 3,  // 3个字符以上的词允许1个拼写错误
          twoTypos: 7, // 7个字符以上的词允许2个拼写错误
        },
        disableOnWords: [],  // 不禁用任何词的模糊匹配
        disableOnAttributes: [],  // 不禁用任何属性的模糊匹配
      },
      // 分词配置：支持中文搜索
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
      ],
    });

    // 产品索引
    const productsIndex = c.index("products");
    await productsIndex.updateSettings({
      searchableAttributes: ["name", "description", "detail"],
      sortableAttributes: ["sort", "createdAt"],
      filterableAttributes: ["isPublished", "categoryId"],
      // 模糊搜索配置：允许拼写错误
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 3,
          twoTypos: 7,
        },
        disableOnWords: [],
        disableOnAttributes: [],
      },
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
      ],
    });

    console.log("MeiliSearch 索引初始化完成");
  } catch (err) {
    console.error("MeiliSearch 索引初始化失败:", err);
  }
}

/**
 * 增量同步：只同步数据库中存在但索引中不存在的数据
 */
export async function syncSearchIndexes(): Promise<{
  productsIndexed: number;
  newsIndexed: number;
}> {
  const c = getClient();
  if (!c) return { productsIndexed: 0, newsIndexed: 0 };

  let productsIndexed = 0;
  let newsIndexed = 0;

  try {
    // 导入 prisma
    const prisma = (await import("./prisma.js")).default;

    // 获取索引中的文档ID
    const [productIdsInIndex, newsIdsInIndex] = await Promise.all([
      getDocumentIds(c, "products"),
      getDocumentIds(c, "news"),
    ]);

    // 获取数据库中已发布的产品和新闻
    const [publishedProducts, publishedNews] = await Promise.all([
      (prisma as any).product.findMany({ where: { isPublished: true } }),
      (prisma as any).news.findMany({ where: { isPublished: true } }),
    ]);

    // 索引缺失的产品
    for (const product of publishedProducts) {
      if (!productIdsInIndex.has(product.id)) {
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
        productsIndexed++;
      }
    }

    // 索引缺失的新闻
    for (const item of publishedNews) {
      if (!newsIdsInIndex.has(item.id)) {
        await indexDocument("news", {
          id: item.id,
          title: item.title,
          summary: item.summary || "",
          content: item.content || "",
          isPublished: item.isPublished,
          createdAt: item.createdAt.getTime(),
        });
        newsIndexed++;
      }
    }

    if (productsIndexed > 0 || newsIndexed > 0) {
      console.log(`搜索索引增量同步完成：产品 ${productsIndexed} 条，新闻 ${newsIndexed} 条`);
    } else {
      console.log("搜索索引已是最新状态，无需同步");
    }
  } catch (err) {
    console.error("搜索索引增量同步失败:", err);
  }

  return { productsIndexed, newsIndexed };
}

/**
 * 获取索引中所有文档ID
 */
async function getDocumentIds(client: Meilisearch, indexName: string): Promise<Set<number>> {
  const ids = new Set<number>();
  try {
    const index = client.index(indexName);
    let offset = 0;
    const limit = 100;

    while (true) {
      const result = await index.search("", {
        limit,
        offset,
        attributesToRetrieve: ["id"],
      });

      for (const hit of result.hits) {
        const id = hit.id as number;
        if (id) ids.add(id);
      }

      if (result.hits.length < limit) break;
      offset += limit;
    }
  } catch {
    // 索引可能不存在，返回空集合
  }
  return ids;
}

/**
 * 添加/更新文档到搜索索引
 */
export async function indexDocument(
  indexName: "news" | "products",
  document: Record<string, unknown>
) {
  const c = getClient();
  if (!c) return;
  try {
    await c.index(indexName).addDocuments([document]);
  } catch (err) {
    console.error(`MeiliSearch 索引文档失败 [${indexName}]:`, err);
  }
}

/**
 * 从搜索索引中删除文档
 */
export async function removeDocument(indexName: "news" | "products", id: number) {
  const c = getClient();
  if (!c) return;
  try {
    await c.index(indexName).deleteDocument(id);
  } catch (err) {
    console.error(`MeiliSearch 删除文档失败 [${indexName}]:`, err);
  }
}

/**
 * 搜索
 */
export async function searchDocuments(
  indexName: "news" | "products",
  query: string,
  options?: {
    limit?: number;
    offset?: number;
    filter?: string;
  }
) {
  const c = getClient();
  if (!c) return { hits: [], total: 0 };
  try {
    const index = c.index(indexName);
    const result = await index.search(query, {
      limit: options?.limit || 10,
      offset: options?.offset || 0,
      filter: options?.filter,
      // 确保使用 id 作为主键
      attributesToRetrieve: ["id", ...(indexName === "products" 
        ? ["name", "description", "detail", "categoryId", "isPublished", "sort"]
        : ["title", "summary", "content", "isPublished", "createdAt"]
      )],
    });
    return {
      hits: result.hits,
      total: result.estimatedTotalHits || 0,
    };
  } catch (err) {
    console.error(`MeiliSearch 搜索失败 [${indexName}]:`, err);
    return { hits: [], total: 0 };
  }
}
