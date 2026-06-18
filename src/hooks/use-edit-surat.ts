"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import type { RegisterSurat, SuratItem } from "@/types"
import type { DeptOption } from "@/domain/surat/types"
import {
  getCustomFieldInputValue,
  validateCustomFieldValue,
} from "@/domain/surat/custom-fields"
import {
  buildUpdatePayload,
  formatLampiran,
  validateSuratForm,
} from "@/domain/surat/use-cases"
import {
  applyTujuanToSuratList,
  emptySuratItem,
} from "@/domain/surat/entities"
import { fetchDeptList } from "@/domain/surat/repositories"
import { getErrorMessage } from "@/lib/utils"

const DEPT_NOT_FOUND_MESSAGE = "Departemen tidak ditemukan. Hubungi administrator untuk menambahkannya."

function getSubmitErrorMessage(error: unknown) {
  const message = getErrorMessage(error)
  return message.toLowerCase().includes("departemen") && message.toLowerCase().includes("tidak ditemukan")
    ? DEPT_NOT_FOUND_MESSAGE
    : message
}

interface FormState {
  deptId: string
  asalSurat: string
  tujuan: string
  tanggalTerima: string
}

export function useEditSurat(basePath: string) {
  const { dept, id } = useParams<{ dept: string; id: string }>()
  const router = useRouter()

  const [original, setOriginal] = useState<RegisterSurat | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [previewNomor, setPreviewNomor] = useState<string | null>(null)
  const [deptList, setDeptList] = useState<DeptOption[]>([])

  const [form, setForm] = useState<FormState>({
    deptId: "",
    asalSurat: "",
    tujuan: "",
    tanggalTerima: new Date().toISOString().slice(0, 10),
  })

  const [suratList, setSuratList] = useState<SuratItem[]>([])
  const selectedDept = deptList.find((item) => item.id === form.deptId)
  const selectedCustomColumns = (selectedDept?.columns ?? []).filter((column) => !column.isDefault)

  useEffect(() => {
    fetchDeptList()
      .then(setDeptList)
      .catch((err) => console.error("Fetch dept gagal:", err))
  }, [])

  useEffect(() => {
    fetch(`/api/surat/${dept}/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal mengambil data")
        return res.json()
      })
      .then((data: unknown) => {
        if (!data) {
          setError("Data tidak ditemukan")
          return
        }

        const d = data as RegisterSurat
        setOriginal(d)
        setForm({
          deptId: d.dept?.id ?? "",
          asalSurat: d.asalSurat ?? "",
          tujuan: d.dept?.shortName ?? ("tujuan" in d ? d.tujuan : ""),
          tanggalTerima: d.tanggalTerima?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        })

        setSuratList(d.detailSurat.map((s) => ({
          id: String(s.id),
          perihal: s.perihal,
          noSurat: s.noSurat ?? "",
          lampiran: s.lampiran ?? "",
          tujuan: d.dept?.shortName ?? s.tujuan ?? "",
          tanggalSurat: s.tanggalSurat.slice(0, 10),
          customFields: s.customFields ?? {},
        })))

        window.dispatchEvent(new CustomEvent("breadcrumb:sub", {
          detail: `Edit - ${d.dept?.shortName} / ${d.nomor}`,
        }))
      })
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
  }, [dept, id])

  function validate(): boolean {
    const missing = validateSuratForm({
      asalSurat: form.asalSurat,
      suratList,
    })

    const errs: Record<string, string> = {}
    missing.forEach((msg: string) => { errs[msg] = msg })
    selectedCustomColumns.forEach((column) => {
      suratList.forEach((item, index) => {
        const value = getCustomFieldInputValue(column, item)
        const error = validateCustomFieldValue(column, value)
        if (error) {
          const key = `surat_${index}_custom_${column.id}`
          errs[key] = error
          missing.push(`Surat ${index + 1}: ${error}`)
        }
      })
    })
    setFormErrors(errs)
    if (missing.length > 0) {
      toast.error("Gagal menyimpan", {
        description: `Mohon diisi di bagian: ${missing.join(", ")}`,
      })
    }
    return missing.length === 0
  }

  const actions = {
    setField: (key: keyof FormState, value: string) => {
      const nextTujuan = key === "deptId"
        ? deptList.find((item) => item.id === value)?.shortName ?? ""
        : value

      setForm((prev) => {
        const next = { ...prev, [key]: value }
        if (key === "deptId" && value) next.tujuan = nextTujuan
        return next
      })

      if (key === "deptId" && value) {
        setSuratList((prev) => applyTujuanToSuratList(prev, nextTujuan))
      }

      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })

      if (key === "deptId") {
        if (value && value !== original?.dept?.id) {
          fetch(`/api/surat/preview-nomor?deptId=${value}`)
            .then((res) => res.json())
            .then((data) => setPreviewNomor(data.nomor))
            .catch(() => setPreviewNomor(null))
        } else {
          setPreviewNomor(null)
        }
      }
    },

    setSuratField: (idx: number, key: keyof SuratItem, value: string) => {
      setSuratList((prev) => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s))
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[`surat_${idx}_${key}`]
        return next
      })
    },
    setSuratCustomField: (idx: number, columnId: string, value: string) => {
      setSuratList((prev) => prev.map((s, i) => i === idx
        ? { ...s, customFields: { ...(s.customFields ?? {}), [columnId]: value } }
        : s
      ))
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[`surat_${idx}_custom_${columnId}`]
        return next
      })
    },
    setLampiranNum: (idx: number, raw: string) => {
      setSuratList((prev) => prev.map((s, i) => i === idx ? { ...s, lampiran: formatLampiran(raw) } : s))
    },
    addSurat: () => setSuratList((prev) => [...prev, emptySuratItem(form.tujuan)]),
    removeSurat: (idx: number) => setSuratList((prev) => prev.filter((_, i) => i !== idx)),

    handleBack: () => router.push(`${basePath}/view/${dept}/${id}`),

    handleSave: async () => {
      if (!validate()) return
      setSaving(true)
      try {
        const payload = buildUpdatePayload({
          deptId: form.deptId,
          asalSurat: form.asalSurat,
          tujuan: form.tujuan,
          tanggalTerima: form.tanggalTerima,
          suratList,
        })

        const res = await fetch(`/api/surat/${dept}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const result = await res.json().catch(() => null) as { message?: string } | null
        if (!res.ok) throw new Error(result?.message ?? "Gagal menyimpan")

        toast.success(result?.message ?? "Data surat berhasil diubah")
        router.push(`${basePath}/view/${payload.deptId}/${id}`)
      } catch (e: unknown) {
        toast.error("Gagal Menyimpan", { description: getSubmitErrorMessage(e) })
      } finally {
        setSaving(false)
      }
    },
  }

  return {
    state: {
      loading,
      saving,
      error,
      original,
      form,
      suratList,
      formErrors,
      previewNomor,
      deptList,
      selectedDept,
      selectedCustomColumns,
    },
    actions,
  }
}
