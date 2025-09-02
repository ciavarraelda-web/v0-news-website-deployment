import { Button } from "@/components/ui/button"
import { TrendingUp, Zap, Globe } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Crypto News Hub</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 text-pretty">
            Stay ahead of the market with real-time cryptocurrency news, analysis, and insights
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/advertise">
                <Zap className="mr-2 h-5 w-5" />
                Advertise Your Token
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/news">
                <Globe className="mr-2 h-5 w-5" />
                Browse All News
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-semibold mb-2">Real-time Updates</h3>
              <p className="text-sm text-blue-100">Get the latest crypto news as it happens</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Zap className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-semibold mb-2">Token Advertising</h3>
              <p className="text-sm text-blue-100">Promote your project to crypto enthusiasts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Globe className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-semibold mb-2">Global Coverage</h3>
              <p className="text-sm text-blue-100">News from markets around the world</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
