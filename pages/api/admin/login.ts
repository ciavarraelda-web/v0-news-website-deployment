import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { password } = req.body
  if (!password) return res.status(400).json({ error: "Password required" })

  if (password !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Invalid password" })
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  })

  res.setHeader(
    "Set-Cookie",
    `admin_token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`
  )

  return res.status(200).json({ success: true })
}
