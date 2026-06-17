-- 华夏时空 - 扩展与基础设置
-- 执行顺序: 001

-- 启用必要扩展
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgRouting;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- 模糊搜索支持

-- 统一使用公元年份（浮点数，负数表示公元前）
-- 例：公元前221年 = -221.0，公元755年 = 755.0
