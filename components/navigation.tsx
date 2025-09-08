// components/navigation.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Newspaper, ArrowLeftRight, Menu, X } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Newspaper className="h-6 w-6 text-blue-600" />
            Crypto News Hub
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition">Home</Link>
            <Link href="/news" className="text-sm font-medium hover:text-blue-600 transition">News</Link>
            <Link href="/analysis" className="text-sm font-medium hover:text-blue-600 transition">Analysis</Link>
            <Link href="/exchange" className="text-sm font-medium hover:text-blue-600 transition">Exchange</Link>
            <Link href="/portfolio" className="text-sm font-medium hover:text-blue-600 transition">Portfolio</Link>
            <Link href="/advertise" className="text-sm font-medium hover:text-blue-600 transition">Advertise</Link>
          </div>

          {/* CTA Exchange Button Desktop */}
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/exchange">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Exchange
              </Link>
            </Button>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-background mt-2">
            <div className="flex flex-col p-4 space-y-2">
              <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/news" onClick={() => setMobileOpen(false)}>News</Link>
              <Link href="/analysis" onClick={() => setMobileOpen(false)}>Analysis</Link>
              <Link href="/exchange" onClick={() => setMobileOpen(false)}>Exchange</Link>
              <Link href="/portfolio" onClick={() => setMobileOpen(false)}>Portfolio</Link>
              <Link href="/advertise" onClick={() => setMobileOpen(false)}>Advertise</Link>

              {/* CTA button anche nel menu mobile */}
              <Button asChild onClick={() => setMobileOpen(false)}>
                <Link href="/exchange">
                  <ArrowLeftRight className="mr-2 h-4 w-4" /> Exchange
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
