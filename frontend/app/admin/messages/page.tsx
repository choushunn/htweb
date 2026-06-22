"use client";

import { Table, Button, Modal, Tag, Space, App, Popconfirm, Card, Breadcrumb, Input } from "antd";
import { EyeOutlined, CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Message {
  id: number;
  name: string;
  phone: string;
  email: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [data, setData] = useState<Message[]>([]);
  const [filteredData, setFilteredData] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Message | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/messages");
      const list = res.data?.data || res.data || [];
      const arr = Array.isArray(list) ? list : [];
      setData(arr);
      setFilteredData(arr);
    } catch (error) {
      message.error("获取留言列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredData(data);
      return;
    }
    const q = searchText.toLowerCase();
    setFilteredData(data.filter((item) => item.name.toLowerCase().includes(q) || item.content.toLowerCase().includes(q)));
  }, [searchText, data]);

  const handleView = async (record: Message) => {
    setViewingItem(record);
    setViewModalOpen(true);
    // 查看后自动标记为已读
    if (!record.isRead) {
      try {
        await api.put(`/api/admin/messages/${record.id}/read`);
        fetchData();
      } catch {
        // 静默处理
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/admin/messages/${id}`);
      message.success("删除成功");
      fetchData();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: "5%", sorter: (a: any, b: any) => a.id - b.id },
    {
      title: "留言人",
      key: "contact",
      width: "12%",
      ellipsis: true,
      render: (_: any, record: Message) => (
        <span className="cursor-pointer text-[#0070d5] hover:underline" onClick={() => handleView(record)}>
          {record.name}
        </span>
      ),
      sorter: (a: any, b: any) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: "留言内容",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      sorter: (a: any, b: any) => (a.content || '').localeCompare(b.content || ''),
    },
    {
      title: "状态",
      dataIndex: "isRead",
      key: "isRead",
      width: "7%",
      render: (isRead: boolean) =>
        isRead ? <Tag>已读</Tag> : <Tag color="blue">未读</Tag>,
      sorter: (a: any, b: any) => Number(a.isRead) - Number(b.isRead),
    },
    {
      title: "提交时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "14%",
      render: (date: string) =>
        date
          ? new Date(date).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }) +
            " " +
            new Date(date).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
          : "-",
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "操作",
      key: "action",
      width: "14%",
      render: (_: any, record: Message) => (
        <Space size={0}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Popconfirm title="确定要删除这条留言吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb
          separator={<span className="text-gray-300 mx-0.5">/</span>}
          items={[
            {
              title: (
                <span className="text-gray-400 text-sm hover:text-[#0070d5] transition-colors cursor-pointer" onClick={() => router.push("/admin")}>
                  首页
                </span>
              ),
            },
            { title: <span className="text-[#0070d5] text-sm font-medium">留言管理</span> },
          ]}
        />
        <div className="flex items-center gap-3">
          <Input.Search
            placeholder="搜索姓名或留言内容..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
            className="w-64"
          />
        </div>
      </div>
      <Card className="admin-table-card shadow-sm" variant="outlined" styles={{ body: { overflow: 'hidden' } }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total) => `共 ${total} 条`, hideOnSinglePage: true }}
          showSorterTooltip={false}
          tableLayout="fixed"
          rowClassName={(record: Message) => (record.isRead ? "" : "bg-blue-50")}
        />
      </Card>

      <Modal
        title="查看留言"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={
          <Button onClick={() => setViewModalOpen(false)}>
            关闭
          </Button>
        }
        width={640}
        centered
        destroyOnHidden
      >
        {viewingItem && (
          <div>
            {/* 联系信息卡片 */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 mb-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0070d5] to-[#60a5fa] flex items-center justify-center text-white text-xl font-semibold shadow-sm shrink-0">
                  {viewingItem.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-medium text-gray-900">{viewingItem.name}</div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {viewingItem.createdAt
                      ? new Date(viewingItem.createdAt).toLocaleString("zh-CN")
                      : "-"}
                  </div>
                </div>
                <Tag
                  color={viewingItem.isRead ? "default" : "blue"}
                  className="!text-sm !px-3 !py-0.5 !leading-6 !border-0 shrink-0"
                >
                  {viewingItem.isRead ? "已读" : "未读"}
                </Tag>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">电话</div>
                  <div className="text-base text-gray-700">
                    {viewingItem.phone || <span className="text-gray-300">未填写</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">邮箱</div>
                  <div className="text-base text-gray-700 break-all">
                    {viewingItem.email || <span className="text-gray-300">未填写</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* 留言内容卡片 */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100">
                <span className="text-base font-medium text-gray-500">留言内容</span>
              </div>
              <div className="p-5 text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {viewingItem.content || <span className="text-gray-300">无内容</span>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
