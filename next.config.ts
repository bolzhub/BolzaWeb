import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            // ancien nom du sous-site (When the human is away)
            { source: "/WhenTheHumanIsAway", destination: "/HumanAway", permanent: true },
            // ancien nom du sous-site (Life Drawing, ex-ADR)
            { source: "/ADR", destination: "/LifeDrawing", permanent: true },
            { source: "/ADR/:path*", destination: "/LifeDrawing/:path*", permanent: true },
        ];
    },
};

export default nextConfig;
