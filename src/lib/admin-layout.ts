export function getAdminPageTitle(pathname: string) {
  if (pathname.includes("/dashboard")) return "Dashboard"
  if (pathname.includes("/users")) return "Kelola Pengguna"
  if (pathname.includes("/departemen")) return "Kelola Departemen"
  return "Dashboard"
}

export function isAdminUsersPage(pathname: string) {
  return /^\/admin\/users\/?$/.test(pathname)
}
