import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// This would fetch from your MongoDB
async function getTokenAds() {
  // Simulated token ads data
  return [
    {
      id: 1,
      tokenName: "CryptoGem",
      symbol: "CGEM",
      icon: "/generic-crypto-logo.png",
      description: "Revolutionary DeFi protocol with 15% APY",
      website: "https://cryptogem.io",
      featured: true,
      expiresAt: "2024-01-20T00:00:00Z",
    },
    {
      id: 2,
      tokenName: "MoonShot",
      symbol: "MOON",
      icon: "/moon-token-logo.png",
      description: "Next-gen gaming token with NFT integration",
      website: "https://moonshot.game",
      featured: false,
      expiresAt: "2024-01-18T00:00:00Z",
    },
    {
      id: 3,
      tokenName: "EcoChain",
      symbol: "ECO",
      icon: "/eco-token-logo.png",
      description: "Carbon-neutral blockchain for sustainability",
      website: "https://ecochain.green",
      featured: true,
      expiresAt: "2024-01-22T00:00:00Z",
    },
    {
      id: 4,
      tokenName: "MetaVerse",
      symbol: "META",
      icon: "/metaverse-token-logo.png",
      description: "Virtual reality platform token",
      website: "https://metaverse.world",
      featured: false,
      expiresAt: "2024-01-19T00:00:00Z",
    },
  ]
}

export async function TokenAds() {
  const tokenAds = await getTokenAds()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Featured Tokens
        </CardTitle>
        <p className="text-sm text-muted-foreground">Discover promising crypto projects</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {tokenAds.map((token) => (
          <div key={token.id} className="group p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="relative">
                <Image
                  src={token.icon || "/placeholder.svg"}
                  alt={`${token.tokenName} logo`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                {token.featured && <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-current" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">{token.tokenName}</h4>
                  <Badge variant="outline" className="text-xs">
                    {token.symbol}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{token.description}</p>
                <Button size="sm" variant="outline" className="w-full text-xs h-7 bg-transparent" asChild>
                  <Link href={token.website} target="_blank">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button className="w-full" variant="default" asChild>
            <Link href="/advertise">Advertise Your Token</Link>
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">Starting at 100 USDC</p>
        </div>
      </CardContent>
    </Card>
  )
}
