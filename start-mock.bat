@echo off
chcp 65001 >nul 2>&1
title 华夏时空 - 一键启动（降级模式）

echo.
echo  ╔══════════════════════════════════════╗
echo  ║   华夏时空 - 降级模式（无需Docker）   ║
echo  ╚══════════════════════════════════════╝
echo.

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 18+
    echo        https://nodejs.org/
    pause
    exit /b 1
)

:: 检查并安装依赖
if not exist node_modules (
    echo [1/2] 安装 Node.js 依赖...
    call npm install
) else (
    echo [1/2] 依赖已存在，跳过安装
)

:: 设置 Mock 模式环境变量
echo [2/2] 启动 Next.js 开发服务器（Mock模式）...
echo.
echo  ────────────────────────────────────────
echo   降级模式说明:
echo     - 使用内存Mock数据，无需PostgreSQL/Redis
echo     - 包含19个朝代、15个历史事件、8个人物
echo     - 地图、时间轴、知识面板均可正常使用
echo.
echo   服务地址:
echo     前端:  http://localhost:3000
echo     API:   http://localhost:3000/api/health
echo  ────────────────────────────────────────
echo.
echo  按 Ctrl+C 停止服务
echo.

set USE_MOCK=true
call npx next dev
