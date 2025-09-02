"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PieChart, TrendingUp, TrendingDown, Plus, X, Wallet } from "lucide-react"
import Image from "next/image"

interface PortfolioHolding {
  id: string
  symbol: string
  name: string
  image: string
  amount: number
  averagePrice: number
  currentPrice: number
  priceChangePercentage24h: number
  addedAt: string
}

function formatPrice(price: number) {
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 100) return `$${price.toFixed(2)}`
  return `$${price.toLocaleString()}`
}

export function PortfolioTracker() {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([])
  const [availableCoins, setAvailableCoins] = useState<any[]>([])
  const [showAddHolding, setShowAddHolding] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [averagePrice, setAveragePrice] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load portfolio from localStorage
  useEffect(() => {
    const savedPortfolio = localStorage.getItem("crypto-portfolio")
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio))
    }
    setIsLoading(false)
  }, [])

  // Fetch available coins
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

  // Update portfolio prices
  useEffect(() => {
    if (portfolio.length === 0) return

    const updatePrices = async () => {
      try {
        const response = await fetch("/api/crypto-data")
        if (response.ok) {
          const data = await response.json()
          const markets = data.markets || []

          const updatedPortfolio = portfolio.map((holding) => {
            const marketData = markets.find((coin: any) => coin.id === holding.id)
            if (marketData) {
              return {
                ...holding,
                currentPrice: marketData.currentPrice,
                priceChangePercentage24h: marketData.priceChangePercentage24h,
              }
            }
            return holding
          })

          setPortfolio(updatedPortfolio)
          localStorage.setItem("crypto-portfolio", JSON.stringify(updatedPortfolio))
        }
      } catch (error) {
        console.error("Error updating portfolio prices:", error)
      }
    }

    updatePrices()
    const interval = setInterval(updatePrices, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [portfolio.length])

  const addHolding = () => {
    if (!selectedCoin || !amount || !averagePrice) return

    const newHolding: PortfolioHolding = {
      id: selectedCoin.id,
      symbol: selectedCoin.symbol,
      name: selectedCoin.name,
      image: selectedCoin.image,
      amount: Number.parseFloat(amount),
      averagePrice: Number.parseFloat(averagePrice),
      currentPrice: selectedCoin.currentPrice,
      priceChangePercentage24h: selectedCoin.priceChangePercentage24h,
      addedAt: new Date().toISOString(),
    }

    const updatedPortfolio = [...portfolio, newHolding]
    setPortfolio(updatedPortfolio)
    localStorage.setItem("crypto-portfolio", JSON.stringify(updatedPortfolio))

    // Reset form
    setSelectedCoin(null)
    setAmount("")
    setAveragePrice("")
    setShowAddHolding(false)
  }

  const removeHolding = (holdingId: string) => {
    const updatedPortfolio = portfolio.filter((holding) => holding.id !== holdingId)
    setPortfolio(updatedPortfolio)
    localStorage.setItem("crypto-portfolio", JSON.stringify(updatedPortfolio))
  }

  const calculatePortfolioStats = () => {
    const totalValue = portfolio.reduce((sum, holding) => sum + holding.amount * holding.currentPrice, 0)
    const totalCost = portfolio.reduce((sum, holding) => sum + holding.amount * holding.averagePrice, 0)
    const totalPnL = totalValue - totalCost
    const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0

    return { totalValue, totalCost, totalPnL, totalPnLPercentage }
  }

  const stats = calculatePortfolioStats()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-green-500" />
            Portfolio Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-muted rounded-lg" />
            <div className="h-16 bg-muted rounded-lg" />
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
            <PieChart className="h-5 w-5 text-green-500" />
            Portfolio Tracker
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowAddHolding(!showAddHolding)}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Track your crypto investments</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Stats */}
        {portfolio.length > 0 && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-lg font-bold">{formatPrice(stats.totalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className={`text-lg font-bold ${stats.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.totalPnL >= 0 ? "+" : ""}
                {formatPrice(stats.totalPnL)} ({stats.totalPnLPercentage.toFixed(2)}%)
              </p>
            </div>
          </div>
        )}

        {/* Add Holding Form */}
        {showAddHolding && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Cryptocurrency</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedCoin?.id || ""}
                onChange={(e) => {
                  const coin = availableCoins.find((c) => c.id === e.target.value)
                  setSelectedCoin(coin)
                  setAveragePrice(coin?.currentPrice.toString() || "")
                }}
              >
                <option value="">Choose a cryptocurrency...</option>
                {availableCoins.slice(0, 20).map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="any"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Average Price</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={averagePrice}
                  onChange={(e) => setAveragePrice(e.target.value)}
                  step="any"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addHolding} disabled={!selectedCoin || !amount || !averagePrice}>
                Add Holding
              </Button>
              <Button variant="outline" onClick={() => setShowAddHolding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Portfolio Holdings */}
        {portfolio.length === 0 ? (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No holdings yet</h3>
            <p className="text-muted-foreground mb-4">Add your crypto holdings to track performance</p>
            <Button onClick={() => setShowAddHolding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Holding
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {portfolio.map((holding) => {
              const currentValue = holding.amount * holding.currentPrice
              const costBasis = holding.amount * holding.averagePrice
              const pnl = currentValue - costBasis
              const pnlPercentage = (pnl / costBasis) * 100

              return (
                <div key={`${holding.id}-${holding.addedAt}`} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={holding.image || "/placeholder.svg"}
                        alt={holding.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="font-semibold text-sm">{holding.name}</span>
                      <Badge variant="outline" className="text-xs uppercase">
                        {holding.symbol}
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => removeHolding(holding.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold">{holding.amount.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Value</p>
                      <p className="font-semibold">{formatPrice(currentValue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Price</p>
                      <p className="font-semibold">{formatPrice(holding.averagePrice)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">P&L</p>
                      <div className={`font-semibold ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                        <div className="flex items-center gap-1">
                          {pnl >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {pnl >= 0 ? "+" : ""}
                          {formatPrice(pnl)} ({pnlPercentage.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
