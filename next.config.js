/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        pathname: "**",
        protocol: "http",
        port: "3000",
      },
      {
        hostname: "digibee.up.railway.app",
        protocol: "https",
      },
      {
        hostname: "digibee-mediafiles.s3.ap-south-1.amazonaws.com",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
