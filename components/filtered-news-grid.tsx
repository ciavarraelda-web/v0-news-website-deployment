import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Wifi, WifiOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

async function getFilteredNews(filter?: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

    const response = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 300 },
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`)
    }

    const data = await response.json()

    let articles = data.articles || []
    if (filter) {
      articles = articles.filter(
        (article: any) =>
          article.category === filter ||
          article.title.toLowerCase().includes(filter.toLowerCase()) ||
          article.description.toLowerCase().includes(filter.toLowerCase()),
      )
    }

    return { ...data, articles }
  } catch (error) {
    console.error("Error fetching filtered news:", error)
    return {
      articles: [],
      totalResults: 0,
      fallback: true,
      lastUpdated: new Date().toISOString(),
    }
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  return `${Math.floor(diffInHours / 24)}d ago`
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

interface NewsGridProps {
  filter?: string
}

export async function NewsGrid({ filter }: NewsGridProps) {
  const newsData = await getFilteredNews(filter)
  const { articles, totalResults, fallback, lastUpdated } = newsData

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">{filter ? `${filter} News` : "Latest Crypto News"}</h2>
        <div className="flex items-center gap-2">
          {fallback ? (
            <Badge variant="outline" className="text-sm flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Offline Mode
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-sm flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Live Updates
            </Badge>
          )}
        </div>
      </div>

      {lastUpdated && (
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          {totalResults > 0 && ` • ${totalResults} articles`}
        </div>
      )}

      {articles.length === 0 ? (
        <Card className="p-8 text-center">
          <WifiOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No News Available</h3>
          <p className="text-muted-foreground">
            {filter ? `No ${filter} news found at the moment.` : "Unable to load crypto news at the moment."} Please try
            again later.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article: any) => (
            <Card key={article.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={`/article/${article.id}`}>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={
                        article.image ||
                        `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(article.category + " crypto news")}`
                      }
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(article.category + " cryptocurrency")}`
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getCategoryColor(article.category)} border-0`}>{article.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{article.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatTimeAgo(article.publishedAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{article.source}</span>
                    </div>
                  </div>
                  {article.author && <div className="mt-2 text-xs text-muted-foreground">By {article.author}</div>}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
