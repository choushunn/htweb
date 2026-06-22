"use client";

import { useEffect, useState } from "react";
import { Typography, Pagination, Breadcrumb, Skeleton, Button, Result } from "antd";
import Link from "next/link";
import api from "@/lib/api";

const { Title, Text, Paragraph } = Typography;

interface NewsItem {
  id: number;
  title: string;
  summary?: string;
  createdAt: string;
  coverImage?: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
}

export default function NewsPageClient({
  news: initialNews,
  pagination: initialPagination,
}: {
  news: NewsItem[];
  pagination: PaginationInfo;
}) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [pagination, setPagination] = useState<PaginationInfo>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/news", {
        params: { page, pageSize: 5 },
      });
      const body = res.data;
      if (body.success) {
        setNews(Array.isArray(body.data) ? body.data : []);
        if (body.pagination) {
          setPagination(body.pagination);
        }
      } else {
        setError(body.error || "加载新闻失败");
      }
    } catch {
      setError("网络异常，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchNews(page);
  };

  return (
    <>
      <div className="w-full h-[260px] md:h-[320px] bg-cover bg-center relative" style={{ backgroundImage: "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20news%20media%20studio%20background%2C%20clean%20minimalist%20light%20tones%2C%20abstract%20communication%20patterns%2C%20corporate%20news%20banner&image_size=landscape_16_9)" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0070d5]/80 to-black/40" />
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <h1 className="text-white text-[36px] md:text-[48px] font-bold tracking-wider">
            新闻中心
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-2">
            了解最新动态与行业资讯
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { title: <Link href="/">首页</Link> },
              { title: "新闻中心" },
            ]}
          />
        </div>

      {loading && (
        <div className="flex flex-col gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-8 bg-white rounded-2xl p-6 shadow-sm">
              <Skeleton.Image className="!w-[320px] !h-[200px] !rounded-xl" active />
              <div className="flex-1 flex flex-col justify-center">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && news.length === 0 && !error && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4 text-gray-300">&#128240;</div>
          <p className="text-lg mb-4">暂无新闻</p>
          <Link href="/" className="text-brand hover:text-brand-hover underline text-base">返回首页 &rarr;</Link>
        </div>
      )}

      {error && (
        <div className="py-16">
          <Result
            status="error"
            title="加载失败"
            subTitle={error}
            extra={
              <Button type="primary" onClick={() => fetchNews(pagination.page)}>
                重新加载
              </Button>
            }
          />
        </div>
      )}

      {!loading && news.length > 0 && (
        <>
          <div className="flex flex-col gap-8">
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="group block transition-transform duration-200 active:scale-[0.98]">
                <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    {item.coverImage ? (
                      <div className="w-full md:w-[320px] h-[200px] bg-gray-200 bg-cover bg-center rounded-xl flex-shrink-0 overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-[400ms] ease-out group-hover:scale-105 will-change-transform"
                          style={{ backgroundImage: `url(${item.coverImage})` }}
                        />
                      </div>
                    ) : (
                      <div className="w-full md:w-[320px] h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 rounded-xl flex-shrink-0">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📰</div>
                          <div className="text-sm">暂无图片</div>
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-2">
                      <Title level={3} className="mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors !mb-3">
                        {item.title}
                      </Title>
                      {item.summary && (
                        <Paragraph
                          className="text-gray-500 mb-4 !mb-4 leading-relaxed"
                          ellipsis={{ rows: 2 }}
                        >
                          {item.summary}
                        </Paragraph>
                      )}
                      <div className="flex items-center gap-4 mt-auto">
                        <Text type="secondary" className="text-sm flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                        </Text>
                        <span className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex items-center gap-1">
                          查看详情
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          {pagination.total > pagination.pageSize && (
            <div className="mt-12 flex justify-center">
              <Pagination
                current={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="[&_.ant-pagination-item]:rounded-lg"
              />
            </div>
          )}
        </>
      )}
      </div>
    </>);
}
