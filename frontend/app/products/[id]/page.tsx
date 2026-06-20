import type { Metadata } from "next";
import { Breadcrumb, Alert } from "antd";
import Link from "next/link";
import serverFetch from "@/lib/serverApi";
import ProductDetailClient from "./ProductDetailClient";

interface Product {
  id: number;
  name: string;
  description?: string;
  detail?: string;
  images?: string[];
  category?: { name: string } | null;
  createdAt?: string;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await serverFetch<Product>(`/api/products/${id}`);
    return {
      title: res.data?.name || "产品详情",
      description: res.data?.description || "昊天金属科技产品详情",
    };
  } catch {
    return { title: "产品详情" };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product: Product | null = null;
  let error: string | null = null;

  try {
    const res = await serverFetch<Product>(`/api/products/${id}`);
    product = res.data;
  } catch {
    error = "产品数据加载失败，请稍后重试";
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <Alert title={error} type="error" showIcon />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <Alert title="产品未找到" type="warning" showIcon />
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
