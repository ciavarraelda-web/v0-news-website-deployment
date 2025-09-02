import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import crypto from "crypto"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-cc-webhook-signature")

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.COINBASE_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.type === "charge:confirmed") {
      await client.connect()
      const db = client.db("crypto-news")

      // Update ad status to active
      const chargeId = event.data.id
      const metadata = event.data.metadata

      if (metadata.adType === "token") {
        await db.collection("token_ads").updateOne(
          { chargeId },
          {
            $set: {
              status: "active",
              activatedAt: new Date(),
            },
          },
        )
      } else if (metadata.adType === "banner") {
        await db.collection("banner_ads").updateOne(
          { chargeId },
          {
            $set: {
              status: "active",
              activatedAt: new Date(),
            },
          },
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  } finally {
    await client.close()
  }
}
