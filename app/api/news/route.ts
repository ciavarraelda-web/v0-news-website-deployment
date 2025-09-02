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
    const queries = ["cryptocurrency", "bitcoin", "ethereum", "blockchain", "defi", "crypto market"]

    // Fetch from multiple queries to get diverse crypto news
    const newsPromises = queries.slice(0, 3).map((query) =>
      fetch(
        `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`,
        { next: { revalidate: 300 } }, // Cache for 5 minutes
      ),
    )

    const responses = await Promise.all(newsPromises)

    // Check if all requests were successful
    const failedRequests = responses.filter((response) => !response.ok)
    if (failedRequests.length === responses.length) {
      throw new Error("All news API requests failed")
    }

    // Combine articles from all successful requests
    const allArticles = []
    for (const response of responses) {
      if (response.ok) {
        const data = await response.json()
        allArticles.push(...(data.articles || []))
      }
    }

    const seenUrls = new Set()
    const articles = allArticles
      .filter((article: any) => {
        // Basic content validation
        if (!article.title || !article.description || article.title.includes("[Removed]")) {
          return false
        }

        // Remove duplicates based on URL
        if (seenUrls.has(article.url)) {
          return false
        }
        seenUrls.add(article.url)

        // Filter for crypto-related content
        const text = `${article.title} ${article.description}`.toLowerCase()
        const cryptoKeywords = [
          "crypto",
          "bitcoin",
          "ethereum",
          "blockchain",
          "defi",
          "nft",
          "altcoin",
          "token",
          "mining",
          "staking",
          "exchange",
          "wallet",
          "binance",
          "coinbase",
          "dogecoin",
          "solana",
          "cardano",
          "polygon",
        ]

        return cryptoKeywords.some((keyword) => text.includes(keyword))
      })
      .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 20)
      .map((article: any) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        image: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source.name,
        url: article.url,
        category: detectCategory(article.title, article.description),
        author: article.author,
      }))

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
        publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
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
        publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
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
