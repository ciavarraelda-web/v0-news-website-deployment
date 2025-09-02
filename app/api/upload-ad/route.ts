import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const type = formData.get("type") as string

    await client.connect()
    const db = client.db("crypto-news")

    if (type === "token") {
      const iconFile = formData.get("icon") as File
      const tokenName = formData.get("tokenName") as string
      const symbol = formData.get("symbol") as string
      const description = formData.get("description") as string
      const website = formData.get("website") as string

      // In a real app, you'd upload the file to cloud storage (AWS S3, Vercel Blob, etc.)
      // For now, we'll store the file info in the database
      const tokenAd = {
        tokenName,
        symbol,
        description,
        website,
        iconFileName: iconFile.name,
        iconSize: iconFile.size,
        status: "pending_review",
        type: "token",
        duration: 30, // 30 days
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }

      await db.collection("token_ads").insertOne(tokenAd)
    } else if (type === "banner") {
      const bannerFile = formData.get("banner") as File
      const title = formData.get("title") as string
      const description = formData.get("description") as string
      const website = formData.get("website") as string
      const duration = Number.parseInt(formData.get("duration") as string)
      const position = formData.get("position") as string

      const bannerAd = {
        title,
        description,
        website,
        position,
        duration,
        bannerFileName: bannerFile.name,
        bannerSize: bannerFile.size,
        status: "pending_review",
        type: "banner",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      }

      await db.collection("banner_ads").insertOne(bannerAd)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  } finally {
    await client.close()
  }
}
