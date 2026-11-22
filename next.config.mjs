/** @type {import('next').NextConfig} */
const nextConfig = {
  // The page runs one imperative GSAP setup on mount; a single effect run keeps dev identical to production.
  reactStrictMode: false
};

export default nextConfig;
