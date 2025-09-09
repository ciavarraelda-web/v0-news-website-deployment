/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Configurazioni sperimentali se necessario
  },
  images: {
    // Configurazione per ottimizzazione immagini
    domains: ['https://cryptoico.eu'],
  },
  // Disabilita ESLint durante il build se necessario
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disabilita TypeScript durante il build se necessario
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
