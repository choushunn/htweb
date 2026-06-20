"use client";

import { useEffect, useState } from "react";
import { Layout, Row, Col, Divider } from "antd";
import {
  EnvironmentFilled,
  PhoneFilled,
  MailFilled,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";

const { Footer: AntFooter } = Layout;

interface Category {
  id: number;
  name: string;
  sort: number;
  _count?: { products: number };
}

export default function Footer() {
  const pathname = usePathname();
  const { wechatQr } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    import("@/lib/api").then((mod) => {
      mod.default.get("/api/categories").then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data;
        if (Array.isArray(list)) setCategories(list.slice(0, 5));
      }).catch(() => {});
    });
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <AntFooter
      style={{
        background: "#272727",
        color: "rgba(255,255,255,0.75)",
        fontSize: "15px",
        padding: "48px 24px 32px",
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <Row gutter={[32, 32]}>
          {/* 公司信息 */}
          <Col xs={24} md={8}>
            <div className="text-white text-lg md:text-xl font-semibold mb-5">
              山东昊天金属科技有限公司
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="flex gap-2.5 text-white/85">
                <EnvironmentFilled aria-hidden="true" className="mt-1 text-base" />
                <span className="text-[14px] md:text-[15px] leading-[1.6]">
                  山东省青岛市莱西市南墅镇水晶路17号
                </span>
              </div>
              <a href="tel:13210894158" suppressHydrationWarning className="flex gap-2.5 items-center no-underline text-white/85 hover:text-white/95 transition-colors">
                <PhoneFilled aria-hidden="true" className="text-base" />
                <span className="text-[14px] md:text-[15px]">132-1089-4158</span>
              </a>
              <div className="flex gap-2.5 items-center">
                <MailFilled aria-hidden="true" className="text-base" />
                <a href="mailto:1227134924@qq.com" className="text-white/85 text-[14px] md:text-[15px] no-underline hover:text-white/95 transition-colors">1227134924@qq.com</a>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="flex flex-col items-center">
                  {wechatQr ? (
                    <img src={wechatQr} alt="微信二维码" className="h-[100px] w-auto" />
                  ) : (
                    <div className="w-[100px] h-[100px] rounded bg-[rgba(255,255,255,0.08)] flex items-center justify-center">
                    </div>
                  )}
                  <span className="text-white/60 text-[12px]">微信</span>
                </div>
              </div>
            </div>
          </Col>

          {/* 快速链接 */}
          <Col xs={12} md={8}>
            <div className="text-white text-lg md:text-xl font-semibold mb-5">
              快速链接
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-[14px] md:text-[15px] !text-white/80 no-underline hover:!underline hover:!text-white/95">
                首页
              </Link>
              <Link href="/about" className="text-[14px] md:text-[15px] !text-white/80 no-underline hover:!underline hover:!text-white/95">
                关于我们
              </Link>
              <Link href="/products" className="text-[14px] md:text-[15px] !text-white/80 no-underline hover:!underline hover:!text-white/95">
                产品中心
              </Link>
              <Link href="/certificates" className="text-[14px] md:text-[15px] !text-white/80 no-underline hover:!underline hover:!text-white/95">
                企业资质
              </Link>
              <Link href="/news" className="text-[14px] md:text-[15px] !text-white/80 no-underline hover:!underline hover:!text-white/95">
                新闻中心
              </Link>
              <Link href="/contact" className="text-[14px] md:text-[15px] !text-white/80 no-underline hover:!underline hover:!text-white/95">
                联系我们
              </Link>
            </div>
          </Col>

          {/* 主营产品 */}
          <Col xs={12} md={8}>
            <div className="text-white text-lg md:text-xl font-semibold mb-5">
              主营产品
            </div>
            <div className="flex flex-col gap-2.5 text-[14px] md:text-[15px]">
              {categories.length > 0 ? categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category_id=${cat.id}`}
                  className="!text-white/80 no-underline hover:!underline hover:!text-white/95 transition-colors"
                >
                  {cat.name}
                  {cat._count && <span className="text-white/40 ml-1 text-xs">({cat._count.products})</span>}
                </Link>
              )) : (
                <span className="!text-white/40 text-xs">暂无分类数据</span>
              )}
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: "rgba(255,255,255,0.1)", margin: "32px 0 24px" }} />

        <div className="text-center text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
          &copy; 2022~{year || "2025"} 山东昊天金属科技有限公司 版权所有
          <span className="mx-2">|</span>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            鲁ICP备202XXXXXXXX号-1
          </a>
        </div>
      </div>
    </AntFooter>
  );
}
