"use client"

import useSWR                from "swr"
import { useCallback, useState } from "react"
import { toast }             from "sonner"
import type { User }         from "@/domain/user/types"

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

// ── Fetcher ───────────────────────────────────────────────────

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Gagal mengambil data user")
    return res.json()
  })

// ── Hook utama ────────────────────────────────────────────────

export function useUsers(options: UseUsersOptions = {}) {
  const { page = 1, limit = 10, search = "", role = "" } = options

  const params = new URLSearchParams()
  params.set("page",  String(page))
  params.set("limit", String(limit))
  if (search) params.set("search", search)
  if (role)   params.set("role",   role)

  const { data, error, isLoading, mutate } = useSWR<PaginatedUsers>(
    `/api/users?${params.toString()}`,
    fetcher,
    {
      refreshInterval:    5_000,  // polling tiap 5 detik
      revalidateOnFocus:  true,    // refetch saat tab difokus
      revalidateOnReconnect: true, // refetch saat koneksi kembali
    }
  )

  return {
    data,
    loading: isLoading,
    error:   error?.message ?? null,
    refetch: mutate,
  }
}

// ── Aksi CRUD (dipakai di komponen form/delete) ───────────────

export function useUserActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)

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

  const updateUser = useCallback(
    async (id: string, body: Partial<{
      name: string; email: string
      username: string; password: string; role: string
    }>) => {
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

// ── Util ──────────────────────────────────────────────────────

function flattenError(error: unknown): string {
  if (typeof error === "string") return error
  if (typeof error === "object" && error !== null) {
    return Object.values(error as Record<string, string[]>).flat().join(". ")
  }
  return "Terjadi kesalahan validasi"
}