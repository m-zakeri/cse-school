/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const isExport = process.env.NEXT_EXPORT === "true";

// Auto-detect GitHub Pages subpath if repo is not username.github.io
const repo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[1] : "";
const isRootPages = !repo || repo.endsWith(".github.io");
const basePath = isExport && !isRootPages && repo ? `/${repo}` : "";

const nextConfig = {
  output: isExport ? "export" : "standalone",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
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


