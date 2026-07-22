import { type Role } from "@/components/surat/shared"

export const routes = {
  // ── Auth ────────────────────────────────────────────────────────
  login: "/login",

  guest: {
    lacakSurat: "/guest/lacak-surat",
  },

  // ── Dashboard ───────────────────────────────────────────────────
  dashboard: {
    admin: "/admin/dashboard",
  },

  // ── Data Surat ──────────────────────────────────────────────────
  dataSurat: {
    staff: "/staff/data-surat",
    pkl:   "/pkl/data-surat",
  },

  // ── Staff ────────────────────────────────────────────────────────
  staff: {
    index:     "/staff",
    add:       "/staff/add",
    dataSurat: "/staff/data-surat",
    cetak: (ids: (number | string)[]) =>
      `/staff/cetak?ids=${ids.join(",")}`,
  },

  // ── PKL ──────────────────────────────────────────────────────────
  pkl: {
    index:     "/pkl",
    add:       "/pkl/add",
    dataSurat: "/pkl/data-surat",
    cetak: (ids: (number | string)[]) => `/pkl/cetak?ids=${ids.join(",")}`,
  },

  // ── Admin ────────────────────────────────────────────────────────
  admin: {
    index:     "/admin",
    dashboard: "/admin/dashboard",
  },
} as const

// ─── Helper: redirect berdasarkan role setelah login ─────────────
export function getRouteByRole(role?: Role | null): string {
  switch (role) {
    case "ADMIN": return routes.dashboard.admin
    case "STAFF": return routes.dataSurat.staff
    case "PKL":   return routes.dataSurat.pkl
    default:      return routes.dataSurat.staff
  }
}

export function getTrackRouteByRole(role?: Role | null): string {
  switch (role) {
    case "ADMIN": return "/admin/lacak-surat"
    case "STAFF": return "/staff/track"
    case "PKL":   return "/pkl/track"
    default:      return "/staff/track"
  }
}

function getSafeInternalCallback(callbackUrl?: string | null) {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) return null
  return callbackUrl
}

function getQuerySuffix(path: string) {
  const queryStart = path.indexOf("?")
  return queryStart >= 0 ? path.slice(queryStart) : ""
}

function matchesPathBase(path: string, base: string) {
  return path === base || path.startsWith(`${base}/`) || path.startsWith(`${base}?`)
}

export function getLoginRedirectRoute(role?: Role | null, callbackUrl?: string | null): string {
  const callback = getSafeInternalCallback(callbackUrl)
  if (!callback) return getRouteByRole(role)

  if (matchesPathBase(callback, routes.guest.lacakSurat)) {
    return `${getTrackRouteByRole(role)}${getQuerySuffix(callback)}`
  }

  if (role === "ADMIN" && matchesPathBase(callback, "/admin")) return callback
  if (role === "PKL" && matchesPathBase(callback, "/pkl")) return callback
  if (role !== "ADMIN" && matchesPathBase(callback, "/staff")) return callback

  return getRouteByRole(role)
}

// ─── Helper: base path berdasarkan role ──────────────────────────
export function getBasePathByRole(role: Role): string {
  switch (role) {
    case "STAFF": return routes.staff.index
    case "PKL":   return routes.pkl.index
    case "ADMIN": return routes.admin.index
    default:      return routes.staff.index
  }
}

// ─── Helper: cetak surat berdasarkan role ────────────────────────
export function getCetakRoute(role: Role, ids: (number | string)[]): string {
  switch (role) {
    case "STAFF": return routes.staff.cetak(ids)
    case "PKL":   return routes.pkl.cetak(ids)
    default:      return routes.staff.cetak(ids)
  }
}
