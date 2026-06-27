import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;
let enabled = true;

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const CACHE_TTL = parseInt(process.env.CACHE_TTL || "60", 10); // 默认 60 秒

export async function getCacheClient(): Promise<RedisClientType> {
  if (!client) {
    client = createClient({ url: REDIS_URL });
    client.on("error", (err) => {
      console.error("Redis 连接错误:", err.message);
      enabled = false;
    });
    try {
      await client.connect();
      enabled = true;
      console.log("Redis 连接成功");
    } catch (err) {
      console.error("Redis 连接失败，缓存将禁用:", err);
      enabled = false;
    }
  }
  return client;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!enabled) return null;
  try {
    const client = await getCacheClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, data: unknown, ttl = CACHE_TTL): Promise<void> {
  if (!enabled) return;
  try {
    const client = await getCacheClient();
    await client.setEx(key, ttl, JSON.stringify(data));
  } catch {
    // 静默失败
  }
}

export async function cacheDel(pattern: string): Promise<void> {
  if (!enabled) return;
  try {
    const client = await getCacheClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch {
    // 静默失败
  }
}

/**
 * 带缓存的查询包装器：先从缓存读取，没有再执行查询并写入缓存
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = CACHE_TTL
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const data = await fetcher();
  await cacheSet(key, data, ttl);
  return data;
}
