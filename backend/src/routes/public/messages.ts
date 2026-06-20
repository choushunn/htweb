import { Router } from "express";
import { z } from "zod";
import prisma from "../../lib/prisma.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

const messageSchema = z.object({
  name: z.string().min(1, "姓名不能为空").max(50, "姓名不能超过50个字符"),
  phone: z.string().optional(),
  email: z.string().email("邮箱格式不正确").optional().or(z.literal("")),
  content: z.string().min(1, "留言内容不能为空").max(1000, "留言内容不能超过1000个字符"),
});

// POST / - 提交留言
router.post("/", async (req, res) => {
  try {
    const result = messageSchema.safeParse(req.body);
    if (!result.success) {
      fail(res, "表单验证失败", 400, result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })));
      return;
    }

    const { name, phone, email, content } = result.data;

    await prisma.message.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        content,
      },
    });

    success(res, { message: "留言提交成功" }, undefined, 201);
  } catch (error) {
    console.error("提交留言失败:", error);
    fail(res, "提交留言失败");
  }
});

export default router;
