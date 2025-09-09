"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Wifi, WifiOff, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

// Mock data per quando l'API non è disponibile
const mockNews = [
  {
    id: "fallback-1",
    title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
    description: "Major cryptocurrency Bitcoin has surged to unprecedented levels as institutional investors continue to embrace digital assets.",
    image: "/placeholder.svg?height=400&width=600&text=Crypto+News",
    category: "Bitcoin",
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    source: "Crypto News Hub",
    url: "#",
    author: "Market Analysis Team",
  },
  {
    id: "fallback-2",
    title: "Ethereum 2.0 Staking Rewards Attract Record Participation",
    description: "The Ethereum network sees unprecedented staking activity as validators lock up ETH to secure the network.",
    image: "/placeholder.svg?height=400&width=600&text=Ethereum+News",
    category: "Ethereum",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    source: "DeFi Weekly",
    url: "#",
    author: "Ethereum Reporter",
  },
  {
    id: "fallback-3",
    title: "DeFi Protocols Report Record Total Value Locked",
    description: "Decentralized Finance protocols across multiple blockchains have reached new milestones in total value locked.",
    image: "/placeholder.svg?height=400&width=600&text=DeFi+News",
    category: "DeFi",
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    source: "DeFi Pulse",
    url: "#",
    author: "DeFi Analyst",
  },
];

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
}

function getCategoryColor(category) {
  const colors = {
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
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}

export function NewsGrid() {
  const [newsData, setNewsData] = useState({ articles: [], totalResults: 0, fallback: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);
        
        // Prova a recuperare i dati dall'API
        const response = await fetch('/api/news', {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        
        // Se l'API non restituisce articoli, usa i dati mock
        if (!data.articles || data.articles.length === 0) {
          setNewsData({
            articles: mockNews,
            totalResults: mockNews.length,
            fallback: true,
            lastUpdated: new Date().toISOString()
          });
        } else {
          setNewsData({
            ...data,
            fallback: false,
            lastUpdated: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(err.message);
        // In caso di errore, usa i dati mock
        setNewsData({
          articles: mockNews,
          totalResults: mockNews.length,
          fallback: true,
          lastUpdated: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const { articles, totalResults, fallback, lastUpdated } = newsData;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Latest Crypto News</h2>
          <Badge variant="secondary" className="text-sm flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            Loading...
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Latest Crypto News</h2>
          <Badge variant="outline" className="text-sm flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Connection Error
          </Badge>
        </div>
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load News</h3>
          <p className="text-muted-foreground mb-4">Error: {error}</p>
          <p className="text-muted-foreground">Please check your API endpoint or try again later.</p>
        </Card>
      </div>
    );
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
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          {totalResults > 0 && ` • ${totalResults} articles`}
        </div>
      )}

      {articles.length === 0 ? (
        <Card className="p-8 text-center">
          <WifiOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No News Available</h3>
          <p className="text-muted-foreground">Unable to load crypto news at the moment. Please try again later.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={article.url || "#"}>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={article.image || "/placeholder.svg?height=400&width=600&query=crypto news"}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=400&width=600&query=crypto news";
                      }}
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
                  {article.author && (
                    <div className="mt-2 text-xs text-muted-foreground">By {article.author}</div>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
