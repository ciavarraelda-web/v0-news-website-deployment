import type { NextApiRequest, NextApiResponse } from "next"

let tokens: string[] = [] // ⚠️ solo in-memory, si resetta al riavvio

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: "Missing token" })

    if (!tokens.includes(token)) {
      tokens.push(token)
    }

    return res.status(200).json({ success: true, tokens })
  }

  if (req.method === "GET") {
    return res.status(200).json({ tokens })
  }

  return res.status(405).end()
}
