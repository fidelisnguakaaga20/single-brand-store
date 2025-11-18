import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer modern formats for better performance
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;


