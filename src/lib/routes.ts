export const routes = {
  login: "/auth/login",
  dashboard: {
    admin: "/dashboard/admin",
  },
  dataSurat: {
    staff: "/data-surat/staff",
    pkl: "/data-surat/pkl",
  },
  trackSurat: {
    guest: "/track-surat/guest",
  },
}

export function getRouteByRole(role: string): string {
  switch (role) {
    case "ADMIN": return routes.dashboard.admin
    case "STAFF": return routes.dataSurat.staff
    case "PKL": return routes.dataSurat.pkl
    default: return routes.trackSurat.guest
  }
}