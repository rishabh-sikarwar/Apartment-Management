/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // <--- CRITICAL for cPanel Deployment
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**", // Added pathname wildcard to match all Cloudinary images
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
