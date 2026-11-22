import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            // ancien nom du sous-site (When the human is away)
            { source: "/WhenTheHumanIsAway", destination: "/HumanAway", permanent: true },
        ];
    },
};

export default nextConfig;
