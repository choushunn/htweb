"use client";

import { Form, Input, Button, App } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";

interface LoginForm {
  username: string;
  password: string;
}

/* ── 粒子背景 Canvas 组件 ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const PARTICLE_COUNT = 100;
    const CONNECT_DIST = 150;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.5 + 0.2,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(60, 160, 255, ${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(60, 160, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ── 登录页面 ── */
export default function AdminLoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [copyrightText, setCopyrightText] = useState("");
  const [icpNumber, setIcpNumber] = useState("");

  useEffect(() => {
    api.get("/api/settings").then((res) => {
      const data = res.data?.data || res.data;
      if (data) {
        if (data.copyright_text) setCopyrightText(data.copyright_text);
        if (data.icp_number) setIcpNumber(data.icp_number);
      }
    }).catch(() => {});
  }, []);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", values);
      const token = res.data?.token || res.data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        message.success("登录成功");
        router.push("/admin");
      } else {
        message.error("登录失败：未获取到令牌");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "登录失败，请检查用户名和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#1a3a6b]">
      {/* 动态粒子背景 */}
      <ParticleCanvas />

      {/* 背景光晕 */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 z-[1]"
        style={{
          background: "radial-gradient(circle, #0070d5 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10 z-[1]"
        style={{
          background: "radial-gradient(circle, #0070d5 0%, transparent 70%)",
        }}
      />

      {/* 背景网格 */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 品牌区域 */}
          <div className="px-10 pt-10 pb-6 text-center bg-gradient-to-r from-[#0070d5] to-[#005bb5]">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="2"
                  width="28"
                  height="28"
                  rx="6"
                  stroke="white"
                  strokeWidth="2.5"
                />
                <path
                  d="M10 16L14 20L22 12"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-wide mb-1">
              管理后台
            </h1>
            <p className="text-white/70 text-sm">山东昊天金属科技有限公司</p>
          </div>

          {/* 表单区域 */}
          <div className="px-10 pt-8 pb-10">
            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-300 text-base" />}
                  placeholder="请输入管理员用户名"
                  className="h-12 rounded-lg !px-4"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: "请输入密码" }]}
                className="mb-2"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-300 text-base" />}
                  placeholder="请输入密码"
                  className="h-12 rounded-lg !px-4"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item className="mt-8 mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="h-12 rounded-lg text-base font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow duration-200"
                  style={{
                    background: "linear-gradient(135deg, #0070d5, #005bb5)",
                    border: "none",
                  }}
                >
                  登 录
                </Button>
              </Form.Item>
            </Form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-sm" suppressHydrationWarning>
                {copyrightText || "山东昊天金属科技有限公司"}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors no-underline"
                >
                  {icpNumber || "鲁ICP备202XXXXXXXX号-1"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
