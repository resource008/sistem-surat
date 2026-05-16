// ─── Semua konstanta route dalam satu objek ───────────────────────
export const routes = {
  // ── Auth ────────────────────────────────────────────────────────
  login: "/login",

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
    // ✅ Route cetak — dilayani (print)/staff/cetak/page.tsx
    cetak: (ids: (number | string)[]) =>
      `/staff/cetak?ids=${ids.join(",")}`,
  },

  // ── PKL ──────────────────────────────────────────────────────────
  pkl: {
    index:     "/pkl",
    add:       "/pkl/add",
    dataSurat: "/pkl/data-surat",
  },

  // ── Admin ────────────────────────────────────────────────────────
  admin: {
    index:     "/admin",
    dashboard: "/admin/dashboard",
  },
} as const

// ─── Helper: redirect berdasarkan role setelah login ─────────────
export function getRouteByRole(role: string): string {
  switch (role) {
    case "ADMIN": return routes.dashboard.admin
    case "STAFF": return routes.dataSurat.staff
    case "PKL":   return routes.dataSurat.pkl
    default:      return routes.login
  }
}

// ─── Helper: base path berdasarkan role ──────────────────────────
export function getBasePathByRole(role: string): string {
  switch (role) {
    case "STAFF": return routes.staff.index
    case "PKL":   return routes.pkl.index
    case "ADMIN": return routes.admin.index
    default:      return routes.login
  }
}

// ─── Helper: cetak surat berdasarkan role ────────────────────────
export function getCetakRoute(
  ids: (number | string)[],
): string {
  return routes.staff.cetak(ids)
}