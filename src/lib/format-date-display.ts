export function formatDateDisplay(value: string) {
  const trimmed = value.trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)

  if (!match) return trimmed

  const [, year, month, day] = match
  return `${day}-${month}-${year}`
}
