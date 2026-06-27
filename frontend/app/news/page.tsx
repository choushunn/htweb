import type { Metadata } from "next";
import serverFetch from "@/lib/serverApi";
import NewsPageClient from "./NewsPageClient";

export const metadata: Metadata = {
  title: "新闻中心",
  description: "山东昊天金属科技有限公司最新新闻动态与行业资讯",
};

interface NewsItem {
  id: number;
  title: string;
  summary?: string;
  createdAt: string;
  coverImage?: string;
}

export default async function NewsPage() {
  let news: NewsItem[] = [];
  let pagination = { page: 1, pageSize: 5, total: 0 };
  let loading = true;

  try {
    const res = await serverFetch<NewsItem[]>("/api/news?page=1&pageSize=5");
    const data = res.data;
    news = data && Array.isArray(data) ? data : [];
    if (res.pagination) {
      pagination = res.pagination;
    }
    loading = false;
  } catch {
    loading = false;
  }

  return <NewsPageClient news={news} pagination={pagination} isServerLoading={loading} />;
}
