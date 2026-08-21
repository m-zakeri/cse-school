/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const isExport = process.env.NEXT_EXPORT === "true";

// Auto-detect GitHub Pages subpath if repo is not username.github.io
const repo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[1] : "";
const isRootPages = !repo || repo.endsWith(".github.io");
const basePath = isExport && !isRootPages && repo ? `/${repo}` : "";

const nextConfig = {
  output: isExport ? "export" : "standalone",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath || "",
  },
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


