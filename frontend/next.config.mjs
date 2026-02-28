/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // Static export for GitHub Pages
  output: "export",

  // Repo name becomes the base path on GitHub Pages:
  // https://amx07.github.io/book-tweets/
  basePath: isProd ? "/book-tweets" : "",

  // next/image optimization isn't available in static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
