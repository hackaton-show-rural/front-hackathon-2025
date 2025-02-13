/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: true,
  /* eslint: {
     ignoreDuringBuilds: true,
   },
   typescript: {
     ignoreBuildErrors: true,
   },*/
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  output: "standalone",
}

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/~offline",
  },
})

module.exports = withPWA(nextConfig)
