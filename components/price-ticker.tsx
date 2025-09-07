"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function PriceTicker() {
  const [tick, setTick] = useState<{ label: string; value: string }[]>([])
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,polkadot&vs_currencies=usd"
        )
        const json = await res.json()
        if (!mounted) return
        const arr = Object.entries(json).map(([k, v]: any) => ({
          label: k.toUpperCase(),
          value: `$${Number(v.usd).toLocaleString()}`,
        }))
        setTick(arr)
      } catch (e) {
        console.error(e)
      }
    }
    load()
    const int = setInterval(load, 30_000)
    return () => {
      mounted = false
      clearInterval(int)
    }
  }, [])

  if (!tick.length) return null

  return (
    <div className="hidden md:block overflow-hidden bg-muted/40 px-3 py-2 rounded-full">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      >
        {tick.map((t) => (
          <div key={t.label} className="text-xs font-medium">
            <span className="uppercase">{t.label}</span>: <span>{t.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
