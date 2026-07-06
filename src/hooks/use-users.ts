"use client"

import useSWR                from "swr"
import useSWRInfinite        from "swr/infinite"
import { useCallback, useState } from "react"
import { toast }             from "sonner"
import type { User, UserPermissions } from "@/domain/user/types"

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
    `/api/admin/users?${params.toString()}`,
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

export function useInfiniteUsers(options: Omit<UseUsersOptions, "page"> = {}) {
  const { limit = 20, search = "", role = "" } = options

  const getKey = (pageIndex: number, previousPage: PaginatedUsers | null) => {
    if (previousPage && previousPage.meta.page >= previousPage.meta.totalPages) {
      return null
    }

    const params = new URLSearchParams()
    params.set("page", String(pageIndex + 1))
    params.set("limit", String(limit))
    if (search) params.set("search", search)
    if (role) params.set("role", role)

    return `/api/admin/users?${params.toString()}`
  }

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite<PaginatedUsers>(getKey, fetcher, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    })

  const users = data?.flatMap((pageData) => pageData.data) ?? []
  const meta = data?.[data.length - 1]?.meta
  const hasMore = meta ? meta.page < meta.totalPages : false
  const loadingMore = Boolean(data) && isValidating

  return {
    users,
    meta,
    loading: isLoading,
    loadingMore,
    hasMore,
    error: error?.message ?? null,
    size,
    setSize,
    refetch: mutate,
  }
}

export function useUserActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)

  const createUser = useCallback(
    async (body: {
      name:     string
      email:    string
      username: string
      password: string
      role:     string
      permissions?: Partial<UserPermissions>
    }) => {
      setLoading(true)
      try {
        const res  = await fetch("/api/admin/users", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(body),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(getApiMessage(json, "Gagal membuat user"))
        toast.success(json.message ?? "Akun berhasil ditambahkan")
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
      permissions: Partial<UserPermissions>
    }>) => {
      setLoading(true)
      try {
        const res  = await fetch(`/api/admin/users/${id}`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(body),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(getApiMessage(json, "Gagal mengupdate user"))
        toast.success(json.message ?? "Data akun berhasil diubah")
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
        const res  = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
        const json = await res.json()
        if (!res.ok) throw new Error(getApiMessage(json, "Gagal menghapus user"))
        toast.success(json.message ?? "Akun berhasil dihapus")
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

function getApiMessage(json: unknown, fallback: string): string {
  if (typeof json !== "object" || json === null) return fallback

  const body = json as { message?: unknown; error?: unknown; errors?: unknown }
  const fieldMessage = flattenError(body.errors)
  const baseMessage = typeof body.message === "string"
    ? body.message
    : flattenError(body.error)

  if (fieldMessage) return `${baseMessage || fallback}: ${fieldMessage}`
  return baseMessage || fallback
}

function flattenError(error: unknown): string {
  if (typeof error === "string") return error
  if (typeof error === "object" && error !== null) {
    return Object.values(error as Record<string, string[]>).flat().filter(Boolean).join(". ")
  }
  return ""
}
