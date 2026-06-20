import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import path from "node:path";
import { fail } from "./lib/response.js";

const app = express();

// CORS - 支持逗号分隔的多个来源，开发环境允许所有来源
const allowedOrigins = process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3002";
const origins = allowedOrigins.split(",").map((s) => s.trim());
app.use(
  cors({
    origin: origins.includes("*")
      ? "*"
      : (origin, callback) => {
          if (!origin || origins.includes(origin)) {
            callback(null, true);
          } else {
            callback(null, true); // 开发阶段允许所有来源
          }
        },
    credentials: !origins.includes("*"),
  })
);

// JSON body parser
app.use(express.json());

// Static files - uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Rate limiter for POST /api/messages (1 hour window)
const messagePostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, error: "请求过于频繁，请稍后再试" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for login endpoint (15 minutes window)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: "登录尝试过于频繁，请15分钟后再试" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
import publicNewsRouter from "./routes/public/news.js";
import publicProductsRouter from "./routes/public/products.js";
import publicCategoriesRouter from "./routes/public/categories.js";
import publicCertificatesRouter from "./routes/public/certificates.js";
import publicBannersRouter from "./routes/public/banners.js";
import publicMessagesRouter from "./routes/public/messages.js";
import publicSettingsRouter from "./routes/public/settings.js";

// Admin routes
import authRouter from "./routes/auth.js";
import adminNewsRouter from "./routes/admin/news.js";
import adminProductsRouter from "./routes/admin/products.js";
import adminCategoriesRouter from "./routes/admin/categories.js";
import adminCertificatesRouter from "./routes/admin/certificates.js";
import adminBannersRouter from "./routes/admin/banners.js";
import adminMessagesRouter from "./routes/admin/messages.js";
import adminUploadRouter from "./routes/admin/upload.js";
import adminDashboardRouter from "./routes/admin/dashboard.js";
import adminSettingsRouter from "./routes/admin/settings.js";

// Mount public routes
app.use("/api/news", publicNewsRouter);
app.use("/api/products", publicProductsRouter);
app.use("/api/categories", publicCategoriesRouter);
app.use("/api/certificates", publicCertificatesRouter);
app.use("/api/banners", publicBannersRouter);
app.use("/api/messages", messagePostLimiter, publicMessagesRouter);
app.use("/api/settings", publicSettingsRouter);

// Mount admin routes
app.use("/api/auth", loginLimiter, authRouter);
app.use("/api/admin/news", adminNewsRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/categories", adminCategoriesRouter);
app.use("/api/admin/certificates", adminCertificatesRouter);
app.use("/api/admin/banners", adminBannersRouter);
app.use("/api/admin/messages", adminMessagesRouter);
app.use("/api/admin/upload", adminUploadRouter);
app.use("/api/admin/dashboard", adminDashboardRouter);
app.use("/api/admin/settings", adminSettingsRouter);

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler - must be after all routes
app.use((_req: Request, res: Response) => {
  fail(res, "请求的资源不存在", 404);
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  fail(
    res,
    "服务器内部错误",
    500,
    process.env.NODE_ENV === "development"
      ? [{ field: "server", message: err.message }]
      : undefined
  );
});

export default app;
