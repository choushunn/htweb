"use client";

import { Card, Form, Input, Button, Upload, Image, App, Breadcrumb, Spin } from "antd";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Settings {
  wechat_qr: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  copyright_text: string;
  icp_number: string;
}

const defaultSettings: Settings = {
  wechat_qr: "",
  contact_phone: "",
  contact_email: "",
  contact_address: "",
  copyright_text: "",
  icp_number: "",
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const wechatQrValue = Form.useWatch("wechat_qr", form);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/settings");
        const data = res.data?.data || defaultSettings;
        form.setFieldsValue(data);
      } catch (error) {
        message.error("获取站点设置失败");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await api.put("/api/admin/settings", { settings: values });
      message.success("保存成功");
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data?.message || "保存失败");
      }
    } finally {
      setSaving(false);
    }
  };

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
            { title: <span className="text-[#0070d5] text-sm font-medium">站点设置</span> },
          ]}
        />
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
          保存
        </Button>
      </div>

      <Spin spinning={loading}>
        <Card className="shadow-sm" variant="outlined">
          <Form
            form={form}
            layout="vertical"
            className="max-w-2xl"
          >
            <h3 className="text-base font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-100">联系方式</h3>
            <Form.Item name="contact_phone" label="联系电话">
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item name="contact_email" label="联系邮箱">
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
            <Form.Item name="contact_address" label="公司地址">
              <Input placeholder="请输入公司地址" />
            </Form.Item>

            <h3 className="text-base font-semibold text-gray-700 mb-4 mt-6 pb-3 border-b border-gray-100">页脚信息</h3>
            <Form.Item name="copyright_text" label="版权文字">
              <Input placeholder="例如：© 2026 山东昊天金属科技有限公司" />
            </Form.Item>
            <Form.Item name="icp_number" label="ICP备案号">
              <Input placeholder="例如：鲁ICP备202XXXXXXX号-1" />
            </Form.Item>

            <h3 className="text-base font-semibold text-gray-700 mb-4 mt-6 pb-3 border-b border-gray-100">微信二维码</h3>
            <div className="mb-2">
              <Upload
                name="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                action="/api/admin/upload"
                maxCount={1}
                showUploadList={false}
                beforeUpload={(file) => {
                  const isImage = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type);
                  if (!isImage) {
                    message.error("仅支持 jpg, png, webp, gif 格式的图片");
                    return Upload.LIST_IGNORE;
                  }
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error("图片大小不能超过 5MB");
                    return Upload.LIST_IGNORE;
                  }
                  return true;
                }}
                onChange={(info) => {
                  if (info.file.status === "uploading") return;
                  if (info.file.status === "done") {
                    const url = info.file.response?.data?.url;
                    if (url) {
                      form.setFieldValue("wechat_qr", url);
                      message.success("上传成功");
                    }
                  } else if (info.file.status === "error") {
                    message.error(info.file.response?.message || "上传失败");
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Button icon={<UploadOutlined />}>上传图片</Button>
                  <span className="text-gray-400 text-sm">支持 jpg/png/webp/gif，最大 5MB</span>
                </div>
              </Upload>
            </div>
            <Form.Item name="wechat_qr" noStyle>
              <Input type="hidden" />
            </Form.Item>
            <div className="mb-6 mt-2">
              <div className="flex items-start gap-4">
                {wechatQrValue ? (
                  <Image
                    width={120}
                    src={wechatQrValue}
                    alt="微信二维码预览"
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIABQABNjN9GQAAAAlwSFlzAAAWJQAAFiUB4wK6GQAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTM0A1t6AAAAG0lEQVQY02P8//8/AwMDAwMDAwMDw38GBgYGAKNIDv3zQCuNAAAAAElFTkSuQmCC"
                  />
                ) : (
                  <div className="w-[120px] h-[120px] border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                    暂无图片
                  </div>
                )}
              </div>
            </div>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}
