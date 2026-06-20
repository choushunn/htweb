import { Router } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { success, fail } from "../../lib/response.js";

const router = Router();
router.use(authenticateToken);

// 预定义的站点设置键和默认值
const SETTING_KEYS = {
  wechat_qr: "",
  contact_phone: "",
  contact_email: "",
  contact_address: "",
  copyright_text: "",
  icp_number: "",
} as const;

const upsertSchema = z.object({
  settings: z.record(
    z.string(),
    z.string().max(500, "设置值不能超过500个字符")
  ),
});

// GET / - 获取所有设置
router.get("/", async (_req, res) => {
  try {
    const records = await prisma.siteSetting.findMany();
    const settings: Record<string, string> = {};
    for (const key of Object.keys(SETTING_KEYS)) {
      const record = records.find((r) => r.key === key);
      settings[key] = record?.value ?? (SETTING_KEYS as any)[key];
    }
    success(res, settings);
  } catch (error) {
    console.error("获取站点设置失败:", error);
    fail(res, "获取站点设置失败");
  }
});

// PUT / - 批量更新设置
router.put("/", async (req, res) => {
  try {
    const result = upsertSchema.safeParse(req.body);
    if (!result.success) {
      fail(res, "验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const { settings } = result.data;
    const validKeys = Object.keys(SETTING_KEYS);

    // 只保存预定义的键
    for (const [key, value] of Object.entries(settings)) {
      if (validKeys.includes(key)) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    // 返回更新后的全量设置
    const records = await prisma.siteSetting.findMany();
    const allSettings: Record<string, string> = {};
    for (const key of validKeys) {
      const record = records.find((r) => r.key === key);
      allSettings[key] = record?.value ?? (SETTING_KEYS as any)[key];
    }

    success(res, allSettings);
  } catch (error) {
    console.error("更新站点设置失败:", error);
    fail(res, "更新站点设置失败");
  }
});

export default router;
