"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Wallet } from "lucide-react"
import { LiFi, ChainId, TokenAmount } from '@lifinance/sdk'

// Configurazione LI.FI con la tua API key
const LIFI_API_KEY = "a46c5806-341b-46d0-906b-ab5ac5a64663.6375d829-f6f2-465f-aede-ba59bc4bae64"

// Inizializza LI.FI SDK
const lifi = new LiFi({
  apiKey: LIFI_API_KEY,
  integrator: 'Your-Exchange-Platform'
})

export default function ExchangePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quote, setQuote] = useState<any>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [fromToken, setFromToken] = useState('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') // ETH
  const [toToken, setToToken] = useState('0x2791bca1f2de4661ed88a30c99a7a9449aa84174') // USDC
  const [fromAmount, setFromAmount] = useState('0.1')
  const [fromChain, setFromChain] = useState<number>(ChainId.ETH)
  const [toChain, setToChain] = useState<number>(ChainId.POL)

  useEffect(() => {
    // Verifica se c'è un wallet già connesso (es. MetaMask)
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletConnected(true)
          setWalletAddress(accounts[0])
        }
      } catch (err) {
        console.error("Errore nel controllo connessione wallet:", err)
      }
    }
    setLoading(false)
  }
// app/exchange/page.tsx (server component)
import ExchangeClient from './components/ExchangeClient';

export const metadata = {
  title: 'Exchange | CryptoICO',
};

