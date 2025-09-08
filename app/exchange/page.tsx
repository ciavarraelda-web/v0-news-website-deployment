"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ExchangePage() {
  const widgetInitialized = useRef(false)

  useEffect(() => {
    // Evita di inizializzare il widget più volte
    if (widgetInitialized.current) return
    widgetInitialized.current = true

    // Carica lo script di Jumper Exchange
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/gh/jumperexchange/jumper-exchange@latest/dist/jumper-exchange.js"
    script.async = true
    script.onload = () => {
      // Inizializza Jumper Exchange con la tua API key per le fee
      if (window.JumperExchange) {
        window.JumperExchange.init({
          apiKey: "a46c5806-341b-46d0-906b-ab5ac5a64663.6375d829-f6f2-465f-aede-ba59bc4bae64",
          theme: "light",
          container: "#jumper-widget",
          hideLogo: true,
          hideBranding: true
        })

        // Funzione per rimuovere il branding di Jumper
        const removeJumperBranding = () => {
          // Rimuovi elementi per classe
          const classesToRemove = ['jumper', 'Jumper', 'logo', 'brand', 'watermark', 'powered-by', 'footer']
          classesToRemove.forEach(className => {
            const elements = document.getElementsByClassName(className)
            for (let i = 0; i < elements.length; i++) {
              elements[i].style.display = 'none'
              elements[i].style.opacity = '0'
              elements[i].style.visibility = 'hidden'
            }
          })
          
          // Rimuovi elementi per ID
          const idsToRemove = ['jumper', 'Jumper', 'logo', 'brand']
          idsToRemove.forEach(idPart => {
            const elements = document.querySelectorAll(`[id*="${idPart}"]`)
            elements.forEach(el => {
              el.style.display = 'none'
              el.style.opacity = '0'
              el.style.visibility = 'hidden'
            })
          })
          
          // Rimuovi elementi per attributo
          const attributesToCheck = ['src', 'href']
          attributesToCheck.forEach(attr => {
            const elements = document.querySelectorAll(`[${attr}*="jumper"], [${attr}*="Jumper"], [${attr}*="logo"]`)
            elements.forEach(el => {
              el.style.display = 'none'
              el.style.opacity = '0'
              el.style.visibility = 'hidden'
            })
          })
          
          // Rimuovi elementi di testo che menzionano Jumper
          const allElements = document.querySelectorAll('*:not(script):not(style)')
          allElements.forEach(el => {
            if (el.children.length === 0 && el.textContent) {
              const text = el.textContent.toLowerCase()
              if (text.includes('jumper') || text.includes('powered by')) {
                el.style.display = 'none'
                el.style.opacity = '0'
                el.style.visibility = 'hidden'
              }
            }
          })
        }

        // Esegui la rimozione iniziale
        removeJumperBranding()
        
        // Controlla periodicamente per assicurarsi che il branding non riappaia
        const intervalId = setInterval(removeJumperBranding, 2000)
        
        // Osserva le modifiche al DOM per elementi nuovi
        const observer = new MutationObserver(removeJumperBranding)
        observer.observe(document.body, { 
          childList: true, 
          subtree: true,
          attributes: true,
          characterData: true
        })

        // Pulisci alla rimozione del componente
        return () => {
          clearInterval(intervalId)
          observer.disconnect()
        }
      }
    }

    script.onerror = () => {
      console.error("Errore nel caricamento di Jumper Exchange")
      document.getElementById("jumper-widget").innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <h3>Exchange temporaneamente non disponibile</h3>
          <p>Ci scusiamo per l'inconveniente. Riprova più tardi.</p>
        </div>
      `
    }

    document.head.appendChild(script)

    return () => {
      // Pulisci lo script quando il componente viene smontato
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cross-Chain Exchange</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scambia token tra diverse blockchain in modo semplice e sicuro
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
                <CardDescription>Scambia token tra diverse blockchain con un'interfaccia intuitiva</CardDescription>
              </CardHeader>
              <CardContent>
                <div id="jumper-widget" className="min-h-[600px] w-full" style={{ minHeight: "600px" }} />
              </CardContent>
            </Card>
          </div>

          {/* Features & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scambio Multichain</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg">🛡️</span>
                  <div>
                    <h4 className="font-medium">Transazioni Sicure</h4>
                    <p className="text-sm text-gray-600">Tutte le transazioni sono sicure e verificabili on-chain</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 text-lg">📈</span>
                  <div>
                    <h4 className="font-medium">Migliori Tassi</h4>
                    <p className="text-sm text-gray-600">Ottieni i migliori tassi di scambio tra le diverse blockchain</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-600 text-lg">⚡</span>
                  <div>
                    <h4 className="font-medium">Transazioni Veloci</h4>
                    <p className="text-sm text-gray-600">Tempi di elaborazione rapidi per tutte le transazioni</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 text-lg">🔗</span>
                  <div>
                    <h4 className="font-medium">Multi-Blockchain</h4>
                    <p className="text-sm text-gray-600">Supporto per tutte le principali blockchain e migliaia di token</p>
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
                  <Badge variant="secondary">Fantom</Badge>
                  <Badge variant="secondary">Gnosis</Badge>
                  <Badge variant="secondary">+ Altre</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Caratteristiche</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quote in Tempo Reale</span>
                  <span className="text-green-600 font-medium">✓ Attivo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Routing Multichain</span>
                  <span className="text-green-600 font-medium">✓ Attivo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Integrazione Wallet</span>
                  <span className="text-green-600 font-medium">✓ Pronto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interfaccia Intuitiva</span>
                  <span className="text-green-600 font-medium">✓ Si</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cronologia Transazioni</span>
                  <span className="text-green-600 font-medium">✓ Integrata</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
