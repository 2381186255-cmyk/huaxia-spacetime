import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CCTS_WMTS_URL:
      process.env.CCTS_WMTS_URL || "https://gis.sinica.edu.tw/ccts/wmts",
  },

  // 低配电脑优化：减少编译内存占用
  experimental: {
    // 优化内存使用
    optimizePackageImports: [
      "d3",
      "@turf/turf",
      "lucide-react",
      "framer-motion",
    ],
  },

  // 生产构建优化
  compiler: {
    // 移除 console.log（仅生产构建）
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
};

export default nextConfig;
