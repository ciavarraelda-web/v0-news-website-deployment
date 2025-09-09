// next.config.js
module.exports = {
  images: {
    domains: ['newsapi.org', 'images.newsdata.io', 'yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
  },
};
