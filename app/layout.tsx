import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "Crypto News Hub",
  description: "Latest cryptocurrency news and market insights",
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    title: "Crypto News Hub",
    description: "Latest cryptocurrency news and market insights",
    url: "https://yourdomain.com",
    siteName: "Crypto News Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto News Hub",
    description: "Latest cryptocurrency news and market insights",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Crypto News Hub",
        url: "https://yourdomain.com",
        logo: "https://yourdomain.com/logo.png",
      },
      {
        "@type": "WebSite",
        url: "https://yourdomain.com",
        name: "Crypto News Hub",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://yourdomain.com/news?query={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Topbar */}
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
              <Link href="/" className="font-semibold tracking-tight">
                Crypto News Hub
              </Link>
              <nav className="flex items-center gap-2">
                <Link href="/news" className="text-sm hover:underline">
                  News
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="border-t mt-12">
            <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Crypto News Hub
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
