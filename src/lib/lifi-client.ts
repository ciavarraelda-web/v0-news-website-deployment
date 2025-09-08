import { LiFi } from '@lifinance/sdk';

export const lifi = new LiFi({
  apiKey: process.env.LIFI_API_KEY || 'a46c5806-341b-46d0-906b-ab5ac5a64663.6375d829-f6f2-465f-aede-ba59bc4bae64'
});

// Funzioni helper per operazioni comuni
export const getQuote = async (fromChain: number, toChain: number, fromToken: string, toToken: string, amount: string) => {
  return await lifi.getQuote({
    fromChain,
    toChain,
    fromToken,
    toToken,
    fromAmount: amount
  });
};
