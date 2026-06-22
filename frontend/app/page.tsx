import type { Metadata } from "next";
import serverFetch from "@/lib/serverApi";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "首页",
  description:
    "昊天金属科技是一家集催化材料研发、生产、销售与进出口贸易于一体的综合性企业。主营加氢催化剂、铝镍合金氢化催化剂、镍铝合金粉、贵金属催化剂。",
};

interface Banner {
  id: number;
  imageUrl: string;
  title?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  images?: string[];
}

interface NewsItem {
  id: number;
  title: string;
  createdAt: string;
  summary?: string;
}

export default async function HomePage() {
  let banners: Banner[] = [];
  let products: Product[] = [];
  let news: NewsItem[] = [];

  try {
    const results = await Promise.allSettled([
      serverFetch<Banner[]>("/api/banners"),
      serverFetch<Product[]>("/api/products?pageSize=4"),
      serverFetch<NewsItem[]>("/api/news?pageSize=4"),
    ]);

    if (results[0].status === "fulfilled") {
      banners = results[0].value.data;
    }
    if (results[1].status === "fulfilled") {
      products = results[1].value.data;
    }
    if (results[2].status === "fulfilled") {
      news = results[2].value.data;
    }
  } catch {
    // 数据加载失败时使用空数组，由客户端展示降级UI
  }

  return <HomePageClient banners={banners} products={products} news={news} />;
}
