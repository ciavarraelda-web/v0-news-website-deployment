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
  const NEWS_API_KEY = "pub_66f974315a164bc2aee52baed5ff04e1" // la tua chiave NewsAPI
  const cryptoList = ["bitcoin", "ethereum", "cardano", "solana", "litecoin", "polkadot", "ripple"]

  try {
    // 🔹 Fetch news da NewsAPI
    const newsRes = await fetch(
      `https://newsapi.org/v2/everything?q=cryptocurrency OR bitcoin OR ethereum OR defi OR nft&sortBy=publishedAt&pageSize=20&language=en&apiKey=${NEWS_API_KEY}`
    )
    const newsJson = await newsRes.json()
    console.log("[news] raw:", newsJson)

    const articles = (newsJson.articles || []).map((a: any) => ({
      id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: a.title,
      description: a.description || "",
      image: a.urlToImage || "/placeholder.svg",
      url: a.url,
      source: a.source?.name || "Unknown",
      publishedAt: a.publishedAt,
      category: detectCategory(a.title, a.description),
      author: a.author || "Unknown",
      content: a.content || a.description,
    }))

    // 🔹 Fetch dati di mercato da CoinGecko
    const ids = cryptoList.join(",")
    const marketRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    )
    const marketJson = await marketRes.json()
    console.log("[market] raw:", marketJson)

    const marketInfo = cryptoList.map((coin) => ({
      id: coin,
      price: marketJson[coin]?.usd || 0,
      change24h: marketJson[coin]?.usd_24h_change || 0,
      marketCap: marketJson[coin]?.usd_market_cap || 0,
    }))

    return NextResponse.json({
      articles,
      marketInfo,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Errore fetching news/market:", error)

    // Fallback se qualcosa fallisce
    const fallbackArticles = [
      {
        id: "fallback-1",
        title: "Crypto Markets Recover",
        description: "Bitcoin and Ethereum are showing signs of recovery.",
        image: "/bitcoin-concept.png",
        url: "#",
        source: "Crypto News Hub",
        publishedAt: new Date().toISOString(),
        category: "Market",
        author: "Market Team",
        content: "The crypto market is recovering as investor confidence increases.",
      },
    ]

    return NextResponse.json({
      articles: fallbackArticles,
      marketInfo: [],
      lastUpdated: new Date().toISOString(),
      fallback: true,
    })
  }
}
