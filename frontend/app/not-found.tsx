import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div
        className="text-9xl font-bold mb-4 select-none text-[#e8edf5] leading-none"
      >
        404
      </div>
      <div className="w-12 h-0.5 mb-6 bg-[#0070d5]" />
      <h2 className="text-3xl font-semibold text-gray-800 mb-3">页面未找到</h2>
      <p className="text-gray-500 mb-10 text-lg max-w-md">
        您访问的页面不存在或已被移除，请检查链接是否正确
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-3 text-white rounded-md transition-opacity duration-200 hover:opacity-90 no-underline text-base font-medium bg-[#0070d5]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M7 3L2 8L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        返回首页
      </Link>
    </div>
  );
}
