```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Abilita la gestione degli script esterni
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },
  // Abilita iframe e script esterni
  async headers() {
    return [
      {
        source: '/exchange',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.jsdelivr.net"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```
