"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const CATEGORIES = ["Bitcoin", "Ethereum", "DeFi", "NFTs", "Regulation", "Market", "Technology", "Altcoins"]

export function SearchFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get("query") ?? "")
  const selected = useMemo(() => new Set((params.get("cat") ?? "").split(",").filter(Boolean)), [params])

  // Debounced push
  useEffect(() => {
    const t = setTimeout(() => {
      const q = new URLSearchParams(params.toString())
      if (query) q.set("query", query)
      else q.delete("query")
      router.replace(`/news?${q.toString()}`)
    }, 350)
    return () => clearTimeout(t)
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCat = useCallback(
    (cat: string) => {
      const q = new URLSearchParams(params.toString())
      const current = new Set((q.get("cat") ?? "").split(",").filter(Boolean))
      if (current.has(cat)) current.delete(cat)
      else current.add(cat)
      const next = Array.from(current)
      if (next.length) q.set("cat", next.join(","))
      else q.delete("cat")
      router.replace(`/news?${q.toString()}`)
    },
    [params, router]
  )

  const clearAll = () => {
    const q = new URLSearchParams(params.toString())
    q.delete("query")
    q.delete("cat")
    router.replace(`/news?${q.toString()}`)
    setQuery("")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search articles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        <Button variant="outline" onClick={clearAll} title="Clear filters">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = selected.has(cat)
          return (
            <Badge
              key={cat}
              variant={active ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => toggleCat(cat)}
            >
              {cat}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
