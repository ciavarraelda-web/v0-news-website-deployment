import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { metaTitle, metaDescription, keywords, sitemap } = req.body

  try {
    // Salviamo i metadati in un file JSON (può diventare DB in futuro)
    const seoData = { metaTitle, metaDescription, keywords }
    const seoPath = path.join(process.cwd(), "seo.json")
    fs.writeFileSync(seoPath, JSON.stringify(seoData, null, 2))

    // Salviamo la sitemap.xml nella root /public
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml")
    fs.writeFileSync(sitemapPath, sitemap)

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to save SEO settings" })
  }
}
