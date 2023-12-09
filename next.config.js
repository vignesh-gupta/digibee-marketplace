/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        pathname: "**",
        protocol: "http",
        port: '3000',
      },
      {
        hostname: "digibee.up.railway.app",
        pathname: "**",
        protocol: "https",
        port: '*',
      },
    ],
  },
};

module.exports = nextConfig;
