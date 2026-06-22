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
export function getRouteByRole(role: Role): string {
  switch (role) {
    case "ADMIN": return routes.dashboard.admin
    case "STAFF": return routes.dataSurat.staff
    case "PKL":   return routes.dataSurat.pkl
    default:      return routes.login
  }
}

// ─── Helper: base path berdasarkan role ──────────────────────────
export function getBasePathByRole(role: Role): string {
  switch (role) {
    case "STAFF": return routes.staff.index
    case "PKL":   return routes.pkl.index
    case "ADMIN": return routes.admin.index
    default:      return routes.login
  }
}

// ─── Helper: cetak surat berdasarkan role ────────────────────────
export function getCetakRoute(role: Role, ids: (number | string)[]): string {
  switch (role) {
    case "STAFF": return routes.staff.cetak(ids)
    case "PKL":   return routes.pkl.cetak(ids)
    default:      return routes.login
  }
}
