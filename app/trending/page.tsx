"use client"
import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { PieChart, Pie, Tooltip, Cell } from "recharts"
import { CryptoPrices } from "@/components/crypto-prices"

type Article = any

export default function TrendingPage() {
  const [articles, setArticles] = useState<Article[]>([])
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/news`)
      .then((r) => r.json())
      .then((d) => setArticles(d.articles || []))
  }, [])

  const counts = useMemo(() => {
    const m: Record<string, number> = {}
    articles.forEach((a) => {
      const c = a.category || "Other"
      m[c] = (m[c] || 0) + 1
    })
    return Object.entries(m).map(([name, value]) => ({ name, value }))
  }, [articles])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Trending Topics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Category distribution</h2>
          <PieChart width={350} height={300}>
            <Pie data={counts} dataKey="value" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
            <Tooltip />
          </PieChart>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Recommended for you</h2>
          <RecommendedFeed articles={articles} />
        </div>
      </div>
    </div>
  )
}

function RecommendedFeed({ articles }: { articles: Article[] }) {
  // simple personalization: read preferences from localStorage
  const pref = (typeof window !== "undefined" && localStorage.getItem("preferredCategories")) || ""
  const prefs = pref ? pref.split(",") : []
  const filtered = prefs.length ? articles.filter((a) => prefs.includes(a.category)) : articles.slice(0, 10)

  return (
    <ul className="space-y-3">
      {filtered.map((a) => (
        <li key={a.id} className="border rounded p-3">
          <a href={`/article/${a.id}`} className="font-semibold hover:underline">
            {a.title}
          </a>
          <div className="text-sm text-muted-foreground">{a.category} • {new Date(a.publishedAt).toLocaleDateString()}</div>
        </li>
      ))}
    </ul>
  )
}
