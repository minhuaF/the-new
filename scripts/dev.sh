#!/bin/bash

# ==========================================
# 集成开发环境启动脚本
# ==========================================
# 功能：
# 1. 检查并启动 Docker
# 2. 检查并启动 Supabase 本地服务
# 3. 启动 Next.js 开发服务器
# ==========================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}🚀 启动开发环境${NC}"
echo -e "${BLUE}===========================================${NC}"

# 1. 检查 Docker 是否运行
echo -e "\n${YELLOW}[1/3] 检查 Docker 状态...${NC}"
if ! docker info > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Docker 未运行，正在尝试启动...${NC}"

  # 尝试启动 Docker Desktop
  if [ -d "/Applications/Docker.app" ]; then
    echo -e "${BLUE}启动 Docker Desktop...${NC}"
    open -a Docker

    # 等待 Docker 启动（最多等待 60 秒）
    echo -e "${BLUE}等待 Docker 启动...${NC}"
    for i in {1..30}; do
      if docker info > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Docker 已启动${NC}"
        break
      fi
      echo -n "."
      sleep 2

      if [ $i -eq 30 ]; then
        echo -e "\n${RED}✗ Docker 启动超时，请手动启动 Docker Desktop${NC}"
        exit 1
      fi
    done
  else
    echo -e "${RED}✗ 未找到 Docker Desktop，请先安装：https://www.docker.com/products/docker-desktop${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}✓ Docker 已运行${NC}"
fi

# 2. 检查并启动 Supabase
echo -e "\n${YELLOW}[2/3] 检查 Supabase 本地服务...${NC}"
if ! supabase status > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Supabase 未运行，正在启动...${NC}"

  # 启动 Supabase
  if supabase start; then
    echo -e "${GREEN}✓ Supabase 已启动${NC}"

    # 显示服务信息
    echo -e "\n${BLUE}Supabase 服务信息：${NC}"
    supabase status
  else
    echo -e "${RED}✗ Supabase 启动失败，请检查配置${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}✓ Supabase 已运行${NC}"

  # 显示简要状态
  supabase status | head -n 10
fi

# 3. 启动 Next.js 开发服务器
echo -e "\n${YELLOW}[3/3] 启动 Next.js 开发服务器...${NC}"
echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}✓ 开发环境准备就绪！${NC}"
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}📱 应用地址：http://localhost:3000${NC}"
echo -e "${BLUE}🗄️  Supabase Studio：http://127.0.0.1:54323${NC}"
echo -e "${BLUE}===========================================${NC}\n"

# 启动 Next.js（使用 npm 或 pnpm，根据 package.json 的 packageManager）
if [ -f "pnpm-lock.yaml" ]; then
  pnpm dev
else
  npm run dev
fi
