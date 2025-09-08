"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Globe, Users } from "lucide-react"

export default function AdminDashboardPage() {
  const sections = [
    {
      title: "Push Notifications",
      description: "Send and manage Firebase push notifications to all users.",
      icon: <Bell className="h-6 w-6 text-primary" />,
      href: "/admin/notifications",
    },
    {
      title: "SEO Manager",
      description: "Manage metadata, sitemap, and SEO optimizations.",
      icon: <Globe className="h-6 w-6 text-primary" />,
      href: "/admin/seo",
    },
    {
      title: "User Management",
      description: "View and manage registered users and their activity.",
      icon: <Users className="h-6 w-6 text-primary" />,
      href: "/admin/users",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.href} className="hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center space-x-4">
              {section.icon}
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {section.description}
              </p>
              <Link href={section.href}>
                <Button>Go to {section.title}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/api/admin/logout">
          <Button variant="outline">Logout</Button>
        </Link>
      </div>
    </div>
  )
}
