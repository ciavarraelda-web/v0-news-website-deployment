// lib/error-handler.js
export class ErrorHandler {
  static handleAPIError(error, context) {
    console.error(`[${context}] Error:`, error);
    
    // Monitoraggio errori con Sentry (da implementare)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
    
    return {
      error: true,
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    };
  }

  static getFallbackData(dataType) {
    const fallbacks = {
      news: [...], // tus datos mock existentes
      prices: [...],
      videos: [...]
    };
    
    return {
      data: fallbacks[dataType],
      fallback: true,
      cached: false
    };
  }
}
