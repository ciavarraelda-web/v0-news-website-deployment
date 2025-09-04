import { NextResponse } from "next/server"

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()

  if (text.includes("bitcoin") || text.includes("btc")) return "Bitcoin"
  if (text.includes("ethereum") || text.includes("eth") || text.includes("ether")) return "Ethereum"
  if (
    text.includes("defi") ||
    text.includes("decentralized finance") ||
    text.includes("yield") ||
    text.includes("liquidity")
  )
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
    const API_KEY = "api_live_LEDqdwF4qtfM918XQ7RiRntBoIhQSnUHo0rs5IvKbKrpzR6PEyo6tivk"

    // 🔹 Chiamata a NewsData.io (cripto in inglese, max 30 articoli)
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency OR bitcoin OR ethereum&language=en&category=business`,
      {
        next: { revalidate: 180 },
        headers: {
          "User-Agent": "CryptoNewsHub/1.0",
        },
      }
    )

    if (!res.ok) {
      console.error("[v0] NewsData.io API failed:", res.status, res.statusText)
      throw new Error("Failed to fetch news")
    }

    const data = await res.json()
    console.log("[v0] NewsData.io articles:", data.results?.length || 0)

    const seenUrls = new Set()
    const articles = (data.results || [])
      .map((a: any) => ({
        id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: a.title,
        description: a.description || a.content || "No description available",
        image: a.image_url && a.image_url !== "null" ? a.image_url : null,
        publishedAt: a.pubDate || new Date().toISOString(),
        source: a.source_id || "NewsData.io",
        url: a.link,
        category: detectCategory(a.title || "", a.description || ""),
        author: a.creator ? a.creator.join(", ") : "Unknown",
        content: a.content || a.description || a.title,
        originalUrl: a.link,
      }))
      // rimuovi duplicati per URL
      .filter((article) => {
        if (!article.url) return false
        if (seenUrls.has(article.url)) return false
        seenUrls.add(article.url)
        return true
      })
      // ordina per data
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 30)

    return NextResponse.json({
      articles,
      totalResults: articles.length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching news:", error)

    const fallbackArticles = [
      {
        id: "fallback-1",
        title: "Crypto Markets Show Strong Recovery Amid Institutional Interest",
        description:
          "Major cryptocurrencies are experiencing significant gains as institutional investors continue to show increased interest in digital assets.",
        image: "/crypto-market-recovery-chart.png",
        category: "Market",
        publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        source: "Crypto News Hub",
        url: "#",
        author: "Market Analysis Team",
      },
      {
        id: "fallback-2",
        title: "DeFi Protocol Launches Innovative Yield Strategy",
        description:
          "A new decentralized finance protocol has introduced a revolutionary approach to yield farming with enhanced security features.",
        image: "/defi-protocol-interface.png",
        category: "DeFi",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        source: "DeFi Weekly",
        url: "#",
        author: "DeFi Reporter",
      },
    ]

    return NextResponse.json({
      articles: fallbackArticles,
      totalResults: fallbackArticles.length,
      lastUpdated: new Date().toISOString(),
      fallback: true,
    })
  }
}
