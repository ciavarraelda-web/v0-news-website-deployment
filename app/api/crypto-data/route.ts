import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch crypto data from CoinGecko API (free tier)
    const [pricesResponse, marketsResponse] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,polkadot,dogecoin,avalanche-2,polygon,chainlink,litecoin,bitcoin-cash,stellar,ethereum-classic,filecoin,tron,monero,eos,aave,uniswap&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true",
        { next: { revalidate: 60 } }, // Cache for 1 minute
      ),
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d",
        { next: { revalidate: 300 } }, // Cache for 5 minutes
      ),
    ])

    if (!pricesResponse.ok || !marketsResponse.ok) {
      throw new Error("Failed to fetch crypto data")
    }

    const prices = await pricesResponse.json()
    const markets = await marketsResponse.json()

    // Format price data for quick access
    const formattedPrices = Object.entries(prices).map(([id, data]: [string, any]) => ({
      id,
      name: id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      price: data.usd,
      change24h: data.usd_24h_change,
      marketCap: data.usd_market_cap,
      volume24h: data.usd_24h_vol,
    }))

    // Format market data with technical indicators
    const formattedMarkets = markets.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      currentPrice: coin.current_price,
      marketCap: coin.market_cap,
      marketCapRank: coin.market_cap_rank,
      fullyDilutedValuation: coin.fully_diluted_valuation,
      totalVolume: coin.total_volume,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      priceChange24h: coin.price_change_24h,
      priceChangePercentage24h: coin.price_change_percentage_24h,
      priceChangePercentage1h: coin.price_change_percentage_1h_in_currency,
      priceChangePercentage7d: coin.price_change_percentage_7d_in_currency,
      marketCapChange24h: coin.market_cap_change_24h,
      marketCapChangePercentage24h: coin.market_cap_change_percentage_24h,
      circulatingSupply: coin.circulating_supply,
      totalSupply: coin.total_supply,
      maxSupply: coin.max_supply,
      ath: coin.ath,
      athChangePercentage: coin.ath_change_percentage,
      athDate: coin.ath_date,
      atl: coin.atl,
      atlChangePercentage: coin.atl_change_percentage,
      atlDate: coin.atl_date,
      sparklineIn7d: coin.sparkline_in_7d?.price || [],
      lastUpdated: coin.last_updated,
    }))

    return NextResponse.json({
      prices: formattedPrices,
      markets: formattedMarkets,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return NextResponse.json({ error: "Failed to fetch crypto data" }, { status: 500 })
  }
}
