import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output: server + deps mínimas para Docker (node:22-alpine).
  // Portable por diseño — el mismo build corre igual en Vercel (ignora esto) o en AWS/otro host Node.
  output: 'standalone',
  images: {
    // Avatares/documentos servidos desde S3 vía presigned URL (ver core/api-client y api/uploads del backend).
    // Ajustar el hostname real cuando se configure el bucket de producción.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
