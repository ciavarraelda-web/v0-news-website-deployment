import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // proteggiamo solo le rotte admin
  if (pathname.startsWith("/admin")) {
    const authHeader = req.headers.get("authorization")

    // es: Authorization: Bearer SuperPasswordSegreta1503
    if (authHeader === `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.next()
    }

    return new NextResponse("Unauthorized", { status: 401 })
  }

  return NextResponse.next()
}
