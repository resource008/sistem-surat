export function getAdminPageTitle(pathname: string) {
  if (pathname.includes("/dashboard")) return "Dashboard"
  if (pathname.includes("/users")) return "Kelola Pengguna"
  if (pathname.includes("/departemen")) return "Kelola Departemen"
  if (pathname.includes("/kelola-tabel-lacak")) return "Kelola Sheet Lacak"
  return "Dashboard"
}

export function isAdminUsersPage(pathname: string) {
  return /^\/admin\/users\/?$/.test(pathname)
}
