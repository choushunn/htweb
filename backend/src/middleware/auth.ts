import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { fail } from "../lib/response.js";

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        adminId: number;
        username: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    fail(res, "未提供认证令牌", 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
      id: number;
      username: string;
    };
    req.user = {
      adminId: decoded.id,
      username: decoded.username,
    };
    next();
  } catch {
    fail(res, "认证令牌无效或已过期", 401);
  }
}
