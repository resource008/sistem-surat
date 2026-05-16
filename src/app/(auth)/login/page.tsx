"use client"

import { getRouteByRole } from "@/constants/routes"
import { authClient } from "@/infrastructure/auth/auth-client"
import type { Role } from "@/types"
import { Eye, EyeOff, Lock, Loader2, User } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import styles from "./login.module.css"

interface AuthUser {
  id:       string
  name:     string
  email:    string
  role:     Role
  username: string
}

export default function LoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [username,     setUsername]     = useState("")
  const [password,     setPassword]     = useState("")
  const [loading,      setLoading]      = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // ── Notifikasi logout via query param ────────────────────────────────────
  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      toast.success("Berhasil keluar")
    }
  }, [searchParams])

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const toastId = toast.loading("Sedang masuk...")

    const { data, error } = await authClient.signIn.username({ username, password })

    if (error) {
      toast.error("Login gagal", {
        id:          toastId,
        description: error.message ?? "Username atau password salah.",
      })
      setLoading(false)
      return
    }

    toast.success("Login berhasil!", {
      id:          toastId,
      description: `Selamat datang, ${data?.user?.name}`,
    })

    const role = (data?.user as unknown as AuthUser)?.role
    router.push(getRouteByRole(role))
  }

  return (
    <div className={styles.root}>
      <div className={styles.bgImage} />
      <div className={styles.bgOverlay} />

      <div className={styles.cardWrapper}>
        <div className={styles.card}>

          <div className={styles.cardHeader}>
            <Image
              src="/sipef_logo.svg"
              alt="Logo SIPEF"
              width={80}
              height={80}
              className={styles.logo}
              priority
            />
            <h1 className={styles.cardTitle}>Sistem Registrasi Surat</h1>
            <p className={styles.cardSubtitle}>Masukkan username dan password anda</p>
          </div>

          <div className={styles.divider} />

          <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Username</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={16} />
                <input
                  className={styles.fieldInput}
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={16} />
                <input
                  className={styles.fieldInput}
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(p => !p)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading
                ? <Loader2 size={16} className={styles.spinner} />
                : "Masuk"
              }
            </button>

          </form>

          <div className={styles.cardFooter}>
            <span>PT Tolan Tiga Indonesia</span>
          </div>

        </div>
      </div>
    </div>
  )
}