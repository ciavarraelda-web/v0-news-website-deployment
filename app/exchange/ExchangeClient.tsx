'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Wallet, Loader2 } from "lucide-react"
import { LiFi, ChainId, TokenAmount } from '@lifinance/sdk'

// Inizializza LI.FI SDK con la chiave API da variabile d'ambiente
const lifi = new LiFi({
  apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY || '',
  integrator: 'CryptoICO-Exchange-Platform'
})

// Interfaccia per i token supportati
interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
}

// Lista di token supportati per ogni chain
const SUPPORTED_TOKENS: Record<number, TokenInfo[]> = {
  [ChainId.ETH]: [
    { address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'ETH', name: 'Ethereum' },
    { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', name: 'USD Coin' },
    { address: '0x6b175474e89094c44da98b954eedeac495271d0f', symbol: 'DAI', name: 'Dai Stablecoin' },
    { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', name: 'Tether' },
  ],
  [ChainId.POL]: [
    { address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'MATIC', name: 'Polygon' },
    { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC', name: 'USD Coin' },
    { address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', symbol: 'DAI', name: 'Dai Stablecoin' },
    { address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', symbol: 'USDT', name: 'Tether' },
  ],
  [ChainId.BSC]: [
    { address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'BNB', name: 'Binance Coin' },
    { address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', symbol: 'USDC', name: 'USD Coin' },
    { address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', symbol: 'DAI', name: 'Dai Stablecoin' },
    { address: '0x55d398326f99059ff775485246999027b3197955', symbol: 'USDT', name: 'Tether' },
  ],
  [ChainId.ARB]: [
    { address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'ETH', name: 'Ethereum' },
    { address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', symbol: 'USDC', name: 'USD Coin' },
    { address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', symbol: 'DAI', name: 'Dai Stablecoin' },
    { address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', symbol: 'USDT', name: 'Tether' },
  ],
  [ChainId.OPT]: [
    { address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'ETH', name: 'Ethereum' },
    { address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', symbol: 'USDC', name: 'USD Coin' },
    { address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', symbol: 'DAI', name: 'Dai Stablecoin' },
    { address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', symbol: 'USDT', name: 'Tether' },
  ],
  [ChainId.AVA]: [
    { address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'AVAX', name: 'Avalanche' },
    { address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', symbol: 'USDC', name: 'USD Coin' },
    { address: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', symbol: 'DAI', name: 'Dai Stablecoin' },
    { address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7', symbol: 'USDT', name: 'Tether' },
  ],
}

export default function ExchangeClient() {
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
  const [toTokens, setToTokens] = useState<TokenInfo[]>(SUPPORTED_TOKENS[ChainId.POL])

  useEffect(() => {
    // Verifica se c'è un wallet già connesso (es. MetaMask)
    checkWalletConnection()
  }, [])

  useEffect(() => {
    // Aggiorna i token disponibili quando cambia la chain di destinazione
    setToTokens(SUPPORTED_TOKENS[toChain] || [])
    
    // Reimposta il token di destinazione se non è più disponibile
    if (toTokens.length > 0 && !toTokens.some(token => token.address === toToken)) {
      setToToken(toTokens[0].address)
    }
  }, [toChain, toTokens, toToken])

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
        setError("Errore nel collegamento al wallet")
      }
    }
    setLoading(false)
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
        setError("Impossibile connettere il wallet. Assicurati di avere MetaMask installato e sbloccato.")
      } finally {
        setLoading(false)
      }
    } else {
      setError(
        <span>
          MetaMask non è installato. Per favore installa MetaMask per utilizzare l'exchange.{" "}
          <a 
            href="https://metamask.io/download.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            Scarica MetaMask
          </a>
        </span>
      )
    }
  }

  const getQuote = async () => {
    if (!walletConnected) {
      setError("Per favore connetti il wallet prima di richiedere una quotazione")
      return
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError("Inserisci un importo valido")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Richiedi una quotazione usando LI.FI SDK
      const quote = await lifi.getQuote({
        fromAddress: walletAddress,
        fromChain: fromChain,
        toChain: toChain,
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: TokenAmount.fromHumanAmount(fromAmount).amount,
        allowBridges: ['stargate', 'hop', 'connext'],
        allowExchanges: ['uniswap', 'sushiswap', '1inch']
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

      // Esegui lo swap usando LI.FI SDK
      const result = await lifi.executeSwap(quote, {
        updateCallback: (update) => {
          console.log("Update transazione:", update)
          // Qui puoi aggiornare l'UI con lo stato della transazione
        }
      })

      console.log("Swap eseguito con successo:", result)
      alert("Transazione completata con successo!")
      setQuote(null) // Resetta la quotazione dopo lo swap
    } catch (err) {
      console.error("Errore durante lo swap:", err)
      setError("Errore durante l'esecuzione dello swap. Riprova.")
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleChainChange = (chainType: 'from' | 'to', chainId: number) => {
    if (chainType === 'from') {
      setFromChain(chainId)
      // Aggiorna i token disponibili per la chain di origine
      const fromTokens = SUPPORTED_TOKENS[chainId] || []
      if (fromTokens.length > 0 && !fromTokens.some(token => token.address === fromToken)) {
        setFromToken(fromTokens[0].address)
      }
    } else {
      setToChain(chainId)
      // Aggiorna i token disponibili per la chain di destinazione
      const toTokens = SUPPORTED_TOKENS[chainId] || []
      setToTokens(toTokens)
      if (toTokens.length > 0 && !toTokens.some(token => token.address === toToken)) {
        setToToken(toTokens[0].address)
      }
    }
  }

  if (loading && !walletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {error && (
          <div className="mb-6">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Errore</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

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
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
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
                          disabled={loading}
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
                              onChange={(e) => handleChainChange('from', Number(e.target.value))}
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
                              value={fromToken}
                              onChange={(e) => setFromToken(e.target.value)}
                            >
                              {SUPPORTED_TOKENS[fromChain]?.map((token) => (
                                <option key={token.address} value={token.address}>
                                  {token.symbol} - {token.name}
                                </option>
                              ))}
                            </select>
                            <input 
                              type="number" 
                              placeholder="0.0" 
                              className="w-full p-3 border rounded-lg mt-2"
                              value={fromAmount}
                              onChange={(e) => setFromAmount(e.target.value)}
                              min="0"
                              step="any"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">A</label>
                            <select 
                              className="w-full p-3 border rounded-lg"
                              value={toChain}
                              onChange={(e) => handleChainChange('to', Number(e.target.value))}
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
                              {toTokens.map((token) => (
                                <option key={token.address} value={token.address}>
                                  {token.symbol} - {token.name}
                                </option>
                              ))}
                            </select>
                            <div className="w-full p-3 border rounded-lg mt-2 bg-gray-50">
                              <p className="text-sm text-gray-500">Riceverai:</p>
                              <p className="text-lg font-semibold">
                                {quote ? `${quote.estimate.toAmount} ${quote.estimate.toToken.symbol}` : '--'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={getQuote}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || loading}
                        >
                          {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Ottieni Quotazione'}
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
                                {quote.estimate.gasCosts?.length > 0 
                                  ? `${quote.estimate.gasCosts[0].amount} ${quote.estimate.gasCosts[0].token.symbol}`
                                  : 'N/A'}
                              </span>

                              <span>Tempo stimato:</span>
                              <span className="font-medium">
                                {quote.estimate.estimatedDuration} secondi
                              </span>
                            </div>
                            
                            <button 
                              onClick={executeSwap}
                              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                              disabled={loading}
                            >
                              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Conferma Scambio'}
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
                    <p className="text-sm text-gray-600 truncate" title={walletAddress}>
                      {formatAddress(walletAddress)}
                    </p>
                    <button 
                      onClick={() => {
                        setWalletConnected(false)
                        setWalletAddress('')
                        setQuote(null)
                      }}
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
                    <p className="text-sm text-gray-600">Scambia tra 40+ blockchain diverse</p>
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
