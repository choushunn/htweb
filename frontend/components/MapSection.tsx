"use client";

import { useEffect, useRef, useState } from "react";

// 高德地图安全密钥 (从环境变量读取)
const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY || "";

interface MapSectionProps {
  address?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MapSection({ address, className = "", style }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!AMAP_KEY || !mapRef.current) {
      setError(true);
      return;
    }

    // 加载 AMap 安全密钥 (JSAPI 2.0)
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
    script.async = true;
    script.onload = () => {
      setLoaded(true);
    };
    script.onerror = () => {
      setError(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || !window.AMap) return;

    const map = new window.AMap.Map(mapRef.current, {
      zoom: 15,
      center: [116.397428, 39.90923], // 默认北京中心，实际部署时替换为公司坐标
      mapStyle: "amap://styles/light",
      resizeEnable: true,
    });

    // 添加地图控件
    window.AMap.plugin(["AMap.ToolBar", "AMap.Scale"], () => {
      map.addControl(new window.AMap.ToolBar());
      map.addControl(new window.AMap.Scale());
    });

    // 添加标记
    const marker = new window.AMap.Marker({
      position: map.getCenter(),
      title: address || "公司地址",
    });
    marker.setMap(map);

    // 信息窗体
    if (address) {
      const info = new window.AMap.InfoWindow({
        content: `<div style="padding: 8px; font-size: 14px; color: #333;">${address}</div>`,
        offset: new window.AMap.Pixel(0, -30),
      });
      info.open(map, marker.getPosition());
    }

    return () => {
      map.destroy();
    };
  }, [loaded, address]);

  // 无 API Key 时显示占位
  if (!AMAP_KEY) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ minHeight: 300, ...style }}
      >
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2 text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="text-sm">{address || "公司位置"}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ minHeight: 300, ...style }}
      >
        <div className="text-center text-gray-400">
          <div className="text-sm">{address || "公司位置"}</div>
          <div className="text-xs mt-2">地图加载失败</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: 300, width: "100%", ...style }}
    />
  );
}
