import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Advertise Your Crypto Project</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Reach thousands of crypto enthusiasts and investors with our targeted advertising solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Token Icon Advertising */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500 text-white">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                Token Icon Ads
              </CardTitle>
              <div className="text-3xl font-bold">5000 USDC</div>
              <p className="text-muted-foreground">Promote your token in our featured sidebar</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Featured in sidebar on all pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Custom token icon and description</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Direct link to your website</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">30-day exposure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">~50,000 daily impressions</span>
                </div>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href="/advertise/token">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Banner Advertising */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                Banner Ads
              </CardTitle>
              <p className="text-muted-foreground">Premium banner placement for maximum visibility</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 3-Day Banner */}
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">3-Day Banner</h4>
                  <div className="text-2xl font-bold">1000 USDC</div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Top/bottom banner placement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Custom banner design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3 text-blue-500" />
                    <span>~150,000 total impressions</span>
                  </div>
                </div>
              </div>

              {/* 7-Day Banner */}
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-semibold">7-Day Banner</h4>
                    <Badge variant="secondary" className="text-xs mt-1">
                      Best Value
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">1500 USDC</div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Premium banner placement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Custom banner design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Priority positioning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3 text-blue-500" />
                    <span>~350,000 total impressions</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-transparent" variant="outline" size="lg" asChild>
                <Link href="/advertise/banner">Choose Banner Plan</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Why Advertise With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-muted-foreground">Daily Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-muted-foreground">Crypto Enthusiasts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-muted-foreground">Global Reach</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
