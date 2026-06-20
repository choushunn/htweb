"use client";

import { Table, Button, Modal, Tag, Space, message, Popconfirm, Card, Breadcrumb, Input } from "antd";
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

  const handleView = (record: Message) => {
    setViewingItem(record);
    setViewModalOpen(true);
  };

  const handleMarkRead = async (id: number) => {
    try {
      await api.put(`/api/admin/messages/${id}/read`);
      message.success("已标记为已读");
      fetchData();
    } catch (error) {
      message.error("操作失败");
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
    { title: "ID", dataIndex: "id", key: "id", sorter: (a: any, b: any) => a.id - b.id },
    { title: "姓名", dataIndex: "name", key: "name", sorter: (a: any, b: any) => (a.name || '').localeCompare(b.name || '') },
    { title: "电话", dataIndex: "phone", key: "phone", sorter: (a: any, b: any) => (a.phone || '').localeCompare(b.phone || '') },
    { title: "邮箱", dataIndex: "email", key: "email", ellipsis: true, sorter: (a: any, b: any) => (a.email || '').localeCompare(b.email || '') },
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
      render: (isRead: boolean) =>
        isRead ? <Tag>已读</Tag> : <Tag color="red">未读</Tag>,
      sorter: (a: any, b: any) => Number(a.isRead) - Number(b.isRead),
    },
    {
      title: "提交时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (date ? new Date(date).toLocaleString("zh-CN") : "-"),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Message) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          {!record.isRead && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleMarkRead(record.id)}
            >
              标记已读
            </Button>
          )}
          <Popconfirm
            title="确定要删除这条留言吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
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
      <Card className="admin-table-card shadow-sm" variant="outlined">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total) => `共 ${total} 条`, hideOnSinglePage: true }}
          showSorterTooltip={false}
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
          <div className="space-y-3">
            <div>
              <strong>姓名：</strong>
              {viewingItem.name}
            </div>
            <div>
              <strong>电话：</strong>
              {viewingItem.phone}
            </div>
            <div>
              <strong>邮箱：</strong>
              {viewingItem.email}
            </div>
            <div>
              <strong>提交时间：</strong>
              {viewingItem.createdAt
                ? new Date(viewingItem.createdAt).toLocaleString("zh-CN")
                : "-"}
            </div>
            <div>
              <strong>留言内容：</strong>
              <div className="mt-2 p-3 bg-gray-50 rounded whitespace-pre-wrap">
                {viewingItem.content}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
