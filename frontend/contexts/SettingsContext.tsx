"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "@/lib/api";

interface Settings {
  wechatQr: string;
  contact_phone?: string;
  contact_email?: string;
  contact_address?: string;
}

const SettingsContext = createContext<Settings>({ wechatQr: "" });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [wechatQr, setWechatQr] = useState("");

  useEffect(() => {
    api.get("/api/settings")
      .then((res) => {
        const body = res.data;
        // 新格式: { success: true, data: { wechat_qr: "..." } }
        // 旧格式: { data: { wechat_qr: "..." } }
        const data = body?.data || body;
        if (data?.wechat_qr) {
          setWechatQr(data.wechat_qr);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={{ wechatQr }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
