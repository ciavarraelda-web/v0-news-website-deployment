import { Suspense } from "react"
import { TechnicalAnalysis } from "@/components/technical-analysis"
import { AdvancedMarketAnalysis } from "@/components/advanced-market-analysis"
import { AIAnalysis } from "@/components/ai-analysis"
import { AdBanner } from "@/components/ad-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Activity, Brain } from "lucide-react"

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Advanced Market Analysis</h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 text-pretty">
              AI-powered analysis across Crypto, Forex, and Stocks with advanced technical indicators and smart trading
              signals
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Brain className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">AI Trading Signals</h3>
                <p className="text-sm text-purple-100">Smart BUY/SELL/HOLD signals across all markets</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Multi-Market Analysis</h3>
                <p className="text-sm text-purple-100">Crypto, Forex, and Stocks in one platform</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Activity className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Real-time Updates</h3>
                <p className="text-sm text-purple-100">Live market analysis updated every 30 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner Ad */}
      <div className="container mx-auto px-4 py-4">
        <Suspense fallback={<div className="h-24 bg-muted animate-pulse rounded-lg" />}>
          <AdBanner position="top" />
        </Suspense>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Live Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">72%</p>
                    <p className="text-sm text-muted-foreground">Market Sentiment</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">$2.1T</p>
                    <p className="text-sm text-muted-foreground">Total Market Cap</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">45.2%</p>
                    <p className="text-sm text-muted-foreground">BTC Dominance</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">$89B</p>
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Analysis */}
            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
              <TechnicalAnalysis />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <AIAnalysis />
              </Suspense>

              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <AdvancedMarketAnalysis />
              </Suspense>

              <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <AdBanner position="sidebar" />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner Ad */}
      <div className="container mx-auto px-4 py-4">
        <Suspense fallback={<div className="h-24 bg-muted animate-pulse rounded-lg" />}>
          <AdBanner position="bottom" />
        </Suspense>
      </div>
    </div>
  )
}
