"use client";

import { Breadcrumb, Typography } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

interface NewsDetail {
  id: number;
  title: string;
  content?: string;
  createdAt: string;
  summary?: string;
}

export default function NewsDetailClient({ news }: { news: NewsDetail }) {
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
        <div className="mb-8">
          <Breadcrumb
            items={[
              { title: <Link href="/">首页</Link> },
              { title: <Link href="/news">新闻中心</Link> },
              { title: news.title },
            ]}
          />
        </div>

        <article>
          <header className="mb-8">
            <Title level={2} className="mb-4">{news.title}</Title>
            <Text type="secondary">
              发布时间：{new Date(news.createdAt).toLocaleDateString("zh-CN")}
            </Text>
          </header>

          {news.content ? (
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          ) : (
            <div className="text-gray-500">
              {news.summary || "暂无详细内容"}
            </div>
          )}
        </article>
      </div>
    </>
  );
}
