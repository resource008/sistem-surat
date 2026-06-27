"use client"

import { useEffect } from "react"

const HEARTBEAT_INTERVAL_MS = 60_000
const HEARTBEAT_MIN_GAP_MS = 45_000
const ACTIVITY_DEBOUNCE_MS = 1_500

let lastHeartbeatAt = 0
let heartbeatInFlight = false

function sendPresenceHeartbeat() {
  const now = Date.now()

  if (heartbeatInFlight || now - lastHeartbeatAt < HEARTBEAT_MIN_GAP_MS) {
    return
  }

  lastHeartbeatAt = now
  heartbeatInFlight = true

  void fetch("/api/login-activity", {
    method: "POST",
    keepalive: true,
  }).catch(() => {
    // Activity tracking must never interrupt dashboard usage.
  }).finally(() => {
    heartbeatInFlight = false
  })
}

export function usePresenceHeartbeat() {
  useEffect(() => {
    let timeoutId: number | undefined

    function scheduleHeartbeat() {
      if (document.visibilityState !== "visible") return

      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(sendPresenceHeartbeat, ACTIVITY_DEBOUNCE_MS)
    }

    sendPresenceHeartbeat()

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        sendPresenceHeartbeat()
      }
    }, HEARTBEAT_INTERVAL_MS)

    window.addEventListener("focus", sendPresenceHeartbeat)
    window.addEventListener("pointerdown", scheduleHeartbeat)
    window.addEventListener("keydown", scheduleHeartbeat)
    window.addEventListener("scroll", scheduleHeartbeat, { passive: true })
    document.addEventListener("visibilitychange", scheduleHeartbeat)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
      window.removeEventListener("focus", sendPresenceHeartbeat)
      window.removeEventListener("pointerdown", scheduleHeartbeat)
      window.removeEventListener("keydown", scheduleHeartbeat)
      window.removeEventListener("scroll", scheduleHeartbeat)
      document.removeEventListener("visibilitychange", scheduleHeartbeat)
    }
  }, [])
}
