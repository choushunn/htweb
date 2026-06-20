import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { authenticateToken } from "../middleware/auth.js";
import { success, fail } from "../lib/response.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      fail(res, "用户名和密码不能为空", 400);
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin) {
      fail(res, "用户名或密码错误", 401);
      return;
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      fail(res, "用户名或密码错误", 401);
      return;
    }

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      secret,
      { expiresIn: "7d" }
    );

    success(res, { token, username: admin.username });
  } catch (error) {
    console.error("Login error:", error);
    fail(res, "服务器内部错误");
  }
});

// PUT /api/auth/password - 修改密码
router.put("/password", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      fail(res, "未登录", 401);
      return;
    }

    if (!oldPassword || !newPassword) {
      fail(res, "旧密码和新密码不能为空", 400);
      return;
    }

    if (newPassword.length < 6) {
      fail(res, "新密码不能少于6位", 400);
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { id: userId } });
    if (!admin) {
      fail(res, "用户不存在", 404);
      return;
    }

    const isValid = await bcrypt.compare(oldPassword, admin.password);
    if (!isValid) {
      fail(res, "旧密码错误", 400);
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    success(res, { message: "密码修改成功" });
  } catch (error) {
    console.error("修改密码失败:", error);
    fail(res, "修改密码失败");
  }
});

export default router;
