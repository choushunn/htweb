import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App } from "antd";
import zhCN from "antd/locale/zh_CN";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import BrandManifesto from "@/components/layout/BrandManifesto";
import { SettingsProvider } from "@/contexts/SettingsContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "山东昊天金属科技有限公司 - 催化材料研发生产与进出口贸易",
    template: "%s | 昊天金属科技",
  },
  description:
    "昊天金属科技是一家集催化材料研发、生产、销售与进出口贸易于一体的综合性企业。主营加氢催化剂、雷尼镍催化剂、镍铝合金粉、贵金属催化剂，产品远销东南亚、中东、欧美30+国家。",
  keywords: [
    "昊天金属",
    "催化材料",
    "加氢催化剂",
    "雷尼镍催化剂",
    "镍铝合金粉",
    "贵金属催化剂",
    "山东金属科技",
    "青岛金属材料",
  ],
  openGraph: {
    title: "山东昊天金属科技有限公司",
    description:
      "专业催化材料研发生产企业 — 加氢催化剂、雷尼镍催化剂、镍铝合金粉、贵金属催化剂",
    type: "website",
    locale: "zh_CN",
    siteName: "昊天金属科技",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="flex flex-col min-h-screen">
        <a className="skip-link" href="#main-content">跳到主要内容</a>
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorPrimary: "#0070d5",
                fontFamily:
                  '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
                fontSize: 16,
              },
            }}
          >
            <App>
              <SettingsProvider>
                <TopBar />
                <Header />
                <main id="main-content" className="flex-1">{children}</main>
                <BrandManifesto />
                <Footer />
                <FloatingContact />
              </SettingsProvider>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
