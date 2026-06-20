import type { Metadata } from "next";
import { Breadcrumb, Alert } from "antd";
import Link from "next/link";
import serverFetch from "@/lib/serverApi";
import NewsDetailClient from "./NewsDetailClient";

interface NewsDetail {
  id: number;
  title: string;
  content?: string;
  createdAt: string;
  summary?: string;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await serverFetch<NewsDetail>(`/api/news/${id}`);
    return {
      title: res.data?.title || "新闻详情",
      description: res.data?.summary || "昊天金属科技新闻详情",
    };
  } catch {
    return { title: "新闻详情" };
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let news: NewsDetail | null = null;
  let error: string | null = null;

  try {
    const res = await serverFetch<NewsDetail>(`/api/news/${id}`);
    news = res.data;
  } catch {
    error = "新闻数据加载失败，请稍后重试";
  }

  if (error) {
    return (
      <>
        <div
          className="w-full h-[260px] md:h-[320px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20news%20media%20studio%20background%2C%20clean%20minimalist%20light%20tones%2C%20abstract%20communication%20patterns%2C%20corporate%20news%20banner&image_size=landscape_16_9)",
          }}
        />
        <div className="max-w-6xl mx-auto py-12 px-4">
          <Alert title={error} type="error" showIcon />
        </div>
      </>
    );
  }

  if (!news) {
    return (
      <>
        <div
          className="w-full h-[260px] md:h-[320px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20news%20media%20studio%20background%2C%20clean%20minimalist%20light%20tones%2C%20abstract%20communication%20patterns%2C%20corporate%20news%20banner&image_size=landscape_16_9)",
          }}
        />
        <div className="max-w-6xl mx-auto py-12 px-4">
          <Alert title="新闻未找到" type="warning" showIcon />
        </div>
      </>
    );
  }

  return <NewsDetailClient news={news} />;
}
