import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import { success, fail } from "../../lib/response.js";

const router = Router();

// 需要认证
router.use(authenticateToken);

// POST / - 单张图片上传
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      fail(res, "请选择要上传的图片", 400);
      return;
    }

    success(res, { url: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("上传图片失败:", error);
    fail(res, "上传图片失败");
  }
});

export default router;
