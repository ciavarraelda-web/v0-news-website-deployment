// lib/api.js
export class NewsAPIClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL;
    this.keys = {
      newsapi: process.env.NEWS_API_KEY,
      newsdata: process.env.NEWSDATA_API_KEY,
      coinapi: process.env.COIN_API_KEY
    };
  }

  async fetchNews() {
    try {
      // Prima prova: NewsAPI.org
      const newsapiUrl = `https://newsapi.org/v2/everything?q=crypto+blockchain&apiKey=${this.keys.newsapi}&pageSize=20&language=it`;
      const response = await fetch(newsapiUrl);
      
      if (!response.ok) throw new Error('NewsAPI failed');
      
      const data = await response.json();
      return this.formatNewsData(data.articles, 'newsapi');
    } catch (error) {
      // Fallback a NewsData.io
      const newsdataUrl = `https://newsdata.io/api/1/latest?apikey=${this.keys.newsdata}&category=business,technology&q=crypto`;
      const response = await fetch(newsdataUrl);
      
      if (!response.ok) return this.getFallbackNews();
      
      const data = await response.json();
      return this.formatNewsData(data.results, 'newsdata');
    }
  }
}
