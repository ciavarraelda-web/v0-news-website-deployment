import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"
  const response = await fetch(`${baseUrl}/api/news`)
  const data = await response.json()

  const updated = new Date().toISOString()

  const items = data.articles
    ?.map(
      (article: any) => `
      <entry>
        <title><![CDATA[${article.title}]]></title>
        <link href="${baseUrl}/article/${article.id}"/>
        <id>${baseUrl}/article/${article.id}</id>
        <updated>${new Date(article.publishedAt).toISOString()}</updated>
        <summary><![CDATA[${article.description}]]></summary>
      </entry>`
    )
    .join("")

  const atom = `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Crypto News Hub</title>
      <link href="${baseUrl}/atom" rel="self"/>
      <updated>${updated}</updated>
      <id>${baseUrl}/</id>
      ${items}
    </feed>`

  return new NextResponse(atom, {
    headers: {
      "Content-Type": "application/atom+xml",
    },
  })
}
