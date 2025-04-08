import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ 빌드 중 ESLint 오류 무시
  },
  // 여기에 다른 설정들 추가 가능
};

export default nextConfig;
