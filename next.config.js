/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix per moduli che usano "fs" lato client
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },

  // Headers personalizzati (CSP e simili)
  async headers() {
    return [
      {
        // Applica le regole a /exchange e a tutte le sue sotto-route
        source: "/exchange/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.jsdelivr.net unpkg.com *.wagmi.sh *.walletconnect.com *.ethers.org *.0x.org;
              connect-src 'self' https://api.0x.org https://*.walletconnect.com https://rpc.ankr.com https://mainnet.infura.io;
              img-src 'self' data: https:;
              style-src 'self' 'unsafe-inline';
              font-src 'self' data:;
            `.replace(/\s{2,}/g, " ") // pulisce spazi extra
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
