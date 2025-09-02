import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch news from News API
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`,
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error("Failed to fetch news")
    }

    const data = await response.json()

    // Filter and format articles
    const articles = data.articles
      .filter(
        (article: any) =>
          article.title && article.description && article.urlToImage && !article.title.includes("[Removed]"),
      )
      .slice(0, 20)
      .map((article: any) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        image: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source.name,
        url: article.url,
        category: "Crypto", // You could implement category detection here
      }))

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
