"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

type Article = {
  id: string
  title: string
  description: string
  image: string
  category: string
  publishedAt: string
  source: string
}

const PAGE_SIZE = 12

export function InfiniteNewsGrid() {
  const params = useSearchParams()
  const query = (params.get("query") ?? "").toLowerCase()
  const cats = (params.get("cat") ?? "").split(",").filter(Boolean)
  const [articles, setArticles] = useState<Article[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Fetch once
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
        const res = await fetch(`${baseUrl}/api/news`, { next: { revalidate: 180 } })
        if (!res.ok) throw new Error("Failed to fetch news")
        const data = await res.json()
        if (!cancelled) setArticles(data.articles ?? [])
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Error")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [query, params?.toString()])

  const filtered = useMemo(() => {
    const list = articles.filter((a) => {
      const matchesQuery =
        !query ||
        a.title?.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query) ||
        a.source?.toLowerCase().includes(query)
      const matchesCat = !cats.length || cats.includes(a.category)
      return matchesQuery && matchesCat
    })
    return list
  }, [articles, query, cats])

  const visible = useMemo(() => filtered.slice(0, PAGE_SIZE * page), [filtered, page])

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          setPage((p) => {
            const maxPages = Math.ceil(filtered.length / PAGE_SIZE)
            if (p < maxPages) return p + 1
            return p
          })
        }
      },
      { rootMargin: "600px 0px 600px 0px" }
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
    }
  }, [filtered.length])

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {visible.map((a) => (
          <article key={a.id} className="border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/article/${a.id}`}>
              <div className="relative aspect-[16/9]">
                <Image
                  src={a.image || "/placeholder.jpg"}
                  alt={a.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground">{a.category} • {new Date(a.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "2-digit"
                })}</div>
                <h3 className="mt-1 font-semibold line-clamp-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{a.description}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-12 flex items-center justify-center">
        {loading ? <span className="text-sm text-muted-foreground">Loading…</span> : null}
        {!loading && visible.length < filtered.length ? (
          <span className="text-sm text-muted-foreground">Scroll to load more…</span>
        ) : null}
        {!loading && filtered.length === 0 ? (
          <span className="text-sm text-muted-foreground">No results found.</span>
        ) : null}
      </div>
    </>
  )
}
