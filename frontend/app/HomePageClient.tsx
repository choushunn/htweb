"use client";

import { useRef, useState } from "react";
import { Carousel, Card, Row, Col, Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  SafetyCertificateFilled,
  GoldFilled,
  ToolFilled,
  GlobalOutlined,
  BuildFilled,
  CarFilled,
  ExperimentFilled,
  ShakeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import AnimatedBorder from "@/components/ui/AnimatedBorder";

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

const STATS = [
  { value: "1000万", label: "注册资本", color: "#0070d5", bg: "#e8f4fd" },
  { value: "50+", label: "产品品类", color: "#0070d5", bg: "#e8f4fd" },
  { value: "30+", label: "出口国家", color: "#0070d5", bg: "#e8f4fd" },
  { value: "5000万+", label: "年出口额", color: "#0070d5", bg: "#e8f4fd" },
];

const ADVANTAGES = [
  {
    icon: <SafetyCertificateFilled aria-hidden="true" style={{ fontSize: 48, color: "#0070d5" }} />,
    title: "品质保障",
    desc: "严控原材料质量，产品通过ISO9001认证，全流程质量追溯体系确保每一批产品达标。",
  },
  {
    icon: <GoldFilled aria-hidden="true" style={{ fontSize: 48, color: "#0070d5" }} />,
    title: "货源稳定",
    desc: "与国内多家大型钢厂建立长期战略合作关系，库存充足，合同履约率100%。",
  },
  {
    icon: <ToolFilled aria-hidden="true" style={{ fontSize: 48, color: "#0070d5" }} />,
    title: "定制加工",
    desc: "支持尺寸定制、表面处理、分条切割等深加工服务，满足客户个性化需求。",
  },
  {
    icon: <GlobalOutlined aria-hidden="true" style={{ fontSize: 48, color: "#0070d5" }} />,
    title: "全球物流",
    desc: "完善的仓储物流体系，国内次日可达，国际业务覆盖东南亚、中东、欧美等30+国家。",
  },
];

const INDUSTRIES = [
  { icon: <BuildFilled aria-hidden="true" style={{ fontSize: 40, color: "#0070d5" }} />, name: "建筑工程" },
  { icon: <CarFilled aria-hidden="true" style={{ fontSize: 40, color: "#0070d5" }} />, name: "汽车制造" },
  { icon: <ExperimentFilled aria-hidden="true" style={{ fontSize: 40, color: "#0070d5" }} />, name: "化工设备" },
  { icon: <ShakeOutlined aria-hidden="true" style={{ fontSize: 40, color: "#0070d5" }} />, name: "机械加工" },
  { icon: <GlobalOutlined aria-hidden="true" style={{ fontSize: 40, color: "#0070d5" }} />, name: "国际贸易" },
  { icon: <SafetyCertificateFilled aria-hidden="true" style={{ fontSize: 40, color: "#0070d5" }} />, name: "能源电力" },
];

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={className}>{children}</div>
    </div>
  );
}

