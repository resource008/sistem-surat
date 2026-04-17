"use client"

import { authClient } from "@/infrastructure/auth/auth-client"
import { getRouteByRole } from "@/lib/routes"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import styles from "./login.module.css"
import { useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localStorage.getItem("logout_notif") === "true") {
        localStorage.removeItem("logout_notif")
        toast.success("Berhasil keluar")
      }
    }, 300) // delay 300ms agar Toaster sudah siap

    return () => clearTimeout(timer)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const toastId = toast.loading("Sedang masuk...")

    const { data, error } = await authClient.signIn.username({
      username,
      password,
    })

    if (error) {
      toast.error("Login gagal", {
        id: toastId,
        description: error.message ?? "Username atau password salah.",
      })
      setLoading(false)
      return
    }

    toast.success("Login berhasil!", {
      id: toastId,
      description: `Selamat datang, ${data?.user?.name}`,
    })

    const role = (data?.user as any)?.role
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
                  onChange={(e) => setUsername(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!loading && (
              <button type="submit" className={styles.submitBtn}>
                Masuk
              </button>
            )}

          </form>

          <div className={styles.cardFooter}>
            <span>PT Tolan Tiga Indonesia</span>
          </div>
        </div>
      </div>
    </div>
  )
}