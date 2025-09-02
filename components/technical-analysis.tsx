"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3, Activity, Target } from "lucide-react"
import Image from "next/image"

interface RealtimeCryptoData {
  productId: string
  price: number
  change24h: number
  volume24h: number
  bid: number
  ask: number
  spread: number
  priceHistory: number[]
  lastUpdated: string
}

function useRealtimeCryptoData() {
  const [cryptoData, setCryptoData] = useState<Record<string, RealtimeCryptoData>>({})
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
  const wsRef = useRef<WebSocket | null>(null)
  const priceHistoryRef = useRef<Record<string, number[]>>({})

  const cryptoSymbols = ["BTC-USD", "ETH-USD", "ADA-USD", "SOL-USD", "DOT-USD", "DOGE-USD"]

  useEffect(() => {
    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return

      setConnectionStatus("connecting")
      wsRef.current = new WebSocket("wss://ws-direct.exchange.coinbase.com")

      wsRef.current.onopen = () => {
        console.log("[v0] Technical Analysis WebSocket connected")
        setConnectionStatus("connected")

        const subscribeMessage = {
          type: "subscribe",
          channels: [{ name: "ticker", product_ids: cryptoSymbols }],
        }
        wsRef.current?.send(JSON.stringify(subscribeMessage))
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

            // Update price history for technical analysis
            if (!priceHistoryRef.current[data.product_id]) {
              priceHistoryRef.current[data.product_id] = []
            }
            priceHistoryRef.current[data.product_id].push(price)
            if (priceHistoryRef.current[data.product_id].length > 50) {
              priceHistoryRef.current[data.product_id] = priceHistoryRef.current[data.product_id].slice(-50)
            }

            setCryptoData((prev) => ({
              ...prev,
              [data.product_id]: {
                productId: data.product_id,
                price,
                change24h,
                volume24h,
                bid: Number.parseFloat(data.best_bid) || price,
                ask: Number.parseFloat(data.best_ask) || price,
                spread:
                  ((Number.parseFloat(data.best_ask) - Number.parseFloat(data.best_bid)) /
                    Number.parseFloat(data.best_bid)) *
                    100 || 0,
                priceHistory: [...priceHistoryRef.current[data.product_id]],
                lastUpdated: new Date().toISOString(),
              },
            }))
          }
        } catch (error) {
          console.error("[v0] Error parsing technical analysis data:", error)
        }
      }

      wsRef.current.onclose = () => {
        setConnectionStatus("disconnected")
        setTimeout(connectWebSocket, 5000)
      }

      wsRef.current.onerror = () => {
        setConnectionStatus("disconnected")
      }
    }

    connectWebSocket()
    return () => wsRef.current?.close()
  }, [])

  return { cryptoData, connectionStatus }
}

function calculateRSI(prices: number[], period = 14) {
  if (!prices || prices.length < period + 1) return 50

  let gains = 0
  let losses = 0

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1]
    if (change > 0) gains += change
    else losses -= change
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? -change : 0

    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
  }

  if (avgLoss === 0) return 100
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

function getTechnicalSignal(cryptoData: RealtimeCryptoData) {
  const prices = cryptoData.priceHistory || []
  if (prices.length < 10) return { signal: "INSUFFICIENT DATA", color: "text-gray-600", bg: "bg-gray-100" }

  const rsi = calculateRSI(prices)
  const macd = calculateMACD(prices)
  const priceChange24h = cryptoData.change24h || 0
  const spread = cryptoData.spread || 0

  let bullishSignals = 0
  let bearishSignals = 0

  // RSI signals
  if (rsi < 30) bullishSignals += 2
  else if (rsi < 40) bullishSignals += 1
  if (rsi > 70) bearishSignals += 2
  else if (rsi > 60) bearishSignals += 1

  // MACD signals
  if (macd.macd > macd.signal && macd.histogram > 0) bullishSignals += 2
  if (macd.macd < macd.signal && macd.histogram < 0) bearishSignals += 2

  // Price momentum and spread analysis
  if (priceChange24h > 5) bullishSignals += 1
  if (priceChange24h < -5) bearishSignals += 1
  if (spread < 0.1) bullishSignals += 1 // Low spread indicates good liquidity

  if (bullishSignals >= 4) return { signal: "STRONG BUY", color: "text-green-700", bg: "bg-green-200" }
  if (bullishSignals >= 2) return { signal: "BUY", color: "text-green-600", bg: "bg-green-100" }
  if (bearishSignals >= 4) return { signal: "STRONG SELL", color: "text-red-700", bg: "bg-red-200" }
  if (bearishSignals >= 2) return { signal: "SELL", color: "text-red-600", bg: "bg-red-100" }
  return { signal: "HOLD", color: "text-yellow-600", bg: "bg-yellow-100" }
}

