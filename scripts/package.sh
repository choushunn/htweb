#!/bin/bash
# ============================================================
# 昊天官网 - 部署文件打包脚本
# 用法: bash scripts/package.sh [output_name]
# 默认输出: htweb-deploy.zip
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_NAME="${1:-htweb-deploy}"
OUTPUT_FILE="${OUTPUT_NAME}.zip"

cd "$PROJECT_DIR"

echo "=== 昊天官网部署打包工具 ==="
echo "项目根目录: $(pwd)"
echo "输出文件: ${OUTPUT_FILE}"
echo ""

# 需要包含的文件列表
INCLUDES=(
  # Docker
  docker-compose.yml
  # Nginx
  nginx/default.conf
  # 后端
  backend/package.json
  backend/tsconfig.json
  backend/Dockerfile
  backend/prisma/schema.prisma
  "backend/prisma/seed.ts"
  backend/src
  # 前端
  frontend/package.json
  frontend/tsconfig.json
  frontend/next.config.ts
  frontend/Dockerfile
  frontend/app
  frontend/components
  frontend/contexts
  frontend/hooks
  frontend/lib
  frontend/public
  frontend/postcss.config.mjs
  # 公共
  .env.example
)

# 验证所有需要包含的文件/目录都存在
echo "检查文件完整性..."
MISSING=0
for item in "${INCLUDES[@]}"; do
  expanded=( $item )
  for f in "${expanded[@]}"; do
    if [ ! -e "$f" ]; then
      echo "  [缺少] $f"
      MISSING=$((MISSING + 1))
    fi
  done
done

if [ "$MISSING" -gt 0 ]; then
  echo "错误: 有 ${MISSING} 个文件/目录缺失，请确认当前在项目根目录下。"
  exit 1
fi
echo "  ✅ 所有文件存在"
echo ""

# 检查 zip 命令
if ! command -v zip &>/dev/null; then
  echo "错误: 未找到 zip 命令。请先安装: sudo apt install zip"
  exit 1
fi

# 创建临时目录用于打包（避免 zip 包含父目录结构）
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

TARGET_DIR="$TEMP_DIR/$OUTPUT_NAME"
mkdir -p "$TARGET_DIR"

echo "收集文件..."
for item in "${INCLUDES[@]}"; do
  expanded=( $item )
  for f in "${expanded[@]}"; do
    dir="$TARGET_DIR/$(dirname "$f")"
    mkdir -p "$dir"
    cp -r "$f" "$dir/"
  done
done

# 排除不需要的文件（node_modules, .next 等）
echo "清理临时目录..."
find "$TARGET_DIR" -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find "$TARGET_DIR" -name ".next" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find "$TARGET_DIR" -name "dist" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find "$TARGET_DIR" -name "*.tsbuildinfo" -delete 2>/dev/null || true

# 计算大小
PRE_SIZE=$(du -sh "$TARGET_DIR" | awk '{print $1}')

echo "打包中..."
cd "$TEMP_DIR"
zip -r "$PROJECT_DIR/$OUTPUT_FILE" "$OUTPUT_NAME" >/dev/null 2>&1

POST_SIZE=$(du -sh "$PROJECT_DIR/$OUTPUT_FILE" | awk '{print $1}')

echo "完成!"
echo ""
echo "====================================="
echo "  输出: ${OUTPUT_FILE}"
echo "  大小: ${POST_SIZE}"
echo "  内容: ${#INCLUDES[@]} 个文件/目录"
echo "====================================="
echo ""
echo "部署到服务器后，执行:"
echo "  unzip ${OUTPUT_FILE}"
echo "  cd ${OUTPUT_NAME}"
echo "  cp .env.example .env          # 编辑 .env 配置"
echo "  docker compose up -d --build"
echo "  docker compose exec backend npx prisma migrate dev --name init"
echo "  docker compose exec backend npx prisma db seed"
echo ""
