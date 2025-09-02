"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, StarOff, Search, Plus, TrendingUp, TrendingDown, X } from "lucide-react"
import Image from "next/image"

interface WatchlistCoin {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  priceChangePercentage24h: number
  marketCap: number
  addedAt: string
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

export function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistCoin[]>([])
  const [availableCoins, setAvailableCoins] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCoin, setShowAddCoin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("crypto-watchlist")
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }
    setIsLoading(false)
  }, [])

  // Fetch available coins for search
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch("/api/crypto-data")
        if (response.ok) {
          const data = await response.json()
          setAvailableCoins(data.markets || [])
        }
      } catch (error) {
        console.error("Error fetching coins:", error)
      }
    }

    fetchCoins()
  }, [])

  // Update watchlist prices
  useEffect(() => {
    if (watchlist.length === 0) return

    const updatePrices = async () => {
      try {
        const response = await fetch("/api/crypto-data")
        if (response.ok) {
          const data = await response.json()
          const markets = data.markets || []

          const updatedWatchlist = watchlist.map((watchedCoin) => {
            const marketData = markets.find((coin: any) => coin.id === watchedCoin.id)
            if (marketData) {
              return {
                ...watchedCoin,
                currentPrice: marketData.currentPrice,
                priceChangePercentage24h: marketData.priceChangePercentage24h,
                marketCap: marketData.marketCap,
              }
            }
            return watchedCoin
          })

          setWatchlist(updatedWatchlist)
          localStorage.setItem("crypto-watchlist", JSON.stringify(updatedWatchlist))
        }
      } catch (error) {
        console.error("Error updating watchlist prices:", error)
      }
    }

    updatePrices()
    const interval = setInterval(updatePrices, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [watchlist.length])

  const addToWatchlist = (coin: any) => {
    const newWatchlistItem: WatchlistCoin = {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      currentPrice: coin.currentPrice,
      priceChangePercentage24h: coin.priceChangePercentage24h,
      marketCap: coin.marketCap,
      addedAt: new Date().toISOString(),
    }

    const updatedWatchlist = [...watchlist, newWatchlistItem]
    setWatchlist(updatedWatchlist)
    localStorage.setItem("crypto-watchlist", JSON.stringify(updatedWatchlist))
    setShowAddCoin(false)
    setSearchTerm("")
  }

  const removeFromWatchlist = (coinId: string) => {
    const updatedWatchlist = watchlist.filter((coin) => coin.id !== coinId)
    setWatchlist(updatedWatchlist)
    localStorage.setItem("crypto-watchlist", JSON.stringify(updatedWatchlist))
  }

  const isInWatchlist = (coinId: string) => {
    return watchlist.some((coin) => coin.id === coinId)
  }

  const filteredCoins = availableCoins.filter(
    (coin) =>
      (coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !isInWatchlist(coin.id),
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            My Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            My Watchlist
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowAddCoin(!showAddCoin)}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Track your favorite cryptocurrencies</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddCoin && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" variant="ghost" onClick={() => setShowAddCoin(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {searchTerm && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredCoins.slice(0, 5).map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => addToWatchlist(coin)}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={coin.image || "/placeholder.svg"}
                        alt={coin.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-sm">{coin.name}</div>
                        <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {watchlist.length === 0 ? (
          <div className="text-center py-8">
            <StarOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No coins in watchlist</h3>
            <p className="text-muted-foreground mb-4">Add cryptocurrencies to track their prices</p>
            <Button onClick={() => setShowAddCoin(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Coin
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlist.map((coin) => (
              <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Image
                    src={coin.image || "/placeholder.svg"}
                    alt={coin.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{coin.name}</span>
                      <Badge variant="outline" className="text-xs uppercase">
                        {coin.symbol}
                      </Badge>
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

                <Button size="sm" variant="ghost" onClick={() => removeFromWatchlist(coin.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {watchlist.length > 0 && (
          <div className="pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Tracking {watchlist.length} coin{watchlist.length !== 1 ? "s" : ""} • Updates every minute
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
