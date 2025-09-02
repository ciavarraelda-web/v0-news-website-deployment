"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadTokenPage() {
  const [formData, setFormData] = useState<any>(null)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved form data from localStorage
    const savedData = localStorage.getItem("tokenAdData")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIconFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!iconFile || !formData) return

    setUploading(true)

    try {
      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append("icon", iconFile)
      uploadData.append("tokenName", formData.tokenName)
      uploadData.append("symbol", formData.symbol)
      uploadData.append("description", formData.description)
      uploadData.append("website", formData.website)
      uploadData.append("type", "token")

      // Upload to your API
      const response = await fetch("/api/upload-ad", {
        method: "POST",
        body: uploadData,
      })

      if (response.ok) {
        setUploaded(true)
        localStorage.removeItem("tokenAdData")
        toast({
          title: "Success!",
          description: "Your token ad has been uploaded and will go live within 24 hours.",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  if (uploaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Token Ad Uploaded!</h2>
            <p className="text-muted-foreground mb-6">
              Your token advertisement will be reviewed and go live within 24 hours.
            </p>
            <Button asChild>
              <a href="/">Return to Homepage</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">No Payment Data Found</h2>
            <p className="text-muted-foreground mb-6">
              Please complete your payment first before uploading your token.
            </p>
            <Button asChild>
              <a href="/advertise/token">Start Token Ad</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Upload Your Token Icon</h1>
            <p className="text-muted-foreground">Complete your token ad by uploading your icon</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Token: {formData.tokenName} ({formData.symbol})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Your Token Details</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {formData.tokenName}
                    </p>
                    <p>
                      <strong>Symbol:</strong> {formData.symbol}
                    </p>
                    <p>
                      <strong>Description:</strong> {formData.description}
                    </p>
                    <p>
                      <strong>Website:</strong> {formData.website}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="icon">Upload Token Icon</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="icon"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {iconFile ? iconFile.name : "Upload token icon (PNG, JPG, SVG - max 2MB)"}
                        </p>
                      </div>
                    </label>
                    <input
                      id="icon"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={!iconFile || uploading}>
                  {uploading ? "Uploading..." : "Upload Token Ad"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
