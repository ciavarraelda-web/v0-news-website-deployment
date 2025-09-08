<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crypto Exchange | CryptoICO</title>
    <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #e2e8f0;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px 0;
            margin-bottom: 30px;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: 700;
            color: #e2e8f0;
            text-decoration: none;
        }
        
        .logo i {
            color: #3b82f6;
        }
        
        .card {
            background: rgba(30, 41, 59, 0.6);
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 30px;
        }
        
        .card h2 {
            font-size: 24px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .card h2 i {
            color: #3b82f6;
        }
        
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 20px;
        }
        
        .input-group label {
            font-weight: 500;
            color: #cbd5e1;
        }
        
        .input-row {
            display: flex;
            gap: 12px;
        }
        
        .input-row select, .input-row input {
            flex: 1;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 12px 16px;
            color: #e2e8f0;
            font-size: 16px;
        }
        
        .input-row input {
            flex: 2;
        }
        
        button {
            background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 10px;
            width: 100%;
        }
        
        button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }
        
        button:disabled {
            background: #64748b;
            cursor: not-allowed;
        }
        
        .wallet-status {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(15, 23, 42, 0.6);
            padding: 10px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .wallet-status .indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ef4444;
        }
        
        .wallet-status.connected .indicator {
            background: #10b981;
        }
        
        .wallet-address {
            font-family: monospace;
            background: rgba(15, 23, 42, 0.6);
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            word-break: break-all;
        }
        
        .quote-details {
            background: rgba(59, 130, 246, 0.1);
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        .quote-details h4 {
            margin-bottom: 15px;
            color: #3b82f6;
        }
        
        .quote-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top: 4px solid #3b82f6;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // Mock LI.FI SDK since we can't install the real one in this environment
        const mockLifi = {
            getQuote: async (params) => {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                return {
                    estimate: {
                        fromAmount: params.fromAmount,
                        toAmount: (params.fromAmount * 2000).toString(),
                        fromToken: { symbol: params.fromToken === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ? 'ETH' : 'USDC' },
                        toToken: { symbol: params.toToken === '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' ? 'USDC' : 'ETH' },
                        gasCosts: [{ amount: '0.001', token: { symbol: 'ETH' } }],
                        estimatedDuration: 120
                    }
                };
            },
            executeSwap: async (quote) => {
                // Simulate swap execution delay
                await new Promise(resolve => setTimeout(resolve, 3000));
                return { success: true, transactionHash: '0x' + Math.random().toString(16).substr(2, 64) };
            }
        };

        const ChainId = {
            ETH: 1,
            POL: 137,
            BSC: 56,
            ARB: 42161,
            OPT: 10,
            AVA: 43114
        };

        function ExchangePage() {
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);
            const [quote, setQuote] = useState(null);
            const [walletConnected, setWalletConnected] = useState(false);
            const [walletAddress, setWalletAddress] = useState('');
            const [fromToken, setFromToken] = useState('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'); // ETH
            const [toToken, setToToken] = useState('0x2791bca1f2de4661ed88a30c99a7a9449aa84174'); // USDC
            const [fromAmount, setFromAmount] = useState('0.1');
            const [fromChain, setFromChain] = useState(ChainId.ETH);
            const [toChain, setToChain] = useState(ChainId.POL);
            const [isGettingQuote, setIsGettingQuote] = useState(false);
            const [isExecutingSwap, setIsExecutingSwap] = useState(false);

            useEffect(() => {
                checkWalletConnection();
            }, []);

            const checkWalletConnection = async () => {
                if (typeof window.ethereum !== 'undefined') {
                    try {
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const accounts = await provider.listAccounts();
                        if (accounts.length > 0) {
                            setWalletConnected(true);
                            setWalletAddress(accounts[0]);
                        }
                    } catch (err) {
                        console.error("Error checking wallet connection:", err);
                    }
                }
                setLoading(false);
            };

            const connectWallet = async () => {
                if (typeof window.ethereum !== 'undefined') {
                    try {
                        setLoading(true);
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const accounts = await provider.send("eth_requestAccounts", []);
                        setWalletConnected(true);
                        setWalletAddress(accounts[0]);
                        setError(null);
                    } catch (err) {
                        console.error("Error connecting wallet:", err);
                        setError("Unable to connect wallet. Make sure you have MetaMask installed.");
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setError("MetaMask is not installed. Please install MetaMask to use the exchange.");
                }
            };

            const getQuote = async () => {
                if (!walletConnected) {
                    setError("Please connect your wallet before requesting a quote");
                    return;
                }

                try {
                    setIsGettingQuote(true);
                    setError(null);

                    // In a real implementation, use the actual LI.FI SDK
                    const quote = await mockLifi.getQuote({
                        fromAddress: walletAddress,
                        fromChain: fromChain,
                        toChain: toChain,
                        fromToken: fromToken,
                        toToken: toToken,
                        fromAmount: fromAmount,
                        allowBridges: ['stargate', 'hop', 'connext'],
                        allowExchanges: ['uniswap', 'sushiswap', '1inch']
                    });

                    setQuote(quote);
                } catch (err) {
                    console.error("Error getting quote:", err);
                    setError("Unable to get a quote. Please check the parameters and try again.");
                } finally {
                    setIsGettingQuote(false);
                }
            };

            const executeSwap = async () => {
                if (!quote || !walletConnected) return;

                try {
                    setIsExecutingSwap(true);
                    setError(null);

                    // In a real implementation, use the actual LI.FI SDK
                    const result = await mockLifi.executeSwap(quote);
                    
                    console.log("Swap executed successfully:", result);
                    alert("Transaction completed successfully!");
                    setQuote(null);
                } catch (err) {
                    console.error("Error during swap:", err);
                    setError("Error executing the swap. Please try again.");
                } finally {
                    setIsExecutingSwap(false);
                }
            };

            if (loading) {
                return (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                );
            }

            return (
                <div className="container">
                    <header>
                        <div className="header-content">
                            <a href="#" className="logo">
                                <i className="fas fa-exchange-alt"></i>
                                <span>CryptoICO Exchange</span>
                            </a>
                        </div>
                    </header>

                    <div className="card">
                        <h2><i className="fas fa-exchange-alt"></i> Multi-Chain Exchange</h2>
                        
                        {error && (
                            <div className="error">
                                <strong>Error:</strong> {error}
                            </div>
                        )}
                        
                        <div className="wallet-status" className={walletConnected ? "wallet-status connected" : "wallet-status"}>
                            <div className="indicator"></div>
                            <span>{walletConnected ? "Wallet connected" : "Wallet not connected"}</span>
                        </div>
                        
                        {walletConnected && (
                            <div className="wallet-address">
                                Wallet address: {walletAddress}
                            </div>
                        )}
                        
                        {!walletConnected ? (
                            <div style={{textAlign: 'center', padding: '40px 0'}}>
                                <button onClick={connectWallet}>
                                    Connect Wallet
                                </button>
                                <p style={{marginTop: '10px', color: '#94a3b8'}}>
                                    Connect your wallet to start trading
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="input-group">
                                    <label>From</label>
                                    <div className="input-row">
                                        <select 
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
                                            value={fromAmount}
                                            onChange={(e) => setFromAmount(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="input-group">
                                    <label>To</label>
                                    <div className="input-row">
                                        <select 
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
                                    disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isGettingQuote || isExecutingSwap}
                                >
                                    {isGettingQuote ? 'Getting Quote...' : 'Get Quote'}
                                </button>
                                
                                {quote && (
                                    <div className="quote-details">
                                        <h4>Quote Details</h4>
                                        <div className="quote-grid">
                                            <span>Amount to receive:</span>
                                            <span style={{fontWeight: 'bold'}}>
                                                {quote.estimate.toAmount} {quote.estimate.toToken.symbol}
                                            </span>
                                            
                                            <span>Rate:</span>
                                            <span style={{fontWeight: 'bold'}}>
                                                1 {quote.estimate.fromToken.symbol} = {(
                                                    parseFloat(quote.estimate.toAmount) / 
                                                    parseFloat(quote.estimate.fromAmount)
                                                ).toFixed(6)} {quote.estimate.toToken.symbol}
                                            </span>
                                            
                                            <span>Estimated gas cost:</span>
                                            <span style={{fontWeight: 'bold'}}>
                                                {quote.estimate.gasCosts[0].amount} {quote.estimate.gasCosts[0].token.symbol}
                                            </span>

                                            <span>Estimated time:</span>
                                            <span style={{fontWeight: 'bold'}}>
                                                {quote.estimate.estimatedDuration} seconds
                                            </span>
                                        </div>
                                        
                                        <button 
                                            onClick={executeSwap}
                                            disabled={isExecutingSwap}
                                        >
                                            {isExecutingSwap ? 'Processing Swap...' : 'Confirm Swap'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="card">
                        <h2><i className="fas fa-info-circle"></i> About This Exchange</h2>
                        <p>This is a demonstration of a cross-chain cryptocurrency exchange using the LI.FI protocol.</p>
                        <p>In a real implementation, this would allow you to swap tokens across different blockchains with the best available rates.</p>
                        
                        <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Supported Blockchains</h3>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                            <span style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '14px'
                            }}>Ethereum</span>
                            <span style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '14px'
                            }}>Polygon</span>
                            <span style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '14px'
                            }}>Binance Smart Chain</span>
                            <span style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '14px'
                            }}>Arbitrum</span>
                            <span style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '14px'
                            }}>Optimism</span>
                            <span style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '14px'
                            }}>Avalanche</span>
                        </div>
                    </div>
                </div>
            );
        }

        ReactDOM.render(<ExchangePage />, document.getElementById('root'));
    </script>

    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</body>
</html>
