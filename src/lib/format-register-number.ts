export function formatRegisterNumber(value: string | number | null | undefined) {
  const numericValue = Number.parseInt(String(value ?? "0"), 10)
  const safeValue = Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0
  return String(safeValue).padStart(4, "0")
}
