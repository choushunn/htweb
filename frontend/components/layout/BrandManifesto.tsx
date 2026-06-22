"use client";

import { usePathname } from "next/navigation";

export default function BrandManifesto() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <div
        className="w-[60%] max-w-[540px] h-[2px] mx-auto rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #c8d6e5 15%, #0070d5 50%, #c8d6e5 85%, transparent 100%)',
        }}
      />
      <section className="py-12 md:py-20 px-6 bg-white">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="flex items-center justify-center gap-3 md:gap-6 mb-6 flex-wrap">
            {["品牌", "卓越", "专注", "领航", "未来"].map((word, i) => (
              <span key={word} className="flex items-center">
                <span className="text-xl md:text-[32px] font-bold text-gray-800 tracking-wider">
                  {word}
                </span>
                {i < 4 && (
                  <span className="text-[#0070d5] text-base md:text-xl ml-2 md:ml-4 font-light">/</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-sm md:text-lg text-gray-500 leading-relaxed max-w-[600px] mx-auto tracking-wide">
            山东昊天金属科技 — 以品质为根基，以创新驱动未来
          </p>
        </div>
      </section>
    </>
  );
}
