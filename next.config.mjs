/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the Postgres driver out of the webpack bundle and resolve it from
  // node_modules at runtime, so file tracing ships it with the serverless functions.
  experimental: { serverComponentsExternalPackages: ["pg"] },
};
export default nextConfig;
