export function generatePassword(length = 12) {
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const number = "0123456789"
  const symbol = "!@#$%^&*"
  const all = lower + upper + number + symbol
  const required = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    number[Math.floor(Math.random() * number.length)],
    symbol[Math.floor(Math.random() * symbol.length)],
  ]

  for (let i = required.length; i < length; i++) {
    required.push(all[Math.floor(Math.random() * all.length)])
  }

  return required.sort(() => Math.random() - 0.5).join("")
}
