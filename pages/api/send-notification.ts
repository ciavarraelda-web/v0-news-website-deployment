import type { NextApiRequest, NextApiResponse } from "next"
import admin from "firebase-admin"
import { supabase } from "@/lib/supabase"

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const messaging = admin.messaging()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  const { title, body } = req.body

  try {
    // Recupera tutti i token
    const { data: tokens, error } = await supabase.from("fcm_tokens").select("token")
    if (error) throw error

    if (!tokens || tokens.length === 0) {
      return res.status(200).json({ success: false, message: "No tokens registered" })
    }

    const message = {
      notification: { title, body },
      tokens: tokens.map((t) => t.token),
    }

    const response = await messaging.sendEachForMulticast(message)
    res.status(200).json({ success: true, response })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Notification failed" })
  }
}
