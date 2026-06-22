"use client";

import { useState } from "react";
import { Breadcrumb, Image } from "antd";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description?: string;
  detail?: string;
  images?: string[];
  category?: { name: string } | null;
  createdAt?: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = product.images || [];
  const categoryName = product.category?.name;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <Breadcrumb
          className="mb-8"
          items={[
            { title: <Link href="/" className="text-gray-500 hover:text-[#0070d5] transition-colors">首页</Link> },
            { title: <Link href="/products" className="text-gray-500 hover:text-[#0070d5] transition-colors">产品中心</Link> },
            { title: <span className="text-gray-800 font-medium">{product.name}</span> },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {images.length > 0 ? (
            <div className="space-y-4">
              <div className="relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm [&_.ant-image]:!block [&_.ant-image]:!w-full [&_.ant-image]:!h-full [&_.ant-image-img]:!w-full [&_.ant-image-img]:!h-full [&_.ant-image-img]:object-cover" style={{ height: 420 }}>
                <Image.PreviewGroup>
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    preview={{ cover: <div className="text-sm">点击查看大图</div> }}
                  />
                </Image.PreviewGroup>
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-[border-color,opacity,box-shadow] duration-200 ${
                        selectedImage === index
                          ? "border-[#0070d5] shadow-md shadow-blue-200"
                          : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-[420px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>暂无产品图片</span>
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center">
            {categoryName && (
              <div className="inline-flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0070d5]" />
                <span className="text-sm font-medium text-[#0070d5] tracking-wide uppercase">
                  {categoryName}
                </span>
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>

            <div className="w-16 h-0.5 bg-gradient-to-r from-[#0070d5] to-blue-300 rounded-full mb-6" />

            {product.createdAt && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>发布时间：{new Date(product.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
            )}
          </div>
        </div>

        {product.description && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 m-0">产品说明书</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div
                className="
                  prose prose-sm max-w-none text-gray-700 leading-relaxed
                  [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-gray-100
                  [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:mb-4 [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-1.5
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:mb-1.5
                  [&_strong]:font-semibold [&_strong]:text-gray-900
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#0070d5] [&_blockquote]:bg-blue-50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:rounded-r-lg [&_blockquote]:my-4 [&_blockquote]:text-gray-600
                  [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-200 [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:my-6
                  [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-800
                  [&_td]:border [&_td]:border-gray-200 [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-gray-600
                  [&_tr:nth-child(even)_td]:bg-gray-50/50
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-sm
                  [&_hr]:my-8 [&_hr]:border-gray-200
                  [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-gray-800
                  [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
                  [&_a]:text-[#0070d5] [&_a]:hover:underline
                "
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        )}

        {product.detail && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 m-0">详细描述</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div
                className="
                  prose prose-sm max-w-none text-gray-700 leading-relaxed
                  [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4
                  [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:mb-4 [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                  [&_strong]:font-semibold [&_strong]:text-gray-900
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#0070d5] [&_blockquote]:bg-blue-50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:rounded-r-lg [&_blockquote]:my-4
                  [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-200 [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:my-6
                  [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold
                  [&_td]:border [&_td]:border-gray-200 [&_td]:px-4 [&_td]:py-2.5
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-sm
                  [&_hr]:my-8 [&_hr]:border-gray-200
                  [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                  [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
                  [&_a]:text-[#0070d5] [&_a]:hover:underline
                "
                dangerouslySetInnerHTML={{ __html: product.detail }}
              />
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0070d5] transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">返回产品列表</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
