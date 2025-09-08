"use client"
import { useEffect, useState } from "react"
import { requestPermission, onMessageListener } from "@/lib/firebase"
import { Button } from "@/components/ui/button"

export function PushSubscribe() {
  const [token, setToken] = useState<string | null>(null)
  const [message, setMessage] = useState<any>(null)

  async function subscribe() {
    const t = await requestPermission()
    if (t) {
      setToken(t)
      // TODO: send token to your backend (DB) to store subscriptions
      await fetch("/api/save-fcm-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t }),
      })
    }
  }

  useEffect(() => {
    onMessageListener().then((payload) => {
      setMessage(payload)
    })
  }, [])

  return (
    <div className="space-y-2">
      <Button onClick={subscribe}>Enable Notifications</Button>
      {token && <p className="text-xs text-muted-foreground">Subscribed ✅</p>}
      {message && (
        <div className="text-sm bg-muted p-2 rounded">
          {message?.notification?.title}: {message?.notification?.body}
        </div>
      )}
    </div>
  )
}
