"use client";

import { useEffect, useState } from "react";
import { VerticalAlignTopOutlined } from "@ant-design/icons";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-[120px] right-6 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-[#0070d5] text-white text-lg shadow-lg cursor-pointer border-none transition-[opacity,transform,background-color] duration-300 hover:bg-[#005fa3] hover:scale-105 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="回到顶部"
    >
      <VerticalAlignTopOutlined />
    </button>
  );
}
