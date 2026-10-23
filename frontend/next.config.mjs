/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/users',
        destination: '/employees',
        permanent: false,
      },
      {
        source: '/admin/requests',
        destination: '/requests',
        permanent: false,
      },
      {
        source: '/admin/returns',
        destination: '/store/returns',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
