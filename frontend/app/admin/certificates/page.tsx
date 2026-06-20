"use client";

import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Upload,
  Space,
  Tag,
  Image,
  message,
  Popconfirm,
  Card,
  Breadcrumb,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UploadFile } from "antd";
import api from "@/lib/api";

interface Certificate {
  id: number;
  name: string;
  image: string;
  sort: number;
  published: boolean;
}

export default function AdminCertificatesPage() {
  const router = useRouter();
  const [data, setData] = useState<Certificate[]>([]);
  const [filteredData, setFilteredData] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certificate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/certificates");
      const list = res.data?.data || res.data || [];
      const mapped = list.map((item: any) => ({
        id: item.id,
        name: item.name || item.title || "",
        image: item.image || item.imageUrl || "",
        sort: item.sort,
        published: item.published ?? item.isPublished ?? false,
      }));
      setData(mapped);
      setFilteredData(mapped);
    } catch (error) {
      message.error("获取资质列表失败");
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
    setFilteredData(data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase())));
  }, [searchText, data]);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setFileList([]);
    setModalOpen(true);
  };

  const handleEdit = (record: Certificate) => {
    setEditingItem(record);
    form.setFieldsValue({
      name: record.name,
      sort: record.sort,
      published: record.published,
    });
    if (record.image) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: record.image,
        },
      ]);
    } else {
      setFileList([]);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/admin/certificates/${id}`);
      message.success("删除成功");
      fetchData();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      let imageUrl = "";
      if (fileList.length > 0 && fileList[0].url) {
        imageUrl = fileList[0].url;
      } else if (fileList.length > 0 && fileList[0].response) {
        imageUrl = fileList[0].response.url || fileList[0].response.data?.url;
      }
      const submitData = {
        title: values.name,
        imageUrl,
        sort: values.sort,
        isPublished: values.published,
      };

      if (editingItem) {
        await api.put(`/api/admin/certificates/${editingItem.id}`, submitData);
        message.success("更新成功");
      } else {
        await api.post("/api/admin/certificates", submitData);
        message.success("创建成功");
      }
      setModalOpen(false);
      fetchData();
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data?.message || "操作失败");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: (a: any, b: any) => a.id - b.id },
    { title: "名称", dataIndex: "name", key: "name", ellipsis: true, sorter: (a: any, b: any) => (a.name || '').localeCompare(b.name || '') },
    {
      title: "图片",
      dataIndex: "image",
      key: "image",
      render: (image: string) =>
        image ? (
          <Image src={image} alt="资质图片" width={70} height={50} className="object-cover rounded" />
        ) : (
          "-"
        ),
    },
    { title: "排序", dataIndex: "sort", key: "sort", sorter: (a: any, b: any) => a.sort - b.sort },
    {
      title: "发布状态",
      dataIndex: "published",
      key: "published",
      render: (published: boolean) =>
        published ? <Tag color="green">已发布</Tag> : <Tag>未发布</Tag>,
      sorter: (a: any, b: any) => Number(a.published) - Number(b.published),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Certificate) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个资质吗？"
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
            { title: <span className="text-[#0070d5] text-sm font-medium">资质管理</span> },
          ]}
        />
        <div className="flex items-center gap-3">
          <Input.Search
            placeholder="搜索资质名称..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
            className="w-64"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
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
        />
      </Card>

      <Modal
        title={editingItem ? "编辑资质" : "新增资质"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          setFileList([]);
        }}
        confirmLoading={submitting}
        width={640}
        centered
        destroyOnHidden
        okText="确定"
        cancelText="取消"
        okButtonProps={{ className: "bg-[#0070d5] hover:bg-[#005bb5] border-none shadow-sm" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: "请输入资质名称" }]}
          >
            <Input placeholder="请输入资质名称" />
          </Form.Item>
          <Form.Item label="图片">
            <Upload
              action={`${api.defaults.baseURL}/api/admin/upload`}
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              maxCount={1}
              headers={{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }}
            >
              {fileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div className="mt-1">上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="published" label="发布状态" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
