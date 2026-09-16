/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the Postgres driver out of the webpack bundle and resolve it from
  // node_modules at runtime, so file tracing ships it with the serverless functions.
  experimental: { serverComponentsExternalPackages: ["pg"] },
};
/**
 * Every route this project has ever published keeps working. Pages have been
 * merged and renamed twice; a link someone saved should not decay because the
 * architecture improved.
 */
nextConfig.redirects = async () => [
  { source: "/criteria", destination: "/machines", permanent: true },
  { source: "/ethics", destination: "/lab#ethics", permanent: true },
  { source: "/experiment", destination: "/machines", permanent: true },
  { source: "/humans-vs-machines", destination: "/machines", permanent: true },
  { source: "/bayes", destination: "/machines", permanent: true },
  { source: "/underdetermination", destination: "/machines", permanent: true },
  { source: "/canon", destination: "/rewrite", permanent: true },
  { source: "/category", destination: "/categories", permanent: true },
  { source: "/philosophy", destination: "/shape", permanent: true },
  { source: "/end", destination: "/shape", permanent: true },
  { source: "/data", destination: "/lab", permanent: true },
  { source: "/sources", destination: "/about", permanent: true },
  { source: "/ai-console", destination: "/console", permanent: true },
];

export default nextConfig;
