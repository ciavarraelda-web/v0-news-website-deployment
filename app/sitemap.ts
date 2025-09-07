import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cryptoico.eu"

  // Fetch articles from API
  const response = await fetch(`${baseUrl}/api/news`)
  const data = await response.json()

  const articles = data.articles?.map((article: any) => ({
    url: `${baseUrl}/article/${article.id}`,
    lastModified: article.publishedAt,
  })) || []

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date().toISOString(),
    },
    ...articles,
  ]
}
