"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default function ExchangePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const widgetInitialized = useRef(false)

  useEffect(() => {
    if (widgetInitialized.current) return
    widgetInitialized.current = true

    const loadJumperExchange = async () => {
      try {
        setLoading(true)
        
        // Controlla se lo script è già caricato
        if (document.querySelector('script[src*="jumper-exchange"]')) {
          console.log('Jumper Exchange script già caricato')
          return
        }

        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/gh/jumperexchange/jumper-exchange@latest/dist/jumper-exchange.js"
        script.async = true
        
        script.onload = () => {
          console.log('Jumper Exchange script caricato con successo')
          
          if (window.JumperExchange) {
            window.JumperExchange.init({
              apiKey: "a46c5806-341b-46d0-906b-ab5ac5a64663.6375d829-f6f2-465f-aede-ba59bc4bae64",
              theme: "light",
              container: "#jumper-widget",
              hideLogo: true,
              hideBranding: true,
              disableBranding: true
            })

            // Funzione per rimuovere il branding
            const removeJumperBranding = () => {
              const elements = document.querySelectorAll('*')
              elements.forEach(element => {
                const className = element.className?.toString() || ''
                const id = element.id?.toString() || ''
                const text = element.textContent?.toLowerCase() || ''
                
                if (className.includes('jumper') || 
                    className.includes('Jumper') || 
                    id.includes('jumper') ||
                    text.includes('jumper') ||
                    text.includes('powered by')) {
                  element.style.display = 'none'
                  element.style.opacity = '0'
                  element.style.visibility = 'hidden'
                }
              })
            }

            removeJumperBranding()
            setLoading(false)
            
            // Controllo periodico
            const interval = setInterval(removeJumperBranding, 1000)
            
            // Observer per modifiche DOM
            const observer = new MutationObserver(removeJumperBranding)
            observer.observe(document.body, { 
              childList: true, 
              subtree: true,
              attributes: true
            })

            return () => {
              clearInterval(interval)
              observer.disconnect()
            }
          }
        }

        script.onerror = () => {
          console.error("Errore nel caricamento di Jumper Exchange")
          setError("Impossibile caricare il servizio di exchange. Riprova più tardi.")
          setLoading(false)
        }

        document.head.appendChild(script)

      } catch (err) {
        console.error("Errore durante il caricamento:", err)
        setError("Si è verificato un errore durante il caricamento.")
        setLoading(false)
      }
    }

    loadJumperExchange()

    return () => {
      // Pulizia
      const script = document.querySelector('script[src*="jumper-exchange"]')
      if (script) {
        document.head.removeChild(script)
      }
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Errore</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Scambio Criptovalute</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scambia token tra diverse blockchain in modo sicuro e conveniente
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-blue-600">⚡</span>
                  Multi-Chain Exchange
                </CardTitle>
                <CardDescription>
                  Interfaccia professionale per scambi cross-chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                )}
                <div 
                  id="jumper-widget" 
                  className="min-h-[600px] w-full" 
                  style={{ display: loading ? 'none' : 'block' }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Funzionalità Principali</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg">🛡️</span>
                  <div>
                    <h4 className="font-medium">Transazioni Sicure</h4>
                    <p className="text-sm text-gray-600">Tutte le transazioni sono verificate on-chain</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 text-lg">📈</span>
                  <div>
                    <h4 className="font-medium">Migliori Tassi</h4>
                    <p className="text-sm text-gray-600">Ottieni i migliori tassi di scambio</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blockchain Supportate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Ethereum</Badge>
                  <Badge variant="secondary">Polygon</Badge>
                  <Badge variant="secondary">BSC</Badge>
                  <Badge variant="secondary">Arbitrum</Badge>
                  <Badge variant="secondary">Optimism</Badge>
                  <Badge variant="secondary">Avalanche</Badge>
                  <Badge variant="secondary">+ Altre</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
