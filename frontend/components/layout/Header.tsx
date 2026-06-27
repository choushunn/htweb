"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Layout, Menu, Drawer } from "antd";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { SearchOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import api from "@/lib/api";

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

interface SearchResultItem {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  summary?: string;
  [key: string]: unknown;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    products: SearchResultItem[];
    news: SearchResultItem[];
  } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // 实时搜索（带 debounce）
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await api.get("/api/search", {
        params: { q: query.trim(), type: "all", limit: 5 },
      });
      const body = res.data;
      if (body.success) {
        setSearchResults({
          products: body.data?.products?.hits || [],
          news: body.data?.news?.hits || [],
        });
      } else {
        setSearchResults(null);
      }
    } catch {
      setSearchResults(null);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // 输入时自动触发搜索（300ms debounce，至少2个字符，且不在输入法输入中）
  useEffect(() => {
    if (!searchOpen || isComposing) return;
    
    // 清除之前的 timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 如果输入为空或少于2个字符，清空结果但保持下拉框打开（用户可能正在输入）
    if (!searchVal.trim() || searchVal.trim().length < 2) {
      setSearchResults(null);
      // 不要关闭下拉框，保持打开状态让用户继续输入
      return;
    }

    // 显示下拉框
    setShowDropdown(true);
    setSearchLoading(true);

    // 300ms 后执行搜索
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchVal);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchVal, searchOpen, isComposing, performSearch]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleResultClick = (type: "products" | "news", id: number) => {
    setShowDropdown(false);
    setSearchOpen(false);
    setSearchVal("");
    setSearchResults(null);
    router.push(`/${type}/${id}`);
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
        <div className="hidden lg:flex items-center relative h-[68px] ml-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              setSearchOpen(true);
              setShowDropdown(true);
            }}
            className="w-9 h-9 flex items-center justify-center cursor-pointer text-xl rounded transition-colors duration-200 shrink-0 border-none bg-transparent p-0 active:scale-95 text-[#666] ml-0"
            aria-label="打开搜索"
          >
            <SearchOutlined aria-hidden="true" />
          </button>

          {/* 搜索结果模态框 */}
          {showDropdown && searchOpen && (
            <div 
              className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
              onClick={() => {
                setShowDropdown(false);
                setSearchOpen(false);
                setSearchVal("");
                setSearchResults(null);
              }}
            >
              <div 
                className="w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4 p-6 border-b border-gray-100">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="输入关键词搜索产品、新闻..."
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={(e) => {
                        setIsComposing(false);
                        setSearchVal((e.target as HTMLInputElement).value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setShowDropdown(false);
                          setSearchOpen(false);
                          setSearchVal("");
                          setSearchResults(null);
                        }
                      }}
                      autoComplete="off"
                      className="w-full h-12 border-2 border-[#0070d5] rounded-lg px-4 text-lg outline-none focus:ring-2 focus:ring-blue-200"
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchOpen(false);
                      setSearchVal("");
                      setSearchResults(null);
                    }}
                    className="w-12 h-12 flex items-center justify-center text-2xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <CloseOutlined />
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-6">
                  {searchLoading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400">
                      <span className="inline-block w-8 h-8 border-3 border-gray-300 border-t-[#0070d5] rounded-full animate-spin mr-3" />
                      <span className="text-lg">搜索中...</span>
                    </div>
                  ) : searchResults ? (
                    <div>
                      {/* 产品结果 */}
                      {searchResults.products.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-[#0070d5]">产品</span>
                            <span className="text-sm font-normal text-gray-400">({searchResults.products.length})</span>
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {searchResults.products.map((item) => (
                              <button
                                key={`p-${item.id}`}
                                type="button"
                                onClick={() => handleResultClick("products", item.id)}
                                className="text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all cursor-pointer border border-gray-100 hover:border-[#0070d5] hover:shadow-md"
                              >
                                <div className="text-base font-medium text-gray-800 mb-2 line-clamp-2">
                                  {item.name}
                                </div>
                                {item.description && (
                                  <div className="text-sm text-gray-400 line-clamp-2">
                                    {item.description}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 新闻结果 */}
                      {searchResults.news.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-[#0070d5]">新闻</span>
                            <span className="text-sm font-normal text-gray-400">({searchResults.news.length})</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.news.map((item) => (
                              <button
                                key={`n-${item.id}`}
                                type="button"
                                onClick={() => handleResultClick("news", item.id)}
                                className="text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all cursor-pointer border border-gray-100 hover:border-[#0070d5] hover:shadow-md"
                              >
                                <div className="text-base font-medium text-gray-800 mb-2 line-clamp-2">
                                  {item.title}
                                </div>
                                {item.summary && (
                                  <div className="text-sm text-gray-400 line-clamp-2">
                                    {item.summary}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 无结果 */}
                      {searchResults.products.length === 0 && searchResults.news.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                          <div className="text-6xl mb-4">🔍</div>
                          <div className="text-xl mb-2">未找到相关结果</div>
                          <div className="text-sm">请尝试其他关键词</div>
                        </div>
                      )}
                    </div>
                  ) : searchVal ? (
                    <div className="text-center py-16 text-gray-400">
                      <div className="text-xl">输入关键词开始搜索</div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-400">
                      <div className="text-xl mb-4">热门关键词</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["加氢催化剂", "铝镍合金", "钯碳", "贵金属"].map((kw) => (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => setSearchVal(kw)}
                            className="px-4 py-2 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-full text-sm transition-colors cursor-pointer border-none"
                          >
                            {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
