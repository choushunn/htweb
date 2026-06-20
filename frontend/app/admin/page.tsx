"use client";

import { Card, Row, Col, Tag, Typography, Space } from "antd";
import {
  FileTextOutlined,
  ShoppingOutlined,
  MessageOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  PictureOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Text } = Typography;

interface MessageItem {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface MonthlyContent {
  month: string;
  news: number;
  products: number;
}

interface CategoryItem {
  name: string;
  count: number;
}

interface MessageTrend {
  date: string;
  count: number;
}

// 品牌色系图表配色
const CHART_COLORS = ["#0070d5", "#3b82f6", "#60a5fa", "#93c5fd", "#1e3a5f", "#2563eb", "#0284c7", "#0ea5e9"];

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  // 统计数据
  const [stats, setStats] = useState({
    newsTotal: 0,
    productsTotal: 0,
    categoriesTotal: 0,
    certificatesTotal: 0,
    bannersTotal: 0,
    messagesUnread: 0,
    messagesTotal: 0,
  });
  // 最近的留言
  const [recentMessages, setRecentMessages] = useState<MessageItem[]>([]);
  
  // 图表数据
  const [monthlyContent, setMonthlyContent] = useState<MonthlyContent[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryItem[]>([]);
  const [messageTrend, setMessageTrend] = useState<MessageTrend[]>([]);
  // 实时时间
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          newsRes,
          productsRes,
          categoriesRes,
          certificatesRes,
          bannersRes,
          messagesRes,
          dashboardRes,
        ] = await Promise.all([
          api.get("/api/admin/news", { params: { pageSize: 1 } }),
          api.get("/api/admin/products", { params: { pageSize: 1 } }),
          api.get("/api/admin/categories"),
          api.get("/api/admin/certificates"),
          api.get("/api/admin/banners"),
          api.get("/api/admin/messages", { params: { pageSize: 5 } }),
          api.get("/api/admin/dashboard"),
        ]);

        const getList = (res: any) => {
          const d = res.data;
          if (Array.isArray(d)) return d;
          if (Array.isArray(d?.data)) return d.data;
          if (d?.list) return d.list;
          if (d?.data?.list) return d.data.list;
          return [];
        };

        const newsTotal = newsRes.data?.total || 0;
        const productsTotal = productsRes.data?.total || 0;
        const messagesTotal = messagesRes.data?.total || 0;

        const messages = getList(messagesRes);
        const unreadCount = Array.isArray(messages)
          ? messages.filter((m: MessageItem) => !m.isRead).length
          : 0;

        setStats({
          newsTotal,
          productsTotal,
          categoriesTotal: Array.isArray(getList(categoriesRes)) ? getList(categoriesRes).length : 0,
          certificatesTotal: Array.isArray(getList(certificatesRes)) ? getList(certificatesRes).length : 0,
          bannersTotal: Array.isArray(getList(bannersRes)) ? getList(bannersRes).length : 0,
          messagesUnread: unreadCount,
          messagesTotal,
        });

        setRecentMessages(messages.slice(0, 5));

