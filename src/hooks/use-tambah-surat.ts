import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"

import type { DeptOption, SuratItem } from "@/domain/surat/types"
import { emptySuratItem } from "@/domain/surat/entities"
import {
  getCustomFieldInputValue,
  validateCustomFieldValue,
} from "@/domain/surat/custom-fields"
import {
  validateSuratForm,
  buildCreatePayload,
  formatLampiran,
  applyTujuanToSuratList,
} from "@/domain/surat/use-cases"
import { saveSurat, fetchDeptList, fetchPreviewNomor } from "@/domain/surat/repositories"

const DEPT_NOT_FOUND_MESSAGE = "Departemen tidak ditemukan. Hubungi administrator untuk menambahkannya."

function getSubmitErrorMessage(error: unknown) {
  const message = getErrorMessage(error)
  return message.toLowerCase().includes("departemen") && message.toLowerCase().includes("tidak ditemukan")
    ? DEPT_NOT_FOUND_MESSAGE
    : message
}

export function useTambahSurat(basePath: string) {
  const router       = useRouter()
  const isNavigating = useRef(false)

  const getReturnPath = () => {
    try {
      sessionStorage.removeItem("add_return_mode")
      return basePath
    } catch {
      return basePath
    }
  }

  // ── States ────────────────────────────────────────────────────────────────
  const [deptId,        setDeptId]        = useState("")
  const [tanggalTerima, setTanggalTerima] = useState(format(new Date(), "yyyy-MM-dd"))
  const [asalSurat,     setAsalSurat]     = useState("")
  const [deptList,      setDeptList]      = useState<DeptOption[]>([])
  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [previewNomor,  setPreviewNomor]  = useState<string | null>(null)
  const [loadingNomor,  setLoadingNomor]  = useState(false)
  const [suratList,     setSuratList]     = useState<SuratItem[]>([emptySuratItem()])

  // ── Derived ───────────────────────────────────────────────────────────────
  const selectedDept = deptList.find(d => d.id === deptId)
  const selectedTujuan = selectedDept?.shortName ?? ""
  const selectedCustomColumns = (selectedDept?.columns ?? []).filter((column) => !column.isDefault)
  const hasFillableColumns = selectedCustomColumns.length > 0
  const itemCount    = suratList.length
  const itemLabel    = "Surat"

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchDeptList()
      .then(setDeptList)
      .catch(err => console.error("Fetch dept gagal:", err))
      .finally(() => setLoading(false))

    window.dispatchEvent(new CustomEvent("breadcrumb:sub",    { detail: "Tambah Data" }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [])

  useEffect(() => {
    setSuratList([emptySuratItem()])
  }, [])

  useEffect(() => {
    if (!selectedDept) return
    setSuratList(prev => applyTujuanToSuratList(prev, selectedTujuan))
  }, [deptId, selectedDept, selectedTujuan])

  useEffect(() => {
    if (!deptId) { setPreviewNomor(null); return }
    setLoadingNomor(true)
    fetchPreviewNomor(deptId)
      .then(setPreviewNomor)
      .finally(() => setLoadingNomor(false))
  }, [deptId])

  // ── Actions ───────────────────────────────────────────────────────────────
  const actions = {
    setDeptId,
    setTanggalTerima,
    setAsalSurat,

    // Surat Actions
    addSurat:    () => setSuratList(prev => [...prev, emptySuratItem(selectedTujuan)]),
    removeSurat: (id: string) => setSuratList(prev => prev.filter(s => s.id !== id)),
    updateSurat: (id: string, field: keyof Omit<SuratItem, "id">, value: string) =>
      setSuratList(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s)),
    updateSuratCustomField: (id: string, columnId: string, value: string) =>
      setSuratList(prev => prev.map(s => s.id === id
        ? { ...s, customFields: { ...(s.customFields ?? {}), [columnId]: value } }
        : s
      )),
    updateLampiranNum: (id: string, raw: string) =>
      actions.updateSurat(id, "lampiran", formatLampiran(raw)),

    handleBack: () => {
      if (isNavigating.current) return
      isNavigating.current = true
      try { sessionStorage.removeItem("add_return_mode") } catch {}
      router.push(getReturnPath())
    },

    handleSubmit: async (e: React.FormEvent) => {
      e.preventDefault()
      if (isNavigating.current) return
      if (deptId && !hasFillableColumns) return

      const missing = validateSuratForm({
        deptId, asalSurat, tanggalTerima, suratList,
      })
      selectedCustomColumns.forEach((column) => {
        suratList.forEach((item, index) => {
          const value = getCustomFieldInputValue(column, item)
          const error = validateCustomFieldValue(column, value)
          if (error) missing.push(`Surat ${index + 1}: ${error}`)
        })
      })

      if (missing.length > 0) {
        toast.error("Tidak dapat menyimpan", {
          description: missing.join(", "),
        })
        return
      }

      isNavigating.current = true
      setSaving(true)

      try {
        const payload = buildCreatePayload({
          deptId, asalSurat,
          tujuan:        selectedTujuan,
          tanggalTerima, suratList,
        })

        await saveSurat(payload)

        toast.success("Berhasil Ditambahkan", {
          description: `${suratList.length} surat berhasil disimpan.`,
        })

        try { sessionStorage.removeItem("add_return_mode") } catch {}
        router.push(getReturnPath())
      } catch (err) {
        isNavigating.current = false
        setSaving(false)
        toast.error("Gagal Menyimpan", { description: getSubmitErrorMessage(err) })
      }
    },
  }

  return {
    state: {
      deptId, tanggalTerima, asalSurat, deptList, loading, saving,
      previewNomor, loadingNomor, suratList, selectedDept,
      itemCount, itemLabel,
      selectedCustomColumns, hasFillableColumns,
    },
    actions,
  }
}
