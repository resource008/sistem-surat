import { routes } from "@/constants/routes"
import {
  SESSION_LOGOUT_REDIRECT_COOKIE,
  SESSION_LOGOUT_REDIRECT_MAX_AGE_SECONDS,
} from "@/constants/session"

export function markLogoutRedirect() {
  document.cookie = `${SESSION_LOGOUT_REDIRECT_COOKIE}=1; Max-Age=${SESSION_LOGOUT_REDIRECT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`
}

export function redirectToLoggedOutLogin(reason?: "idle") {
  markLogoutRedirect()
  const searchParams = new URLSearchParams({ logout: "true" })
  if (reason) searchParams.set("reason", reason)

  window.location.href = `${routes.login}?${searchParams.toString()}`
}
