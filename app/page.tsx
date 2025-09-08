import { Suspense } from "react"
import { NewsGrid } from "@/components/news-grid"
import { AdBanner } from "@/components/ad-banner"
import { TokenAds } from "@/components/token-ads"
import { Hero } from "@/components/hero"
import { AdvancedMarketAnalysis } from "@/components/advanced-market-analysis"
import { PriceTicker } from "@/components/price-ticker"
import Exchange from "@/components/exchange"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Button to go to the Exchange */}
      <div className="flex justify-center mt-6 mb-4">
        <a
          href="https://www.cryptoico.eu/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
        >
          Go to Exchange
        </a>
      </div>

      <Suspense fallback={<div className="h-12 bg-muted animate-pulse" />}>
        <PriceTicker />
      </Suspense>

      {/* Exchange Section */}
      <div className="container mx-auto px-4 py-6">
        <Exchange />
      </div>

      {/* Top Banner Ad Space */}
      <div className="container mx-auto px-4 py-4">
        <Suspense fallback={<div className="h-24 bg-muted animate-pulse rounded-lg" />}>
          <AdBanner position="top" />
        </Suspense>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main News Content */}
          <div className="lg:col-span-3">
            <Suspense fallback={
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            }>
              <NewsGrid />
            </Suspense>
          </div>

          {/* Sidebar with Token Ads */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <AdvancedMarketAnalysis />
              </Suspense>
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <TokenAds />
              </Suspense>
              {/* Side Banner Ad */}
              <Suspense fallback={<div className="h-24 bg-muted animate-pulse rounded-lg" />}>
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
