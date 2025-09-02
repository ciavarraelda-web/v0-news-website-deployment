import { NextResponse } from "next/server"

// Simulated AI analysis - in production, you'd use actual AI/ML services
function generateSentimentAnalysis(newsData: any[], marketData: any[]) {
  // Analyze news sentiment based on keywords
  const positiveKeywords = ["surge", "bullish", "adoption", "growth", "breakthrough", "partnership", "upgrade"]
  const negativeKeywords = ["crash", "bearish", "decline", "regulation", "hack", "ban", "volatility"]

  let positiveScore = 0
  let negativeScore = 0
  const totalArticles = newsData.length

  newsData.forEach((article) => {
    const text = `${article.title} ${article.description}`.toLowerCase()
    positiveKeywords.forEach((keyword) => {
      if (text.includes(keyword)) positiveScore++
    })
    negativeKeywords.forEach((keyword) => {
      if (text.includes(keyword)) negativeScore++
    })
  })

  const sentimentScore = totalArticles > 0 ? (((positiveScore - negativeScore) / totalArticles) * 100 + 100) / 2 : 50

  return Math.max(0, Math.min(100, sentimentScore))
}

function generatePricePredictions(marketData: any[]) {
  return marketData.slice(0, 10).map((coin) => {
    const currentPrice = coin.currentPrice
    const volatility = Math.abs(coin.priceChangePercentage24h || 0) / 100
    const trend = coin.priceChangePercentage7d || 0

    // Simple prediction algorithm based on trend and volatility
    const trendFactor = trend > 0 ? 1.02 : 0.98
    const volatilityFactor = 1 + (Math.random() - 0.5) * volatility * 0.5

    const prediction24h = currentPrice * trendFactor * volatilityFactor
    const prediction7d = currentPrice * Math.pow(trendFactor, 7) * volatilityFactor

    const confidence = Math.max(30, 100 - volatility * 100)

    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      currentPrice,
      prediction24h: Math.round(prediction24h * 100) / 100,
      prediction7d: Math.round(prediction7d * 100) / 100,
      confidence: Math.round(confidence),
      trend: trend > 5 ? "bullish" : trend < -5 ? "bearish" : "neutral",
      riskLevel: volatility > 0.1 ? "high" : volatility > 0.05 ? "medium" : "low",
    }
  })
}

function generateMarketInsights(marketData: any[], sentimentScore: number) {
  const totalMarketCap = marketData.reduce((sum, coin) => sum + (coin.marketCap || 0), 0)
  const avgChange24h =
    marketData.reduce((sum, coin) => sum + (coin.priceChangePercentage24h || 0), 0) / marketData.length

  const insights = []

  if (sentimentScore > 70) {
    insights.push({
      type: "bullish",
      title: "Strong Market Sentiment",
      description: "News sentiment is overwhelmingly positive, indicating potential upward momentum.",
      confidence: 85,
    })
  } else if (sentimentScore < 30) {
    insights.push({
      type: "bearish",
      title: "Negative Market Sentiment",
      description: "News sentiment suggests caution, potential market correction ahead.",
      confidence: 80,
    })
  }

  if (avgChange24h > 5) {
    insights.push({
      type: "opportunity",
      title: "Market Rally Detected",
      description: "Multiple cryptocurrencies showing strong 24h gains, momentum building.",
      confidence: 75,
    })
  } else if (avgChange24h < -5) {
    insights.push({
      type: "warning",
      title: "Market Correction",
      description: "Widespread declines suggest market-wide correction in progress.",
      confidence: 78,
    })
  }

  return insights
}

export async function GET() {
  try {
    // Fetch market data
    const marketResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/crypto-data`,
      {
        next: { revalidate: 300 },
      },
    )

    // Fetch news data
    const newsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/news`, {
      next: { revalidate: 300 },
    })

    if (!marketResponse.ok || !newsResponse.ok) {
      throw new Error("Failed to fetch data for AI analysis")
    }

    const marketData = await marketResponse.json()
    const newsData = await newsResponse.json()

    // Generate AI analysis
    const sentimentScore = generateSentimentAnalysis(newsData.articles || [], marketData.markets || [])
    const predictions = generatePricePredictions(marketData.markets || [])
    const insights = generateMarketInsights(marketData.markets || [], sentimentScore)

    return NextResponse.json({
      sentiment: {
        score: Math.round(sentimentScore),
        label: sentimentScore > 60 ? "Bullish" : sentimentScore < 40 ? "Bearish" : "Neutral",
        confidence: Math.round(70 + Math.random() * 20),
      },
      predictions,
      insights,
      marketOverview: {
        totalCoins: marketData.markets?.length || 0,
        avgChange24h:
          marketData.markets?.reduce((sum: number, coin: any) => sum + (coin.priceChangePercentage24h || 0), 0) /
          (marketData.markets?.length || 1),
        dominanceIndex: Math.round(45 + Math.random() * 10), // BTC dominance simulation
        fearGreedIndex: Math.round(sentimentScore * 0.8 + Math.random() * 20),
      },
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating AI analysis:", error)
    return NextResponse.json({ error: "Failed to generate AI analysis" }, { status: 500 })
  }
}
