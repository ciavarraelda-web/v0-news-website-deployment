"use client"

import { useEffect, useState } from "react"

type Prices = {
  bitcoin?: { usd: number }
  ethereum?: { usd: number }
  [key: string]: any
}

export function CryptoPrices({ compact = false }: { compact?: boolean }) {
  const [prices, setPrices] = useState<Prices | null>(null)
  const [loading, setLoading] = useState(true)
  const ids = "bitcoin,ethereum"

  useEffect(() => {
    let mounted = true
    async function fetchPrices() {
      try {
        setLoading(true)
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        )
        if (!res.ok) throw new Error("CoinGecko error")
        const json = await res.json()
        if (mounted) setPrices(json)
      } catch (e) {
        console.error("Price fetch error", e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPrices()
    const int = setInterval(fetchPrices, 30_000) // update every 30s
    return () => {
      mounted = false
      clearInterval(int)
    }
  }, [])

  if (loading || !prices) {
    return <div className={compact ? "text-sm" : "text-base"}>Loading prices…</div>
  }

  return (
    <div className={compact ? "flex items-center gap-4 text-sm" : "space-y-1 text-sm"}>
      <div>
        BTC: <strong>${prices.bitcoin?.usd?.toLocaleString()}</strong>
      </div>
      <div>
        ETH: <strong>${prices.ethereum?.usd?.toLocaleString()}</strong>
      </div>
    </div>
  )
}
