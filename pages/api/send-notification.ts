import type { NextApiRequest, NextApiResponse } from "next"
import admin from "firebase-admin"

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
  const { token, title, body } = req.body
  try {
    const message = {
      notification: { title, body },
      token,
    }
    await messaging.send(message)
    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Notification failed" })
  }
}
