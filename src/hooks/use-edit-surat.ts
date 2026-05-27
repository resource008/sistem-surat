// src/hooks/use-edit-surat.ts

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"

import type { PIItem, SuratItem } from "@/domain/surat/types"
import { validateSuratForm, buildUpdatePayload, formatLampiran } from "@/domain/surat/use-cases"
import { fetchSuratById, updateSurat } from "@/domain/surat/repositories"
import { getErrorMessage } from "@/lib/utils"

// ── Local form-state type ─────────────────────────────────────────────────────
interface FormState {
  deptId:        string
  asalSurat:     string
  tujuan:        string
  tanggalTerima: string
}

// ── Helpers matching the old EMPTY_* constants (now inline) ──────────────────
function emptyPIItem(): PIItem {
  return {
    id:           crypto.randomUUID(),
    namaSupplier: "",
    noInvoice:    "",
    nomorSurat:   "",
    tujuan:       "",
    cc:           "",
    tanggalSurat: "",
  }
}

function emptySuratItem(): SuratItem {
  return {
    id:           crypto.randomUUID(),
    perihal:      "",
    noSurat:      "",
    lampiran:     "",
    tujuan:       "",
    tanggalSurat: "",
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function useEditSurat(basePath: string) {
  const { dept, id } = useParams<{ dept: string; id: string }>()
  const router       = useRouter()
  const isPI         = dept === "PI"

  const [original,   setOriginal]   = useState<unknown | null>(null)
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
    fetchSuratById(dept, id)
      .then((data: unknown) => {
        const d = data as any
        setOriginal(d)
        setForm({
          deptId:        d.dept?.shortName    ?? "",
          asalSurat:     d.asalSurat          ?? "",
          tujuan:        d.tujuan             ?? "",
          tanggalTerima: d.tanggalTerima?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        })

        if (isPI) {
          setPiList((d.detailPI ?? []).map((p: Record<string, unknown>) => ({
            id:           String(p.id),
            namaSupplier: (p.namaSupplier as string) ?? "",
            noInvoice:    (p.noInvoice    as string) ?? "",
            nomorSurat:   (p.nomorSurat   as string) ?? "",
            tujuan:       (p.tujuan       as string) ?? "",
            cc:           (p.cc           as string) ?? "",
            tanggalSurat: ((p.tanggalSurat as string | undefined)?.slice(0, 10)) ?? "",
          })))
        } else {
          setSuratList((d.detailSurat ?? []).map((s: Record<string, unknown>) => ({
            id:           String(s.id),
            perihal:      (s.perihal      as string) ?? "",
            noSurat:      (s.noSurat      as string) ?? "",
            lampiran:     (s.lampiran     as string) ?? "",
            tujuan:       (s.tujuan       as string) ?? "",
            tanggalSurat: ((s.tanggalSurat as string | undefined)?.slice(0, 10)) ?? "",
          })))
        }

        window.dispatchEvent(new CustomEvent("breadcrumb:sub", {
          detail: `Edit · ${d.dept?.shortName} / ${d.nomor}`,
        }))
      })
      .catch((e: Error) => setError(e.message))
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

    // Surat Actions
    setSuratField: (idx: number, key: keyof SuratItem, value: string) => {
      setSuratList(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s))
      setFormErrors(prev => { const n = { ...prev }; delete n[`surat_${idx}_${key}`]; return n })
    },
    setLampiranNum: (idx: number, raw: string) => {
      setSuratList(prev => prev.map((s, i) => i === idx ? { ...s, lampiran: formatLampiran(raw) } : s))
    },
    addSurat:    () => setSuratList(p => [...p, emptySuratItem()]),
    removeSurat: (idx: number) => setSuratList(p => p.filter((_, i) => i !== idx)),

    // PI Actions
    setPiField: (idx: number, key: keyof PIItem, value: string) => {
      setPiList(prev => prev.map((p, i) => i === idx ? { ...p, [key]: value } : p))
      setFormErrors(prev => { const n = { ...prev }; delete n[`pi_${idx}_${key}`]; return n })
    },
    addPI:    () => setPiList(p => [...p, emptyPIItem()]),
    removePI: (idx: number) => setPiList(p => p.filter((_, i) => i !== idx)),

    // Navigation & Submit
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

        const result = await updateSurat(dept, id, payload) as any
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