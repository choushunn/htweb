"use client";

import { PhoneFilled, MailFilled, WechatOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";

export default function TopBar() {
  const pathname = usePathname();
  const { wechatQr, contact_phone, contact_email } = useSettings();

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="bg-[#1a1a1a] h-[38px] flex items-center text-white/70 text-sm">
      <div className="max-w-[1200px] w-full mx-auto px-4 md:px-12 flex items-center justify-between">
        <span className="hidden md:inline">欢迎访问山东昊天金属科技有限公司官网</span>
        <div className="flex items-center gap-3 md:gap-6">
          <a href={`tel:${contact_phone}`} suppressHydrationWarning className="flex items-center gap-1.5 text-white/70 no-underline hover:text-white/90 transition-colors">
            <PhoneFilled aria-hidden="true" className="text-xs" />
            {contact_phone?.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3") || contact_phone}
          </a>
          <span className="hidden sm:flex items-center gap-1.5">
            <MailFilled aria-hidden="true" className="text-xs" />
            <a href={`mailto:${contact_email}`} className="text-white/70 no-underline hover:text-white/90 border-b border-b-transparent hover:border-b-white transition-[color,border-color] duration-200">{contact_email}</a>
          </span>
          <div className="relative group">
            <span className="flex items-center gap-1.5 cursor-pointer">
              <WechatOutlined aria-hidden="true" className="text-xs" />
              <span className="hidden sm:inline">微信二维码</span>
            </span>
            <div className="absolute top-full right-0 mt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-[opacity,visibility] duration-200 z-[9999]">
              <div className="bg-white rounded-lg shadow-lg text-center">
                {wechatQr ? (
                  <>
                    <img
                      src={wechatQr}
                      alt="微信二维码"
                      className="block max-w-none"
                      style={{ width: 180 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="w-[180px] h-[180px] rounded bg-[#f0f0f0] flex flex-col items-center justify-center hidden">
                      <WechatOutlined className="text-[#ccc] text-[28px] mb-1" />
                      <span className="text-[#999] text-xs">图片失效</span>
                    </div>
                  </>
                ) : (
                  <div className="w-[180px] h-[180px] rounded bg-[#f0f0f0] flex flex-col items-center justify-center">
                    <WechatOutlined className="text-[#ccc] text-[28px] mb-1" />
                    <span className="text-[#999] text-xs">微信二维码</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
