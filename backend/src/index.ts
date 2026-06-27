import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

// 优雅停机
async function gracefulShutdown(signal: string) {
  console.log(`${signal} 收到，开始优雅关闭...`);
  server.close(async () => {
    console.log("HTTP 服务器已关闭");
    await Promise.allSettled([
      prisma.$disconnect(),
    ]);
    console.log("数据库连接已关闭");
    process.exit(0);
  });

  // 超时强制退出
  setTimeout(() => {
    console.error("强制退出");
    process.exit(1);
  }, 15000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
