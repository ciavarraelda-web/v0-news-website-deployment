import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchFilters } from "@/components/search-filters"
import { InfiniteNewsGrid } from "@/components/infinite-news-grid"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Cryptocurrency News | Latest Updates and Market Insights",
  description:
    "Stay updated with the latest cryptocurrency news, market analysis, regulations, and blockchain innovations.",
  openGraph: {
    title: "Cryptocurrency News | Latest Updates and Market Insights",
    description:
      "Stay updated with the latest cryptocurrency news, market analysis, regulations, and blockchain innovations.",
    url: "https://yourdomain.com/news",
    type: "website",
    images: [{ url: "https://yourdomain.com/og-news.jpg", width: 1200, height: 630, alt: "Cryptocurrency News" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cryptocurrency News | Latest Updates and Market Insights",
    description:
      "Stay updated with the latest cryptocurrency news, market analysis, regulations, and blockchain innovations.",
    images: ["https://yourdomain.com/og-news.jpg"],
  },
}

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Cryptocurrency News</h1>
        <p className="text-lg text-muted-foreground">
          Stay updated with the latest developments in the cryptocurrency world
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main grid */}
        <div className="lg:col-span-3">
          <InfiniteNewsGrid />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search & Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilters />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
