/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"]
    
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
