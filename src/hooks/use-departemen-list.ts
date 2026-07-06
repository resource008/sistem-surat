"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
import type { Departemen, DepartemenColumn, DepartemenFormState } from "@/types"

function stripColumnId(column: DepartemenColumn) {
  const nextColumn = { ...column } as Partial<DepartemenColumn>
  delete nextColumn.id
  return nextColumn
}

const fetcher = async (url: string): Promise<Departemen[]> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data departemen")
  return json
}

export function useDepartemenList() {
  const { data, error, isLoading, mutate } = useSWR<Departemen[]>("/api/dept?includeInactive=true", fetcher, {
    revalidateOnFocus: true,
  })

  const [deleting, setDeleting] = useState<Departemen | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

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

  async function updateDepartemen(departemen: Departemen, form: DepartemenFormState) {
    if (!form.printSheetName.trim()) {
      toast.error("Identifikasi nama lembar wajib diisi")
      return
    }

    setSavingId(departemen.id)

    try {
      const res = await fetch(`/api/dept/${encodeURIComponent(departemen.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tujuan: form.tujuan,
          shortName: form.shortName,
          printSheetName: form.printSheetName,
          columnMode: form.columnMode,
          sourceDepartmentId: form.sourceDepartmentId,
          columns: form.columns.map(stripColumnId),
        }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal menyimpan departemen")
      }

      toast.success("Departemen berhasil diupdate")
      await mutate()
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan departemen"))
    } finally {
      setSavingId(null)
    }
  }

  return {
    state: {
      departments,
      error,
      isLoading,
      deleting,
      deletingId,
      savingId,
    },
    actions: {
      setDeleting,
      deleteDepartemen,
      updateDepartemen,
    },
  }
}
