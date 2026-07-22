const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseDateInput(value?: string | null) {
  if (!value) return null

  const match = value.trim().match(DATE_INPUT_PATTERN)
  if (!match) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  return Number.isNaN(date.getTime()) ? null : date
}

export function getDateInputDayRange(value?: string | null) {
  const date = parseDateInput(value)
  if (!date) return null

  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}
