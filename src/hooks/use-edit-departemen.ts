"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
import { hydrateDepartemenForClient } from "@/lib/departemen-columns"
import {
  EMPTY_DEPARTEMEN_FORM,
  DEFAULT_DEPARTEMEN_COLUMNS,
  type Departemen,
  type DepartemenColumn,
  type DepartemenPrintSheetMode,
  type DepartemenFormState,
} from "@/types"

function stripColumnId(column: DepartemenColumn) {
  const nextColumn = { ...column } as Partial<DepartemenColumn>
  delete nextColumn.id
  return nextColumn
}

async function fetchDepartemenDetails(departments: Departemen[]) {
  return Promise.all(
    departments.map(async (department) => {
      const res = await fetch(`/api/admin/dept/${encodeURIComponent(department.id)}`)
      const json = await res.json().catch(() => null)
      return res.ok ? hydrateDepartemenForClient(json as Departemen) : department
    })
  )
}

function inferPrintSheetMode(departemen: Departemen, departments: Departemen[]): DepartemenPrintSheetMode {
  const printSheetName = departemen.printSheetName?.trim().toLowerCase()
  if (!printSheetName) return "new"

  const isSharedIdentity = departments.some((item) =>
    item.id !== departemen.id &&
    item.printSheetName?.trim().toLowerCase() === printSheetName
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
          fetch("/api/admin/dept"),
          fetch(`/api/admin/dept/${encodeURIComponent(id)}`),
        ])
        const deptListJson = await deptListRes.json().catch(() => null)
        const json = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error(json?.error ?? "Gagal mengambil data departemen")
        }

        if (ignore) return
        const rawDeptList = Array.isArray(deptListJson) ? deptListJson as Departemen[] : []
        const deptList = await fetchDepartemenDetails(rawDeptList)
        const data = hydrateDepartemenForClient(json as Departemen)
        if (ignore) return
        setDepartments(deptList)
        setDepartemen(data)
        setForm({
          tujuan: data.tujuan ?? data.fullName ?? "",
          shortName: data.shortName,
          printSheetName: data.printSheetName ?? "",
          printSheetMode: inferPrintSheetMode(data, deptList),
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
    const printSheetName = form.printSheetName.trim()

    if (!printSheetName) {
      toast.error("Identifikasi nama lembar wajib diisi")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/dept/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tujuan: form.tujuan,
          shortName: form.shortName,
          printSheetName,
          columnMode: form.columnMode,
          sourceDepartmentId: form.sourceDepartmentId,
          columns: form.columns.map(stripColumnId),
        }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(getApiMessage(json, "Gagal menyimpan departemen"))
      }

      toast.success(json?.message ?? "Data departemen berhasil diubah")
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

function getApiMessage(json: unknown, fallback: string): string {
  if (typeof json !== "object" || json === null) return fallback
  const body = json as { message?: unknown; error?: unknown; errors?: unknown }
  const baseMessage = typeof body.message === "string"
    ? body.message
    : typeof body.error === "string"
      ? body.error
      : fallback

  if (typeof body.errors === "object" && body.errors !== null) {
    const details = Object.values(body.errors as Record<string, string[]>)
      .flat()
      .filter(Boolean)
      .join(". ")

    if (details) return `${baseMessage}: ${details}`
  }

  return baseMessage
}
