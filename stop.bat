@echo off
chcp 65001 >nul 2>&1
title 华夏时空 - 停止服务

echo.
echo  正在停止华夏时空所有服务...
echo.

:: 停止 Docker 容器
docker compose down
echo  Docker 服务已停止

echo.
echo  所有服务已停止
pause
