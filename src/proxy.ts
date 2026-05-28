import { betterFetch } from "@better-fetch/fetch"
import { NextRequest, NextResponse } from "next/server"
import { type ExtendedSession } from "@/types/auth"

// ── Protected paths (Harus Login) ─────────────────────────────────
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

// ── Skip paths (Public) ───────────────────────────────────────────
const SKIP_PATHS = [
  "/api/auth",
  "/login",
  "/forbidden",
]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Skip untuk auth & public paths
  const shouldSkip = SKIP_PATHS.some((path) => pathname.startsWith(path))
  if (shouldSkip) return NextResponse.next()

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path))

  // Jika bukan halaman yang dilindungi, biarkan lewat
  if (!isProtected && !isAdminPath) return NextResponse.next()

  // 2. Cek session Better Auth
  const { data: session } = await betterFetch<ExtendedSession>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: { cookie: request.headers.get("cookie") ?? "" },
    },
  )

  // 3. Redirect ke login jika tidak ada sesi
  if (!session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Ambil Role User
  const role = session?.user?.role

  // ── 4. Logika RBAC (Role-Based Access Control) ──────────────────

  // A. Cek Role ADMIN untuk Admin Paths & /admin
  if ((isAdminPath || pathname.startsWith("/admin")) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/forbidden", request.url))
  }

  // B. Cek Role STAFF (Hanya Staff dan Admin yang boleh ke /staff)
  if (pathname.startsWith("/staff") && role !== "STAFF" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/forbidden", request.url))
  }

  // C. Cek Role PKL (Hanya PKL dan Admin yang boleh ke /pkl)
  if (pathname.startsWith("/pkl") && role !== "PKL" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/forbidden", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}