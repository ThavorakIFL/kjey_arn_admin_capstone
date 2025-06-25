import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000", // this should match exactly
                pathname: "/storage/**",
            },
        ],
    },

    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
