import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("crypto-news")

    // Get active token ads
    const tokenAds = await db
      .collection("token_ads")
      .find({
        status: "active",
        expiresAt: { $gt: new Date() },
      })
      .sort({ featured: -1, createdAt: -1 })
      .limit(10)
      .toArray()

    // Get active banner ads
    const bannerAds = await db
      .collection("banner_ads")
      .find({
        status: "active",
        expiresAt: { $gt: new Date() },
      })
      .sort({ priority: -1, createdAt: -1 })
      .toArray()

    return NextResponse.json({
      tokenAds,
      bannerAds,
    })
  } catch (error) {
    console.error("Error fetching ads:", error)
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...adData } = body

    await client.connect()
    const db = client.db("crypto-news")

    const collection = type === "token" ? "token_ads" : "banner_ads"

    const newAd = {
      ...adData,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }

    const result = await db.collection(collection).insertOne(newAd)

    return NextResponse.json({
      success: true,
      adId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating ad:", error)
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 })
  } finally {
    await client.close()
  }
}
