import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink } from "lucide-react"
import Image from "next/image"

// This would typically fetch from your News API
async function getNews() {
  // Simulated news data - replace with actual News API call
  return [
    {
      id: 1,
      title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
      description:
        "Major corporations continue to add Bitcoin to their treasury reserves, driving unprecedented demand and price discovery.",
      image: "/bitcoin-chart.png",
      category: "Bitcoin",
      publishedAt: "2024-01-15T10:30:00Z",
      source: "CryptoDaily",
      url: "#",
    },
    {
      id: 2,
      title: "Ethereum 2.0 Staking Rewards Hit Record Levels",
      description: "Validators are seeing increased returns as network activity surges and fee structures optimize.",
      image: "/ethereum-staking.png",
      category: "Ethereum",
      publishedAt: "2024-01-15T09:15:00Z",
      source: "BlockNews",
      url: "#",
    },
    {
      id: 3,
      title: "DeFi Protocol Launches Revolutionary Yield Farming Strategy",
      description: "New automated market maker promises higher yields with reduced impermanent loss risk.",
      image: "/defi-protocol.png",
      category: "DeFi",
      publishedAt: "2024-01-15T08:45:00Z",
      source: "DeFi Times",
      url: "#",
    },
    {
      id: 4,
      title: "NFT Marketplace Sees 300% Surge in Trading Volume",
      description:
        "Digital art and collectibles market experiences unprecedented growth as mainstream adoption accelerates.",
      image: "/nft-marketplace-concept.png",
      category: "NFTs",
      publishedAt: "2024-01-15T07:20:00Z",
      source: "NFT Weekly",
      url: "#",
    },
    {
      id: 5,
      title: "Central Bank Digital Currency Pilot Program Expands",
      description:
        "Government initiative to test digital currency infrastructure reaches new milestone with broader public participation.",
      image: "/digital-currency.png",
      category: "CBDC",
      publishedAt: "2024-01-15T06:30:00Z",
      source: "FinTech Today",
      url: "#",
    },
    {
      id: 6,
      title: "Layer 2 Solutions Drive Ethereum Scalability Forward",
      description:
        "Rollup technologies demonstrate significant improvements in transaction throughput and cost reduction.",
      image: "/layer-2-ethereum.png",
      category: "Technology",
      publishedAt: "2024-01-15T05:45:00Z",
      source: "Tech Crypto",
      url: "#",
    },
  ]
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  return `${Math.floor(diffInHours / 24)}d ago`
}

export async function NewsGrid() {
  const news = await getNews()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Latest Crypto News</h2>
        <Badge variant="secondary" className="text-sm">
          Live Updates
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((article) => (
          <Card key={article.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-black">
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
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
