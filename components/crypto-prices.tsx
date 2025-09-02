import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import Image from "next/image"

async function getCryptoPrices() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/crypto-data`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch crypto prices")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching crypto prices:", error)
    return { markets: [], prices: [] }
  }
}

function formatPrice(price: number) {
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 100) return `$${price.toFixed(2)}`
  return `$${price.toLocaleString()}`
}

function formatMarketCap(marketCap: number) {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
  return `$${marketCap.toLocaleString()}`
}

export async function CryptoPrices() {
  const data = await getCryptoPrices()
  const topCoins = data.markets?.slice(0, 10) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Live Crypto Prices
        </CardTitle>
        <p className="text-sm text-muted-foreground">Real-time cryptocurrency market data</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topCoins.map((coin: any) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={coin.image || "/placeholder.svg"}
                    alt={`${coin.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <Badge variant="outline" className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4 bg-background">
                    {coin.marketCapRank}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{coin.name}</span>
                    <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatMarketCap(coin.marketCap)}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold">{formatPrice(coin.currentPrice)}</div>
                <div
                  className={`flex items-center gap-1 text-xs ${
                    coin.priceChangePercentage24h >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {coin.priceChangePercentage24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(coin.priceChangePercentage24h).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Last updated: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
