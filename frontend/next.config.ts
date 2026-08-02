import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['transformation-effort-strange-subdivision.trycloudflare.com'],
  /* config options here */
  images:{
    remotePatterns:[
     {
      hostname: "lh3.googleusercontent.com",
      protocol: "https"
     }
    ]
  }
};

export default nextConfig;
