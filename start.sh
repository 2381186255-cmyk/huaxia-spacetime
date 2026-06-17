#!/usr/bin/env bash
# 华夏时空 - 一键启动脚本 (macOS / Linux)

set -e

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║       华夏时空 - 一键启动脚本        ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查 Docker
if ! command -v docker &> /dev/null; then
    log_error "未检测到 Docker，请先安装 Docker"
    echo "       https://www.docker.com/products/docker-desktop"
    exit 1
fi

# 检查 Docker 是否运行
if ! docker info &> /dev/null; then
    log_error "Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    log_error "未检测到 Node.js，请先安装 Node.js 18+"
    echo "       https://nodejs.org/"
    exit 1
fi

echo "[1/5] 启动基础服务 (PostgreSQL + Redis)..."
docker compose up -d postgres redis

echo "[2/5] 等待数据库就绪..."
sleep 3

# 等待 PostgreSQL
until docker exec huaxia-postgres pg_isready -U huaxia -d huaxia_spacetime &> /dev/null; do
    echo "       等待 PostgreSQL 启动中..."
    sleep 2
done
log_info "PostgreSQL 已就绪"

# 等待 Redis
until docker exec huaxia-redis redis-cli ping &> /dev/null; do
    echo "       等待 Redis 启动中..."
    sleep 2
done
log_info "Redis 已就绪"

echo "[3/5] 检查并安装 Node.js 依赖..."
if [ ! -d "node_modules" ]; then
    echo "       安装依赖中..."
    npm install
else
    log_info "依赖已存在，跳过安装"
fi

echo "[4/5] 检查数据库迁移..."
TABLE_COUNT=$(docker exec huaxia-postgres psql -U huaxia -d huaxia_spacetime -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'" 2>/dev/null | xargs || echo "0")
if [ "$TABLE_COUNT" = "0" ]; then
    log_warn "数据库为空，迁移脚本将在 Docker 初始化时自动执行"
else
    log_info "数据库已初始化 ($TABLE_COUNT 张表)"
fi

echo "[5/5] 启动 Next.js 开发服务器..."
echo ""
echo "  ────────────────────────────────────────"
echo "   服务地址:"
echo "     前端:  http://localhost:3000"
echo "     API:   http://localhost:3000/api/health"
echo "     数据库: localhost:5432"
echo "     Redis:  localhost:6379"
echo "  ────────────────────────────────────────"
echo ""
echo "  按 Ctrl+C 停止服务"
echo ""

npx next dev
