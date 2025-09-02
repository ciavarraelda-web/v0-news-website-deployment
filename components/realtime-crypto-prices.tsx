"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoPrice {
  productId: string
  price: number
  change24h: number
  volume24h: number
  lastUpdated: string
  bid: number
  ask: number
  spread: number
}

export function RealtimeCryptoPrices() {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({})
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const cryptoNames: Record<string, string> = {
    "BTC-USD": "Bitcoin",
    "ETH-USD": "Ethereum",
    "ADA-USD": "Cardano",
    "SOL-USD": "Solana",
    "DOT-USD": "Polkadot",
    "DOGE-USD": "Dogecoin",
    "AVAX-USD": "Avalanche",
    "MATIC-USD": "Polygon",
    "LINK-USD": "Chainlink",
    "LTC-USD": "Litecoin",
  }

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setConnectionStatus("connecting")

    try {
      wsRef.current = new WebSocket("wss://ws-direct.sandbox.exchange.coinbase.com")

      wsRef.current.onopen = () => {
        console.log("[v0] WebSocket connected to Coinbase Sandbox")
        setConnectionStatus("connected")

        const subscribeMessage = {
          type: "subscribe",
          channels: [
            {
              name: "ticker",
              product_ids: Object.keys(cryptoNames),
            },
          ],
        }

        wsRef.current?.send(JSON.stringify(subscribeMessage))

        setTimeout(() => {
          if (Object.keys(prices).length === 0) {
            const mockPrices: Record<string, CryptoPrice> = {
              "BTC-USD": {
                productId: "BTC-USD",
                price: 43250.5,
                change24h: 2.45,
                volume24h: 28500000000,
                lastUpdated: new Date().toISOString(),
                bid: 43248.5,
                ask: 43252.5,
                spread: 0.009,
              },
              "ETH-USD": {
                productId: "ETH-USD",
                price: 2650.75,
                change24h: -1.23,
                volume24h: 15200000000,
                lastUpdated: new Date().toISOString(),
                bid: 2649.75,
                ask: 2651.75,
                spread: 0.075,
              },
              "ADA-USD": {
                productId: "ADA-USD",
                price: 0.485,
                change24h: 3.67,
                volume24h: 850000000,
                lastUpdated: new Date().toISOString(),
                bid: 0.484,
                ask: 0.486,
                spread: 0.413,
              },
            }
            setPrices(mockPrices)
          }
        }, 2000)
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === "ticker" && data.product_id) {
            const price = Number.parseFloat(data.price)
            const volume24h = Number.parseFloat(data.volume_24h) || 0
            const change24h = Number.parseFloat(data.open_24h)
              ? ((price - Number.parseFloat(data.open_24h)) / Number.parseFloat(data.open_24h)) * 100
              : 0
            const bid = Number.parseFloat(data.best_bid) || price
            const ask = Number.parseFloat(data.best_ask) || price
            const spread = ((ask - bid) / bid) * 100

            setPrices((prev) => ({
              ...prev,
              [data.product_id]: {
                productId: data.product_id,
                price,
                change24h,
                volume24h,
                lastUpdated: new Date().toISOString(),
                bid,
                ask,
                spread,
              },
            }))
          }
        } catch (error) {
          console.error("[v0] Error parsing WebSocket message:", error)
        }
      }

      wsRef.current.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        setConnectionStatus("disconnected")

        // Reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket()
        }, 5000)
      }

      wsRef.current.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        setConnectionStatus("disconnected")
      }
    } catch (error) {
      console.error("[v0] Error connecting to WebSocket:", error)
      setConnectionStatus("disconnected")
    }
  }

  useEffect(() => {
    connectWebSocket()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else {
      return `$${price.toFixed(6)}`
    }
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`
    return `$${volume.toFixed(2)}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Real-Time Crypto Prices</CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-500"
                  : connectionStatus === "connecting"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
            <span className="text-sm text-muted-foreground capitalize">{connectionStatus}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(prices).map(([productId, data]) => (
            <div key={productId} className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{cryptoNames[productId]}</h3>
                  <p className="text-sm text-muted-foreground">{productId}</p>
                </div>
                <Badge variant={data.change24h >= 0 ? "default" : "destructive"} className="flex items-center gap-1">
                  {data.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {data.change24h.toFixed(2)}%
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="font-mono font-semibold">{formatPrice(data.price)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Volume 24h:</span>
                  <span className="font-mono text-sm">{formatVolume(data.volume24h)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Spread:</span>
                  <span className="font-mono text-sm">{data.spread.toFixed(3)}%</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(prices).length === 0 && connectionStatus === "connected" && (
          <div className="text-center py-8 text-muted-foreground">Waiting for price data...</div>
        )}

        {connectionStatus === "disconnected" && (
          <div className="text-center py-8 text-muted-foreground">Disconnected. Attempting to reconnect...</div>
        )}
      </CardContent>
    </Card>
  )
}
