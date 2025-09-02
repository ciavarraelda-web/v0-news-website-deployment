"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Brain,
  Target,
  AlertTriangle,
  DollarSign,
  Activity,
  Zap,
} from "lucide-react"

interface MarketSignal {
  asset: string
  market: "crypto" | "forex" | "stocks"
  signal: "BUY" | "SELL" | "HOLD"
  strength: number
  price: number
  target: number
  stopLoss: number
  confidence: number
  reasoning: string
  timeframe: string
}

interface MarketOverview {
  sentiment: number
  volatility: number
  trend: "bullish" | "bearish" | "neutral"
  volume: number
  fearGreedIndex: number
}

export function AdvancedMarketAnalysis() {
  const [signals, setSignals] = useState<MarketSignal[]>([])
  const [overview, setOverview] = useState<MarketOverview | null>(null)
  const [activeTab, setActiveTab] = useState("crypto")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateMarketAnalysis = () => {
      const cryptoSignals: MarketSignal[] = [
        {
          asset: "BTC/USD",
          market: "crypto",
          signal: "BUY",
          strength: 85,
          price: 43250,
          target: 47500,
          stopLoss: 41000,
          confidence: 78,
          reasoning: "RSI oversold bounce + MACD bullish crossover + institutional accumulation",
          timeframe: "4H",
        },
        {
          asset: "ETH/USD",
          market: "crypto",
          signal: "HOLD",
          strength: 65,
          price: 2650,
          target: 2850,
          stopLoss: 2450,
          confidence: 72,
          reasoning: "Consolidation phase near resistance, awaiting breakout confirmation",
          timeframe: "1D",
        },
        {
          asset: "SOL/USD",
          market: "crypto",
          signal: "BUY",
          strength: 92,
          price: 98.5,
          target: 115,
          stopLoss: 88,
          confidence: 85,
          reasoning: "Strong ecosystem growth + DeFi TVL increase + technical breakout",
          timeframe: "4H",
        },
      ]

      const forexSignals: MarketSignal[] = [
        {
          asset: "EUR/USD",
          market: "forex",
          signal: "SELL",
          strength: 78,
          price: 1.0845,
          target: 1.072,
          stopLoss: 1.092,
          confidence: 74,
          reasoning: "ECB dovish stance + US dollar strength + technical resistance",
          timeframe: "1D",
        },
        {
          asset: "GBP/USD",
          market: "forex",
          signal: "BUY",
          strength: 71,
          price: 1.265,
          target: 1.285,
          stopLoss: 1.252,
          confidence: 69,
          reasoning: "UK inflation data positive + oversold conditions + support bounce",
          timeframe: "4H",
        },
      ]

      const stockSignals: MarketSignal[] = [
        {
          asset: "AAPL",
          market: "stocks",
          signal: "BUY",
          strength: 88,
          price: 185.5,
          target: 205.0,
          stopLoss: 175.0,
          confidence: 82,
          reasoning: "Strong earnings beat + AI integration momentum + technical breakout",
          timeframe: "1D",
        },
        {
          asset: "TSLA",
          market: "stocks",
          signal: "HOLD",
          strength: 55,
          price: 248.75,
          target: 275.0,
          stopLoss: 225.0,
          confidence: 61,
          reasoning: "Mixed delivery numbers + awaiting cybertruck production update",
          timeframe: "1W",
        },
      ]

      const allSignals = [...cryptoSignals, ...forexSignals, ...stockSignals]
      setSignals(allSignals)

      setOverview({
        sentiment: 72,
        volatility: 45,
        trend: "bullish",
        volume: 89,
        fearGreedIndex: 68,
      })

      setIsLoading(false)
    }

    generateMarketAnalysis()
    const interval = setInterval(generateMarketAnalysis, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "BUY":
        return "text-green-600 bg-green-50"
      case "SELL":
        return "text-red-600 bg-red-50"
      case "HOLD":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-green-600"
    if (strength >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredSignals = signals.filter((signal) => signal.market === activeTab)

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Advanced Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Advanced Market Analysis
          <Badge variant="secondary" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            Live AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Overview */}
        {overview && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Market Sentiment</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{overview.sentiment}%</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Fear & Greed</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{overview.fearGreedIndex}</div>
            </div>
          </div>
        )}

        {/* Market Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="forex">Forex</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {filteredSignals.map((signal, index) => (
              <div key={index} className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{signal.asset}</h3>
                    <Badge className={getSignalColor(signal.signal)}>
                      {signal.signal === "BUY" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {signal.signal === "SELL" && <TrendingDown className="h-3 w-3 mr-1" />}
                      {signal.signal === "HOLD" && <BarChart3 className="h-3 w-3 mr-1" />}
                      {signal.signal}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Strength</div>
                    <div className={`font-bold ${getStrengthColor(signal.strength)}`}>{signal.strength}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <div className="font-mono font-semibold">${signal.price.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target:</span>
                    <div className="font-mono font-semibold text-green-600">${signal.target.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stop Loss:</span>
                    <div className="font-mono font-semibold text-red-600">${signal.stopLoss.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timeframe:</span>
                    <div className="font-semibold">{signal.timeframe}</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">AI Analysis</span>
                    <Badge variant="outline" className="text-xs">
                      {signal.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{signal.reasoning}</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Powered by AI • Updates every 30 seconds</p>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            <DollarSign className="h-3 w-3 mr-1" />
            Get Premium Signals
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
