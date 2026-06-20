import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "企业文化 - 山东昊天金属科技",
  description: "山东昊天金属科技秉承诚信、创新、高效、共赢的企业精神，致力于打造有温度、有担当、有追求的企业文化。",
};

const values = [
  {
    title: "企业愿景",
    desc: "成为国内领先的金属材料综合服务商，引领行业创新发展。",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="24" fill="#e8f4fd" stroke="#0070d5" strokeWidth="2" />
        <path d="M26 14L28.5 21.5H36L30 26.5L32 34L26 29.5L20 34L22 26.5L16 21.5H23.5L26 14Z" fill="#0070d5" />
      </svg>
    ),
  },
  {
    title: "企业使命",
    desc: "为客户提供优质的金属材料解决方案，为员工创造发展平台，为社会贡献价值。",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="24" fill="#e8f4fd" stroke="#0070d5" strokeWidth="2" />
        <path d="M22 18C22 15.79 23.79 14 26 14C28.21 14 30 15.79 30 18C30 20.21 28.21 22 26 22C23.79 22 22 20.21 22 18ZM34 34V32C34 28.68 28.63 27 26 27C23.37 27 18 28.68 18 32V34H34Z" fill="#0070d5" />
      </svg>
    ),
  },
  {
    title: "核心价值观",
    desc: "诚信为本、创新驱动、高效执行、合作共赢。",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="24" fill="#e8f4fd" stroke="#0070d5" strokeWidth="2" />
        <path d="M26 16L28.5 18.5L26 21L23.5 18.5L26 16ZM26 24L32 30H28V36H24V30H20L26 24Z" fill="#0070d5" />
      </svg>
    ),
  },
  {
    title: "经营理念",
    desc: "质量第一、客户至上、持续改进、追求卓越。",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="24" fill="#e8f4fd" stroke="#0070d5" strokeWidth="2" />
        <path d="M26 15L28.09 20.59L34 21.18L29.54 25.12L31.12 31L26 27.59L20.88 31L22.46 25.12L18 21.18L23.91 20.59L26 15Z" fill="#0070d5" />
      </svg>
    ),
  },
];

const stats = [
  { value: "15年", label: "行业深耕" },
  { value: "500+", label: "合作企业" },
  { value: "30+", label: "出口国家" },
];

export default function CulturePage() {
  return (
    <>
      <div
        className="w-full h-[280px] md:h-[340px] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20corporate%20team%20standing%20together%20in%20sunlit%20office%20looking%20forward%2C%20professional%20yet%20warm%20atmosphere%2C%20company%20culture&image_size=landscape_16_9)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0070d5]/80 to-black/40" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <div className="w-16 h-1 bg-white/80 mx-auto mb-6" />
          <h1 className="text-white text-5xl md:text-6xl font-bold tracking-wider">企业文化</h1>
          <p className="text-white/80 text-xl mt-4 tracking-wide">以品质为本，以创新为魂</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0070d5] transition-colors">首页</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-[#0070d5] transition-colors">关于我们</Link>
            <span>/</span>
            <span className="text-gray-800">企业文化</span>
          </nav>
        </div>

        {/* 文化标语 */}
        <div className="text-center mb-20">
          <p className="text-2xl text-gray-500 leading-relaxed max-w-4xl mx-auto">
            山东昊天金属科技秉承<span className="text-[#0070d5] font-semibold">「诚信、创新、高效、共赢」</span>的企业精神，
            致力于打造<span className="text-[#0070d5] font-semibold">有温度、有担当、有追求</span>的企业文化。
          </p>
        </div>

        {/* 价值观卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-lg transition-[box-shadow,border-color] duration-300 h-full group hover:border-[#0070d5]/20">
              <div className="flex items-start gap-6">
                <div className="shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                  {v.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="!mb-3 !text-2xl !font-semibold !text-[#1a1a1a]">
                    {v.title}
                  </h4>
                  <div className="w-10 h-0.5 bg-[#0070d5] mb-4 rounded-full" />
                  <p className="text-gray-500 text-lg leading-[1.9] m-0">
                    {v.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 数据统计 */}
        <div className="mt-24 bg-gradient-to-r from-[#0070d5] to-[#0090f5] rounded-2xl py-12 px-8 text-center">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{s.value}</div>
                <div className="w-8 h-0.5 bg-white/40 mx-auto mb-2 rounded-full" />
                <div className="text-white/80 text-lg">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
