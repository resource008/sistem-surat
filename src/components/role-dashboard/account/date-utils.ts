import type { FormattedDateTime } from "./types"

export function formatDateTime(value: Date | string | null | undefined): FormattedDateTime {
  if (!value) return { date: "N/A", time: "" }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { date: "N/A", time: "" }

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")

  return {
    date: `${day}/${month}/${year}, ${hour}.${minute}`,
    time: "",
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
