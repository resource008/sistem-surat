export const DEFAULT_TRACK_CATEGORY_COLOR = "#ffffff"

export const TRACK_CATEGORY_COLORS = [
  DEFAULT_TRACK_CATEGORY_COLOR,
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#4f46e5",
  "#64748b",
]

export function normalizeTrackCategoryColor(color: string, fallback = DEFAULT_TRACK_CATEGORY_COLOR) {
  const value = color.trim()
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : fallback
}

export function normalizeTrackCategoryPaletteColor(color: string, fallback = DEFAULT_TRACK_CATEGORY_COLOR) {
  const normalizedColor = normalizeTrackCategoryColor(color, fallback).toLowerCase()
  const normalizedFallback = normalizeTrackCategoryColor(fallback, DEFAULT_TRACK_CATEGORY_COLOR).toLowerCase()

  return TRACK_CATEGORY_COLORS.find((paletteColor) => paletteColor.toLowerCase() === normalizedColor)
    ?? TRACK_CATEGORY_COLORS.find((paletteColor) => paletteColor.toLowerCase() === normalizedFallback)
    ?? DEFAULT_TRACK_CATEGORY_COLOR
}

export function isTrackCategoryPaletteColor(color: string) {
  const normalizedColor = normalizeTrackCategoryColor(color, "").toLowerCase()
  return TRACK_CATEGORY_COLORS.some((paletteColor) => paletteColor.toLowerCase() === normalizedColor)
}

function isWhiteTrackCategoryColor(color: string) {
  return normalizeTrackCategoryColor(color).toLowerCase() === DEFAULT_TRACK_CATEGORY_COLOR
}

function getRelativeLuminance(color: string) {
  const hex = normalizeTrackCategoryColor(color).replace("#", "")
  const channels = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((channel) => {
    const value = parseInt(channel, 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })

  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2])
}

export function getTrackCategoryTextColor(color: string) {
  if (isWhiteTrackCategoryColor(color)) return "#111827"
  return getRelativeLuminance(color) > 0.42 ? "#111827" : "#ffffff"
}

export function getTrackCategoryStyle(color: string) {
  const backgroundColor = normalizeTrackCategoryColor(color)
  const isWhite = isWhiteTrackCategoryColor(backgroundColor)

  return {
    backgroundColor,
    borderColor: isWhite ? "#e5e7eb" : backgroundColor,
    color: getTrackCategoryTextColor(backgroundColor),
  }
}
