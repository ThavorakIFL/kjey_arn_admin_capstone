import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "api-kjeyarn.paragoniu.app",
                port: "8000", // this should match exactly
                pathname: "/storage/**",
            },
            {
                protocol: "https",
                hostname: "kjeyarn.newlinkmarketing.com",
                port: "", // this should match exactly
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "api-kjeyarn.paragoniu.app",
                port: "", // this should match exactly
                pathname: "/**",
            },
        ],
    },

    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
