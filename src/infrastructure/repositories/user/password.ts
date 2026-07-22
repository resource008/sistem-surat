import { timingSafeEqual } from "node:crypto"
import { scryptAsync } from "@noble/hashes/scrypt.js"
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils.js"

export async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16))
  const key = await scryptAsync(password.normalize("NFKC"), salt, {
    N:      16384,
    r:      16,
    p:      1,
    dkLen:  64,
    maxmem: 128 * 16384 * 16 * 2,
  })
  return `${salt}:${bytesToHex(key)}`
}

export async function verifyPassword(password: string, hashedPassword: string | null | undefined): Promise<boolean> {
  if (!hashedPassword) return false

  const [salt, expectedHex] = hashedPassword.split(":")
  if (!salt || !expectedHex) return false

  try {
    const expected = hexToBytes(expectedHex)
    const actual = await scryptAsync(password.normalize("NFKC"), salt, {
      N:      16384,
      r:      16,
      p:      1,
      dkLen:  expected.length,
      maxmem: 128 * 16384 * 16 * 2,
    })

    return expected.length === actual.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
  } catch {
    return false
  }
}
