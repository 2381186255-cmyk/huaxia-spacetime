#!/usr/bin/env bash
# 华夏时空 - 降级模式启动脚本（无需Docker）

set -e

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║   华夏时空 - 降级模式（无需Docker）   ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到 Node.js，请先安装 Node.js 18+"
    echo "       https://nodejs.org/"
    exit 1
fi

# 检查并安装依赖
if [ ! -d "node_modules" ]; then
    echo "[1/2] 安装 Node.js 依赖..."
    npm install
else
    echo "[1/2] 依赖已存在，跳过安装"
fi

echo "[2/2] 启动 Next.js 开发服务器（Mock模式）..."
echo ""
echo "  ────────────────────────────────────────"
echo "   降级模式说明:"
echo "     - 使用内存Mock数据，无需PostgreSQL/Redis"
echo "     - 包含19个朝代、15个历史事件、8个人物"
echo "     - 地图、时间轴、知识面板均可正常使用"
echo ""
echo "   服务地址:"
echo "     前端:  http://localhost:3000"
echo "     API:   http://localhost:3000/api/health"
echo "  ────────────────────────────────────────"
echo ""
echo "  按 Ctrl+C 停止服务"
echo ""

USE_MOCK=true npx next dev
