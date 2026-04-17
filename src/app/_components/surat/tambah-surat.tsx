"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { X, Loader2, Save, Calendar as CalendarIcon, Plus, Trash2, Hash } from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { FormField, SuratItem, EMPTY_SURAT_ITEM, inputClass, readonlyClass, Role } from "./shared"
import { toast } from "sonner"

interface DeptOption {
  id:        string
  shortName: string
  tujuan:    string
}

interface Props {
  role:     Role
  basePath: string
}

const parseLocalDate = (str: string) => {
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export default function TambahSuratPage({ role, basePath }: Props) {
  const router = useRouter()

  const [deptId,        setDeptId]        = useState("")
  const [tanggalTerima, setTanggalTerima] = useState(format(new Date(), "yyyy-MM-dd"))
  const [asalSurat,     setAsalSurat]     = useState("")
  const [tujuan,        setTujuan]        = useState("")
  const [suratList,     setSuratList]     = useState<SuratItem[]>([EMPTY_SURAT_ITEM()])
  const [deptList,      setDeptList]      = useState<DeptOption[]>([])
  const [saving,        setSaving]        = useState(false)
  const [previewNomor,  setPreviewNomor]  = useState<string | null>(null)
  const [loadingNomor,  setLoadingNomor]  = useState(false)

  useEffect(() => {
    fetch("/api/dept")
      .then(r => r.json())
      .then(d => {
        if (!Array.isArray(d)) { console.error("API /api/dept error:", d); return }
        setDeptList(d.map((x: any) => ({ id: x.id, shortName: x.shortName, tujuan: x.tujuan ?? "" })))
      })
      .catch(err => console.error("Fetch dept gagal:", err))

    window.dispatchEvent(new CustomEvent("breadcrumb:sub",    { detail: "Tambah Data" }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [])

  const selectedDept = deptList.find(d => d.id === deptId)

  useEffect(() => {
    if (!deptId || deptList.length === 0) { setPreviewNomor(null); return }
    const dept = deptList.find(d => d.id === deptId)
    if (!dept) { setPreviewNomor(null); return }

    setTujuan(dept.tujuan)
    setLoadingNomor(true)
    fetch(`/api/surat/preview-nomor?deptId=${dept.id}`)
      .then(r => r.json())
      .then(data => setPreviewNomor(data.nomor ?? null))
      .catch(() => setPreviewNomor(null))
      .finally(() => setLoadingNomor(false))
  }, [deptId, deptList])

  const addSurat    = () => setSuratList(prev => [...prev, EMPTY_SURAT_ITEM()])
  const removeSurat = (id: string) => setSuratList(prev => prev.filter(s => s.id !== id))
  const updateSurat = (id: string, field: keyof Omit<SuratItem, "id">, value: string) =>
    setSuratList(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))

  function validateForm(): boolean {
    const missing: string[] = []
    if (!deptId)           missing.push("Departemen")
    if (!asalSurat.trim()) missing.push("Asal surat")
    if (!tanggalTerima)    missing.push("Tanggal terima")

    suratList.forEach((s, i) => {
      const no = suratList.length > 1 ? ` (Surat ${i + 1})` : ""
      if (!s.perihal.trim()) missing.push(`Perihal surat${no}`)
      if (!s.tanggalSurat)   missing.push(`Tanggal surat${no}`)
      if (!s.lampiran)       missing.push(`Lampiran${no}`)
    })

    if (missing.length > 0) {
      toast.error("Tidak dapat menyimpan", { description: `${missing.join(", ")} wajib diisi.` })
      return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      const payload = {
        deptId,
        asalSurat,
        tujuan,
        tanggalTerima: parseLocalDate(tanggalTerima).toISOString(),
        suratList: suratList.map(s => ({
          perihal:      s.perihal,
          noSurat:      s.noSurat || null,
          lampiran:     s.lampiran ? `${s.lampiran} SET` : null,
          tanggalSurat: parseLocalDate(s.tanggalSurat).toISOString(),
        })),
      }

      const res     = await fetch("/api/surat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const resBody = await res.json().catch(() => null)
      if (!res.ok) throw new Error(resBody?.error || "Gagal menyimpan data")

      toast.success("Berhasil Ditambahkan", { description: `${suratList.length} surat berhasil disimpan.` })
      router.push(basePath)
    } catch (e) {
      toast.error("Gagal Menyimpan", { description: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-4 pb-28">

      {/* ── Kartu: Informasi Amplop ──────────────────────────────────────── */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm">

        <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Informasi Surat
          </h3>
        </div>

        <div className="p-5 flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Departemen">
              <Select value={deptId} onValueChange={setDeptId}>
                <SelectTrigger className={cn(inputClass, "h-10 shadow-none")}>
                  <SelectValue placeholder="Pilih departemen" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                  {deptList.map(d => (
                    <SelectItem key={d.id} value={d.id}
                      className="text-[13px] cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-700 dark:focus:text-blue-300">
                      {d.shortName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Tanggal Terima">
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline"
                    className={cn(inputClass, "h-10 justify-start text-left shadow-none font-normal",
                      !tanggalTerima && "text-slate-400 dark:text-slate-500")}>
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-slate-400" />
                    {tanggalTerima
                      ? format(parseLocalDate(tanggalTerima), "dd MMM yyyy", { locale: localeID })
                      : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800" align="start">
                  <Calendar mode="single"
                    selected={tanggalTerima ? parseLocalDate(tanggalTerima) : undefined}
                    onSelect={d => setTanggalTerima(d ? format(d, "yyyy-MM-dd") : "")}
                    initialFocus />
                </PopoverContent>
              </Popover>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Asal Surat">
              <input className={inputClass} value={asalSurat}
                onChange={e => setAsalSurat(e.target.value)}
                placeholder="Masukkan asal surat" />
            </FormField>

            <FormField label="Tujuan">
              <div className={readonlyClass}>
                {tujuan || (
                  <span className="text-slate-400 dark:text-slate-500 italic font-normal">
                    Otomatis dari departemen
                  </span>
                )}
              </div>
            </FormField>
          </div>

          {/* Nomor Registrasi Preview */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
            <Hash className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Nomor Registrasi
              </span>
              <span className="text-[13px] font-mono font-medium text-slate-700 dark:text-slate-300 truncate">
                {loadingNomor
                  ? <span className="text-slate-400 text-[12px] font-sans animate-pulse">Memuat…</span>
                  : previewNomor
                    ? previewNomor
                    : <span className="text-slate-400 text-[12px] font-sans italic font-normal">Pilih departemen dulu</span>
                }
              </span>
            </div>
            {selectedDept && (
              <span className="shrink-0 text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-2.5 py-0.5">
                {selectedDept.shortName}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* ── Kartu: Daftar Surat ──────────────────────────────────────────── */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm">

        <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Daftar Surat
          </h3>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[11px] font-bold text-blue-600 dark:text-blue-400">
            {suratList.length}
          </span>
        </div>

        <div className="p-5 flex flex-col gap-3">

          {suratList.map((surat, index) => (
            <div key={surat.id}
              className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">

              {/* Header baris surat */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Surat {index + 1}
                  </span>
                </div>
                {suratList.length > 1 && (
                  <button type="button" onClick={() => removeSurat(surat.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-all">
                    <Trash2 size={11} />
                    Hapus
                  </button>
                )}
              </div>

              <div className="p-4 flex flex-col gap-4">
                <FormField label="Perihal Surat">
                  <textarea
                    className={cn(inputClass, "resize-none leading-relaxed min-h-16")}
                    rows={2}
                    value={surat.perihal}
                    onChange={e => updateSurat(surat.id, "perihal", e.target.value)}
                    placeholder="Masukkan perihal surat" />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Tanggal Surat">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline"
                          className={cn(inputClass, "h-10 justify-start text-left shadow-none font-normal",
                            !surat.tanggalSurat && "text-slate-400 dark:text-slate-500")}>
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-slate-400" />
                          {surat.tanggalSurat
                            ? format(parseLocalDate(surat.tanggalSurat), "dd MMM yyyy", { locale: localeID })
                            : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800" align="start">
                        <Calendar mode="single"
                          selected={surat.tanggalSurat ? parseLocalDate(surat.tanggalSurat) : undefined}
                          onSelect={d => updateSurat(surat.id, "tanggalSurat", d ? format(d, "yyyy-MM-dd") : "")} />
                      </PopoverContent>
                    </Popover>
                  </FormField>

                  <FormField label="No. Surat">
                    <input className={inputClass} value={surat.noSurat}
                      onChange={e => updateSurat(surat.id, "noSurat", e.target.value)}
                      placeholder="Opsional" />
                  </FormField>
                </div>

                <FormField label="Lampiran">
                  <div className="relative">
                    <input type="text" inputMode="numeric"
                      className={cn(inputClass, "pr-12")}
                      value={surat.lampiran}
                      onChange={e => updateSurat(surat.id, "lampiran", e.target.value.replace(/\D/g, ""))}
                      placeholder="0" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                      <span className="text-[12px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                        SET
                      </span>
                    </div>
                  </div>
                </FormField>
              </div>
            </div>
          ))}

          {/* Tombol Tambah */}
          <button type="button" onClick={addSurat}
            className="w-full inline-flex items-center justify-center gap-2 text-[13px] font-medium text-blue-600 dark:text-blue-400 border border-dashed border-blue-300 dark:border-blue-700 rounded-lg py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-all mt-1 mb-1">
            <Plus size={14} />
            Tambah Surat Lainnya
          </button>

        </div>
      </div>

      {/* ── Floating Action Bar ─────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/50">

        {/* Batal */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(basePath)}
          className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={14} />
          Batal
        </Button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

        {/* Simpan */}
        <Button
          type="submit"
          variant="ghost"
          disabled={saving}
          className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
            ? <><Loader2 size={14} className="animate-spin" /> Menyimpan…</>
            : <><Save size={14} /> Simpan{suratList.length > 1 ? ` ${suratList.length} Surat` : ""}</>
          }
        </Button>

  </div>
</div>

    </form>
  )
}