export default function ExchangePage() {
  return <ExchangeClient />;
}
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setLoading(true)
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        setWalletConnected(true)
        setWalletAddress(accounts[0])
        setError(null)
      } catch (err) {
        console.error("Errore nella connessione del wallet:", err)
        setError("Impossibile connettere il wallet. Assicurati di avere MetaMask installato.")
      } finally {
        setLoading(false)
      }
    } else {
      setError("MetaMask non è installato. Per favore installa MetaMask per utilizzare l'exchange.")
    }
  }

  const getQuote = async () => {
    if (!walletConnected) {
      setError("Per favore connetti il wallet prima di richiedere una quotazione")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Richiedi una quotazione usando LI.FI SDK [citation:3][citation:4]
      const quote = await lifi.getQuote({
        fromAddress: walletAddress,
        fromChain: fromChain,
        toChain: toChain,
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: TokenAmount.fromHumanAmount(fromAmount).amount,
        allowBridges: ['stargate', 'hop', 'connext'], // Bridges consentiti
        allowExchanges: ['uniswap', 'sushiswap', '1inch'] // DEX consentiti
      })

      setQuote(quote)
      console.log("Quotazione ottenuta:", quote)
    } catch (err) {
      console.error("Errore nel recupero della quotazione:", err)
      setError("Impossibile ottenere una quotazione. Verifica i parametri e riprova.")
    } finally {
      setLoading(false)
    }
  }

  const executeSwap = async () => {
    if (!quote || !walletConnected) return

    try {
      setLoading(true)
      setError(null)

      // Esegui lo swap usando LI.FI SDK [citation:3]
      const result = await lifi.executeSwap(quote, {
        updateCallback: (update) => {
          console.log("Update transazione:", update)
          // Qui puoi aggiornare l'UI con lo stato della transazione
        }
      })

      console.log("Swap eseguito con successo:", result)
      alert("Transazione completata con successo!")
      
    } catch (err) {
      console.error("Errore durante lo swap:", err)
      setError("Errore durante l'esecuzione dello swap. Riprova.")
    } finally {
      setLoading(false)
    }
  }

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
                {loading ? (
                  <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Connetti Wallet */}
                    {!walletConnected ? (
                      <div className="text-center py-8">
                        <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <button 
                          onClick={connectWallet}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Connetti Wallet
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                          Connetti il tuo wallet per iniziare a fare trading
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Da</label>
                            <select 
                              className="w-full p-3 border rounded-lg"
                              value={fromChain}
                              onChange={(e) => setFromChain(Number(e.target.value))}
                            >
                              <option value={ChainId.ETH}>Ethereum</option>
                              <option value={ChainId.POL}>Polygon</option>
                              <option value={ChainId.BSC}>Binance Smart Chain</option>
                              <option value={ChainId.ARB}>Arbitrum</option>
                              <option value={ChainId.OPT}>Optimism</option>
                              <option value={ChainId.AVA}>Avalanche</option>
                            </select>
                            <input 
                              type="number" 
                              placeholder="0.0" 
                              className="w-full p-3 border rounded-lg mt-2"
                              value={fromAmount}
                              onChange={(e) => setFromAmount(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">A</label>
                            <select 
                              className="w-full p-3 border rounded-lg"
                              value={toChain}
                              onChange={(e) => setToChain(Number(e.target.value))}
                            >
                              <option value={ChainId.ETH}>Ethereum</option>
                              <option value={ChainId.POL}>Polygon</option>
                              <option value={ChainId.BSC}>Binance Smart Chain</option>
                              <option value={ChainId.ARB}>Arbitrum</option>
                              <option value={ChainId.OPT}>Optimism</option>
                              <option value={ChainId.AVA}>Avalanche</option>
                            </select>
                            <select 
                              className="w-full p-3 border rounded-lg mt-2"
                              value={toToken}
                              onChange={(e) => setToToken(e.target.value)}
                            >
                              <option value="0x2791bca1f2de4661ed88a30c99a7a9449aa84174">USDC</option>
                              <option value="0x8f3cf7ad23cd3cadbd9735aff958023239c6a063">DAI</option>
                              <option value="0xc2132d05d31c914a87c6611c10748aeb04b58e8f">USDT</option>
                              <option value="0x7ceb23fd6bc0add59e62ac25578270cff1b9f619">WETH</option>
                            </select>
                          </div>
                        </div>
                        
                        <button 
                          onClick={getQuote}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                          disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                        >
                          Ottieni Quotazione
                        </button>
                        
                        {quote && (
                          <div className="bg-gray-50 p-4 rounded-lg mt-4">
                            <h4 className="font-semibold mb-2">Dettagli Quotazione</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                              <span>Importo ricevuto:</span>
                              <span className="font-medium">
                                {quote.estimate.toAmount} {quote.estimate.toToken.symbol}
                              </span>
                              
                              <span>Tasso:</span>
                              <span className="font-medium">
                                1 {quote.estimate.fromToken.symbol} = {(
                                  parseFloat(quote.estimate.toAmount) / 
                                  parseFloat(quote.estimate.fromAmount)
                                ).toFixed(6)} {quote.estimate.toToken.symbol}
                              </span>
                              
                              <span>Costo gas stimato:</span>
                              <span className="font-medium">
                                {quote.estimate.gasCosts} {quote.estimate.gasCosts[0]?.token?.symbol}
                              </span>

                              <span>Tempo stimato:</span>
                              <span className="font-medium">
                                {quote.estimate.estimatedDuration} secondi
                              </span>
                            </div>
                            
                            <button 
                              onClick={executeSwap}
                              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Conferma Scambio
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wallet Connesso</CardTitle>
              </CardHeader>
              <CardContent>
                {walletConnected ? (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Wallet className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {walletAddress}
                    </p>
                    <button 
                      onClick={() => setWalletConnected(false)}
                      className="text-red-600 text-sm mt-2"
                    >
                      Disconnetti
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Nessun wallet connesso
                  </p>
                )}
              </CardContent>
            </Card>

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
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 text-lg">🔀</span>
                  <div>
                    <h4 className="font-medium">Cross-Chain</h4>
                    <p className="text-sm text-gray-600">Scambia tra 40+ blockchain diverse [citation:7]</p>
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
                  <Badge variant="secondary">Solana</Badge>
                  <Badge variant="secondary">Base</Badge>
                  <Badge variant="secondary">+ 40+ altre</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
