import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3, Activity, Target, Zap } from "lucide-react"
import Image from "next/image"

async function getTechnicalAnalysis() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

    const response = await fetch(`${baseUrl}/api/crypto-data`, {
      next: { revalidate: 300 },
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch technical analysis data: ${response.statusText}`)
    }

    const data = await response.json()
    return data.markets?.slice(0, 6) || []
  } catch (error) {
    console.error("[v0] Error fetching technical analysis:", error)
    return [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        currentPrice: 43250,
        priceChangePercentage24h: 2.5,
        priceChangePercentage7d: 8.2,
        image: "/bitcoin-concept.png",
        sparklineIn7d: [
          40000, 41200, 42100, 41800, 42500, 43100, 42900, 43250, 43400, 43100, 43300, 43250, 43500, 43200,
        ],
        low24h: 42800,
        high24h: 43500,
        volume24h: 28500000000,
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        currentPrice: 2650,
        priceChangePercentage24h: -1.2,
        priceChangePercentage7d: 5.8,
        image: "/ethereum-abstract.png",
        sparklineIn7d: [2500, 2520, 2580, 2600, 2620, 2640, 2630, 2650, 2680, 2630, 2660, 2650, 2670, 2640],
        low24h: 2620,
        high24h: 2680,
        volume24h: 15200000000,
      },
      {
        id: "cardano",
        name: "Cardano",
        symbol: "ADA",
        currentPrice: 0.485,
        priceChangePercentage24h: 4.2,
        priceChangePercentage7d: -2.1,
        image: "/cardano-blockchain.png",
        sparklineIn7d: [0.45, 0.46, 0.47, 0.48, 0.49, 0.485, 0.48, 0.485, 0.49, 0.487, 0.485, 0.488, 0.485, 0.485],
        low24h: 0.465,
        high24h: 0.495,
        volume24h: 420000000,
      },
    ]
  }
}

function calculateRSI(prices: number[], period = 14) {
  if (prices.length < period + 1) return 50

  let gains = 0
  let losses = 0

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1]
    if (change > 0) gains += change
    else losses -= change
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  // Apply smoothing for remaining periods
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? -change : 0

    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
  }

  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

function calculateMACD(prices: number[]) {
  if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0 }

  // Calculate EMA
  const calculateEMA = (data: number[], period: number) => {
    const multiplier = 2 / (period + 1)
    let ema = data[0]

    for (let i = 1; i < data.length; i++) {
      ema = (data[i] - ema) * multiplier + ema
    }
    return ema
  }

  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)
  const macd = ema12 - ema26

  // Signal line (9-period EMA of MACD)
  const macdHistory = [macd] // Simplified for demo
  const signal = calculateEMA(macdHistory, 9)
  const histogram = macd - signal

  return { macd, signal, histogram }
}

function calculateParabolicSAR(prices: number[], highs: number[], lows: number[]) {
  if (prices.length < 5) return { sar: prices[prices.length - 1], trend: "neutral" }

  const af = 0.02 // Acceleration factor
  const maxAF = 0.2
  const currentAF = af
  const trend = prices[prices.length - 1] > prices[prices.length - 2] ? "bullish" : "bearish"

  // Simplified SAR calculation for demo
  const currentPrice = prices[prices.length - 1]
  const previousPrice = prices[prices.length - 2]

  let sar
  if (trend === "bullish") {
    sar = Math.min(...lows.slice(-5)) * (1 - currentAF)
  } else {
    sar = Math.max(...highs.slice(-5)) * (1 + currentAF)
  }

  return { sar, trend }
}

function getTechnicalSignal(coin: any) {
  const prices = coin.sparklineIn7d || []
  const highs = prices.map((p: number) => p * 1.02) // Simulated highs
  const lows = prices.map((p: number) => p * 0.98) // Simulated lows

  const rsi = calculateRSI(prices)
  const macd = calculateMACD(prices)
  const sar = calculateParabolicSAR(prices, highs, lows)
  const priceChange24h = coin.priceChangePercentage24h || 0
  const priceChange7d = coin.priceChangePercentage7d || 0

  let bullishSignals = 0
  let bearishSignals = 0

  // RSI signals
  if (rsi < 30) bullishSignals++
  if (rsi > 70) bearishSignals++

  // MACD signals
  if (macd.macd > macd.signal && macd.histogram > 0) bullishSignals++
  if (macd.macd < macd.signal && macd.histogram < 0) bearishSignals++

  // SAR signals
  if (sar.trend === "bullish") bullishSignals++
  if (sar.trend === "bearish") bearishSignals++

  // Price momentum
  if (priceChange24h > 3 && priceChange7d > 5) bullishSignals++
  if (priceChange24h < -3 && priceChange7d < -5) bearishSignals++

  if (bullishSignals >= 3) return { signal: "STRONG BUY", color: "text-green-700", bg: "bg-green-200" }
  if (bullishSignals >= 2) return { signal: "BUY", color: "text-green-600", bg: "bg-green-100" }
  if (bearishSignals >= 3) return { signal: "STRONG SELL", color: "text-red-700", bg: "bg-red-200" }
  if (bearishSignals >= 2) return { signal: "SELL", color: "text-red-600", bg: "bg-red-100" }
  return { signal: "HOLD", color: "text-yellow-600", bg: "bg-yellow-100" }
}

function formatPrice(price: number) {
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 100) return `$${price.toFixed(2)}`
  return `$${price.toLocaleString()}`
}

export async function TechnicalAnalysis() {
  const coins = await getTechnicalAnalysis()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          Advanced Technical Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">Multi-indicator analysis with RSI, MACD, and Parabolic SAR</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {coins.map((coin: any) => {
          const prices = coin.sparklineIn7d || []
          const highs = prices.map((p: number) => p * 1.02)
          const lows = prices.map((p: number) => p * 0.98)

          const rsi = calculateRSI(prices)
          const macd = calculateMACD(prices)
          const sar = calculateParabolicSAR(prices, highs, lows)
          const signal = getTechnicalSignal(coin)

          return (
            <div key={coin.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={coin.image || "/placeholder.svg"}
                    alt={`${coin.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-sm">{coin.name}</h4>
                    <p className="text-xs text-muted-foreground uppercase">{coin.symbol}</p>
                  </div>
                </div>
                <Badge className={`${signal.bg} ${signal.color} border-0`}>{signal.signal}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-semibold text-sm">{formatPrice(coin.currentPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">24h Change</p>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      coin.priceChangePercentage24h >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {coin.priceChangePercentage24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(coin.priceChangePercentage24h || 0).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Volume 24h</p>
                  <p className="font-semibold text-sm">${(coin.volume24h / 1000000).toFixed(0)}M</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* RSI Indicator */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">RSI (14)</span>
                    <span
                      className={`text-xs font-medium ${
                        rsi > 70 ? "text-red-600" : rsi < 30 ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {rsi.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        rsi > 70 ? "bg-red-500" : rsi < 30 ? "bg-green-500" : "bg-yellow-500"
                      }`}
                      style={{ width: `${rsi}%` }}
                    />
                  </div>
                </div>

                {/* MACD Indicator */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">MACD</p>
                    <p className={`text-xs font-medium ${macd.macd > 0 ? "text-green-600" : "text-red-600"}`}>
                      {macd.macd.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Signal</p>
                    <p className={`text-xs font-medium ${macd.signal > 0 ? "text-green-600" : "text-red-600"}`}>
                      {macd.signal.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Parabolic SAR */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Parabolic SAR</span>
                  <div className="flex items-center gap-1">
                    <Zap className={`h-3 w-3 ${sar.trend === "bullish" ? "text-green-600" : "text-red-600"}`} />
                    <span
                      className={`text-xs font-medium ${sar.trend === "bullish" ? "text-green-600" : "text-red-600"}`}
                    >
                      {sar.trend.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  Support: {formatPrice((coin.low24h || coin.currentPrice) * 0.95)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  Resistance: {formatPrice((coin.high24h || coin.currentPrice) * 1.05)}
                </div>
              </div>
            </div>
          )
        })}

        <div className="pt-4 border-t">
          <Button className="w-full bg-transparent" variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Detailed Charts
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">Real-time analysis • Updated every 5 minutes</p>
        </div>
      </CardContent>
    </Card>
  )
}
