import Link from "next/link";
import ScrollRevealWrapper from "./ScrollRevealWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们 - 山东昊天金属科技",
  description: "山东昊天金属科技有限公司成立于2022年，专注催化材料研发、生产、销售与服务，产品出口30余国家，注册资本1000万元。",
};

function Icon({ d, viewBox = "0 0 24 24" }: { d: string; viewBox?: string }) {
  return (
    <svg width="36" height="36" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} fill="#0070d5" />
    </svg>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <div className="w-12 h-0.5 bg-[#0070d5] mx-auto mb-5" />
      <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1a1a1a] tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-gray-500 mt-3">{subtitle}</p>
      )}
    </div>
  );
}

const MILESTONES = [
  { year: "2022", event: "公司成立，落户青岛莱西市，注册资本1000万元" },
  { year: "2023", event: "通过ISO9001质量管理体系认证，建立完整品控体系" },
  { year: "2024", event: "产品出口突破30个国家，年出口额超5000万元" },
  { year: "2025", event: "扩建研发中心，获得多项催化材料技术专利" },
  { year: "2026", event: "启动二期厂房建设，产能提升200%，布局新能源材料" },
];

const VALUES = [
  {
    icon: <Icon d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3-3c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1s1 .45 1 1v5c0 .55-.45 1-1 1zm0-8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />,
    title: "企业使命",
    desc: "以科技创新驱动催化材料行业发展，为全球客户提供高品质产品与解决方案",
  },
  {
    icon: <Icon d="M16 6l2.29-2.29-1.42-1.42L14.59 4.6 12 2 9.41 4.6 7.12 2.29 5.71 3.71 8 6l-4 6h4l-2 4h2v6h2v-6h2l-2-4h4l-4-6z" />,
    title: "企业愿景",
    desc: "成为国内领先、国际知名的催化材料综合服务商",
  },
  {
    icon: <Icon d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />,
    title: "核心价值观",
    desc: "诚信为本、创新为魂、高效务实、合作共赢",
  },
];

