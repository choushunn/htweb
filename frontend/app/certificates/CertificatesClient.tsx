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
        className="w-full h-[260px] md:h-[320px] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Corporate%20certificate%20awards%20display%2C%20professional%20office%20wall%20with%20gold%20plaques%20and%20framed%20credentials%2C%20formal%20business%20environment&image_size=landscape_16_9)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0070d5]/80 to-black/40" />
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <h1 className="text-white text-[36px] md:text-[48px] font-bold tracking-wider">
            企业资质
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-2">
            荣誉见证实力，品质铸就未来
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { title: <Link href="/">首页</Link> },
              { title: "企业资质" },
            ]}
          />
        </div>

        {!error && certificates.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4 text-gray-300">&#127942;</div>
            <p className="text-lg mb-4">暂无资质证书</p>
            <Link href="/contact" className="text-brand hover:text-brand-hover underline text-base">联系我们了解资质详情 &rarr;</Link>
          </div>
        ) : error || certificates.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4 text-gray-300">&#128196;</div>
            <p className="text-lg mb-4">暂无数据</p>
            <Link href="/" className="text-brand hover:text-brand-hover underline text-base">返回首页 &rarr;</Link>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {certificates.map((cert) => (
              <Col xs={24} sm={12} md={8} lg={6} key={cert.id}>
                <div className="text-center transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98]">
                  <div className="overflow-hidden rounded-lg [&_.ant-image]:!block [&_.ant-image]:!w-full">
                    <Image
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="object-cover w-full !h-[280px] transition-transform duration-[400ms] ease-out hover:scale-110 will-change-transform"
                      preview={{
                        cover: <Text className="text-white">点击预览</Text>,
                      }}
                    />
                  </div>
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
