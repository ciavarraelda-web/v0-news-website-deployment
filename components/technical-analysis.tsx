import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3, Activity, Target } from "lucide-react"
import Image from "next/image"

async function getTechnicalAnalysis() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
    console.log("[v0] Fetching technical analysis from:", `${baseUrl}/api/crypto-data`)

    const response = await fetch(`${baseUrl}/api/crypto-data`, {
      next: { revalidate: 300 },
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Technical analysis response status:", response.status)

    if (!response.ok) {
      console.error("[v0] Failed to fetch technical analysis data:", response.statusText)
      throw new Error(`Failed to fetch technical analysis data: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Technical analysis data received:", data.markets?.length || 0, "coins")
    return data.markets?.slice(0, 5) || []
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
        sparklineIn7d: [42000, 42500, 43000, 43250, 43100, 43300, 43250],
        low24h: 42800,
        high24h: 43500,
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        currentPrice: 2650,
        priceChangePercentage24h: -1.2,
        priceChangePercentage7d: 5.8,
        image: "/ethereum-abstract.png",
        sparklineIn7d: [2600, 2620, 2640, 2650, 2630, 2660, 2650],
        low24h: 2620,
        high24h: 2680,
      },
    ]
  }
}

function calculateRSI(prices: number[]) {
  if (prices.length < 14) return 50

  let gains = 0
  let losses = 0

  for (let i = 1; i < 15; i++) {
    const change = prices[i] - prices[i - 1]
    if (change > 0) gains += change
    else losses -= change
  }

  const avgGain = gains / 14
  const avgLoss = losses / 14
  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

function getTechnicalSignal(coin: any) {
  const rsi = calculateRSI(coin.sparklineIn7d || [])
  const priceChange24h = coin.priceChangePercentage24h || 0
  const priceChange7d = coin.priceChangePercentage7d || 0

  if (rsi > 70 && priceChange24h > 5) return { signal: "SELL", color: "text-red-600", bg: "bg-red-100" }
  if (rsi < 30 && priceChange24h < -5) return { signal: "BUY", color: "text-green-600", bg: "bg-green-100" }
  if (priceChange7d > 10) return { signal: "STRONG BUY", color: "text-green-700", bg: "bg-green-200" }
  if (priceChange7d < -10) return { signal: "STRONG SELL", color: "text-red-700", bg: "bg-red-200" }
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
          Technical Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">AI-powered trading signals and market indicators</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {coins.map((coin: any) => {
          const rsi = calculateRSI(coin.sparklineIn7d || [])
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

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-semibold">{formatPrice(coin.currentPrice)}</p>
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
              </div>

              <div className="space-y-2">
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
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      rsi > 70 ? "bg-red-500" : rsi < 30 ? "bg-green-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${rsi}%` }}
                  />
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
            View Full Analysis
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">Updated every 5 minutes</p>
        </div>
      </CardContent>
    </Card>
  )
}
