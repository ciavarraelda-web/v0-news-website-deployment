import { NextResponse } from "next/server"

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()
  if (text.includes("bitcoin") || text.includes("btc")) return "Bitcoin"
  if (text.includes("ethereum") || text.includes("eth") || text.includes("ether")) return "Ethereum"
  if (text.includes("defi") || text.includes("decentralized")) return "DeFi"
  if (text.includes("nft") || text.includes("non-fungible")) return "NFTs"
  if (text.includes("regulation") || text.includes("sec")) return "Regulation"
  if (text.includes("mining") || text.includes("proof of work")) return "Mining"
  if (text.includes("staking") || text.includes("proof of stake")) return "Staking"
  if (text.includes("exchange") || text.includes("trading")) return "Exchange"
  if (text.includes("altcoin") || text.includes("token")) return "Altcoins"
  if (text.includes("blockchain") || text.includes("layer 2")) return "Technology"
  return "Crypto"
}

export async function GET() {
  const API_KEY = "api_live_LEDqdwF4qtfM918XQ7RiRntBoIhQSnUHo0rs5IvKbKrpzR6PEyo6tivk"
  let dataResults: any[] = []

  // 1️⃣ Proviamo l’endpoint /crypto
  try {
    const res = await fetch(`https://newsdata.io/api/1/crypto?apikey=${API_KEY}&language=en&timeframe=24h`, {
      headers: { "User-Agent": "CryptoNewsHub/1.0" },
      cache: "no-store",
    })
    const json = await res.json()
    console.log("[v0] /crypto status:", res.status, json.status || "")
    if (res.ok && Array.isArray(json.results) && json.results.length) {
      dataResults = json.results
    } else {
      console.warn("[v0] /crypto empty, fallback to generic search")
      throw new Error("Crypto endpoint empty")
    }
  } catch (err) {
    console.error("[v0] Error /crypto:", err.message)
    // 2️⃣ fallback a /news
    try {
      const res2 = await fetch(`https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency&language=en`, {
        headers: { "User-Agent": "CryptoNewsHub/1.0" },
        cache: "no-store",
      })
      const json2 = await res2.json()
      console.log("[v0] /news search status:", res2.status, json2.status || "")
      if (res2.ok && Array.isArray(json2.results) && json2.results.length) {
        dataResults = json2.results
      } else {
        console.error("[v0] Generic search also failed")
      }
    } catch (err2) {
      console.error("[v0] Error /news search:", err2.message)
    }
  }

  // 🔹 Se non ci sono risultati
  if (!dataResults.length) {
    return NextResponse.json({
      articles: [],
      totalResults: 0,
      lastUpdated: new Date().toISOString(),
      fallback: true,
    })
  }

  // 🔹 Mapping dei campi
  const seen = new Set()
  const articles = dataResults
    .map((a: any) => ({
      id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: a.title || "",
      description: a.description || a.content || "No description",
      image: a.image_url && a.image_url !== "null" ? a.image_url : null,
      publishedAt: a.pubDate || new Date().toISOString(),
      source: a.source_id || "Unknown",
      url: a.link,
      category: detectCategory(a.title || "", a.description || ""),
      author: Array.isArray(a.creator) ? a.creator.join(", ") : a.creator || "Unknown",
      content: a.content || a.description || a.title,
      originalUrl: a.link,
    }))
    .filter(item => item.title && item.url && !seen.has(item.url) && seen.add(item.url))
    .sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 30)

  return NextResponse.json({
    articles,
    totalResults: articles.length,
    lastUpdated: new Date().toISOString(),
  })
}
