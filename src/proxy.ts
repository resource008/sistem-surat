import { betterFetch } from "@better-fetch/fetch"
import { NextRequest, NextResponse } from "next/server"
import type { Session } from "better-auth/types"

// ── Protected paths ───────────────────────────────────────────────
const PROTECTED_PATHS = [
  "/staff",
  "/admin",
  "/pkl",
]

// ── Admin only paths ──────────────────────────────────────────────
const ADMIN_PATHS = [
  "/dashboard",
  "/users",
  "/departemen",
]

// ── Skip paths ────────────────────────────────────────────────────
const SKIP_PATHS = [
  "/api/auth",
  "/login",
  "/forbidden",
]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip untuk auth & public paths
  const shouldSkip = SKIP_PATHS.some((path) =>
    pathname.startsWith(path),
  )
  if (shouldSkip) return NextResponse.next()

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  )
  const isAdminPath = ADMIN_PATHS.some((path) =>
    pathname.startsWith(path),
  )

  if (!isProtected && !isAdminPath) return NextResponse.next()

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

  // ── Cek role ADMIN untuk admin paths ─────────────────────────
  if (isAdminPath && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/forbidden", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}