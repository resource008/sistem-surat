export function getAdminPageTitle(pathname: string) {
  if (pathname.includes("/dashboard")) return "Dashboard"
  if (pathname.includes("/users")) return "Kelola Pengguna"
  if (pathname.includes("/departemen")) return "Kelola Departemen"
  if (pathname.includes("/lacak-surat")) return "Kelola Sheet Lacak"
  return "Dashboard"
}

export function getAdminPageSubtitle(pathname: string) {
  if (/^\/admin\/lacak-surat\/add\/?$/.test(pathname)) {
    return "Tambah Sheet Lacak"
  }

  if (/^\/admin\/lacak-surat\/[^/]+\/edit\/?$/.test(pathname)) {
    return "Edit Sheet Lacak"
  }

  if (/^\/admin\/lacak-surat\/[^/]+\/?$/.test(pathname)) {
    return "Detail Sheet Lacak"
  }

  return null
}

export function isAdminUsersPage(pathname: string) {
  return /^\/admin\/users\/?$/.test(pathname)
}
