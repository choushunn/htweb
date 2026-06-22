"use client";

import { Layout, Menu, Button, App, Space, Avatar, Modal, Form, Input } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  PictureOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "仪表盘" },
  { key: "/admin/news", icon: <FileTextOutlined />, label: "新闻管理" },
  { key: "/admin/products", icon: <ShoppingOutlined />, label: "产品管理" },
  { key: "/admin/categories", icon: <AppstoreOutlined />, label: "分类管理" },
  { key: "/admin/certificates", icon: <SafetyOutlined />, label: "资质管理" },
  { key: "/admin/banners", icon: <PictureOutlined />, label: "轮播管理" },
  { key: "/admin/messages", icon: <MessageOutlined />, label: "留言管理" },
  { key: "/admin/settings", icon: <SettingOutlined />, label: "站点设置" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("管理员");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordForm] = Form.useForm();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [passwordChangedModalOpen, setPasswordChangedModalOpen] = useState(false);
  const [year, setYear] = useState(2026);
  const [copyrightText, setCopyrightText] = useState("");
  const [icpNumber, setIcpNumber] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { message } = App.useApp();

  useEffect(() => {
    setMounted(true);
    setYear(new Date().getFullYear());
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);

    if (pathname !== "/admin/login") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/admin/login");
      } else {
        // 获取站点设置（版权信息、备案号）
        api.get("/api/admin/settings").then((res) => {
          const data = res.data?.data || res.data;
          if (data) {
            if (data.copyright_text) setCopyrightText(data.copyright_text);
            if (data.icp_number) setIcpNumber(data.icp_number);
          }
        }).catch(() => {});
      }
    }
  }, [pathname, router]);

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  if (!mounted) return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    message.success("已退出登录");
    router.push("/admin/login");
  };

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        message.error("两次输入的新密码不一致");
        return;
      }
      setPasswordSubmitting(true);
      await api.put("/api/auth/password", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      setPasswordModalOpen(false);
      passwordForm.resetFields();
      setPasswordChangedModalOpen(true);
    } catch (error: any) {
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error(error.message || "修改密码失败");
      }
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleReLogin = () => {
    setPasswordChangedModalOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/admin/login");
  };


  return (
    <Layout className="min-h-screen">
      <Sider
        style={{ background: '#fff' }}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        trigger={null}
        className={`border-r border-[#f0f0f0] ${!collapsed ? "shadow-[2px_0_8px_rgba(0,0,0,0.04)]" : ""}`}
      >
        {/* Logo 区域 */}
        <div className="h-14 flex items-center justify-center border-b border-[#f0f0f0] bg-gradient-to-br from-[#0070d5] to-[#005bb5] text-white">
          {collapsed ? (
            <SettingOutlined className="text-2xl text-white" />
          ) : (
            <Space>
              <SettingOutlined className="text-[22px] text-white" />
              <span className="text-lg font-bold text-white tracking-wide">
                管理后台
              </span>
            </Space>
          )}
        </div>

        {/* 侧边菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          className="border-none text-[15px] py-2"
        />
      </Sider>

      <Layout className="flex flex-col flex-1 h-screen">
        {/* 顶部 Header */}
        <Header style={{ background: '#fff' }} className="!h-14 flex items-center justify-between !px-5 border-b border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] shrink-0 relative">
          {/* 顶部品牌色装饰线 */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0070d5] to-[#00a0ff]" />

          {/* 左侧：折叠按钮 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="!w-9 !h-9 text-base text-gray-400 hover:text-[#0070d5] flex items-center justify-center"
          />

          {/* 右侧：查看官网 + 退出系统 + 用户信息 */}
          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={<span className="text-base">&#8599;</span>}
              onClick={() => window.open("/", "_blank")}
              className="text-gray-400 hover:text-[#0070d5] h-9 px-3 rounded-lg hover:bg-blue-50 transition-colors text-[13px]"
            >
              查看官网
            </Button>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={() => setLogoutModalOpen(true)}
              className="text-gray-400 hover:text-red-500 h-9 px-3 rounded-lg hover:bg-red-50 transition-colors text-[13px]"
            >
              退出系统
            </Button>
            <div className="relative" ref={userMenuRef}>
              <div
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 h-9 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer select-none"
              >
                <Avatar
                  size={26}
                  icon={<UserOutlined />}
                  className="bg-[#0070d5]"
                />
                <span className="text-[13px] text-gray-700">{username}</span>
              </div>

              {/* 自定义下拉菜单 */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-3 py-2 text-gray-400 text-xs border-b border-gray-50">
                    {username}
                  </div>
                  <div
                    onClick={() => { setUserMenuOpen(false); passwordForm.resetFields(); setPasswordModalOpen(true); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <LockOutlined className="text-[#0070d5]" />
                    <span>修改密码</span>
                  </div>
                  <div className="border-t border-gray-50" />
                  <div
                    onClick={() => { setUserMenuOpen(false); setLogoutModalOpen(true); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <LogoutOutlined />
                    <span>退出系统</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="p-6 bg-[#f0f4f8] flex-1 overflow-auto">
          {children}
        </Content>

        {/* 底部版权 - 贴底 */}
        <div className="h-14 flex items-center justify-center bg-white border-t border-gray-100 text-gray-700 text-base shrink-0">
          <span>{copyrightText || "山东昊天金属科技有限公司"}</span>
          <span className="mx-2">|</span>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition-colors no-underline"
          >
            {icpNumber || "鲁ICP备202XXXXXXXX号-1"}
          </a>
        </div>
      </Layout>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalOpen}
        onCancel={() => { setPasswordModalOpen(false); passwordForm.resetFields(); }}
        onOk={handlePasswordChange}
        confirmLoading={passwordSubmitting}
        width={420}
        centered
        okText="确定"
        cancelText="取消"
        okButtonProps={{ className: "bg-[#0070d5] hover:bg-[#005bb5] border-none shadow-sm" }}
      >
        <Form form={passwordForm} layout="vertical" className="mt-4">
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: "请输入当前密码" }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "新密码不能少于6位" },
            ]}
          >
            <Input.Password placeholder="请输入新密码（至少6位）" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请再次输入新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的新密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 退出确认弹窗 */}
      <Modal
        title="确认退出"
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        onOk={handleLogout}
        okText="确定"
        cancelText="取消"
        width={380}
        centered
        okButtonProps={{ danger: true, className: "shadow-sm" }}
      >
        <div className="py-4 flex items-center gap-3">
          <span className="text-2xl">&#9888;&#65039;</span>
          <span className="text-gray-600">确定要退出系统吗？</span>
        </div>
      </Modal>

      {/* 密码修改成功提示弹窗 */}
      <Modal
        title="密码已修改"
        open={passwordChangedModalOpen}
        onOk={handleReLogin}
        okText="重新登录"
        closable={false}
        width={380}
        centered
        okButtonProps={{ className: "bg-[#0070d5] hover:bg-[#005bb5] border-none shadow-sm" }}
      >
        <div className="py-4 flex items-center gap-3">
          <span className="text-2xl">&#10004;&#65039;</span>
          <span className="text-gray-600">密码修改成功，请重新登录</span>
        </div>
      </Modal>
    </Layout>
  );
}
