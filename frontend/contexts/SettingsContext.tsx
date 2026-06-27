"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "@/lib/api";

interface Settings {
  wechatQr: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  icp_number: string;
  copyright_text: string;
}

const SettingsContext = createContext<Settings>({
  wechatQr: "",
  contact_phone: "",
  contact_email: "",
  contact_address: "",
  icp_number: "",
  copyright_text: "",
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    wechatQr: "",
    contact_phone: "",
    contact_email: "",
    contact_address: "",
    icp_number: "",
    copyright_text: "",
  });

  useEffect(() => {
    api.get("/api/settings")
      .then((res) => {
        const body = res.data;
        const data = body?.data || body;
        if (data) {
          setSettings({
            wechatQr: data.wechat_qr || "",
            contact_phone: data.contact_phone || "13210894158",
            contact_email: data.contact_email || "1227134924@qq.com",
            contact_address: data.contact_address || "山东省临沂市沂河新区朝阳街道综合保税区东方跨境电商产业园20楼2010-2室",
            icp_number: data.icp_number || "",
            copyright_text: data.copyright_text || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
