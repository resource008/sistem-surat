// ============================================================
// src/hooks/use-users.ts
// React hook untuk CRUD User — dipakai oleh komponen admin
// ============================================================

"use client"

import { useState, useEffect, useCallback } from "react"
import { toast }                             from "sonner"
import type { User }                         from "@/domain/user/types"

// ── Tipe lokal ────────────────────────────────────────────────

interface PaginatedUsers {
  data: User[]
  meta: {
    total:      number
    page:       number
    limit:      number
    totalPages: number
  }
}

interface UseUsersOptions {
  page?:   number
  limit?:  number
  search?: string
  role?:   string
}

// ── Hook utama ────────────────────────────────────────────────

export function useUsers(options: UseUsersOptions = {}) {
  const { page = 1, limit = 10, search = "", role = "" } = options

  const [data,    setData]    = useState<PaginatedUsers | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set("page",  String(page))
      params.set("limit", String(limit))
      if (search) params.set("search", search)
      if (role)   params.set("role",   role)

      const res  = await fetch(`/api/users?${params.toString()}`)
      const json = await res.json()

      if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data user")

      setData(json)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, role])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { data, loading, error, refetch: fetchUsers }
}

// ── Hook untuk satu user ──────────────────────────────────────

export function useUser(id: string | null) {
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        if (json.error) throw new Error(json.error)
        setUser(json)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message ?? "Gagal mengambil detail user")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  return { user, loading, error }
}

// ── Aksi CRUD (dipakai di komponen form/delete) ───────────────

export function useUserActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)

  // CREATE
  const createUser = useCallback(
    async (body: {
      name:     string
      email:    string
      username: string
      password: string
      role:     string
    }) => {
      setLoading(true)
      try {
        const res  = await fetch("/api/users", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(body),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(flattenError(json.error))
        toast.success("User berhasil dibuat")
        onSuccess?.()
        return { success: true, data: json as User }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Gagal membuat user"
        toast.error(msg)
        return { success: false, error: msg }
      } finally {
        setLoading(false)
      }
    },
    [onSuccess]
  )

  // UPDATE
  const updateUser = useCallback(
    async (
      id:   string,
      body: Partial<{
        name:     string
        email:    string
        username: string
        password: string
        role:     string
      }>
    ) => {
      setLoading(true)
      try {
        const res  = await fetch(`/api/users/${id}`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(body),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(flattenError(json.error))
        toast.success("User berhasil diupdate")
        onSuccess?.()
        return { success: true, data: json as User }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Gagal mengupdate user"
        toast.error(msg)
        return { success: false, error: msg }
      } finally {
        setLoading(false)
      }
    },
    [onSuccess]
  )

  // DELETE
  const deleteUser = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const res  = await fetch(`/api/users/${id}`, { method: "DELETE" })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Gagal menghapus user")
        toast.success("User berhasil dihapus")
        onSuccess?.()
        return { success: true }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Gagal menghapus user"
        toast.error(msg)
        return { success: false, error: msg }
      } finally {
        setLoading(false)
      }
    },
    [onSuccess]
  )

  return { createUser, updateUser, deleteUser, loading }
}

// ── Util: ratakan error object dari Zod ──────────────────────

function flattenError(
  error: unknown
): string {
  if (typeof error === "string") return error
  if (typeof error === "object" && error !== null) {
    return Object.values(error as Record<string, string[]>)
      .flat()
      .join(". ")
  }
  return "Terjadi kesalahan validasi"
}