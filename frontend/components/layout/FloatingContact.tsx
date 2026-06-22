"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PhoneFilled,
  WechatOutlined,
  UpOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { useSettings } from "@/contexts/SettingsContext";

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  expandedContent: React.ReactNode;
}

function ContactItem({ icon, label, expandedContent }: ContactItemProps) {
  return (
    <div className="group flex items-center justify-end h-12 md:h-14 relative">
      <div
        className={`absolute right-12 md:right-14 top-0 bg-white border border-[#e8e8e8] rounded-l min-h-12 md:min-h-14 flex items-center whitespace-nowrap shadow-md z-10 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-[opacity,visibility] duration-200 ${label === "微信咨询" ? "py-2 px-2" : "px-5"}`}
      >
        {expandedContent}
      </div>
      <button
        type="button"
        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-white text-[24px] md:text-[30px] transition-colors duration-200 relative z-11 cursor-pointer border-none bg-transparent p-0"
        aria-label={label}
      >
        {icon}
      </button>
    </div>
  );
}

export default function FloatingContact() {
  const pathname = usePathname();
  const { wechatQr, contact_phone } = useSettings();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* 桌面端：右侧悬浮面板 */}
      <div
        className="fixed right-0 top-1/2 z-[999] flex-col hidden lg:flex" style={{ transform: "translateY(calc(-50% + 60px))" }}
        aria-label="快捷联系方式"
        role="complementary"
      >
        <div className="bg-[#0070d5] transition-colors duration-200 hover:bg-[#005bb5]">
          <ContactItem
            icon={<QqOutlined aria-hidden="true" />}
            label="QQ咨询"
            expandedContent={
              <a
                href="https://wpa.qq.com/msgrd?v=3&uin=1227134924&site=qq&menu=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0070d5] text-base font-medium no-underline whitespace-nowrap"
              >
                QQ: 1227134924
              </a>
            }
          />
        </div>

        <div className="h-[1px] bg-[rgba(255,255,255,0.15)]" />

        <div className="bg-[#0070d5] transition-colors duration-200 hover:bg-[#005bb5]">
          <ContactItem
            icon={<PhoneFilled aria-hidden="true" />}
            label="电话咨询"
            expandedContent={
              <div className="flex items-center gap-[10px]">
                <PhoneFilled className="text-[#0070d5] text-[18px]" aria-hidden="true" />
                <a href={`tel:${contact_phone}`} suppressHydrationWarning className="text-[#1a1a1a] text-[16px] md:text-[18px] font-bold tracking-[1px] no-underline">
                  {contact_phone?.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3") || contact_phone}
                </a>
              </div>
            }
          />
        </div>

        <div className="h-[1px] bg-[rgba(255,255,255,0.15)]" />

        <div className="bg-[#0070d5] transition-colors duration-200 hover:bg-[#005bb5]">
          <ContactItem
            icon={<WechatOutlined aria-hidden="true" />}
            label="微信咨询"
            expandedContent={
              <div className="flex items-start">
                {wechatQr ? (
                  <div>
                    <img
                      src={wechatQr}
                      alt="微信二维码"
                      className="h-auto block max-w-none"
                      style={{ width: 160 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="w-[200px] h-[200px] rounded bg-[#f0f0f0] flex flex-col items-center justify-center hidden">
                      <WechatOutlined className="text-[#ccc] text-[36px] mb-1" />
                      <span className="text-[#999] text-sm">图片失效</span>
                    </div>
                    <span className="text-[#999] text-xs mt-[6px] block text-center">
                      扫码咨询
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-[180px] h-[180px] rounded bg-[#f0f0f0] flex flex-col items-center justify-center">
                      <WechatOutlined className="text-[#ccc] text-[36px] mb-1" />
                      <span className="text-[#999] text-sm">微信二维码</span>
                    </div>
                  </div>
                )}
              </div>
            }
          />
        </div>
      </div>

      {/* 移动端：底部固定栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] flex lg:hidden bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]" role="complementary" aria-label="快捷联系方式">
        <a
          href={`tel:${contact_phone}`}
          suppressHydrationWarning
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[#0070d5] no-underline active:bg-blue-50 transition-colors"
        >
          <PhoneFilled aria-hidden="true" className="text-xl" />
          <span className="text-[11px] text-gray-600">电话</span>
        </a>
        <a
          href="https://wpa.qq.com/msgrd?v=3&uin=1227134924&site=qq&menu=yes"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[#0070d5] no-underline active:bg-blue-50 transition-colors"
        >
          <QqOutlined aria-hidden="true" className="text-xl" />
          <span className="text-[11px] text-gray-600">QQ</span>
        </a>
        <a
          href="/contact"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[#0070d5] no-underline active:bg-blue-50 transition-colors"
        >
          <WechatOutlined aria-hidden="true" className="text-xl" />
          <span className="text-[11px] text-gray-600">留言</span>
        </a>
      </div>

      {/* 回到顶部按钮 */}
      <button
        type="button"
        aria-label="回到顶部"
        className="fixed right-3 bottom-24 lg:right-0 lg:bottom-20 z-[999] cursor-pointer overflow-hidden border-none p-0 bg-transparent"
        style={{
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? ("auto" as const) : ("none" as const),
          transition: "opacity 0.3s",
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <div className="w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center bg-[#0070d5]/90 lg:bg-[#0070d5] text-white text-lg lg:text-[24px] rounded-full lg:rounded-none transition-colors duration-200 hover:bg-[#005bb5] shadow-md lg:shadow-none">
          <UpOutlined aria-hidden="true" />
        </div>
      </button>
    </>
  );
}
