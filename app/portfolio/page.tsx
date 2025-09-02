import { Suspense } from "react"
import { Watchlist } from "@/components/watchlist"
import { PortfolioTracker } from "@/components/portfolio-tracker"
import { CryptoPrices } from "@/components/crypto-prices"
import { AdBanner } from "@/components/ad-banner"
import { PriceTicker } from "@/components/price-ticker"
import { TrendingUp, Star, PieChart } from "lucide-react"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Portfolio & Watchlist</h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 text-pretty">
              Track your crypto investments and monitor your favorite cryptocurrencies in real-time
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <PieChart className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Portfolio Tracking</h3>
                <p className="text-sm text-green-100">Monitor your holdings and P&L in real-time</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Star className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Custom Watchlist</h3>
                <p className="text-sm text-green-100">Track your favorite cryptocurrencies</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Live Price Updates</h3>
                <p className="text-sm text-green-100">Real-time price data updated every minute</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Ticker */}
      <Suspense fallback={<div className="h-12 bg-muted animate-pulse" />}>
        <PriceTicker />
      </Suspense>

      {/* Top Banner Ad */}
      <div className="container mx-auto px-4 py-4">
        <Suspense fallback={<div className="h-24 bg-muted animate-pulse rounded-lg" />}>
          <AdBanner position="top" />
        </Suspense>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Portfolio Content */}
          <div className="lg:col-span-2 space-y-8">
            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
              <PortfolioTracker />
            </Suspense>

            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
              <Watchlist />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <CryptoPrices />
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
