export const routes = {
  login: "/auth/login",
  dashboard: {
    admin: "/admin/dashboard",
  },
  dataSurat: {
    staff: "/staff/data-surat",
    pkl:   "/pkl/data-surat",    // ← tambah ini
  },
}

export function getRouteByRole(role: string): string {
  switch (role) {
    case "ADMIN": return routes.dashboard.admin
    case "STAFF": return routes.dataSurat.staff
    case "PKL":   return routes.dataSurat.pkl   // ← fix: bukan ke /staff
    default:      return "/auth/login"
  }
}

// Helper baru: ambil basePath berdasarkan role
export function getBasePathByRole(role: string): string {
  switch (role) {
    case "STAFF": return "/staff"
    case "PKL":   return "/pkl"
    case "ADMIN": return "/admin"
    default:      return "/auth/login"
  }
}