import type { FormattedDateTime } from "./types"

export function formatDateTime(value: Date | string | null | undefined): FormattedDateTime {
  if (!value) return { date: "-", time: "" }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { date: "-", time: "" }

  return {
    date: date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

export function isSameTimestamp(
  a: Date | string | null | undefined,
  b: Date | string | null | undefined
) {
  if (!a || !b) return false

  const first = new Date(a).getTime()
  const second = new Date(b).getTime()
  if (Number.isNaN(first) || Number.isNaN(second)) return false

  return Math.abs(first - second) < 1000
}
