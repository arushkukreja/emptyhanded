/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb"
    }
  },
  turbopack: {
    root: process.cwd()
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazon.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "thenimetyou.com" },
      { protocol: "https", hostname: "ceremonia.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "www.makeupbymario.com" },
      { protocol: "https", hostname: "jvnhair.com" },
      { protocol: "https", hostname: "**.supabase.co" }
    ]
  }
};

export default nextConfig;
