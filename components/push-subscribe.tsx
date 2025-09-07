"use client"
import { useEffect } from "react"

export function PushSubscribe() {
  useEffect(() => {
    if (typeof window === "undefined") return
    // Wait until OneSignal SDK is loaded
    const t = setInterval(() => {
      // @ts-ignore
      if (window.OneSignal) {
        clearInterval(t)
        // @ts-ignore
        const OneSignal = window.OneSignal || []
        // @ts-ignore
        OneSignal.push(function() {
          // @ts-ignore
          OneSignal.init({
            appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "YOUR_ONESIGNAL_APP_ID",
            allowLocalhostAsSecureOrigin: true,
          })
        })
      }
    }, 300)
    return () => clearInterval(t)
  }, [])

  return null
}
