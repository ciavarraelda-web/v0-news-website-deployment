import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cryptoico.eu"
  const response = await fetch(`${baseUrl}/api/news`)
  const data = await response.json()

  const items = data.articles
    ?.map(
      (article: any) => `
      <item>
        <title><![CDATA[${article.title}]]></title>
        <link>${baseUrl}/article/${article.id}</link>
        <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
        <description><![CDATA[${article.description}]]></description>
      </item>`
    )
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Crypto News Hub</title>
        <link>${baseUrl}</link>
        <description>Latest cryptocurrency news and market insights</description>
        ${items}
      </channel>
    </rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  })
}
