"use client";

import { useState, useRef, useEffect } from "react";
import { Layout, Menu, Drawer } from "antd";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { SearchOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

const menuItems = [
  { key: "/", label: "首页", className: "!font-semibold" },
  {
    key: "about",
    label: "关于我们",
    className: "!font-semibold",
    children: [
      { key: "/about", label: "公司简介", className: "!font-semibold" },
      { key: "/about/culture", label: "企业文化", className: "!font-semibold" },
      { key: "/about/service", label: "售后服务", className: "!font-semibold" },
    ],
  },
  { key: "/products", label: "产品中心", className: "!font-semibold" },
  { key: "/certificates", label: "企业资质", className: "!font-semibold" },
  { key: "/news", label: "新闻中心", className: "!font-semibold" },
  { key: "/contact", label: "联系我们", className: "!font-semibold" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  const getSelectedKey = () => {
    if (pathname === "/") return "/";
    for (const item of menuItems) {
      if (item.key === "/") continue;
      if (item.children) {
        const exactChild = item.children.find((c) => pathname === c.key);
        if (exactChild) return exactChild.key;
        const prefixChild = item.children.find((c) =>
          pathname.startsWith(c.key + "/")
        );
        if (prefixChild) return prefixChild.key;
      } else if (pathname === item.key || pathname.startsWith(item.key + "/")) {
        return item.key;
      }
    }
    return "";
  };

  const getOpenKeys = () => {
    for (const item of menuItems) {
      if (item.children) {
        const child = item.children.find((c) =>
          pathname === c.key || pathname.startsWith(c.key + "/")
        );
        if (child) return [item.key];
      }
    }
    return [];
  };

  const selectedKey = getSelectedKey();
  const [openKeys, setOpenKeys] = useState<string[]>(getOpenKeys());

  useEffect(() => {
    setOpenKeys(getOpenKeys());
  }, [pathname]);

  const handleSearch = () => {
    const val = searchVal.trim();
    if (val) {
      router.push(`/products?keyword=${encodeURIComponent(val)}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  };

  const handleMobileNavClick = (key: string) => {
    setMobileMenuOpen(false);
    router.push(key);
  };

  // Mobile drawer menu items (flat list with submenu support)
  const getMobileMenuItems = () => {
    const items: { key: string; label: string; depth?: number }[] = [];
    menuItems.forEach((item) => {
      if (item.children) {
        items.push({ key: item.children[0].key, label: item.label, depth: 0 });
        item.children.forEach((child) => {
          items.push({ key: child.key, label: `  ${child.label}`, depth: 1 });
        });
      } else {
        items.push({ key: item.key, label: item.label, depth: 0 });
      }
    });
    return items;
  };

  return (
    <AntHeader className="bg-white border-b border-[#e8e8e8] h-[68px] leading-[68px] flex items-center justify-center sticky top-0 z-[100]">
      <div className="max-w-[1200px] w-full px-4 md:px-12 flex items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-[24px] md:text-[28px] font-bold text-[#0070d5] mr-4 md:mr-12 whitespace-nowrap tracking-wide no-underline"
        >
          昊天金属
        </Link>

        {/* 桌面端导航菜单 - hidden on mobile */}
        <Menu
          mode="horizontal"
          selectedKeys={selectedKey ? [selectedKey] : []}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          className="hidden lg:flex flex-1 min-w-0 border-none bg-transparent text-[17px] leading-[68px]"
        />

        {/* 桌面端导航右侧占位 + 搜索 */}
        <div className="hidden lg:flex items-center relative h-[68px] ml-auto">
          <div
            className={`flex items-center overflow-hidden transition-[width,opacity] duration-200 ease-in-out ${searchOpen ? 'w-[200px] opacity-100' : 'w-0 opacity-0'}`}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="搜索产品..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onBlur={() => {
                if (!searchVal.trim()) {
                  setSearchOpen(false);
                  setSearchVal("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
                if (e.key === "Escape") {
                  setSearchOpen(false);
                  setSearchVal("");
                }
              }}
              autoComplete="off"
              className="w-full h-9 border border-[#d9d9d9] rounded px-3 text-[15px] outline-none box-border"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (searchOpen) {
                const val = searchVal.trim();
                if (val) {
                  router.push(`/products?keyword=${encodeURIComponent(val)}`);
                  setSearchVal("");
                }
                setSearchOpen(false);
              } else {
                setSearchOpen(true);
              }
            }}
            className={`w-9 h-9 flex items-center justify-center cursor-pointer text-xl rounded transition-colors duration-200 shrink-0 border-none bg-transparent p-0 active:scale-95 ${searchOpen ? 'text-[#0070d5] ml-2' : 'text-[#666] ml-0'}`}
            aria-label={searchOpen ? "搜索" : "展开搜索"}
          >
            <SearchOutlined aria-hidden="true" />
          </button>
        </div>

        {/* 移动端：搜索 + 汉堡菜单 */}
        <div className="flex lg:hidden items-center ml-auto gap-1">
          <button
            type="button"
            onClick={() => {
              const val = searchVal.trim();
              if (val) {
                router.push(`/products?keyword=${encodeURIComponent(val)}`);
                setSearchVal("");
              } else {
                router.push("/products");
              }
            }}
            className="w-9 h-9 flex items-center justify-center text-[#666] text-xl border-none bg-transparent cursor-pointer active:scale-95"
            aria-label="搜索产品"
          >
            <SearchOutlined aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 flex items-center justify-center text-[#333] text-2xl border-none bg-transparent cursor-pointer active:scale-95"
            aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
          >
            {mobileMenuOpen ? <CloseOutlined aria-hidden="true" /> : <MenuOutlined aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title={
          <span className="text-[#0070d5] font-bold text-xl">昊天金属</span>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        size="default"
        styles={{
          body: { padding: "8px 0" },
          header: { borderBottom: "1px solid #f0f0f0" },
        }}
      >
        <nav className="flex flex-col">
          {getMobileMenuItems().map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleMobileNavClick(item.key)}
              className={`text-left px-6 py-3.5 text-base transition-colors duration-150 border-none bg-transparent cursor-pointer active:bg-blue-50
                ${pathname === item.key || (item.key !== "/" && pathname.startsWith(item.key))
                  ? "text-[#0070d5] font-semibold bg-[#e8f4fd]"
                  : "text-[#333] hover:text-[#0070d5] hover:bg-gray-50"
                }
                ${item.depth === 1 ? "pl-12 text-sm text-gray-500" : ""}
              `}
            >
              {item.label.replace(/^\s+/, "")}
            </button>
          ))}
        </nav>
      </Drawer>
    </AntHeader>
  );
}
