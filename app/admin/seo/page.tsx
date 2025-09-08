"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function SeoManagerPage() {
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [sitemap, setSitemap] = useState("")
  const [message, setMessage] = useState("")

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")

    const res = await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metaTitle, metaDescription, keywords, sitemap }),
    })

    if (res.ok) {
      setMessage("SEO settings saved successfully ✅")
    } else {
      setMessage("Failed to save SEO settings ❌")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SEO Manager</h1>

      <Card>
        <CardHeader>
          <CardTitle>Metadata Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Enter site meta title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Enter site meta description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Keywords (comma separated)
              </label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="bitcoin, crypto, blockchain"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sitemap XML
              </label>
              <Textarea
                rows={6}
                value={sitemap}
                onChange={(e) => setSitemap(e.target.value)}
                placeholder={`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">...</urlset>`}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Settings
            </Button>
          </form>
          {message && <p className="mt-4 text-sm">{message}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
