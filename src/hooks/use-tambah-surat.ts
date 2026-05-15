import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { toast } from "sonner"

import { DeptOption, PIItem, SuratItem } from "@/domain/surat/types"
import { isPIDept, emptyPIItem, emptySuratItem } from "@/domain/surat/entities"
import {
  validateTambahForm,
  buildPayload,
  formatLampiran,
  applyTujuanToPIList,
  applyTujuanToSuratList,
} from "@/domain/surat/use-cases"
import { saveSurat, fetchDeptList, fetchPreviewNomor } from "@/domain/surat/repositories"

export function useTambahSurat(basePath: string) {
  const router = useRouter()
  const isNavigating = useRef(false)

  const getReturnPath = () => {
    try {
      return sessionStorage.getItem("add_return_mode") === "pi" ? `${basePath}?mode=pi` : basePath
    } catch {
      return basePath
    }
  }

  // ── States ──────────────────────────────────────────────────────────────
  const [deptId, setDeptId] = useState("")
  const [tanggalTerima, setTanggalTerima] = useState(format(new Date(), "yyyy-MM-dd"))
  const [asalSurat, setAsalSurat] = useState("")
  
  const [deptList, setDeptList] = useState<DeptOption[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [previewNomor, setPreviewNomor] = useState<string | null>(null)
  const [loadingNomor, setLoadingNomor] = useState(false)
  
  const [piList, setPiList] = useState<PIItem[]>([emptyPIItem()])
  const [suratList, setSuratList] = useState<SuratItem[]>([emptySuratItem()])

  // ── Derived States ──────────────────────────────────────────────────────
  const isPI = isPIDept(deptId)
  const selectedDept = deptList.find(d => d.id === deptId)
  const itemCount = isPI ? piList.length : suratList.length
  const itemLabel = isPI ? "Invoice" : "Surat"

  // ── Effects ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchDeptList()
      .then(setDeptList)
      .catch(err => console.error("Fetch dept gagal:", err))
      .finally(() => setLoading(false))

    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Tambah Data" }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [])

  useEffect(() => {
    setPiList([emptyPIItem()])
    setSuratList([emptySuratItem()])
  }, [isPI])

  useEffect(() => {
    if (!selectedDept) return
    if (isPI) setPiList(prev => applyTujuanToPIList(prev, selectedDept.tujuan))
    else setSuratList(prev => applyTujuanToSuratList(prev, selectedDept.tujuan))
  }, [deptId, selectedDept, isPI])

  useEffect(() => {
    if (!deptId) { setPreviewNomor(null); return }
    setLoadingNomor(true)
    fetchPreviewNomor(deptId)
      .then(setPreviewNomor)
      .finally(() => setLoadingNomor(false))
  }, [deptId])

  // ── Handlers ────────────────────────────────────────────────────────────
  const actions = {
    setDeptId,
    setTanggalTerima,
    setAsalSurat,
    
    // PI Actions
    addPI: () => setPiList(prev => [...prev, emptyPIItem(selectedDept?.tujuan)]),
    removePI: (id: string) => setPiList(prev => prev.filter(p => p.id !== id)),
    updatePI: (id: string, field: keyof Omit<PIItem, "id">, value: string) =>
      setPiList(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p)),

    // Surat Actions
    addSurat: () => setSuratList(prev => [...prev, emptySuratItem(selectedDept?.tujuan)]),
    removeSurat: (id: string) => setSuratList(prev => prev.filter(s => s.id !== id)),
    updateSurat: (id: string, field: keyof Omit<SuratItem, "id">, value: string) =>
      setSuratList(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s)),
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

      const missing = validateTambahForm({
        deptId, asalSurat, tanggalTerima, isPIDept: isPI, piList, suratList,
      })

      if (missing.length > 0) {
        toast.error("Tidak dapat menyimpan", { description: `${missing.join(", ")} wajib diisi.` })
        return
      }

      isNavigating.current = true
      setSaving(true)

      try {
        const payload = buildPayload({
          deptId, asalSurat, tujuan: selectedDept?.tujuan || "",
          tanggalTerima, isPIDept: isPI, piList, suratList
        })

        await saveSurat(payload)

        toast.success("Berhasil Ditambahkan", {
          description: isPI ? `${piList.length} invoice berhasil disimpan.` : `${suratList.length} surat berhasil disimpan.`,
        })

        try { sessionStorage.removeItem("add_return_mode") } catch {}
        router.push(getReturnPath())

      } catch (err) {
        isNavigating.current = false
        setSaving(false)
        toast.error("Gagal Menyimpan", { description: (err as Error).message })
      }
    }
  }

  return {
    state: {
      deptId, tanggalTerima, asalSurat, deptList, loading, saving,
      previewNomor, loadingNomor, piList, suratList, isPI, selectedDept,
      itemCount, itemLabel
    },
    actions
  }
}