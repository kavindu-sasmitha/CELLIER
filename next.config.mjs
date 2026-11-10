/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  allowedDevOrigins: ['192.168.60.17', '192.168.8.166', 'localhost:3000'],
};

export default nextConfig;
