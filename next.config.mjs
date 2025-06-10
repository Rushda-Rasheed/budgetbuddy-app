/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/budgetbuddy',
          permanent: false,
        },
      ];
    },
  };
  
  export default nextConfig;
  