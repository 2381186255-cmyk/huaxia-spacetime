#!/usr/bin/env bash
# 华夏时空 - 停止所有服务

echo ""
echo "  正在停止华夏时空所有服务..."
echo ""

docker compose down
echo "  Docker 服务已停止"

echo ""
echo "  所有服务已停止"
