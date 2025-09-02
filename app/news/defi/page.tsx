import { NewsGrid } from "@/components/filtered-news-grid"

export default function DeFiNewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">DeFi News</h1>
        <p className="text-lg text-muted-foreground">
          Decentralized Finance protocols, yield farming, and DeFi innovations
        </p>
      </div>
      <NewsGrid filter="DeFi" />
    </div>
  )
}
