/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const isExport = process.env.NEXT_EXPORT === "true";

const nextConfig = {
  output: isExport ? "export" : "standalone",
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: isProd,
  },
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;

