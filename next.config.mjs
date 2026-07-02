const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
        pathname: "/**"
      }
    ]
  },
  output: "standalone",
  reactStrictMode: true
};

export default nextConfig;
