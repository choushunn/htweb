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
  App,
  Popconfirm,
  Card,
  Breadcrumb,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
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
  const { message } = App.useApp();
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

  // Custom dropdown to replace Ant Design Select (doesn't open properly inside Modal)
  function CategoryDropdown({
    value,
    onChange: onChangeProp,
  }: {
    value?: number;
    onChange?: (value: number) => void;
  }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const selected = categories.find((c) => c.id === value);

    return (
      <div ref={ref} className="relative">
        <div
          className="border border-gray-300 rounded-md px-3 py-[5px] cursor-pointer flex items-center justify-between bg-white hover:border-[#0070d5] transition-colors text-sm"
          onClick={() => setOpen(!open)}
        >
          <span className={selected ? "text-gray-900" : "text-gray-400"}>
            {selected ? selected.name : "请选择分类"}
          </span>
          <DownOutlined
            className={`text-[10px] text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
        {open && (
          <div className="absolute z-[1000] mt-[2px] w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {categories.length === 0 ? (
              <div className="px-3 py-2 text-gray-400 text-sm">暂无分类</div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`px-3 py-2 cursor-pointer text-sm hover:bg-blue-50 transition-colors ${
                    value === cat.id
                      ? "bg-blue-50 text-[#0070d5] font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={() => {
                    onChangeProp?.(cat.id);
                    setOpen(false);
                  }}
                >
                  {cat.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

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
    { title: "ID", dataIndex: "id", key: "id", sorter: (a: any, b: any) => a.id - b.id },
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
        title={
          <span className="text-base font-semibold text-gray-800 tracking-wide">
            {editingItem ? "编辑产品" : "新增产品"}
          </span>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        confirmLoading={submitting}
        width={800}
        centered
        okText="确定"
        cancelText="取消"
        okButtonProps={{ className: "bg-[#0070d5] hover:bg-[#005bb5] border-none shadow-sm px-5" }}
        afterClose={() => form.resetFields()}
        classNames={{ body: "px-6 py-2" }}
      >
        <Form form={form} layout="vertical" className="space-y-0">
          {/* 基本信息 */}
          <div className="mb-5">
            <div className="grid grid-cols-2 gap-x-5">
              <Form.Item
                name="name"
                label={<span className="text-sm text-gray-600">名称</span>}
                rules={[{ required: true, message: "请输入产品名称" }]}
                className="mb-0"
              >
                <Input placeholder="请输入产品名称" className="rounded-md" />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label={<span className="text-sm text-gray-600">分类</span>}
                rules={[{ required: true, message: "请选择产品分类" }]}
                className="mb-0"
              >
                <CategoryDropdown />
              </Form.Item>
            </div>
          </div>

          {/* 内容描述 */}
          <div className="mb-5">
            <Form.Item
              name="summary"
              label={<span className="text-sm text-gray-600">简介</span>}
              className="mb-3"
            >
              <Input.TextArea rows={2} placeholder="请输入产品简介" className="rounded-md" />
            </Form.Item>
            <Form.Item
              name="description"
              label={<span className="text-sm text-gray-600">详细描述</span>}
              className="mb-0"
            >
              <Input.TextArea rows={4} placeholder="请输入产品详细描述" className="rounded-md" />
            </Form.Item>
          </div>

          {/* 详细内容 */}
          <div className="mb-5">
            <Form.Item
              label={<span className="text-sm text-gray-600">产品说明书</span>}
              required
              className="mb-0"
            >
              <RichTextEditor
                key={editorKey}
                content={editorContent}
                onChange={setEditorContent}
              />
            </Form.Item>
          </div>

          {/* 媒体与设置 */}
          <div className="mb-2">
            <Form.Item label={<span className="text-sm text-gray-600">图片</span>} className="mb-4">
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
                <div className="flex flex-col items-center gap-1">
                  <UploadOutlined className="text-lg text-gray-400" />
                  <div className="text-xs text-gray-400">上传图片</div>
                </div>
              </Upload>
            </Form.Item>
            <div className="grid grid-cols-2 gap-x-5">
              <Form.Item
                name="sort"
                label={<span className="text-sm text-gray-600">排序</span>}
                className="mb-0"
              >
                <InputNumber min={0} className="w-full rounded-md" />
              </Form.Item>
              <Form.Item
                name="published"
                label={<span className="text-sm text-gray-600">发布状态</span>}
                valuePropName="checked"
                className="mb-0"
              >
                <div className="flex items-center h-9">
                  <Switch />
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
