"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Wifi, WifiOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

export function NewsGrid() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fallback, setFallback] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news")
        const data = await res.json()
        setArticles(data.articles || [])
        setFallback(data.fallback || false)
        setLastUpdated(data.lastUpdated || null)
      } catch (err) {
        console.error("Errore fetch news:", err)
      } finally {
        setLoading(false)
      }
    }
    loadNews()
  }, [])

  if (loading) {
    return <p className="text-gray-500">Caricamento notizie...</p>
  }

  if (articles.length === 0) {
    return (
      <Card className="p-8 text-center">
        <WifiOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No News Available</h3>
        <p className="text-muted-foreground">
          Unable to load crypto news at the moment. Please try again later.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Latest Crypto News</h2>
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
          Last updated: {new Date(lastUpdated).toLocaleTimeString()} • {articles.length} articles
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={article.url} target="_blank">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={article.image || "/placeholder.svg?height=400&width=600&query=crypto news"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getCategoryColor(article.category)} border-0`}>
                      {article.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </CardTitle>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatTimeAgo(article.publishedAt)}
                  </div>
                  <span>{article.source}</span>
                </div>
                {article.author && (
                  <div className="mt-2 text-xs text-muted-foreground">By {article.author}</div>
                )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
