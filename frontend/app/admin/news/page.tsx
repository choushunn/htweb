"use client";

import {
  Table,
  Button,
  Modal,
  Form,
  Input,
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
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { UploadFile } from "antd";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import api from "@/lib/api";

interface NewsItem {
  id: number;
  title: string;
  cover: string;
  summary: string;
  content: string;
  published: boolean;
  createdAt: string;
}

function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const { message } = App.useApp();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: false,
      }),
      ImageExt.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
      }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
    ],
    content: content || "",
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post("/api/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const url = res.data?.url || res.data?.data?.url;
        if (url && editor) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      } catch {
        message.error("图片上传失败");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("输入链接地址", previousUrl || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
        isActive ? "bg-gray-200 text-blue-600" : "text-gray-700"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="标题2"
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="标题3"
        >
          <Heading3 size={18} />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="粗体"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="斜体"
        >
          <Italic size={18} />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="无序列表"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="有序列表"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="引用"
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="代码块"
        >
          <Code size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="分割线"
        >
          <Minus size={18} />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="链接"
        >
          <Link size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleImageUpload}
          title="图片"
        >
          <ImageIcon size={18} />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="撤销"
        >
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="重做"
        >
          <Redo size={18} />
        </ToolbarButton>
        {uploading && (
          <span className="text-xs text-gray-500 ml-2">上传中...</span>
        )}
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]"
      />
    </div>
  );
}

function NewsModal({
  open,
  editingItem,
  fileList,
  setFileList,
  editorKey,
  editorContent,
  setEditorContent,
  onClose,
  onSuccess,
}: {
  open: boolean;
  editingItem: NewsItem | null;
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
  editorKey: number;
  editorContent: string;
  setEditorContent: (content: string) => void;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { message } = App.useApp();

  // Modal 打开后设置或重置表单值
  useEffect(() => {
    if (open) {
      if (editingItem) {
        form.setFieldsValue({
          title: editingItem.title,
          summary: editingItem.summary,
          published: editingItem.published,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const submitData: Record<string, any> = {
        title: values.title,
        summary: values.summary,
        content: editorContent,
        isPublished: values.published,
      };
      if (fileList.length > 0 && fileList[0].url) {
        submitData.coverImage = fileList[0].url;
      } else if (fileList.length > 0 && fileList[0].response) {
        submitData.coverImage =
          fileList[0].response.url || fileList[0].response.data?.url;
      }

      if (editingItem) {
        await api.put(`/api/admin/news/${editingItem.id}`, submitData);
        message.success("更新成功");
      } else {
        await api.post("/api/admin/news", submitData);
        message.success("创建成功");
      }
      onSuccess();
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

  return (
    <Modal
      title={editingItem ? "编辑新闻" : "新增新闻"}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={submitting}
      width={800}
      centered
      okText="确定"
      cancelText="取消"
      okButtonProps={{ className: "bg-[#0070d5] hover:bg-[#005bb5] border-none shadow-sm" }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: "请输入新闻标题" }]}
        >
          <Input placeholder="请输入新闻标题" />
        </Form.Item>
        <Form.Item label="封面图">
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
        <Form.Item name="summary" label="摘要">
          <Input.TextArea rows={3} placeholder="请输入新闻摘要" />
        </Form.Item>
        <Form.Item label="详细内容" required>
          <TiptapEditor
            key={editorKey}
            content={editorContent}
            onChange={setEditorContent}
          />
        </Form.Item>
        <Form.Item name="published" label="发布状态" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default function AdminNewsPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [data, setData] = useState<NewsItem[]>([]);
  const [filteredData, setFilteredData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [editorContent, setEditorContent] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/news");
      const rawList = res.data?.data || res.data || [];
      const list = rawList.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.cover || item.coverImage || "",
        summary: item.summary || "",
        content: item.content || "",
        published: item.published ?? item.isPublished ?? false,
        createdAt: item.createdAt,
      }));
      setData(list);
      setFilteredData(list);
    } catch (error) {
      message.error("获取新闻列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchText) {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFileList([]);
    setEditorContent("");
    setEditorKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleEdit = (record: NewsItem) => {
    setEditingItem(record);
    setFileList(
      record.cover
        ? [
            {
              uid: "-1",
              name: "cover.png",
              status: "done",
              url: record.cover,
            },
          ]
        : []
    );
    setEditorContent(record.content || "");
    setEditorKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/admin/news/${id}`);
      message.success("删除成功");
      fetchData();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFileList([]);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchData();
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: (a: any, b: any) => a.id - b.id },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      sorter: (a: any, b: any) => (a.title || '').localeCompare(b.title || ''),
    },
    {
      title: "封面图",
      dataIndex: "cover",
      key: "cover",
      render: (cover: string) =>
        cover ? (
          <Image
            src={cover}
            alt="封面"
            width={80}
            height={50}
            className="object-cover rounded"
          />
        ) : (
          "-"
        ),
    },
    {
      title: "发布状态",
      dataIndex: "published",
      key: "published",
      render: (published: boolean) =>
        published ? (
          <Tag color="green">已发布</Tag>
        ) : (
          <Tag>未发布</Tag>
        ),
      sorter: (a: any, b: any) => Number(a.published) - Number(b.published),
    },
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
      render: (_: any, record: NewsItem) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open("/news/" + record.id, "_blank")}
          >
            预览
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这篇新闻吗？"
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
            { title: <span className="text-[#0070d5] text-sm font-medium">新闻管理</span> },
          ]}
        />
        <div className="flex items-center gap-3">
          <Input.Search
            placeholder="搜索新闻标题..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
            className="w-64"
            allowClear
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

      <NewsModal
        open={modalOpen}
        editingItem={editingItem}
        fileList={fileList}
        setFileList={setFileList}
        editorKey={editorKey}
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
