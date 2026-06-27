import type { Metadata } from "next";
import serverFetch from "@/lib/serverApi";
import ProductsPageClient from "./ProductsPageClient";

export const metadata: Metadata = {
  title: "产品中心",
  description: "山东昊天金属科技有限公司产品展示 — 加氢催化剂、铝镍合金氢化催化剂、镍铝合金粉、贵金属催化剂",
};

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

export default async function ProductsPage() {
  let categories: Category[] = [];
  let products: Product[] = [];
  let pagination = { page: 1, pageSize: 16, total: 0 };
  let loading = true;

  try {
    const [catRes, prodRes] = await Promise.all([
      serverFetch<Category[]>("/api/categories"),
      serverFetch<Product[]>("/api/products?page=1&pageSize=16"),
    ]);

    categories = catRes.data && Array.isArray(catRes.data) ? catRes.data : [];
    
    const body = prodRes;
    products = body.data && Array.isArray(body.data) ? body.data : [];
    if (body.pagination) pagination = body.pagination;
    
    loading = false;
  } catch {
    loading = false;
  }

  return (
    <ProductsPageClient
      categories={categories}
      products={products}
      pagination={pagination}
      isServerLoading={loading}
    />
  );
}
