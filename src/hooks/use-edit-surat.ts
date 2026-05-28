"use client"

import { useState, useEffect }         from "react"
import { useRouter, useParams }        from "next/navigation"
import { toast }                       from "sonner"
import type { RegisterSurat, RegisterPI, PIItem, SuratItem } from "@/types"
import {
  validateSuratForm,
  buildUpdatePayload,
  formatLampiran,
}                                      from "@/domain/surat/use-cases"
import { fetchSuratById, editSurat }   from "@/services/surat-service"
import { emptyPIItem, emptySuratItem } from "@/domain/surat/entities"
import { getErrorMessage }             from "@/lib/utils"

// ── Local form-state type ─────────────────────────────────────────────────────
interface FormState {
  deptId:        string
  asalSurat:     string
  tujuan:        string
  tanggalTerima: string
}

// ─────────────────────────────────────────────────────────────────────────────

export function useEditSurat(basePath: string) {
  const { dept, id } = useParams<{ dept: string; id: string }>()
  const router       = useRouter()
  const isPI         = dept === "PI"

  const [original,   setOriginal]   = useState<RegisterSurat | RegisterPI | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<FormState>({
    deptId:        "",
    asalSurat:     "",
    tujuan:        "",
    tanggalTerima: new Date().toISOString().slice(0, 10),
  })

  const [suratList, setSuratList] = useState<SuratItem[]>([])
  const [piList,    setPiList]    = useState<PIItem[]>([])

  // ── Fetch Data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchSuratById(Number(id), dept)
      .then((data: unknown) => {
        if (!data) {
          setError("Data tidak ditemukan")
          return
        }

        const d = data as RegisterSurat | RegisterPI
        setOriginal(d)
        setForm({
          deptId:        d.dept?.shortName             ?? "",
          asalSurat:     d.asalSurat                   ?? "",
          tujuan:        "tujuan" in d ? d.tujuan : "",
          tanggalTerima: d.tanggalTerima?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        })

        if (isPI) {
          const pi = d as RegisterPI
          setPiList(pi.detailPI.map((p) => ({
            id:           String(p.id),
            namaSupplier: p.namaSupplier,
            noInvoice:    p.noInvoice    ?? "",
            nomorSurat:   p.nomorSurat   ?? "",
            tujuan:       p.tujuan       ?? "",
            cc:           p.cc           ?? "",
            tanggalSurat: p.tanggalSurat.slice(0, 10),
          })))
        } else {
          const surat = d as RegisterSurat
          setSuratList(surat.detailSurat.map((s) => ({
            id:           String(s.id),
            perihal:      s.perihal,
            noSurat:      s.noSurat  ?? "",
            lampiran:     s.lampiran ?? "",
            tujuan:       "",
            tanggalSurat: s.tanggalSurat.slice(0, 10),
          })))
        }

        window.dispatchEvent(new CustomEvent("breadcrumb:sub", {
          detail: `Edit · ${d.dept?.shortName} / ${d.nomor}`,
        }))
      })
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
  }, [dept, id, isPI])

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const missing = validateSuratForm({
      asalSurat: form.asalSurat,
      isPIDept:  isPI,
      piList,
      suratList,
    })

    const errs: Record<string, string> = {}
    missing.forEach((msg: string) => { errs[msg] = msg })
    setFormErrors(errs)
    return missing.length === 0
  }

  // ── Actions ─────────────────────────────────────────────────────────────────
  const actions = {
    setField: (key: keyof FormState, value: string) => {
      setForm(prev => {
        const next = { ...prev, [key]: value }
        if (key === "deptId" && value) next.tujuan = value
        return next
      })
      setFormErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    },

    setSuratField: (idx: number, key: keyof SuratItem, value: string) => {
      setSuratList(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s))
      setFormErrors(prev => { const n = { ...prev }; delete n[`surat_${idx}_${key}`]; return n })
    },
    setLampiranNum: (idx: number, raw: string) => {
      setSuratList(prev => prev.map((s, i) => i === idx ? { ...s, lampiran: formatLampiran(raw) } : s))
    },
    addSurat:    () => setSuratList(p => [...p, emptySuratItem()]),
    removeSurat: (idx: number) => setSuratList(p => p.filter((_, i) => i !== idx)),

    setPiField: (idx: number, key: keyof PIItem, value: string) => {
      setPiList(prev => prev.map((p, i) => i === idx ? { ...p, [key]: value } : p))
      setFormErrors(prev => { const n = { ...prev }; delete n[`pi_${idx}_${key}`]; return n })
    },
    addPI:    () => setPiList(p => [...p, emptyPIItem()]),
    removePI: (idx: number) => setPiList(p => p.filter((_, i) => i !== idx)),

    handleBack: () => router.push(`${basePath}/view/${dept}/${id}`),

    handleSave: async () => {
      if (!validate()) return
      setSaving(true)
      try {
        const payload = buildUpdatePayload({
          asalSurat:     form.asalSurat,
          tujuan:        form.tujuan,
          tanggalTerima: form.tanggalTerima,
          isPIDept:      isPI,
          piList,
          suratList,
        })

        const result = await editSurat(Number(id), dept, payload) as RegisterSurat | RegisterPI
        toast.success("Berhasil diubah")
        router.push(`${basePath}/view/${result.dept.id}/${result.id}`)
      } catch (e: unknown) {
        toast.error("Gagal Menyimpan", { description: getErrorMessage(e) })
      } finally {
        setSaving(false)
      }
    },
  }

  return {
    state: { isPI, loading, saving, error, original, form, suratList, piList, formErrors },
    actions,
  }
}