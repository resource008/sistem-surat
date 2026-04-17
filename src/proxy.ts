// src/proxy.ts
import { NextRequest, NextResponse } from "next/server"

const ROLE_PREFIXES = ["staff", "pkl", "admin"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session token from cookie (better-auth)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value

  // Not logged in → redirect to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Check if path matches a role prefix
  const matchedPrefix = ROLE_PREFIXES.find(
    (prefix) =>
      pathname.startsWith(`/${prefix}/`) || pathname === `/${prefix}`
  )

  // Not a protected route → allow through
  if (!matchedPrefix) return NextResponse.next()

  // Fetch session to get the user's actual role
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

    const userRole: string = (session.user.role ?? "GUEST").toLowerCase()

    // Role mismatch → redirect to the correct role path
    if (matchedPrefix !== userRole) {
      const correctPath = pathname.replace(`/${matchedPrefix}`, `/${userRole}`)
      return NextResponse.redirect(new URL(correctPath, request.url))
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/staff/:path*", "/pkl/:path*", "/admin/:path*"],
}