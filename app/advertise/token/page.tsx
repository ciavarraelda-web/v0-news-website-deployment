"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, CreditCard, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TokenAdvertisePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    tokenName: "",
    symbol: "",
    description: "",
    website: "",
    iconFile: null as File | null,
  })
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, iconFile: file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would integrate with your Coinbase Commerce API
    toast({
      title: "Payment Required",
      description: "Redirecting to Coinbase Commerce for payment...",
    })

    // Simulate payment process
    setTimeout(() => {
      setStep(3)
      toast({
        title: "Success!",
        description: "Your token ad has been submitted for review.",
      })
    }, 2000)
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ad Submitted Successfully!</h2>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Advertise Your Token</h1>
            <p className="text-muted-foreground">Get your token featured in our sidebar for 30 days</p>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Token Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setStep(2)
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tokenName">Token Name</Label>
                      <Input
                        id="tokenName"
                        value={formData.tokenName}
                        onChange={(e) => setFormData({ ...formData, tokenName: e.target.value })}
                        placeholder="e.g., CryptoGem"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="symbol">Symbol</Label>
                      <Input
                        id="symbol"
                        value={formData.symbol}
                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                        placeholder="e.g., CGEM"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of your token (max 100 characters)"
                      maxLength={100}
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
                      placeholder="https://yourtoken.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="icon">Token Icon</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="icon"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {formData.iconFile ? formData.iconFile.name : "Upload token icon (PNG, JPG, SVG)"}
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
                  Payment - 100 USDC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>
                          Token: {formData.tokenName} ({formData.symbol})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration: 30 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Placement: Sidebar featured</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>100 USDC</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      You will be redirected to Coinbase Commerce to complete your payment
                    </p>
                    <Button onClick={handleSubmit} size="lg" className="w-full">
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
