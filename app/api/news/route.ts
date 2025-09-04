import { NextResponse } from "next/server"

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()

  if (text.includes("bitcoin") || text.includes("btc")) return "Bitcoin"
  if (text.includes("ethereum") || text.includes("eth") || text.includes("ether")) return "Ethereum"
  if (text.includes("defi") || text.includes("decentralized finance") || text.includes("yield") || text.includes("liquidity"))
    return "DeFi"
  if (text.includes("nft") || text.includes("non-fungible") || text.includes("opensea") || text.includes("collectible"))
    return "NFTs"
  if (text.includes("regulation") || text.includes("sec") || text.includes("government") || text.includes("legal"))
    return "Regulation"
  if (text.includes("mining") || text.includes("hash") || text.includes("proof of work")) return "Mining"
  if (text.includes("staking") || text.includes("proof of stake") || text.includes("validator")) return "Staking"
  if (text.includes("exchange") || text.includes("trading") || text.includes("binance") || text.includes("coinbase"))
    return "Exchange"
  if (text.includes("altcoin") || text.includes("token") || text.includes("coin")) return "Altcoins"
  if (text.includes("blockchain") || text.includes("layer 2") || text.includes("scaling")) return "Technology"

  return "Crypto"
}

export async function GET() {
  try {
    const NEWSAPI_KEYS = [
      "aa53ba1f151d42f5bac01774e792e9ee", // tua chiave
      "pub_916ff56267e04509b505898cb63f5ea7", // extra
    ]

    const NEWSDATA_KEY = "api_live_LEDqdwF4qtfM918XQ7RiRntBoIhQSnUHo0rs5IvKbKrpzR6PEyo6tivk"

    const queries = [
      "cryptocurrency market",
      "bitcoin price analysis",
      "ethereum blockchain",
      "defi protocol news",
      "crypto regulation",
      "blockchain technology",
      "altcoin trading",
      "nft marketplace",
    ]

    // 🔹 1. Provo con NewsAPI
    const newsPromises = queries.map((query, index) => {
      const apiKey = NEWSAPI_KEYS[index % NEWSAPI_KEYS.length]
      return fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=12&language=en&apiKey=${apiKey}`,
        { next: { revalidate: 180 } }
      )
    })

    const responses = await Promise.all(newsPromises)
    const successfulResponses = responses.filter((r) => r.ok)

    let allArticles: any[] = []

    if (successfulResponses.length > 0) {
      for (const response of successfulResponses) {
        const data = await response.json()
        allArticles.push(...(data.articles || []))
      }
    } else {
      console.warn("[v0] NewsAPI fallita, provo con NewsData.io")

      // 🔹 2. Se NewsAPI fallisce → NewsData.io
      const newsDataRes = await fetch(
        `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&q=crypto&language=en&category=business,technology`
      )

      if (newsDataRes.ok) {
        const data = await newsDataRes.json()
        allArticles = (data.results || []).map((a: any) => ({
          title: a.title,
          description: a.description,
          url: a.link,
          urlToImage: a.image_url,
          publishedAt: a.pubDate,
          source: { name: a.source_id },
          author: a.creator ? a.creator.join(", ") : "Unknown",
          content: a.content,
        }))
      } else {
        throw new Error("Nessuna API disponibile")
      }
    }

    // 🔹 Pulizia e normalizzazione
    const seenUrls = new Set()
    const articles = allArticles
      .filter((article: any) => article.title && article.description)
      .filter((article: any) => {
        if (seenUrls.has(article.url)) return false
        seenUrls.add(article.url)
        return true
      })
      .map((article: any) => ({
        id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        description: article.description,
        image: article.urlToImage || article.image || "/placeholder.svg",
        publishedAt: article.publishedAt,
        source: article.source?.name || article.source || "Unknown",
        url: article.url,
        category: detectCategory(article.title, article.description),
        author: article.author || "Unknown",
        content: article.content || article.description,
      }))
      .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 30)

    return NextResponse.json({
      articles,
      totalResults: articles.length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching news:", error)

    return NextResponse.json({
      articles: [],
      totalResults: 0,
      lastUpdated: new Date().toISOString(),
      fallback: true,
    })
  }
}
