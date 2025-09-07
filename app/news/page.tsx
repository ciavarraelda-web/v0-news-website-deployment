import { NewsGrid } from "@/components/news-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"

// ✅ Revalidate every 60 seconds for fresh content
export const revalidate = 60

// ✅ SEO Metadata
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
    images: [
      {
        url: "https://yourdomain.com/og-news.jpg",
        width: 1200,
        height: 630,
        alt: "Cryptocurrency News",
      },
    ],
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
  // ✅ JSON-LD Schema (Google can recognize this as a collection of news articles)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cryptocurrency News",
    description:
      "Stay updated with the latest cryptocurrency news, market analysis, regulations, and blockchain innovations.",
    url: "https://yourdomain.com/news",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Cryptocurrency News</h1>
        <p className="text-lg text-muted-foreground">
          Stay updated with the latest developments in the cryptocurrency world
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <NewsGrid />
        </div>

        {/* Sidebar: Categories */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="w-full justify-start">
                Bitcoin
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                Ethereum
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                DeFi
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                NFTs
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                Regulation
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
