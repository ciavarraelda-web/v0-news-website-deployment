import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface AdBannerProps {
  position: "top" | "bottom" | "sidebar"
}

// This would fetch from your MongoDB
async function getBannerAd(position: string) {
  // Simulated banner ad data
  const ads = {
    top: {
      id: 1,
      title: "Trade Crypto with Zero Fees",
      description: "Join the leading crypto exchange with advanced trading tools",
      image: "/crypto-exchange-banner.png",
      url: "https://example-exchange.com",
      sponsor: "CryptoExchange Pro",
      expiresAt: "2024-01-20T00:00:00Z",
    },
    sidebar: {
      id: 2,
      title: "Secure Your Crypto",
      description: "Hardware wallet with military-grade security",
      image: "/hardware-wallet.png",
      url: "https://example-wallet.com",
      sponsor: "SecureWallet",
      expiresAt: "2024-01-18T00:00:00Z",
    },
    bottom: {
      id: 3,
      title: "Learn Crypto Trading",
      description: "Master cryptocurrency trading with our comprehensive course",
      image: "/crypto-education.png",
      url: "https://example-education.com",
      sponsor: "Crypto Academy",
      expiresAt: "2024-01-22T00:00:00Z",
    },
  }

  return ads[position as keyof typeof ads] || null
}

export async function AdBanner({ position }: AdBannerProps) {
  const ad = await getBannerAd(position)

  if (!ad) {
    return (
      <Card className="p-6 text-center border-dashed">
        <p className="text-muted-foreground">Advertisement Space Available</p>
        <Link href="/advertise" className="text-blue-600 hover:underline text-sm">
          Advertise Here
        </Link>
      </Card>
    )
  }

  const isHorizontal = position === "top" || position === "bottom"

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <Link href={ad.url} target="_blank" className="block">
        <div className={`relative ${isHorizontal ? "h-24 md:h-32" : "h-64"}`}>
          <Image
            src={ad.image || "/placeholder.svg"}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs bg-white/90 text-black">
              Sponsored
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2 right-2 text-white">
            <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-1">{ad.title}</h3>
            <p className="text-xs opacity-90 line-clamp-1">{ad.description}</p>
          </div>
        </div>
      </Link>
    </Card>
  )
}
