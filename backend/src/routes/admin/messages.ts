import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticateToken } from "../../middleware/auth.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// 所有路由需要认证
router.use(authenticateToken);

// GET / - 留言列表，支持分页，按 createdAt desc
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.message.count(),
    ]);

    success(res, data, { page, pageSize, total });
  } catch (error) {
    console.error("获取留言列表失败:", error);
    fail(res, "获取留言列表失败");
  }
});

// PUT /:id/read - 标记已读
router.put("/:id/read", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      fail(res, "无效的ID", 400);
      return;
    }

    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "留言不存在", 404);
      return;
    }

    const message = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    success(res, message);
  } catch (error) {
    console.error("标记已读失败:", error);
    fail(res, "标记已读失败");
  }
});

// DELETE /:id - 删除留言
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      fail(res, "无效的ID", 400);
      return;
    }

    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) {
      fail(res, "留言不存在", 404);
      return;
    }

    await prisma.message.delete({ where: { id } });
    success(res, { message: "删除成功" });
  } catch (error) {
    console.error("删除留言失败:", error);
    fail(res, "删除留言失败");
  }
});

export default router;
