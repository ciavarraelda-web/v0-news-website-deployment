import { NewsGrid } from "@/components/news-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Cryptocurrency News</h1>
        <p className="text-lg text-muted-foreground">
          Stay updated with the latest developments in the cryptocurrency world
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <NewsGrid />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="w-full justify-start">
                Bitcoin
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                Ethereum
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                DeFi
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                NFTs
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                Regulation
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
