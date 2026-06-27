import app from "./app.js";
import { initSearchIndexes, syncSearchIndexes } from "./lib/search.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server is running on port ${PORT}`);
  // 初始化搜索索引设置
  await initSearchIndexes();
  // 增量同步：只同步缺失的数据
  await syncSearchIndexes();
});
