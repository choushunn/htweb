"use client";

import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  PictureOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "仪表盘" },
  { key: "/admin/news", icon: <FileTextOutlined />, label: "新闻管理" },
  { key: "/admin/products", icon: <ShoppingOutlined />, label: "产品管理" },
  { key: "/admin/categories", icon: <AppstoreOutlined />, label: "分类管理" },
  { key: "/admin/certificates", icon: <SafetyOutlined />, label: "资质管理" },
  { key: "/admin/banners", icon: <PictureOutlined />, label: "轮播管理" },
  { key: "/admin/messages", icon: <MessageOutlined />, label: "留言管理" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sider className="bg-white">
      <div className="h-16 flex items-center justify-center font-bold text-blue-600 border-b">
        管理后台
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        className="border-none"
      />
    </Sider>
  );
}
