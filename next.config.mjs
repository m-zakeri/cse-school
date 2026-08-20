/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // بهینه‌سازی برای سرعت بیشتر
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // بهینه‌سازی experimental برای سرعت بیشتر
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;
