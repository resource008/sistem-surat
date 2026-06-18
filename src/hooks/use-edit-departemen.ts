"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
import {
  EMPTY_DEPARTEMEN_FORM,
  DEFAULT_DEPARTEMEN_COLUMNS,
  type Departemen,
  type DepartemenPrintColumnMode,
  type DepartemenFormState,
} from "@/types"

function inferPrintColumnMode(departemen: Departemen, departments: Departemen[]): DepartemenPrintColumnMode {
  const printColumnName = departemen.printColumnName?.trim().toLowerCase()
  if (!printColumnName) return "new"

  const isSharedIdentity = departments.some((item) =>
    item.id !== departemen.id &&
    item.printColumnName?.trim().toLowerCase() === printColumnName
  )

  return isSharedIdentity ? "existing" : "new"
}

export function useEditDepartemen(id: string, breadcrumbTitle = "Edit Departemen") {
  const router = useRouter()
  const [departemen, setDepartemen] = useState<Departemen | null>(null)
  const [departments, setDepartments] = useState<Departemen[]>([])
  const [form, setForm] = useState<DepartemenFormState>(EMPTY_DEPARTEMEN_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: breadcrumbTitle }))
    return () => {
      window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    }
  }, [breadcrumbTitle])

  useEffect(() => {
    let ignore = false

    async function loadDepartemen() {
      setLoading(true)
      try {
        const [deptListRes, res] = await Promise.all([
          fetch("/api/dept"),
          fetch(`/api/dept/${encodeURIComponent(id)}`),
        ])
        const deptListJson = await deptListRes.json().catch(() => null)
        const json = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error(json?.error ?? "Gagal mengambil data departemen")
        }

        if (ignore) return
        const deptList = Array.isArray(deptListJson) ? deptListJson as Departemen[] : []
        const data = json as Departemen
        setDepartments(deptList)
        setDepartemen(data)
        setForm({
          tujuan: data.tujuan,
          shortName: data.shortName,
          printColumnName: data.printColumnName ?? "",
          printColumnMode: inferPrintColumnMode(data, deptList),
          columnMode: "new",
          sourceDepartmentId: "",
          columns: data.columns?.length
            ? data.columns
            : DEFAULT_DEPARTEMEN_COLUMNS.map((column) => ({ ...column })),
        })
      } catch (err) {
        if (!ignore) toast.error(getErrorMessage(err, "Gagal mengambil data departemen"))
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadDepartemen()
    return () => {
      ignore = true
    }
  }, [id])

  function cancel() {
    router.push("/admin/departemen")
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.tujuan.trim()) {
      toast.error("Nama departemen wajib diisi")
      return
    }
    if (!form.shortName.trim()) {
      toast.error("Singkatan departemen wajib diisi")
      return
    }
    if (!form.printColumnName.trim()) {
      toast.error("Identifikasi cetak wajib diisi")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/dept/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tujuan: form.tujuan,
          shortName: form.shortName,
          printColumnName: form.printColumnName,
          columnMode: form.columnMode,
          sourceDepartmentId: form.sourceDepartmentId,
          columns: form.columns,
        }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal menyimpan departemen")
      }

      toast.success("Departemen berhasil diupdate")
      router.push("/admin/departemen")
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan departemen"))
    } finally {
      setSaving(false)
    }
  }

  return {
    state: { departemen, departments, form, loading, saving },
    actions: { setForm, submit, cancel },
  }
}
