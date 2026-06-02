export function formatNumber(value: number) {
  return value.toLocaleString("id-ID")
}

export function formatNullableDate(value: string | Date | null) {
  if (!value) return "N/A"
  return new Intl.DateTimeFormat("id-ID", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}