export default function HomePageClient({
  banners: initialBanners,
  products: initialProducts,
  news: initialNews,
}: {
  banners: Banner[];
  products: Product[];
  news: NewsItem[];
}) {
  const [banners] = useState<Banner[]>(initialBanners);
  const [products] = useState<Product[]>(initialProducts);
  const [news] = useState<NewsItem[]>(initialNews);
  const carouselRef = useRef<any>(null);

  const hasData = banners.length > 0 || products.length > 0 || news.length > 0;

  return (
    <div>
      {/* ====== Banner 轮播 ====== */}
      {banners.length > 0 && (
        <div className="relative group">
          <Carousel ref={carouselRef} autoplay autoplaySpeed={5000} effect="fade">
            {banners.map((banner) => (
              <div key={banner.id}>
                <div
                  className="h-[500px] md:h-[650px] flex items-center justify-center relative"
                  style={{
                    backgroundImage: `url(${banner.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
                    }}
                  />
                  {banner.title && (
                    <div className="relative z-[1] max-w-[900px] mx-auto px-8 text-center">
                      <div
                        className="text-white text-[36px] md:text-[56px] font-bold tracking-[3px] md:tracking-[6px] text-center py-6 px-8 md:px-12 border-l-4 border-r-4 border-[#0070d5] leading-[1.3] inline-block"
                        style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                      >
                        {banner.title}
                      </div>
                      <div className="mt-8 flex items-center justify-center gap-4">
                        <AnimatedBorder className="inline-block transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                          <Link
                            href="/contact"
                            className="no-underline"
                          >
                            <span className="block py-3.5 px-9 bg-white text-[#0070d5] font-semibold text-base whitespace-nowrap">
                              <span className="flex items-center gap-2">
                                立即咨询 →
                              </span>
                            </span>
                          </Link>
                        </AnimatedBorder>
                        <AnimatedBorder reverse className="inline-block transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                          <Link
                            href="/products"
                            className="no-underline"
                          >
                            <span className="block py-3.5 px-9 bg-[#0a1628] text-white font-semibold text-base whitespace-nowrap">
                              <span className="flex items-center gap-2">
                                查看产品 →
                              </span>
                            </span>
                          </Link>
                        </AnimatedBorder>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Carousel>

          <button
            onClick={() => carouselRef.current?.prev()}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white text-2xl border border-white/20 cursor-pointer opacity-0 group-hover:opacity-100 transition-[opacity,background-color,transform] duration-300 hover:bg-white/25 hover:scale-110 active:scale-95"
            aria-label="上一张"
          >
            <LeftOutlined />
          </button>
          <button
            onClick={() => carouselRef.current?.next()}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white text-2xl border border-white/20 cursor-pointer opacity-0 group-hover:opacity-100 transition-[opacity,background-color,transform] duration-300 hover:bg-white/25 hover:scale-110 active:scale-95"
            aria-label="下一张"
          >
            <RightOutlined />
          </button>
        </div>
      )}

      {/* ====== 关于我们 ====== */}
      <AnimatedSection delay={100}>
        <section className="py-16 px-6 bg-[#f7f9fa]">
          <div className="max-w-[1000px] mx-auto text-center">
            <div className="w-12 h-0.5 bg-[#0070d5] mx-auto mb-5" />
            <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1a1a1a] mb-8 tracking-wide">
              关于山东昊天金属科技
            </h2>
            <p className="text-[18px] md:text-[22px] leading-[2] text-[#1a1a1a] max-w-[800px] mx-auto">
              山东昊天金属科技有限公司是一家集催化材料研发、生产、销售与进出口贸易于一体的综合性企业。
              公司成立于 2022 年，注册资本 1000 万元，总部位于山东省青岛市，
              业务覆盖加氢催化剂、雷尼镍催化剂、镍铝合金粉、贵金属催化剂等多个领域，
              产品远销东南亚、中东、欧美等国际市场。
            </p>

            <Row gutter={[32, 32]} className="!mt-16">
              {STATS.map((stat) => (
                <Col xs={12} md={6} key={stat.label}>
                  <div
                    className="py-10 px-4 h-full shadow-sm border border-[#0070d5]/10 transition-[box-shadow,transform] duration-300 hover:shadow-md active:scale-[0.98]"
                    style={{ backgroundColor: stat.bg }}
                  >
                    <div className="text-[36px] md:text-[48px] font-bold leading-none mb-1" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="w-8 h-0.5 mx-auto my-3 rounded-full" style={{ backgroundColor: stat.color }} />
                    <div className="text-[#333] text-base md:text-lg mt-1">{stat.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      </AnimatedSection>

      {/* ====== 核心优势 ====== */}
      <AnimatedSection delay={150}>
        <section className="py-16 px-6 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <div className="w-12 h-0.5 bg-[#0070d5] mx-auto mb-5" />
              <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1a1a1a] tracking-wide m-0">
                核心优势
              </h2>
            </div>
            <Row gutter={[32, 32]}>
              {ADVANTAGES.map((item) => (
                <Col xs={24} sm={12} lg={6} key={item.title}>
                  <div className="text-center py-14 px-7 h-full transition-[box-shadow,transform] duration-300 hover:shadow-[0_4px_20px_rgba(0,112,213,0.12)] active:scale-[0.98]">
                    <div className="mb-6">{item.icon}</div>
                    <h3 className="text-[22px] md:text-[26px] font-semibold text-[#1a1a1a] mb-4">
                      {item.title}
                    </h3>
                    <p className="text-[16px] md:text-[19px] text-[#333] leading-[1.9] m-0">
                      {item.desc}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      </AnimatedSection>

      {/* ====== 业务领域 ====== */}
      <AnimatedSection delay={200}>
        <section className="py-16 px-6 bg-[#f7f9fa]">
          <div className="max-w-[900px] mx-auto text-center">
            <div className="w-12 h-0.5 bg-[#0070d5] mx-auto mb-5" />
            <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1a1a1a] tracking-wide mb-14">
              服务领域
            </h2>
            <Row gutter={[32, 32]}>
              {INDUSTRIES.map((item) => (
                <Col xs={12} md={8} key={item.name}>
                  <div className="group flex flex-col items-center gap-4 py-12 px-5 bg-white border border-[#f0f0f0] cursor-default transition-[border-color,box-shadow,transform] duration-300 hover:border-[#0070d5] hover:shadow-[0_4px_20px_rgba(0,112,213,0.12)] active:scale-[0.98]">
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="text-[20px] md:text-[22px] font-medium text-[#333] transition-colors duration-300 group-hover:text-[#0070d5]">
                      {item.name}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      </AnimatedSection>

      {/* ====== 产品中心 ====== */}
      {products.length > 0 && (
        <AnimatedSection delay={250}>
          <section className="py-16 px-6 bg-white">
            <div className="max-w-[1200px] mx-auto">
              <div className="text-center mb-14">
                <div className="w-12 h-0.5 bg-[#0070d5] mx-auto mb-5" />
                <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1a1a1a] tracking-wide m-0">
                  产品中心
                </h2>
              </div>
              <Row gutter={[32, 32]}>
                {products.map((product) => (
                  <Col xs={24} sm={12} lg={6} key={product.id}>
                    <Link href={`/products/${product.id}`} className="no-underline">
                      <Card
                        hoverable
                        variant="borderless"
                        className="!rounded-xl overflow-hidden h-full"
                        styles={{ body: { padding: 24 } }}
                        cover={
                          product.images?.[0] ? (
                            <div className="overflow-hidden">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                height={260}
                                className="object-cover w-full transition-transform duration-[400ms] ease-out hover:scale-105 will-change-transform"
                                preview={false}
                                loading="lazy"
                                fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect fill='%23f5f5f5' width='400' height='260'/%3E%3Ctext x='200' y='130' text-anchor='middle' fill='%23999' font-size='16' dy='.3em'%3E暂无图片%3C/text%3E%3C/svg%3E"
                              />
                            </div>
                          ) : (
                            <div className="h-[260px] bg-[#f5f5f5] flex items-center justify-center text-[#666] text-base">
                              暂无图片
                            </div>
                          )
                        }
                      >
                        <h3 className="text-[20px] md:text-[22px] font-semibold text-[#1a1a1a] mb-3">
                          {product.name}
                        </h3>
                        <p className="text-base md:text-lg text-[#333] leading-[1.8] m-0">
                          {product.description || ""}
                        </p>
                        <div className="mt-4 text-[#0070d5] text-base md:text-lg font-medium">
                          查看详情 →
                        </div>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-14">
                <Link
                  href="/products"
                  className="inline-block py-3.5 px-14 font-medium text-base md:text-lg text-[#0070d5] border border-[#0070d5] no-underline rounded-lg transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-[#0070d5] hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  查看全部产品 →
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* ====== 新闻动态 ====== */}
      {news.length > 0 && (
        <AnimatedSection delay={300}>
          <section className="py-16 px-6 bg-[#f7f9fa]">
            <div className="max-w-[900px] mx-auto">
              <div className="text-center mb-14">
                <div className="w-12 h-0.5 bg-[#0070d5] mx-auto mb-5" />
                <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1a1a1a] tracking-wide m-0">
                  新闻动态
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="no-underline group block"
                  >
                    <div className="flex items-center justify-between py-7 px-8 bg-white rounded-xl border border-[#f0f0f0] transition-[box-shadow,border-color,transform] duration-200 hover:shadow-md hover:border-[#0070d5]/20 active:scale-[0.99]">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="text-[18px] md:text-xl text-[#1a1a1a] font-medium group-hover:text-[#0070d5] transition-colors line-clamp-1">
                          {item.title}
                        </span>
                        {item.summary && (
                          <span className="text-[14px] md:text-[15px] text-gray-400 line-clamp-1">
                            {item.summary}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-[#999] text-[13px]">
                          {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                        </span>
                        <span className="text-[#0070d5] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          查看 →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* ====== 底部 CTA ====== */}
      <AnimatedSection delay={350}>
        <section className="py-16 px-6 bg-white">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#1a1a1a] mb-4">
              需要定制催化材料解决方案？
            </h2>
            <p className="text-base md:text-lg text-gray-500 mb-8 max-w-[600px] mx-auto">
              无论您有任何需求，我们的专业团队都将为您提供一对一的技术咨询与产品服务
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-block py-3.5 px-12 bg-[#0070d5] text-white font-semibold text-base no-underline rounded-lg shadow-lg transition-[background-color,transform] duration-200 hover:bg-[#005bb5] hover:-translate-y-0.5 active:translate-y-0"
              >
                联系我们
              </Link>
              <Link
                href="/about"
                className="inline-block py-3.5 px-12 border border-[#0070d5] text-[#0070d5] font-semibold text-base no-underline rounded-lg transition-[background-color,color,transform] duration-200 hover:bg-[#0070d5] hover:text-white hover:-translate-y-0.5 active:translate-y-0"
              >
                了解更多
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* 无数据提示 */}
      {!hasData && (
        <section className="py-16 px-6 bg-[#f7f9fa]">
          <div className="max-w-[1000px] mx-auto text-center">
            <div className="w-12 h-0.5 bg-[#0070d5] mx-auto mb-5" />
            <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1a1a1a] mb-4 tracking-wide">
              关于山东昊天金属科技
            </h2>
            <p className="text-[18px] text-[#555]">数据加载中，请稍后访问…</p>
          </div>
        </section>
      )}

    </div>
  );
}