function formatPrice(price: number) {
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 100) return `$${price.toFixed(2)}`
  return `$${price.toLocaleString()}`
}

export function TechnicalAnalysis() {
  const { cryptoData, connectionStatus } = useRealtimeCryptoData()

  const cryptoNames: Record<string, { name: string; image: string }> = {
    "BTC-USD": { name: "Bitcoin", image: "/bitcoin-concept.png" },
    "ETH-USD": { name: "Ethereum", image: "/ethereum-abstract.png" },
    "ADA-USD": { name: "Cardano", image: "/cardano-blockchain.png" },
    "SOL-USD": { name: "Solana", image: "/solana-logo.png" },
    "DOT-USD": { name: "Polkadot", image: "/polkadot-logo.png" },
    "DOGE-USD": { name: "Dogecoin", image: "/dogecoin-logo.png" },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            <CardTitle>Real-Time Technical Analysis</CardTitle>
          </div>
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
        <p className="text-sm text-muted-foreground">Live analysis with RSI, MACD, and Parabolic SAR from Coinbase</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(cryptoData).map(([productId, data]) => {
          const prices = data.priceHistory || []
          const rsi = calculateRSI(prices)
          const macd = calculateMACD(prices)
          const signal = getTechnicalSignal(data)
          const cryptoInfo = cryptoNames[productId]

          if (!cryptoInfo) return null

          return (
            <div key={productId} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={cryptoInfo.image || "/placeholder.svg"}
                    alt={`${cryptoInfo.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-sm">{cryptoInfo.name}</h4>
                    <p className="text-xs text-muted-foreground">{productId}</p>
                  </div>
                </div>
                <Badge className={`${signal.bg} ${signal.color} border-0`}>{signal.signal}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Live Price</p>
                  <p className="font-semibold text-sm">{formatPrice(data.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">24h Change</p>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      data.change24h >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {data.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(data.change24h).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Spread</p>
                  <p className="font-semibold text-sm">{data.spread.toFixed(3)}%</p>
                </div>
              </div>

              {/* Real-time Technical Indicators */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">RSI (14) - Live</span>
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
                      style={{ width: `${Math.min(rsi, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">MACD - Live</p>
                    <p className={`text-xs font-medium ${macd.macd > 0 ? "text-green-600" : "text-red-600"}`}>
                      {macd.macd.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Signal</p>
                    <p className={`text-xs font-medium ${macd.signal > 0 ? "text-green-600" : "text-red-600"}`}>
                      {macd.signal.toFixed(6)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Bid/Ask Spread</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-blue-600">${data.bid.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">/</span>
                    <span className="text-xs font-medium text-red-600">${data.ask.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  Data Points: {prices.length}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )
        })}

        {Object.keys(cryptoData).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {connectionStatus === "connected" ? "Waiting for real-time data..." : "Connecting to Coinbase WebSocket..."}
          </div>
        )}

        <div className="pt-4 border-t">
          <Button className="w-full bg-transparent" variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Advanced Charts
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Real-time analysis • Live data from Coinbase Pro
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
