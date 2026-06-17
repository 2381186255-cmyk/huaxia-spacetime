@echo off
chcp 65001 >nul 2>&1
title 华夏时空 - 一键启动

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       华夏时空 - 一键启动脚本        ║
echo  ╚══════════════════════════════════════╝
echo.

:: 检查 Docker
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Docker，请先安装 Docker Desktop
    echo        https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 18+
    echo        https://nodejs.org/
    pause
    exit /b 1
)

:: 检查 Docker Desktop 是否运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker 未运行，请先启动 Docker Desktop
    pause
    exit /b 1
)

echo [1/5] 启动基础服务 (PostgreSQL + Redis)...
docker compose up -d postgres redis
if %errorlevel% neq 0 (
    echo [错误] Docker 服务启动失败
    pause
    exit /b 1
)

echo [2/5] 等待数据库就绪...
timeout /t 5 /nobreak >nul

:wait_postgres
docker exec huaxia-postgres pg_isready -U huaxia -d huaxia_spacetime >nul 2>&1
if %errorlevel% neq 0 (
    echo        等待 PostgreSQL 启动中...
    timeout /t 3 /nobreak >nul
    goto wait_postgres
)
echo        PostgreSQL 已就绪

:wait_redis
docker exec huaxia-redis redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo        等待 Redis 启动中...
    timeout /t 3 /nobreak >nul
    goto wait_redis
)
echo        Redis 已就绪

echo [3/5] 检查并安装 Node.js 依赖...
if not exist node_modules (
    echo        安装依赖中...
    call npm install
) else (
    echo        依赖已存在，跳过安装
)

echo [4/5] 检查数据库迁移...
for /f %%i in ('docker exec huaxia-postgres psql -U huaxia -d huaxia_spacetime -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'" 2^>nul') do set TABLE_COUNT=%%i
if "%TABLE_COUNT%"=="0" (
    echo        数据库为空，迁移脚本将在 Docker 初始化时自动执行
) else (
    echo        数据库已初始化 (%TABLE_COUNT% 张表)
)

echo [5/5] 启动 Next.js 开发服务器...
echo.
echo  ────────────────────────────────────────
echo   服务地址:
echo     前端:  http://localhost:3000
echo     API:   http://localhost:3000/api/health
echo     数据库: localhost:5432
echo     Redis:  localhost:6379
echo  ────────────────────────────────────────
echo.
echo  按 Ctrl+C 停止服务
echo.

call npx next dev
