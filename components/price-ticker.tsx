"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TickerCoin {
  id: string
  symbol: string
  name: string
  currentPrice: number
  priceChangePercentage24h: number
}

function formatPrice(price: number) {
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 100) return `$${price.toFixed(2)}`
  return `$${price.toLocaleString()}`
}

export function PriceTicker() {
  const [coins, setCoins] = useState<TickerCoin[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("/api/crypto-data")
        if (response.ok) {
          const data = await response.json()
          const topCoins = data.markets?.slice(0, 8) || []
          setCoins(topCoins)
        }
      } catch (error) {
        console.error("Error fetching ticker prices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-muted/50 border-y">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center space-x-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-16 h-4 bg-muted rounded" />
                <div className="w-12 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted/50 border-y overflow-hidden">
      <div className="container mx-auto px-4 py-2">
        <div className="flex animate-scroll space-x-8">
          {coins.concat(coins).map((coin, index) => (
            <div key={`${coin.id}-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
              <span className="font-semibold text-sm">{coin.symbol}</span>
              <span className="text-sm">{formatPrice(coin.currentPrice)}</span>
              <div
                className={`flex items-center text-xs ${
                  coin.priceChangePercentage24h >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {coin.priceChangePercentage24h >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(coin.priceChangePercentage24h).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
