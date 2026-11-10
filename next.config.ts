import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Docker builds set NEXT_OUTPUT=standalone to produce a minimal server bundle.
  // Local `npm run build` / `npm run start` are unaffected.
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
