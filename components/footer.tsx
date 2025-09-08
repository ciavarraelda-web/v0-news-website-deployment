import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <span className="text-blue-600">📰</span>
              Crypto News Hub
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted source for cryptocurrency news and cross-chain trading.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">News</h3>
            <div className="space-y-2 text-sm">
              <Link href="/news" className="block text-muted-foreground hover:text-foreground">
                Latest News
              </Link>
              <Link href="/news/bitcoin" className="block text-muted-foreground hover:text-foreground">
                Bitcoin
              </Link>
              <Link href="/news/ethereum" className="block text-muted-foreground hover:text-foreground">
                Ethereum
              </Link>
              <Link href="/news/defi" className="block text-muted-foreground hover:text-foreground">
                DeFi
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Advertising</h3>
            <div className="space-y-2 text-sm">
              <Link href="/advertise" className="block text-muted-foreground hover:text-foreground">
                Get Started
              </Link>
              <Link href="/advertise/token" className="block text-muted-foreground hover:text-foreground">
                Token Ads
              </Link>
              <Link href="/advertise/banner" className="block text-muted-foreground hover:text-foreground">
                Banner Ads
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
                Contact Us
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Crypto News Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
