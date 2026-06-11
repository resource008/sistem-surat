// lib/avatar.ts  (atau utils/avatar.ts)

export const AVATAR_PALETTE = [
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#14b8a6", // teal
  "#6366f1", // indigo
]

export function getAvatarColor(name?: string | null): string {
  const safeName = name?.trim() || "User"
  let hash = 0
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

export function getInitials(name?: string | null): string {
  const safeName = name?.trim() || "User"
  return safeName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}
