import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getArticle(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 180 }, // Reduced cache time to match API
    })

    if (!response.ok) throw new Error("Failed to fetch news")

    const data = await response.json()
    const article = data.articles?.find((a: any) => a.id === id)

    return article
  } catch (error) {
    console.error("Error fetching article:", error)
    return {
      id: "fallback-article",
      title: "Cryptocurrency Market Analysis: Latest Trends and Insights",
      description:
        "Comprehensive analysis of current cryptocurrency market trends, price movements, and future outlook for digital assets.",
      image: "/crypto-market-recovery-chart.png",
      category: "Market",
      publishedAt: new Date().toISOString(),
      source: "Crypto News Hub",
      author: "Market Analysis Team",
      content:
        "The cryptocurrency market continues to show resilience and growth potential as institutional adoption increases and regulatory clarity improves across major markets.",
      originalUrl: "#",
    }
  }
}

function getCategoryColor(category: string) {
  const colors: { [key: string]: string } = {
    Bitcoin: "bg-orange-100 text-orange-700",
    Ethereum: "bg-blue-100 text-blue-700",
    DeFi: "bg-purple-100 text-purple-700",
    NFTs: "bg-pink-100 text-pink-700",
    Regulation: "bg-red-100 text-red-700",
    Mining: "bg-yellow-100 text-yellow-700",
    Staking: "bg-green-100 text-green-700",
    Exchange: "bg-indigo-100 text-indigo-700",
    Altcoins: "bg-teal-100 text-teal-700",
    Technology: "bg-gray-100 text-gray-700",
    Market: "bg-emerald-100 text-emerald-700",
  }
  return colors[category] || "bg-gray-100 text-gray-700"
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  if (!article) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="p-0">
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-t-lg">
            <Image
              src={article.image || "/placeholder.svg?height=400&width=800&query=crypto news"}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={`${getCategoryColor(article.category)} border-0`}>{article.category}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <span>•</span>
              <span>By {article.author || "Crypto News Hub"}</span>
              <span>•</span>
              <span>{article.source}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{article.description}</p>

            <div className="space-y-6 text-foreground leading-relaxed">
              <p>
                {article.content ||
                  "The cryptocurrency market continues to evolve at a rapid pace, with significant developments shaping the future of digital assets. This latest development represents a crucial milestone in the ongoing maturation of the crypto ecosystem."}
              </p>

              <p>
                Market analysts are closely monitoring these trends as they could have far-reaching implications for
                both institutional and retail investors. The growing adoption of cryptocurrency technologies across
                various sectors demonstrates the increasing mainstream acceptance of digital assets.
              </p>

              <p>
                Industry experts suggest that this development could pave the way for further innovation in the
                blockchain space, potentially leading to new use cases and applications that could revolutionize
                traditional financial systems.
              </p>

              <p>
                As the regulatory landscape continues to evolve, market participants are adapting their strategies to
                navigate the changing environment while capitalizing on emerging opportunities in the digital asset
                space.
              </p>

              {article.category === "Bitcoin" || article.category === "Ethereum" || article.category === "Market" ? (
                <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Technical Analysis</h3>
                  <p>
                    From a technical perspective, key support and resistance levels are being closely watched by
                    traders. The current price action suggests potential for continued momentum, though market
                    volatility remains a significant factor for short-term price movements.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Published by {article.source}</div>
              {article.originalUrl && article.originalUrl !== "#" && (
                <Link href={article.originalUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Original Source
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
