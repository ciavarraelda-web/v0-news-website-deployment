import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin")) {
    // consenti la pagina login senza controllo
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next()
    }

    const token = req.cookies.get("admin_token")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  return NextResponse.next()
}
