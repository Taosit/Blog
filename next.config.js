/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/",
        destination: "/blogs",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
