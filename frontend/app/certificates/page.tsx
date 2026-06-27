import type { Metadata } from "next";
import { Typography, Row, Col, Breadcrumb } from "antd";
import Link from "next/link";
import serverFetch from "@/lib/serverApi";
import CertificatesClient from "./CertificatesClient";

export const metadata: Metadata = {
  title: "企业资质",
  description: "山东昊天金属科技有限公司企业资质证书展示",
};

interface Certificate {
  id: number;
  title: string;
  imageUrl: string;
}

export default async function CertificatesPage() {
  let certificates: Certificate[] = [];
  let error: string | null = null;
  let loading = true;

  try {
    const res = await serverFetch<Certificate[]>("/api/certificates");
    const data = res.data;
    certificates = data && Array.isArray(data) ? data : [];
    loading = false;
  } catch {
    error = "数据加载失败，请稍后重试";
    loading = false;
  }

  return <CertificatesClient certificates={certificates} error={error} isServerLoading={loading} />;
}
