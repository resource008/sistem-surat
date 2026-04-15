export const routes = {
  login: "/auth/login",
  dashboard: {
    admin: "/admin/dashboard",
  },
  dataSurat: {
    staff: "/staff/data-surat",
    cetak: "/staff/cetak",
    track: "/staff/track",
  },
  trackSurat: {
    guest: "/track-surat/guest",
  },
}

export function getRouteByRole(role: string): string {
  switch (role) {
    case "ADMIN": return routes.dashboard.admin
    case "STAFF": return routes.dataSurat.staff
    case "PKL": return routes.dataSurat.staff
    default: return routes.trackSurat.guest
  }
}