import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// 公开设置键（可安全暴露给前端的配置项）
const PUBLIC_KEYS = ["wechat_qr"];

// GET / - 获取公开设置
router.get("/", async (_req, res) => {
  try {
    const records = await prisma.siteSetting.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    });
    const settings: Record<string, string> = {};
    for (const key of PUBLIC_KEYS) {
      const record = records.find((r) => r.key === key);
      settings[key] = record?.value ?? "";
    }
    success(res, settings);
  } catch (error) {
    console.error("获取公开设置失败:", error);
    fail(res, "获取公开设置失败");
  }
});

export default router;
