import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "@/lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { token } = req.body
  if (!token) return res.status(400).json({ error: "Missing token" })

  const { error } = await supabase
    .from("fcm_tokens")
    .upsert({ token }, { onConflict: "token" }) // evita duplicati

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "DB insert failed" })
  }

  return res.status(200).json({ success: true })
}
