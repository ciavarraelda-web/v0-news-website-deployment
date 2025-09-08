// lib/firebase.ts
import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)

export const messaging = typeof window !== "undefined" ? getMessaging(app) : null

export async function requestPermission() {
  if (!messaging) return null
  try {
    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      })
      console.log("FCM token:", token)
      return token
    }
  } catch (err) {
    console.error("FCM permission error", err)
  }
  return null
}

export function onMessageListener() {
  return new Promise((resolve) => {
    if (!messaging) return
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
}
