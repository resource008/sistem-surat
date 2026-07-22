import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"

import type { DeptOption, SuratItem } from "@/domain/surat/types"
import { emptySuratItem } from "@/domain/surat/entities"
import {
  getCustomFieldInputValue,
  isFillableSuratColumn,
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
const TAMBAH_SURAT_DRAFT_VERSION = 1
const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/

type TambahSuratDraft = {
  version: number
  deptId: string
  tanggalTerima: string
  asalSurat: string
  suratList: SuratItem[]
}

function getDraftStorageKey(basePath: string) {
  return `sistem-surat:tambah-surat:draft:${basePath}`
}

function getTodayInputDate() {
  return format(new Date(), "yyyy-MM-dd")
}

function normalizeInputDate(value: unknown) {
  return typeof value === "string" && DATE_INPUT_PATTERN.test(value)
    ? value
    : getTodayInputDate()
}

function readDraft(basePath: string): TambahSuratDraft | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(getDraftStorageKey(basePath))
    if (!raw) return null

    const draft = JSON.parse(raw) as Partial<TambahSuratDraft>
    if (draft.version !== TAMBAH_SURAT_DRAFT_VERSION) return null
    if (!Array.isArray(draft.suratList)) return null

    return {
      version: TAMBAH_SURAT_DRAFT_VERSION,
      deptId: typeof draft.deptId === "string" ? draft.deptId : "",
      tanggalTerima: normalizeInputDate(draft.tanggalTerima),
      asalSurat: typeof draft.asalSurat === "string" ? draft.asalSurat : "",
      suratList: draft.suratList.length > 0 ? draft.suratList as SuratItem[] : [emptySuratItem()],
    }
  } catch {
    return null
  }
}

function writeDraft(basePath: string, draft: TambahSuratDraft) {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(getDraftStorageKey(basePath), JSON.stringify(draft))
  } catch {}
}

function clearDraft(basePath: string) {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(getDraftStorageKey(basePath))
  } catch {}
}

function getTambahSuratColumnKey(column: { id?: string; label: string; sortOrder: number }, index: number) {
  const id = column.id?.trim()
  if (id) return id

  const order = Number.isFinite(column.sortOrder) ? column.sortOrder : index
  return `column_${order}_${index}_${column.label.trim().toLowerCase()}`
}

function getSubmitErrorMessage(error: unknown) {
  const message = getErrorMessage(error)
  return message.toLowerCase().includes("departemen") && message.toLowerCase().includes("tidak ditemukan")
    ? DEPT_NOT_FOUND_MESSAGE
    : message
}

export function useTambahSurat(basePath: string) {
  const router       = useRouter()
  const isNavigating = useRef(false)
  const initialDraft = useRef(readDraft(basePath))

  const getReturnPath = () => {
    try {
      sessionStorage.removeItem("add_return_mode")
      return basePath
    } catch {
      return basePath
    }
  }

  // ── States ────────────────────────────────────────────────────────────────
  const [deptId,        setDeptId]        = useState(initialDraft.current?.deptId ?? "")
  const [tanggalTerima, setTanggalTerima] = useState(normalizeInputDate(initialDraft.current?.tanggalTerima))
  const [asalSurat,     setAsalSurat]     = useState(initialDraft.current?.asalSurat ?? "")
  const [deptList,      setDeptList]      = useState<DeptOption[]>([])
  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [previewNomor,  setPreviewNomor]  = useState<string | null>(null)
  const [loadingNomor,  setLoadingNomor]  = useState(false)
  const [suratList,     setSuratList]     = useState<SuratItem[]>(initialDraft.current?.suratList ?? [emptySuratItem()])
  const [formErrors,    setFormErrors]    = useState<Record<string, string>>({})

  // ── Derived ───────────────────────────────────────────────────────────────
  const selectedDept = deptList.find(d => d.id === deptId)
  const selectedTujuan = selectedDept?.shortName ?? ""
  const effectiveAsalSurat = selectedDept?.shortName ?? asalSurat
  const selectedCustomColumns = (selectedDept?.columns ?? []).filter((column) => !column.isDefault)
  const selectedFillableColumns = selectedCustomColumns.filter(isFillableSuratColumn)
  const hasConfiguredColumns = (selectedDept?.columns ?? []).length > 0
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
    if (!selectedDept) return
    setSuratList(prev => applyTujuanToSuratList(prev, selectedTujuan))
  }, [deptId, selectedDept, selectedTujuan])

  useEffect(() => {
    if (saving || isNavigating.current) return

    writeDraft(basePath, {
      version: TAMBAH_SURAT_DRAFT_VERSION,
      deptId,
      tanggalTerima,
      asalSurat,
      suratList,
    })
  }, [asalSurat, basePath, deptId, saving, suratList, tanggalTerima])

  useEffect(() => {
    if (!deptId) { setPreviewNomor(null); return }
    setLoadingNomor(true)
    fetchPreviewNomor(deptId, tanggalTerima)
      .then(setPreviewNomor)
      .finally(() => setLoadingNomor(false))
  }, [deptId, tanggalTerima])

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
      {
        setSuratList(prev => prev.map(s => s.id === id
          ? { ...s, customFields: { ...(s.customFields ?? {}), [columnId]: value } }
          : s
        ))
        const itemIndex = suratList.findIndex((item) => item.id === id)
        if (itemIndex >= 0) {
          setFormErrors((current) => {
            const next = { ...current }
            delete next[`surat_${itemIndex}_custom_${columnId}`]
            return next
          })
        }
      },
    updateLampiranNum: (id: string, raw: string) =>
      actions.updateSurat(id, "lampiran", formatLampiran(raw)),

    handleBack: () => {
      if (isNavigating.current) return
      isNavigating.current = true
      try { sessionStorage.removeItem("add_return_mode") } catch {}
      clearDraft(basePath)
      router.push(getReturnPath())
    },

    handleSubmit: async (e: React.FormEvent) => {
      e.preventDefault()
      if (isNavigating.current) return
      if (deptId && !hasConfiguredColumns) return

      const effectiveTanggalTerima = normalizeInputDate(tanggalTerima)
      if (effectiveTanggalTerima !== tanggalTerima) setTanggalTerima(effectiveTanggalTerima)

      const missing = validateSuratForm({
        deptId, asalSurat: effectiveAsalSurat, tanggalTerima: effectiveTanggalTerima, suratList,
      })
      const nextFormErrors: Record<string, string> = {}
      selectedFillableColumns.forEach((column, columnIndex) => {
        suratList.forEach((item, index) => {
          const fieldKey = getTambahSuratColumnKey(column, columnIndex)
          const value = item.customFields?.[fieldKey] ?? getCustomFieldInputValue(column, item)
          const error = validateCustomFieldValue(column, value)
          if (error) {
            nextFormErrors[`surat_${index}_custom_${column.id}`] = error
            missing.push(`Surat ${index + 1}: ${error}`)
          }
        })
      })
      setFormErrors(nextFormErrors)

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
          deptId, asalSurat: effectiveAsalSurat,
          tujuan:        selectedTujuan,
          tanggalTerima: effectiveTanggalTerima, suratList,
        })

        await saveSurat(payload)

        toast.success("Berhasil Ditambahkan", {
          description: `${suratList.length} surat berhasil disimpan.`,
        })

        try { sessionStorage.removeItem("add_return_mode") } catch {}
        clearDraft(basePath)
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
      selectedCustomColumns, hasFillableColumns, hasConfiguredColumns,
      formErrors,
    },
    actions,
  }
}
