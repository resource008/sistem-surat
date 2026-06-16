"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
import type { Departemen } from "@/types"

const fetcher = async (url: string): Promise<Departemen[]> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data departemen")
  return json
}

export function useDepartemenList() {
  const { data, error, isLoading, mutate } = useSWR<Departemen[]>("/api/dept", fetcher, {
    revalidateOnFocus: true,
  })

  const [deleting, setDeleting] = useState<Departemen | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const departments = useMemo(() => data ?? [], [data])

  async function deleteDepartemen() {
    if (!deleting) return
    setDeletingId(deleting.id)

    try {
      const res = await fetch(`/api/dept/${encodeURIComponent(deleting.id)}`, {
        method: "DELETE",
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.message ?? json?.error ?? "Gagal menghapus departemen")
      }

      toast.success(json?.message ?? "Departemen berhasil dihapus")
      setDeleting(null)
      await mutate()
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus departemen"))
    } finally {
      setDeletingId(null)
    }
  }

  return {
    state: {
      departments,
      error,
      isLoading,
      deleting,
      deletingId,
    },
    actions: {
      setDeleting,
      deleteDepartemen,
    },
  }
}
