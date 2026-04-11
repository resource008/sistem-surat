// src/proxy.ts
import { NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute =
    pathname.startsWith("/staff") || pathname.startsWith("/admin")

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  try {
    const sessionRes = await fetch(
      new URL("/api/auth/get-session", request.url),
      {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
      }
    )

    const session = await sessionRes.json()

    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/staff/:path*", "/admin/:path*"],
}