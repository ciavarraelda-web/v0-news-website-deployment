import { NewsGrid } from "@/components/filtered-news-grid"

export default function BitcoinNewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Bitcoin News</h1>
        <p className="text-lg text-muted-foreground">Latest Bitcoin updates, price movements, and market analysis</p>
      </div>
      <NewsGrid filter="Bitcoin" />
    </div>
  )
}
