"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, CreditCard, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BannerAdvertisePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    website: "",
    bannerFile: null as File | null,
    duration: "3", // 3 or 7 days
    position: "top", // top, bottom, sidebar
  })
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, bannerFile: file })
    }
  }

  const getPrice = () => {
    return formData.duration === "3" ? "1000" : "1500"
  }

  const getCoinbaseLink = () => {
    if (formData.duration === "3") {
      return "https://commerce.coinbase.com/checkout/7b93a07f-f5c4-404f-98ad-3a99e604adde"
    } else {
      return "https://commerce.coinbase.com/checkout/8c3e25a5-2e37-4105-b594-cb8c763774da"
    }
  }

  const handlePayment = () => {
    localStorage.setItem("bannerAdData", JSON.stringify(formData))
    window.open(getCoinbaseLink(), "_blank")
    toast({
      title: "Payment Initiated",
      description: "Complete your payment in the new tab. Your banner will be uploaded after payment confirmation.",
    })
    setTimeout(() => setStep(3), 2000)
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Initiated!</h2>
            <p className="text-muted-foreground mb-6">
              Complete your payment in the Coinbase Commerce tab. Your banner will go live after payment confirmation.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <a href="/">Return to Homepage</a>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <a href="/upload-banner">Upload Banner After Payment</a>
              </Button>
            </div>
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
            <h1 className="text-3xl font-bold mb-4">Banner Advertising</h1>
            <p className="text-muted-foreground">Get premium banner placement for maximum visibility</p>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Banner Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setStep(2)
                  }}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="title">Banner Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Trade Crypto with Zero Fees"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of your offer (max 150 characters)"
                      maxLength={150}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      required
                    />
                  </div>

                  <div>
                    <Label>Duration & Pricing</Label>
                    <RadioGroup
                      value={formData.duration}
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="3" id="3days" />
                        <Label htmlFor="3days" className="flex-1 cursor-pointer">
                          <div className="flex justify-between">
                            <span>3 Days Banner</span>
                            <span className="font-bold">1000 USDC</span>
                          </div>
                          <p className="text-sm text-muted-foreground">~150,000 total impressions</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                        <RadioGroupItem value="7" id="7days" />
                        <Label htmlFor="7days" className="flex-1 cursor-pointer">
                          <div className="flex justify-between">
                            <span>7 Days Banner (Best Value)</span>
                            <span className="font-bold">1500 USDC</span>
                          </div>
                          <p className="text-sm text-muted-foreground">~350,000 total impressions</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Banner Position</Label>
                    <RadioGroup
                      value={formData.position}
                      onValueChange={(value) => setFormData({ ...formData, position: value })}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="top" id="top" />
                        <Label htmlFor="top">Top of page (recommended)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bottom" id="bottom" />
                        <Label htmlFor="bottom">Bottom of page</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sidebar" id="sidebar" />
                        <Label htmlFor="sidebar">Sidebar</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="banner">Banner Image</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="banner"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {formData.bannerFile
                              ? formData.bannerFile.name
                              : "Upload banner image (PNG, JPG - 728x90 or 300x250)"}
                          </p>
                        </div>
                      </label>
                      <input
                        id="banner"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment - {getPrice()} USDC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Banner: {formData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration: {formData.duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Position: {formData.position}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{getPrice()} USDC</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      You will be redirected to Coinbase Commerce to complete your payment
                    </p>
                    <Button onClick={handlePayment} size="lg" className="w-full">
                      Pay with Crypto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
