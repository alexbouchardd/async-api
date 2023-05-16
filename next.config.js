/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOOKDECK_API_URL: process.env.HOOKDECK_API_URL,
    HOOKDECK_API_KEY: process.env.HOOKDECK_API_KEY,
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