export default function AboutPage() {
  return (
    <>
      <div
        className="w-full h-[260px] md:h-[320px] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20corporate%20office%20building%20exterior%2C%20clean%20professional%20atmosphere%2C%20bright%20blue%20sky%2C%20business%20headquarters&image_size=landscape_16_9)",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <h1 className="text-white text-[36px] md:text-[48px] font-bold tracking-wider">
            关于我们
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-2">
            专注催化材料，以品质致敬信任
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0070d5] transition-colors">首页</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-[#0070d5] transition-colors">关于我们</Link>
            <span>/</span>
            <span className="text-gray-800">公司简介</span>
          </nav>
        </div>

        <ScrollRevealWrapper>
          <SectionTitle title="公司简介" subtitle="About Us" />
          <div className="max-w-4xl mx-auto">
            <p className="text-base md:text-lg leading-[2] text-gray-700 mb-5">
              山东昊天金属科技有限公司成立于2022年，坐落于山东省青岛市莱西市，是一家集催化材料研发、生产加工、销售服务与进出口贸易于一体的综合性高新技术企业。公司注册资本1000万元，占地约5万平方米，拥有现代化标准厂房3万余平方米。
            </p>
            <p className="text-base md:text-lg leading-[2] text-gray-700 mb-5">
              公司配备先进的生产设备和检测仪器，主要产品涵盖加氢催化剂、雷尼镍催化剂、镍铝合金粉、贵金属催化剂等多个品类，广泛应用于石油化工、医药合成、精细化学品、新能源等领域。
            </p>
            <p className="text-base md:text-lg leading-[2] text-gray-700 mb-5">
              公司始终坚持"质量第一、客户至上"的经营理念，先后通过ISO9001质量管理体系认证、ISO14001环境管理体系认证，产品质量达到国际先进水平。凭借过硬的产品质量和优质的服务，产品畅销全国各省市，并远销东南亚、中东、欧美等30余个国家和地区。
            </p>
          </div>
        </ScrollRevealWrapper>

        <ScrollRevealWrapper className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "1000万+", label: "注册资本", icon: <Icon d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z" /> },
              { value: "50+", label: "产品品类", icon: <Icon d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /> },
              { value: "30+", label: "出口国家", icon: <Icon d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /> },
              { value: "5000万+", label: "年出口额", icon: <Icon d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-10 px-4 bg-[#f7f9fa] border border-[#0070d5]/10 transition-[box-shadow,transform] duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="text-[#0070d5] text-3xl mb-3">{stat.icon}</div>
                <div className="text-[36px] md:text-[44px] font-bold text-[#0070d5] leading-none mb-2">{stat.value}</div>
                <div className="w-8 h-0.5 bg-[#0070d5] mx-auto my-3 rounded-full" />
                <div className="text-[#555] text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollRevealWrapper>

        <ScrollRevealWrapper className="mt-20">
          <SectionTitle title="企业文化" subtitle="Culture & Values" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((val) => (
              <div key={val.title} className="text-center py-12 px-6 bg-white border border-gray-100 rounded-lg transition-[box-shadow,border-color] duration-300 hover:shadow-lg hover:border-[#0070d5]/20 h-full">
                <div className="mb-5">{val.icon}</div>
                <h3 className="text-[24px] font-semibold text-[#1a1a1a] mb-4">{val.title}</h3>
                <p className="text-base text-gray-600 leading-[1.9]">{val.desc}</p>
              </div>
            ))}
          </div>
        </ScrollRevealWrapper>

        <ScrollRevealWrapper className="mt-20">
          <SectionTitle title="发展历程" subtitle="Milestones" />
          <div className="max-w-3xl mx-auto">
            <div className="relative pl-8 border-l-2 border-[#0070d5]/30">
              {MILESTONES.map((m, idx) => (
                <div
                  key={m.year}
                  className={`mb-10 last:mb-0 relative ${
                    idx !== MILESTONES.length - 1 ? "pb-2" : ""
                  }`}
                >
                  <div className="absolute -left-[calc(2rem+5px)] top-1 w-4 h-4 rounded-full bg-[#0070d5] border-2 border-white shadow" />
                  <div className="bg-[#f7f9fa] rounded-lg p-5 transition-shadow duration-300 hover:shadow-md">
                    <span className="inline-block px-3 py-1 bg-[#0070d5] text-white text-sm font-semibold rounded mb-2">
                      {m.year}
                    </span>
                    <p className="text-base text-gray-700 leading-relaxed m-0">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollRevealWrapper>

        <ScrollRevealWrapper className="mt-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0070d5] via-[#0060bd] to-[#004a94] rounded-2xl py-16 md:py-20 px-8 md:px-12 text-center">
            <div className="absolute -top-24 -right-24 w-64 h-64 border-[20px] border-white/[0.04] rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 border-[15px] border-white/[0.04] rounded-full" />
            <div className="absolute top-1/2 left-8 w-px h-24 bg-white/[0.06] -translate-y-1/2 rotate-45 hidden md:block" />
            <div className="absolute top-1/2 right-8 w-px h-24 bg-white/[0.06] -translate-y-1/2 -rotate-45 hidden md:block" />
            <div className="absolute inset-x-[15%] top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative z-[1]">
              <div className="w-16 h-0.5 bg-white/30 mx-auto mb-6 rounded-full" />
              <h3 className="text-[30px] md:text-[40px] font-bold text-white mb-4 tracking-wide leading-tight">
                携手昊天，共赢未来
              </h3>
              <p className="text-white/75 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed tracking-wide">
                无论您是寻求高品质催化材料，还是需要定制化解决方案，我们都将竭诚为您服务
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 py-3.5 px-10 text-base no-underline rounded-lg transition-[background-color,transform,box-shadow] duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:translate-y-0"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <span className="text-[#0070d5] font-semibold">联系我们</span>
                  <span className="text-[#0070d5] font-semibold transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 py-3.5 px-10 border-2 border-white/70 text-base no-underline rounded-lg transition-[background-color,transform,border-color] duration-300 hover:bg-white/10 hover:-translate-y-1 hover:border-white active:translate-y-0"
                >
                  <span className="text-white font-semibold">查看产品</span>
                  <span className="text-white font-semibold transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollRevealWrapper>
      </div>
    </>
  );
}
