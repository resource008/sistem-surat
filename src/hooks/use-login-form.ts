"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getRouteByRole } from "@/constants/routes"
import {
  SESSION_BROWSER_ACTIVE_KEY,
  SESSION_IDLE_LOGOUT_KEY,
  SESSION_LAST_ACTIVITY_KEY,
} from "@/constants/session"
import { authClient } from "@/infrastructure/auth/auth-client"
import type { Role } from "@/types"

interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  username: string
}

export function useLoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const toastId = toast.loading("Sedang masuk...")

    try {
      const { data, error } = await authClient.signIn.username({ username, password })

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

      const now = String(Date.now())
      window.sessionStorage.setItem(SESSION_BROWSER_ACTIVE_KEY, "1")
      window.sessionStorage.setItem(SESSION_LAST_ACTIVITY_KEY, now)
      window.sessionStorage.removeItem(SESSION_IDLE_LOGOUT_KEY)

      try {
        await fetch("/api/admin/login-activity", { method: "POST" })
      } catch {
        // Login tetap dilanjutkan walau pencatatan aktivitas gagal.
      }

      const role = (data?.user as unknown as AuthUser)?.role
      router.push(getRouteByRole(role))
    } catch {
      toast.error("Login gagal", {
        id: toastId,
        description: "Terjadi kesalahan saat masuk.",
      })
      setLoading(false)
    }
  }

  return {
    username,
    password,
    loading,
    showPassword,
    setUsername,
    setPassword,
    setShowPassword,
    handleSubmit,
  }
}
