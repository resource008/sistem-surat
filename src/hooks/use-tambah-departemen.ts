"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
import {
  EMPTY_DEPARTEMEN_FORM,
  DEFAULT_DEPARTEMEN_COLUMNS,
  type Departemen,
  type DepartemenFormState,
} from "@/types"

export function useTambahDepartemen() {
  const router = useRouter()
  const [form, setForm] = useState<DepartemenFormState>({
    ...EMPTY_DEPARTEMEN_FORM,
    columns: DEFAULT_DEPARTEMEN_COLUMNS.map((column) => ({ ...column })),
  })
  const [departments, setDepartments] = useState<Departemen[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Tambah Departemen" }))
    fetch("/api/dept")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setDepartments(Array.isArray(data) ? data : []))
      .catch(() => setDepartments([]))

    return () => {
      window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    }
  }, [])

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
    if (form.columnMode === "existing" && !form.sourceDepartmentId.trim()) {
      toast.error("Pilih departemen sumber kolom")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/dept", {
        method: "POST",
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

      toast.success("Departemen berhasil ditambahkan")
      router.push("/admin/departemen")
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan departemen"))
    } finally {
      setSaving(false)
    }
  }

  return {
    state: { form, saving, departments },
    actions: { setForm, submit, cancel },
  }
}
