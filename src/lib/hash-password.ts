import { scryptAsync }           from "@noble/hashes/scrypt.js"
import { randomBytes, bytesToHex } from "@noble/hashes/utils.js"

export async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16))
  const key  = await scryptAsync(password.normalize("NFKC"), salt, {
    N:      16384,
    r:      16,
    p:      1,
    dkLen:  64,
    maxmem: 128 * 16384 * 16 * 2,
  })
  return `${salt}:${bytesToHex(key)}`
}