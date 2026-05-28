"use client"

import { useEffect } from "react"

const HEARTBEAT_INTERVAL_MS = 15_000

function sendPresenceHeartbeat() {
  void fetch("/api/login-activity", {
    method: "POST",
    keepalive: true,
  }).catch(() => {

  })
}

export function usePresenceHeartbeat() {
  useEffect(() => {
    let timeoutId: number | undefined

    function scheduleHeartbeat() {
      if (document.visibilityState !== "visible") return

      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(sendPresenceHeartbeat, 1_000)
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
