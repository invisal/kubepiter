const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.resolve(__dirname, "node_modules")],
  },
  output: "standalone",
};

module.exports = nextConfig;
