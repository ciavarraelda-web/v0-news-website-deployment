import { NewsGrid } from "@/components/filtered-news-grid"

export default function EthereumNewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Ethereum News</h1>
        <p className="text-lg text-muted-foreground">
          Latest Ethereum updates, DeFi developments, and network improvements
        </p>
      </div>
      <NewsGrid filter="Ethereum" />
    </div>
  )
}
