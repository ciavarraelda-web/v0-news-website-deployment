import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return WebSocket connection details for client-side connection
    return NextResponse.json({
      websocketUrl: "wss://ws-direct.exchange.coinbase.com",
      sandboxUrl: "wss://ws-direct.sandbox.exchange.coinbase.com",
      channels: ["ticker", "level2"],
      productIds: [
        "BTC-USD",
        "ETH-USD",
        "ADA-USD",
        "SOL-USD",
        "DOT-USD",
        "DOGE-USD",
        "AVAX-USD",
        "MATIC-USD",
        "LINK-USD",
        "LTC-USD",
      ],
      message: "Use client-side WebSocket connection for real-time data",
    })
  } catch (error) {
    console.error("Error setting up WebSocket config:", error)
    return NextResponse.json({ error: "Failed to setup WebSocket config" }, { status: 500 })
  }
}
