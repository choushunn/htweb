import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "售后服务 - 山东昊天金属科技",
  description: "山东昊天金属科技提供全方位、多层次、高效率的售前咨询、技术支持、售后保障及定制化服务，专业团队全程护航。",
};

const services = [
  {
    title: "售前咨询",
    items: [
      "专业工程师一对一技术咨询",
      "产品选型与材料匹配建议",
      "免费样品寄送服务",
      "技术参数与检测报告提供",
    ],
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#e8f4fd" />
        <path d="M20 24C20 21.79 21.79 20 24 20H32C34.21 20 36 21.79 36 24V32C36 34.21 34.21 36 32 36H24C21.79 36 20 34.21 20 32V24Z" fill="#0070d5" opacity="0.2" />
        <path d="M28 24L28 32M24 28L32 28" stroke="#0070d5" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="28" r="10" stroke="#0070d5" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: "技术支持",
    items: [
      "材料加工工艺指导",
      "产品使用技术培训",
      "现场技术问题诊断",
      "专业技术文档支持",
    ],
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#e8f4fd" />
        <path d="M22 18L34 18C35.1 18 36 18.9 36 20L36 36C36 37.1 35.1 38 34 38L22 38C20.9 38 20 37.1 20 36L20 20C20 18.9 20.9 18 22 18Z" fill="#0070d5" opacity="0.2" />
        <path d="M24 28L27 31L32 25" stroke="#0070d5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="28" r="10" stroke="#0070d5" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: "售后服务",
    items: [
      "7×24小时客服热线",
      "质量问题48小时内响应",
      "产品退换货保障",
      "定期客户回访服务",
    ],
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#e8f4fd" />
        <path d="M20 26C20 23.79 21.79 22 24 22H32C34.21 22 36 23.79 36 26V32C36 34.21 34.21 36 32 36H28L24 38V36H24C21.79 36 20 34.21 20 32V26Z" fill="#0070d5" opacity="0.2" />
        <path d="M24 28H32M24 32H28" stroke="#0070d5" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="28" r="10" stroke="#0070d5" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    title: "定制服务",
    items: [
      "非标尺寸定制加工",
      "特殊材质需求对接",
      "订单进度实时追踪",
      "专属客户经理服务",
    ],
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#e8f4fd" />
        <path d="M18 22L28 18L38 22V34L28 38L18 34V22Z" fill="#0070d5" opacity="0.2" />
        <path d="M23 28L27 32L33 25" stroke="#0070d5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 22L28 18L38 22" stroke="#0070d5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 18V38" stroke="#0070d5" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const highlights = [
  { value: "48h", label: "问题响应" },
  { value: "98%", label: "客户满意度" },
  { value: "15年", label: "服务经验" },
];

export default function ServicePage() {
  return (
    <>
      <div
        className="w-full h-[280px] md:h-[340px] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20tech%20support%20team%20working%20in%20modern%20office%20with%20blue%20lighting%2C%20headsets%2C%20computers%2C%20clean%20corporate%20environment&image_size=landscape_16_9)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-[#0070d5]/60" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <div className="w-16 h-1 bg-white/80 mx-auto mb-6" />
          <h1 className="text-white text-5xl md:text-6xl font-bold tracking-wider">售后服务</h1>
          <p className="text-white/80 text-xl mt-4 tracking-wide">专业服务，全程护航</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0070d5] transition-colors">首页</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-[#0070d5] transition-colors">关于我们</Link>
            <span>/</span>
            <span className="text-gray-800">售后服务</span>
          </nav>
        </div>

        <div className="text-center mb-20">
          <p className="text-2xl text-gray-500 leading-relaxed max-w-4xl mx-auto">
            我们致力于为每一位客户提供<span className="text-[#0070d5] font-semibold">全方位、多层次、高效率</span>的服务体验，
            从售前咨询到售后保障，<span className="text-[#0070d5] font-semibold">全程专业团队</span>为您保驾护航。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 hover:shadow-lg transition-[box-shadow,border-color] duration-300 h-full group hover:border-[#0070d5]/20">
              <div className="flex items-start gap-6">
                <div className="shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-4 text-2xl font-semibold text-[#1a1a1a]">
                    {s.title}
                  </h4>
                  <div className="w-10 h-0.5 bg-[#0070d5] mb-5 rounded-full" />
                  <ul className="list-none p-0 m-0">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-gray-500 text-base leading-[2]"
                      >
                        <svg className="w-5 h-5 shrink-0 mt-[5px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill="#0070d5" fillOpacity="0.1" />
                          <path d="M6 10.5L9 13.5L14 7" stroke="#0070d5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-gradient-to-r from-[#0070d5] to-[#0090f5] rounded-2xl py-12 px-8 text-center">
          <div className="grid grid-cols-3 gap-8">
            {highlights.map((h) => (
              <div key={h.label} className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{h.value}</div>
                <div className="w-8 h-0.5 bg-white/40 mx-auto mb-2 rounded-full" />
                <div className="text-white/80 text-lg">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