        // 设置图表数据
        const dashboardData = dashboardRes.data;
        setMonthlyContent(dashboardData?.monthlyContent || []);
        setCategoryDistribution(dashboardData?.categoryDistribution || []);
        setMessageTrend(dashboardData?.messageTrend || []);
      } catch (error) {
        console.error("获取统计数据失败", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { title: "新闻总数", value: stats.newsTotal, icon: <FileTextOutlined />, gradient: "from-[#1e3a5f] to-[#2563eb]", link: "/admin/news" },
    { title: "产品总数", value: stats.productsTotal, icon: <ShoppingOutlined />, gradient: "from-[#1e40af] to-[#3b82f6]", link: "/admin/products" },
    { title: "分类数量", value: stats.categoriesTotal, icon: <AppstoreOutlined />, gradient: "from-[#1d4ed8] to-[#4f46e5]", link: "/admin/categories" },
    { title: "资质证书", value: stats.certificatesTotal, icon: <SafetyOutlined />, gradient: "from-[#0369a1] to-[#0ea5e9]", link: "/admin/certificates" },
    { title: "轮播图数", value: stats.bannersTotal, icon: <PictureOutlined />, gradient: "from-[#0e7490] to-[#06b6d4]", link: "/admin/banners" },
    { title: "未读留言", value: stats.messagesUnread, icon: <MessageOutlined />, gradient: "from-[#b91c1c] to-[#ef4444]", link: "/admin/messages" },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* 头部：欢迎语 */}
      <div className="flex items-center justify-between shrink-0">
        <Text type="secondary">欢迎回来~</Text>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RiseOutlined />
          <span>数据实时更新</span>
          <span className="text-[#0070d5] text-sm font-medium">
            {now ? (() => {
              const d = now;
              const pad = (n: number) => String(n).padStart(2, "0");
              return `${d.getFullYear()}年${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
            })() : ""}
          </span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="shrink-0">
        <Row gutter={[16, 16]}>
          {statCards.map((card) => (
            <Col xs={24} sm={12} lg={8} key={card.title}>
              <Link href={card.link} className="block no-underline">
                <Card
                  hoverable
                  loading={loading}
                  className="h-full overflow-hidden"
                  styles={{ body: { padding: "24px 20px" } }}
                >
                  <div className="flex items-center justify-between relative">
                    <div className="relative z-10">
                      <Text type="secondary" className="text-sm">{card.title}</Text>
                      <div className="text-2xl font-bold mt-1 text-[#1e3a5f]">
                        {card.value}
                      </div>
                    </div>
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${card.gradient} text-white text-xl shadow relative z-10`}
                    >
                      {card.icon}
                    </div>
                    <div
                      className={`absolute -bottom-5 -right-5 w-28 h-28 rounded-full bg-gradient-to-br ${card.gradient} opacity-5`}
                    />
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* 图表区域：内容趋势 + 分类分布 + 留言趋势 三列等宽 */}
      <div className="grid grid-cols-3 gap-4 shrink-0" style={{ height: 280 }}>
        {/* 内容趋势 */}
        <Card
          title="内容趋势"
          size="small"
          loading={loading}
          className="w-full h-full"
        >
          <div className="h-[238px]">
            {monthlyContent.length > 0 ? (
              <ResponsiveContainer width="100%" height={238}>
                <BarChart data={monthlyContent} barSize={14} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} allowDecimals={false} width={25} />
                  <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 12 }} />
                  <Bar dataKey="news" name="新闻" fill="#0070d5" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="products" name="产品" fill="#60a5fa" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">暂无数据</div>
            )}
          </div>
        </Card>

        {/* 分类分布 */}
        <Card
          title="产品分类分布"
          size="small"
          loading={loading}
          className="w-full h-full"
        >
          <div className="h-[238px]">
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={238}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={85}
                    paddingAngle={3}
                    dataKey="count" nameKey="name"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {categoryDistribution.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 6, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 12 }}
                    formatter={(value: any, name: any) => [`${value} 个产品`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">暂无数据</div>
            )}
          </div>
        </Card>

        {/* 近7天留言趋势 */}
        <Card
          title="近7天留言趋势"
          size="small"
          loading={loading}
          className="w-full h-full"
        >
          <div className="h-[238px]">
            {messageTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={238}>
                <BarChart data={messageTrend} barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }}
                    tickFormatter={(val: string) => val.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} allowDecimals={false} width={25} />
                  <Tooltip
                    contentStyle={{ borderRadius: 6, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 12 }}
                    labelFormatter={(val: any) => `${val} 留言`}
                  />
                  <Bar dataKey="count" name="留言数" fill="#0070d5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">暂无数据</div>
            )}
          </div>
        </Card>
      </div>
      
        <div className="w-full h-4"></div>
      {/* 底部：最近的留言 + 快捷操作 */}
      <div className="grid grid-cols-2 gap-4 shrink-0">
        <Card
          title="最近的留言"
          size="small"
          loading={loading}
          extra={<Link href="/admin/messages" className="text-xs">查看全部</Link>}
          styles={{ body: { padding: "8px 16px" } }}
        >
          {recentMessages.length === 0 ? (
            <div className="text-center py-4 text-gray-400 text-xs">暂无留言</div>
          ) : (
            <div>
              {recentMessages.slice(0, 3).map((item, idx) => (
                <div key={idx} className={(!item.isRead ? "bg-blue-50 -mx-4 px-4 rounded " : "") + "-mx-4 px-4"} style={{ padding: "6px 0" }}>
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-0.5">
                      <Space size={6}>
                        <Text strong className="text-sm">{item.name}</Text>
                        {!item.isRead && <Tag color="blue" className="!text-[11px] !px-1.5 !py-0 !leading-5">未读</Tag>}
                      </Space>
                      <Text type="secondary" className="text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                      </Text>
                    </div>
                    <Text type="secondary" className="text-xs block truncate leading-6">{item.content}</Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        {/* 快捷操作 */}
        <Card
          title="快捷操作"
          size="small"
          loading={loading}
          styles={{ body: { padding: "12px 16px" } }}
        >
          <Row gutter={[12, 12]}>
            {[
              { title: "新增新闻", link: "/admin/news", icon: <FileTextOutlined />, gradient: "from-[#1e3a5f] to-[#2563eb]" },
              { title: "新增产品", link: "/admin/products", icon: <ShoppingOutlined />, gradient: "from-[#1e40af] to-[#3b82f6]" },
              { title: "管理分类", link: "/admin/categories", icon: <AppstoreOutlined />, gradient: "from-[#1d4ed8] to-[#4f46e5]" },
              { title: "管理轮播", link: "/admin/banners", icon: <PictureOutlined />, gradient: "from-[#0e7490] to-[#06b6d4]" },
            ].map((action) => (
              <Col xs={12} key={action.title}>
                <Link href={action.link} className="block no-underline group">
                  <Card hoverable size="small" className="text-center" styles={{ body: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 8px" } }}>
                    {action.icon}
                    <Text className="text-xs mt-1">{action.title}</Text>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </div>
  );
}
