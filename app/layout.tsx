import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Crypto News Hub - Latest Cryptocurrency News & Token Advertising",
  description: "Stay updated with the latest cryptocurrency news, market analysis, and advertise your crypto projects to thousands of enthusiasts.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          {children}
          <Footer />
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}
