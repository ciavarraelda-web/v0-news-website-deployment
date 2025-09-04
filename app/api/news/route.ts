import { NextResponse } from "next/server"

// Aggiungi cache per conservare gli ultimi articoli ricevuti
let cachedArticles: any[] = []
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minuti

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()
  const categories = [
    { keywords: ["bitcoin", "btc"], name: "Bitcoin" },
    { keywords: ["ethereum", "eth", "ether"], name: "Ethereum" },
    { keywords: ["defi", "decentralized finance", "yield", "liquidity"], name: "DeFi" },
    { keywords: ["nft", "non-fungible", "opensea", "collectible"], name: "NFTs" },
    { keywords: ["regulation", "sec", "government", "legal"], name: "Regulation" },
    { keywords: ["mining", "hash", "proof of work"], name: "Mining" },
    { keywords: ["staking", "proof of stake", "validator"], name: "Staking" },
    { keywords: ["exchange", "trading", "binance", "coinbase"], name: "Exchange" },
    { keywords: ["altcoin", "token", "coin"], name: "Altcoins" },
    { keywords: ["blockchain", "layer 2", "scaling"], name: "Technology" }
  ]

  for (const category of categories) {
    if (category.keywords.some(keyword => text.includes(keyword))) {
      return category.name
    }
  }

  return "Crypto"
}

export async function GET() {
  const currentTime = Date.now()
  
  // Usa la cache se ancora valida
  if (currentTime - lastFetchTime < CACHE_DURATION && cachedArticles.length > 0) {
    return NextResponse.json({
      articles: cachedArticles,
      totalResults: cachedArticles.length,
      lastUpdated: new Date(lastFetchTime).toISOString(),
      cached: true
    })
  }

  try {
    const API_KEY = process.env.NEWSDATA_API_KEY || "your_api_key_here"

    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency OR bitcoin OR ethereum&language=en&category=business`,
      {
        next: { revalidate: 300 }, // 5 minutes
        headers: {
          "User-Agent": "CryptoNewsHub/1.0",
        },
      }
    )

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`)
    }

    const data = await res.json()
    
    const seenUrls = new Set()
    const articles = (data.results || [])
      .map((a: any) => ({
        id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: a.title || "No title available",
        description: a.description || a.content || "No description available",
        image: a.image_url && a.image_url !== "null" ? a.image_url : null,
        publishedAt: a.pubDate || new Date().toISOString(),
        source: a.source_id || "NewsData.io",
        url: a.link || "#",
        category: detectCategory(a.title || "", a.description || ""),
        author: a.creator ? a.creator.join(", ") : "Unknown",
      }))
      .filter((article: any) => {
        if (!article.url || article.url === "#") return false
        if (seenUrls.has(article.url)) return false
        seenUrls.add(article.url)
        return true
      })
      .sort((a: any, b: any) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, 30)

    // Aggiorna cache
    cachedArticles = articles
    lastFetchTime = currentTime

    return NextResponse.json({
      articles,
      totalResults: articles.length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching news, using cached or fallback data:", error)

    // Usa gli articoli in cache se disponibili, altrimenti fallback
    const articlesToUse = cachedArticles.length > 0 ? cachedArticles : [
      {
        id: "fallback-1",
        title: "Crypto Markets Show Strong Recovery",
        description: "Major cryptocurrencies are experiencing significant gains as institutional investors continue to show interest.",
        image: null,
        category: "Market",
        publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        source: "Crypto News Hub",
        url: "#",
        author: "Market Analysis Team",
      },
      {
        id: "fallback-2",
        title: "DeFi Protocol Launches Innovative Yield Strategy",
        description: "A new decentralized finance protocol has introduced a revolutionary approach to yield farming.",
        image: null,
        category: "DeFi",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        source: "DeFi Weekly",
        url: "#",
        author: "DeFi Reporter",
      },
    ]

    return NextResponse.json({
      articles: articlesToUse,
      totalResults: articlesToUse.length,
      lastUpdated: new Date().toISOString(),
      fallback: true,
      cached: cachedArticles.length > 0
    })
  }
}
