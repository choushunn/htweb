"use client";

import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UploadFile } from "antd";
import api from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";

interface Product {
  id: number;
  name: string;
  categoryId: number;
  summary: string;
  description: string;
  images: string[];
  sort: number;
  published: boolean;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | undefined>(undefined);
  const [editorContent, setEditorContent] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/api/admin/products"),
        api.get("/api/admin/categories"),
      ]);
      const products = productsRes.data?.data || productsRes.data || [];
      const cats = categoriesRes.data?.data || categoriesRes.data || [];
      const mapped = products.map((item: any) => ({
        id: item.id,
        name: item.name,
        categoryId: item.categoryId,
        summary: item.summary || item.detail || "",
        description: item.description || "",
        images: item.images || [],
        sort: item.sort,
        published: item.published ?? item.isPublished ?? false,
        createdAt: item.createdAt,
      }));
      setData(mapped);
      setCategories(cats);
      setFilteredData(mapped);
    } catch (error) {
      message.error("获取数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...data];
    if (searchText) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterCategory != null) {
      result = result.filter((item) => item.categoryId === filterCategory);
    }
    setFilteredData(result);
  }, [searchText, filterCategory, data]);

  useEffect(() => {
    fetchData();
  }, []);

  const categoryMap = categories.reduce<Record<number, string>>(
    (map, cat) => {
      map[cat.id] = cat.name;
      return map;
    },
    {}
  );

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setFileList([]);
    setEditorContent("");
    setEditorKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleEdit = (record: Product) => {
    setEditingItem(record);
    form.setFieldsValue({
      name: record.name,
      categoryId: record.categoryId,
      summary: record.summary,
      description: record.description,
      sort: record.sort,
      published: record.published,
    });
    setEditorContent(record.description || "");
    setEditorKey((k) => k + 1);
    if (record.images && record.images.length > 0) {
      setFileList(
        record.images.map((img, index) => ({
          uid: String(index),
          name: `image-${index}.png`,
          status: "done" as const,
          url: img,
        }))
      );
    } else {
      setFileList([]);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/admin/products/${id}`);
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

      let imageUrls: string[] = [];
      if (fileList.length > 0) {
        imageUrls = fileList
          .map((f) => f.url || f.response?.url || f.response?.data?.url)
          .filter(Boolean) as string[];
      }
      const submitData = {
        name: values.name,
        categoryId: values.categoryId,
        detail: values.summary,
        description: editorContent,
        sort: values.sort,
        isPublished: values.published,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      if (editingItem) {
        await api.put(`/api/admin/products/${editingItem.id}`, submitData);
        message.success("更新成功");
      } else {
        await api.post("/api/admin/products", submitData);
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
    setFileList(info.fileList);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60, sorter: (a: any, b: any) => a.id - b.id },
    {
      title: "图片",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) =>
        images && images.length > 0 ? (
          <Image src={images[0]} alt="产品图片" width={60} height={45} className="object-cover rounded" />
        ) : (
          "-"
        ),
    },
    { title: "名称", dataIndex: "name", key: "name", ellipsis: true, sorter: (a: any, b: any) => (a.name || '').localeCompare(b.name || '') },
    {
      title: "分类",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: number) => categoryMap[categoryId] || "-",
      sorter: (a: any, b: any) => a.categoryId - b.categoryId,
    },
    {
      title: "发布状态",
      dataIndex: "published",
      key: "published",
      render: (published: boolean) =>
        published ? <Tag color="green">已发布</Tag> : <Tag>未发布</Tag>,
      sorter: (a: any, b: any) => Number(a.published) - Number(b.published),
    },
    { title: "排序", dataIndex: "sort", key: "sort", sorter: (a: any, b: any) => a.sort - b.sort },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleString("zh-CN") : "-",
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个产品吗？"
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
            { title: <span className="text-[#0070d5] text-sm font-medium">产品管理</span> },
          ]}
        />
        <div className="flex items-center gap-3">
          <Input
            placeholder="搜索产品名称..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
            allowClear
          />
          <Select
            placeholder="按分类筛选"
            value={filterCategory}
            onChange={(value) => setFilterCategory(value ?? undefined)}
            className="w-40"
            allowClear
            options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="ml-auto">
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
        title={editingItem ? "编辑产品" : "新增产品"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          setFileList([]);
        }}
        confirmLoading={submitting}
        width={720}
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
            rules={[{ required: true, message: "请输入产品名称" }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="分类"
            rules={[{ required: true, message: "请选择产品分类" }]}
          >
            <Select placeholder="请选择分类" options={categories.map((cat) => ({ label: cat.name, value: cat.id }))} />
          </Form.Item>
          <Form.Item name="summary" label="简介">
            <Input.TextArea rows={3} placeholder="请输入产品简介" />
          </Form.Item>
          <Form.Item name="description" label="详细描述">
            <Input.TextArea rows={6} placeholder="请输入产品详细描述" />
          </Form.Item>
          <Form.Item label="产品说明书" required>
            <RichTextEditor
              key={editorKey}
              content={editorContent}
              onChange={setEditorContent}
            />
          </Form.Item>
          <Form.Item label="图片（多张）">
            <Upload
              action={`${api.defaults.baseURL}/api/admin/upload`}
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              multiple
              headers={{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }}
            >
              <div>
                <UploadOutlined />
                <div className="mt-1">上传图片</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item
            name="published"
            label="发布状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
