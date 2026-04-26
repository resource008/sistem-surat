import { betterFetch } from "@better-fetch/fetch"
import { NextRequest, NextResponse } from "next/server"
import type { Session } from "better-auth/types"

// ── Protected paths ───────────────────────────────────────────────
const PROTECTED_PATHS = [
  "/staff",
  "/admin",
  "/pkl",
]

// ── Skip paths ────────────────────────────────────────────────────
const SKIP_PATHS = [
  "/api/auth",
  "/login",
]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip untuk auth & public paths
  const shouldSkip = SKIP_PATHS.some((path) =>
    pathname.startsWith(path),
  )
  if (shouldSkip) return NextResponse.next()

  // Skip jika bukan protected path
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  )
  if (!isProtected) return NextResponse.next()

  // ── Cek session Better Auth ───────────────────────────────────
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  )

  if (!session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}