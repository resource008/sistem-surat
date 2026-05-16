import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { FormState, SuratItem, PIItem, EMPTY_SURAT_ITEM, EMPTY_PI_ITEM } from "@/components/surat/shared"

export function useEditSurat(basePath: string) {
  const { dept, id } = useParams<{ dept: string; id: string }>()
  const router = useRouter()
  const isPI = dept === "PI"

  const [original, setOriginal] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [form, setForm] = useState<FormState>({
    deptId: "", asalSurat: "", tujuan: "", tanggalTerima: new Date().toISOString().slice(0, 10),
  })
  
  const [suratList, setSuratList] = useState<SuratItem[]>([])
  const [piList, setPiList] = useState<PIItem[]>([])
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // ── Fetch Data ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/surat/${dept}/${id}`)
      .then(r => { if (!r.ok) throw new Error("Data tidak ditemukan"); return r.json() })
      .then((data: any) => {
        setOriginal(data)
        setForm({
          deptId: data.dept?.shortName ?? "",
          asalSurat: data.asalSurat ?? "",
          tujuan: data.tujuan ?? "",
          tanggalTerima: data.tanggalTerima?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        })

        if (isPI) {
          setPiList((data.detailPI ?? []).map((p: any) => ({
            id: String(p.id),
            namaSupplier: p.namaSupplier ?? "",
            noInvoice: p.noInvoice ?? "",
            nomorSurat: p.nomorSurat ?? "",
            tujuan: p.tujuan ?? "",
            cc: p.cc ?? "",
            tanggalSurat: p.tanggalSurat?.slice(0, 10) ?? "",
          })))
        } else {
          setSuratList((data.detailSurat ?? []).map((d: any) => ({
            id: String(d.id),
            perihal: d.perihal ?? "",
            noSurat: d.noSurat ?? "",
            lampiran: d.lampiran ?? "",
            tanggalSurat: d.tanggalSurat?.slice(0, 10) ?? "",
          })))
        }

        window.dispatchEvent(new CustomEvent("breadcrumb:sub", {
          detail: `Edit · ${data.dept?.shortName} / ${data.nomor}`,
        }))
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [dept, id, isPI])

  // ── Validation ────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.asalSurat) errs.asalSurat = "Asal surat wajib diisi"

    if (isPI) {
      if (piList.length === 0) errs.piList = "Minimal 1 PI harus ada"
      else {
        piList.forEach((p, i) => {
          if (!p.namaSupplier) errs[`pi_${i}_namaSupplier`] = "Nama supplier wajib diisi"
          if (!p.tanggalSurat) errs[`pi_${i}_tanggalSurat`] = "Tanggal surat wajib diisi"
        })
      }
    } else {
      if (!form.deptId) errs.deptId = "Departemen wajib dipilih"
      if (suratList.length === 0) errs.suratList = "Minimal 1 surat harus ada"
      else {
        suratList.forEach((s, i) => {
          if (!s.perihal) errs[`surat_${i}_perihal`] = "Perihal wajib diisi"
          if (!s.tanggalSurat) errs[`surat_${i}_tanggalSurat`] = "Tanggal surat wajib diisi"
        })
      }
    }

    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Actions ───────────────────────────────────────────────────────────
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
      const num = raw.replace(/[^0-9]/g, "")
      setSuratList(prev => prev.map((s, i) => i === idx ? { ...s, lampiran: num ? `${num} SET` : "" } : s))
    },
    addSurat: () => setSuratList(p => [...p, EMPTY_SURAT_ITEM()]),
    removeSurat: (idx: number) => setSuratList(p => p.filter((_, i) => i !== idx)),

    // PI Actions
    setPiField: (idx: number, key: keyof PIItem, value: string) => {
      setPiList(prev => prev.map((p, i) => i === idx ? { ...p, [key]: value } : p))
      setFormErrors(prev => { const n = { ...prev }; delete n[`pi_${idx}_${key}`]; return n })
    },
    addPI: () => setPiList(p => [...p, EMPTY_PI_ITEM()]),
    removePI: (idx: number) => setPiList(p => p.filter((_, i) => i !== idx)),

    // Navigation & Submit
    handleBack: () => router.push(`${basePath}/view/${dept}/${id}`),
    
    handleSave: async () => {
      if (!validate()) return
      setSaving(true)
      try {
        const body = isPI
          ? {
              asalSurat: form.asalSurat,
              tanggalTerima: form.tanggalTerima,
              piList: piList.map(p => ({
                namaSupplier: p.namaSupplier,
                noInvoice: p.noInvoice || null,
                nomorSurat: p.nomorSurat || null,
                tujuan: p.tujuan || null,
                cc: p.cc || null,
                tanggalSurat: p.tanggalSurat,
              })),
            }
          : {
              deptId: form.deptId,
              asalSurat: form.asalSurat,
              tujuan: form.tujuan,
              tanggalTerima: form.tanggalTerima,
              suratList: suratList.map(s => ({
                perihal: s.perihal,
                noSurat: s.noSurat || null,
                lampiran: s.lampiran || null,
                tanggalSurat: s.tanggalSurat,
              })),
            }

        const res = await fetch(`/api/surat/${dept}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Gagal menyimpan perubahan")
        const result = await res.json()
        toast.success("Berhasil diubah")
        router.push(`${basePath}/view/${result.dept.id}/${result.id}`)
      } catch (e: any) {
        toast.error(e.message ?? "Terjadi kesalahan")
      } finally {
        setSaving(false)
      }
    }
  }

  return {
    state: { isPI, loading, saving, error, original, form, suratList, piList, formErrors },
    actions
  }
}