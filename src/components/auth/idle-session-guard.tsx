"use client"

import { useEffect, useRef } from "react"
import {
  SESSION_BROWSER_ACTIVE_KEY,
  SESSION_ACTIVITY_WRITE_INTERVAL_MS,
  SESSION_IDLE_LOGOUT_KEY,
  SESSION_IDLE_TIMEOUT_MS,
  SESSION_LAST_ACTIVITY_KEY,
  SESSION_REFRESH_INTERVAL_MS,
} from "@/constants/session"
import { authClient } from "@/infrastructure/auth/auth-client"
import { redirectToLoggedOutLogin } from "@/lib/logout-redirect"

const ACTIVITY_EVENTS = [
  "pointerdown",
  "pointermove",
  "keydown",
  "wheel",
  "scroll",
  "touchstart",
] as const

type LogoutReason = "idle" | "browser"

function getStoredTimestamp(key: string) {
  const value = window.sessionStorage.getItem(key)
  const timestamp = value ? Number(value) : NaN
  return Number.isFinite(timestamp) ? timestamp : null
}

function redirectToLogin(reason: LogoutReason = "idle") {
  redirectToLoggedOutLogin(reason)
}

export function IdleSessionGuard() {
  const timeoutRef = useRef<number | null>(null)
  const expiringRef = useRef(false)
  const lastWriteRef = useRef(0)
  const lastRefreshRef = useRef(0)
  const refreshPromiseRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    function clearScheduledCheck() {
      if (!timeoutRef.current) return
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    function getLastActivity() {
      const stored = getStoredTimestamp(SESSION_LAST_ACTIVITY_KEY)
      if (stored) return stored

      const now = Date.now()
      window.sessionStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(now))
      return now
    }

    async function refreshSession() {
      if (refreshPromiseRef.current) return refreshPromiseRef.current

      const now = Date.now()
      if (now - lastRefreshRef.current < SESSION_REFRESH_INTERVAL_MS) return

      lastRefreshRef.current = now
      refreshPromiseRef.current = authClient.getSession()
        .then(({ data }) => {
          if (!data && !expiringRef.current) {
            redirectToLogin()
          }
        })
        .catch(() => {
          // Network hiccups should not log the user out while they are active.
        })
        .finally(() => {
          refreshPromiseRef.current = null
        })

      return refreshPromiseRef.current
    }

    async function expireSession(reason: LogoutReason = "idle") {
      if (expiringRef.current) return
      expiringRef.current = true
      clearScheduledCheck()

      try {
        window.sessionStorage.setItem(SESSION_IDLE_LOGOUT_KEY, String(Date.now()))
      } catch {
        // sessionStorage is best-effort for recording local logout state.
      }

      try {
        if (reason === "browser") {
          window.sessionStorage.removeItem(SESSION_BROWSER_ACTIVE_KEY)
        }

        const { data: session } = await authClient.getSession()

        if (session?.session?.token) {
          await authClient.revokeSession({ token: session.session.token }).catch(() => {})
        }

        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => redirectToLogin(reason),
          },
        })
      } finally {
        redirectToLogin(reason)
      }
    }

    function hasActiveBrowserSession() {
      try {
        return window.sessionStorage.getItem(SESSION_BROWSER_ACTIVE_KEY) === "1"
      } catch {
        return false
      }
    }

    function scheduleCheck() {
      if (expiringRef.current) return

      clearScheduledCheck()
      const lastActivity = getLastActivity()
      const remaining = SESSION_IDLE_TIMEOUT_MS - (Date.now() - lastActivity)

      if (remaining <= 0) {
        void expireSession()
        return
      }

      timeoutRef.current = window.setTimeout(() => {
        scheduleCheck()
      }, Math.max(1000, remaining))
    }

    function recordActivity() {
      if (expiringRef.current || document.hidden) return

      const now = Date.now()
      if (now - lastWriteRef.current < SESSION_ACTIVITY_WRITE_INTERVAL_MS) return

      lastWriteRef.current = now
      window.sessionStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(now))
      scheduleCheck()
      void refreshSession()
    }

    function handleVisibilityChange() {
      if (document.hidden) return
      recordActivity()
    }

    if (!hasActiveBrowserSession()) {
      void expireSession("browser")
      return () => {
        clearScheduledCheck()
      }
    }

    if (!getStoredTimestamp(SESSION_LAST_ACTIVITY_KEY)) {
      window.sessionStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(Date.now()))
    }

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, { passive: true })
    })
    document.addEventListener("visibilitychange", handleVisibilityChange)
    scheduleCheck()
    void refreshSession()

    return () => {
      clearScheduledCheck()
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity)
      })
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return null
}
