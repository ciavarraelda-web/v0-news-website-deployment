import { Button } from "@/components/ui/button"
import { Newspaper, Zap } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Newspaper className="h-6 w-6 text-blue-600" />
            Crypto News Hub
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/news" className="text-sm font-medium hover:text-blue-600 transition-colors">
              News
            </Link>
            <Link href="/analysis" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Analysis
            </Link>
            <Link href="/portfolio" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Portfolio
            </Link>
            <Link href="/advertise" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Advertise
            </Link>
          </div>

          <Button asChild>
            <Link href="/advertise">
              <Zap className="mr-2 h-4 w-4" />
              Advertise
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
