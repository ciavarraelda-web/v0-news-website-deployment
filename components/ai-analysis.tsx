import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Target, Zap } from "lucide-react"

async function getAIAnalysis() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai-analysis`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch AI analysis")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching AI analysis:", error)
    return null
  }
}

function formatPrice(price: number) {
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 100) return `$${price.toFixed(2)}`
  return `$${price.toLocaleString()}`
}

export async function AIAnalysis() {
  const analysis = await getAIAnalysis()

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load AI analysis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Market Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Market Sentiment
          </CardTitle>
          <p className="text-sm text-muted-foreground">Real-time sentiment analysis powered by AI</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{analysis.sentiment.score}/100</div>
              <Badge
                className={`${
                  analysis.sentiment.label === "Bullish"
                    ? "bg-green-100 text-green-700"
                    : analysis.sentiment.label === "Bearish"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                } border-0`}
              >
                {analysis.sentiment.label}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Confidence</div>
              <div className="font-semibold">{analysis.sentiment.confidence}%</div>
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all ${
                analysis.sentiment.score > 60
                  ? "bg-green-500"
                  : analysis.sentiment.score < 40
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
              style={{ width: `${analysis.sentiment.score}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-semibold">{analysis.marketOverview.dominanceIndex}%</div>
              <div className="text-muted-foreground">BTC Dominance</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-semibold">{analysis.marketOverview.fearGreedIndex}</div>
              <div className="text-muted-foreground">Fear & Greed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            AI Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.insights.map((insight: any, index: number) => (
            <div key={index} className="p-3 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {insight.type === "bullish" && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {insight.type === "bearish" && <TrendingDown className="h-4 w-4 text-red-500" />}
                  {insight.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  {insight.type === "opportunity" && <Target className="h-4 w-4 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            AI Price Predictions
          </CardTitle>
          <p className="text-sm text-muted-foreground">Machine learning powered price forecasts</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.predictions.slice(0, 5).map((prediction: any) => (
            <div key={prediction.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{prediction.name}</span>
                  <Badge variant="outline" className="text-xs uppercase">
                    {prediction.symbol}
                  </Badge>
                </div>
                <Badge
                  className={`${
                    prediction.trend === "bullish"
                      ? "bg-green-100 text-green-700"
                      : prediction.trend === "bearish"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                  } border-0 text-xs`}
                >
                  {prediction.trend}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-semibold">{formatPrice(prediction.currentPrice)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">24h Target</p>
                  <p className="font-semibold">{formatPrice(prediction.prediction24h)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">7d Target</p>
                  <p className="font-semibold">{formatPrice(prediction.prediction7d)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2 pt-2 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Confidence: {prediction.confidence}%</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    prediction.riskLevel === "high"
                      ? "border-red-200 text-red-600"
                      : prediction.riskLevel === "medium"
                        ? "border-yellow-200 text-yellow-600"
                        : "border-green-200 text-green-600"
                  }`}
                >
                  {prediction.riskLevel} risk
                </Badge>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <Button className="w-full bg-transparent" variant="outline">
              <Brain className="mr-2 h-4 w-4" />
              View All Predictions
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">Predictions updated every 5 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
