"use client";

import { useState, useCallback } from "react";
import { Card, Row, Col, Pagination, Breadcrumb, Button, Result } from "antd";
import Link from "next/link";
import api from "@/lib/api";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  images?: string[];
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
}

export default function ProductsPageClient({
  categories,
  products: initialProducts,
  pagination: initialPagination,
}: {
  categories: Category[];
  products: Product[];
  pagination: PaginationInfo;
}) {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [pagination, setPagination] = useState<PaginationInfo>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

  const fetchProducts = useCallback(async (categoryId?: number, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, pageSize: 16 };
      if (categoryId) params.category_id = categoryId;
      const res = await api.get("/api/products", { params });
      const body = res.data;
      if (body.success) {
        setProducts(Array.isArray(body.data) ? body.data : []);
        if (body.pagination) setPagination(body.pagination);
      } else {
        setError(body.error || "加载产品失败");
      }
    } catch {
      setError("网络异常，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategoryChange = (categoryId?: number) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId, 1);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(selectedCategory, page);
  };

  return (
    <>
      <div
        className="w-full h-[260px] md:h-[320px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Industrial%20product%20showcase%20warehouse%2C%20steel%20coils%20and%20metal%20materials%20stacked%2C%20modern%20factory%20interior%2C%20professional%20lighting&image_size=landscape_16_9)",
        }}
      />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { title: <Link href="/">首页</Link> },
              { title: "产品中心" },
            ]}
          />
        </div>

        {categories.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 m-0 tracking-wide">
                产品分类
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => handleCategoryChange(undefined)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 border cursor-pointer active:scale-95
                  ${(selectedCategory === undefined)
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 border cursor-pointer active:scale-95
                    ${selectedCategory === cat.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && !loading && !error ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4 text-gray-300">&#128230;</div>
            <p className="text-lg mb-4">暂无产品</p>
            <Link href="/contact" className="text-brand hover:text-brand-hover underline text-base">前往咨询定制产品 &rarr;</Link>
          </div>
        ) : error ? (
          <div className="py-16">
            <Result
              status="error"
              title="加载失败"
              subTitle={error}
              extra={
                <Button type="primary" onClick={() => fetchProducts(selectedCategory, pagination.page)}>
                  重新加载
                </Button>
              }
            />
          </div>
        ) : loading && products.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-lg animate-pulse">加载中...</div>
        ) : (
          <Row gutter={[24, 24]}>
            {products.map((product) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
                <Link href={`/products/${product.id}`} className="block group">
                  <Card
                    hoverable
                    className="[&_.ant-card-cover]:overflow-hidden [&_.ant-card-cover]:relative transition-transform duration-200 active:scale-[0.98]"
                    onMouseEnter={() => setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                    cover={
                      product.images?.[0] ? (
                        <div className="relative overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            style={{
                              transform: hoveredProductId === product.id ? "scale(1.25)" : "scale(1)",
                              transition: "transform 400ms cubic-bezier(0.33, 1, 0.68, 1)",
                              willChange: "transform",
                            }}
                            loading="lazy"
                          />
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                            style={{
                              opacity: hoveredProductId === product.id ? 1 : 0,
                              transition: "opacity 400ms cubic-bezier(0.33, 1, 0.68, 1)",
                            }}
                          />
                          <div
                            className="absolute bottom-0 left-0 right-0 px-4 pb-3"
                            style={{
                              opacity: hoveredProductId === product.id ? 1 : 0,
                              transform: hoveredProductId === product.id ? "translateY(0)" : "translateY(12px)",
                              transition: "opacity 400ms cubic-bezier(0.33, 1, 0.68, 1), transform 400ms cubic-bezier(0.33, 1, 0.68, 1)",
                            }}
                          >
                            <span className="text-white text-sm font-medium drop-shadow-sm block truncate">
                              {product.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                          暂无图片
                        </div>
                      )
                    }
                  >
                    <Card.Meta
                      title={product.name}
                      description={product.description || ""}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}

        {pagination.total > pagination.pageSize && (
          <div className="mt-8 text-center">
            <Pagination
              current={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </>
  );
}
