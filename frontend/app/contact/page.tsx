"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Breadcrumb,
  message,
  Alert,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import api from "@/lib/api";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ContactFormValues {
  name: string;
  phone?: string;
  email?: string;
  content: string;
}

export default function ContactPage() {
  const [form] = Form.useForm<ContactFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wechatQr, setWechatQr] = useState("");

  useEffect(() => {
    api.get("/api/settings").then((res) => {
      const data = res.data?.data || res.data || {};
      if (data.wechat_qr) setWechatQr(data.wechat_qr);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post("/api/messages", values);
      message.success("留言提交成功！我们会尽快与您联系。");
      form.resetFields();
    } catch {
      setSubmitError("留言提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="w-full h-[260px] md:h-[320px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20office%20reception%20desk%2C%20corporate%20lobby%20with%20warm%20lighting%2C%20professional%20business%20environment%2C%20clean%20and%20welcoming&image_size=landscape_16_9)",
        }}
      />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { title: <Link href="/">首页</Link> },
              { title: "联系我们" },
            ]}
          />
        </div>

        <Row gutter={[48, 48]}>
          {/* 公司信息 */}
          <Col xs={24} md={10}>
            <Card className="h-full">
              <Title level={4} className="mb-6">联系方式</Title>

              <div className="mb-6">
                <div className="flex items-start gap-3 mb-5">
                  <EnvironmentOutlined aria-hidden="true" className="text-xl text-blue-600 mt-1" />
                  <div>
                    <Text strong className="block mb-1">公司地址</Text>
                    <Text type="secondary">山东省青岛市莱西市南墅镇水晶路17号</Text>
                    <div className="text-gray-400 text-xs mt-1">邮编：266600</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-5">
                  <PhoneOutlined aria-hidden="true" className="text-xl text-blue-600 mt-1" />
                  <div>
                    <Text strong className="block mb-1">联系电话</Text>
                    <Text type="secondary">132-1089-4158</Text>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-5">
                  <MailOutlined aria-hidden="true" className="text-xl text-blue-600 mt-1" />
                  <div>
                    <Text strong className="block mb-1">电子邮箱</Text>
                    <Text type="secondary">1227134924@qq.com</Text>
                  </div>
                </div>
              </div>

              {/* 微信二维码 */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Text strong>微信咨询</Text>
                </div>
                <div className="flex items-start">
                  {wechatQr ? (
                    <div>
                      <img
                        src={wechatQr}
                        alt="微信二维码"
                        className="h-[140px] w-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="w-[110px] h-[110px] bg-[#f0f0f0] flex flex-col items-center justify-center hidden">
                        <span className="text-[#999] text-[11px]">图片失效</span>
                      </div>
                     
                    </div>
                  ) : (
                    <div>
                      <div className="w-[110px] h-[110px] bg-[#f0f0f0] flex flex-col items-center justify-center">
                        <span className="text-[#999] text-[11px]">微信二维码</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>

          {/* 留言表单 */}
          <Col xs={24} md={14}>
            <Card>
              <Title level={4} className="mb-6">在线留言</Title>
              <Paragraph className="text-gray-500 mb-6">
                如果您有任何问题或合作意向，请填写以下表单，我们将尽快回复您。
              </Paragraph>

              {submitError && (
                <Alert
                  title={submitError}
                  type="error"
                  showIcon
                  closable
                  className="mb-4"
                  onClose={() => setSubmitError(null)}
                  role="alert"
                  aria-live="polite"
                />
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="姓名"
                      name="name"
                      rules={[{ required: true, message: "请输入您的姓名" }]}
                    >
                      <Input placeholder="请输入姓名" autoComplete="name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="电话" name="phone">
                      <Input placeholder="请输入联系电话" autoComplete="tel" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="邮箱" name="email">
                  <Input placeholder="请输入电子邮箱" type="email" autoComplete="email" />
                </Form.Item>

                <Form.Item
                  label="留言内容"
                  name="content"
                  rules={[{ required: true, message: "请输入留言内容" }]}
                >
                  <TextArea rows={5} placeholder="请输入您的留言内容..." autoComplete="off" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    size="large"
                  >
                    提交留言
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
