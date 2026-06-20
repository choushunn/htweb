"use client";

import { Typography, Image, Row, Col, Breadcrumb } from "antd";
import Link from "next/link";

const { Text } = Typography;

interface Certificate {
  id: number;
  title: string;
  imageUrl: string;
}

export default function CertificatesClient({
  certificates,
  error,
}: {
  certificates: Certificate[];
  error?: string | null;
}) {
  return (
    <>
      <div
        className="w-full h-[260px] md:h-[320px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Corporate%20certificate%20awards%20display%2C%20professional%20office%20wall%20with%20gold%20plaques%20and%20framed%20credentials%2C%20formal%20business%20environment&image_size=landscape_16_9)",
        }}
      />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { title: <Link href="/">首页</Link> },
              { title: "企业资质" },
            ]}
          />
        </div>

        {error ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 text-red-300">&#9888;</div>
            <p className="text-gray-500 text-lg mb-4">{error}</p>
            <Link href="/" className="text-brand hover:text-brand-hover underline text-base">返回首页 &rarr;</Link>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4 text-gray-300">&#127942;</div>
            <p className="text-lg mb-4">暂无资质证书</p>
            <Link href="/contact" className="text-brand hover:text-brand-hover underline text-base">联系我们了解资质详情 &rarr;</Link>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {certificates.map((cert) => (
              <Col xs={24} sm={12} md={8} lg={6} key={cert.id}>
                <div className="text-center transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98]">
                  <Image
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="rounded-lg object-cover !w-full !h-[280px]"
                    preview={{
                      cover: <Text className="text-white">点击预览</Text>,
                    }}
                  />
                  <Text strong className="block mt-3 text-base">
                    {cert.title}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}
