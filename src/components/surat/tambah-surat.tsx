"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { X, Loader2, Save, Calendar as CalendarIcon, Plus, Trash2, Hash, FileText } from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { FormField, inputClass, readonlyClass, Role } from "./shared"
import { toast } from "sonner"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"

interface DeptOption {
  id:        string
  shortName: string
  tujuan:    string
}

interface PIItem {
  id           : string
  namaSupplier : string
  noInvoice    : string
  tanggalSurat : string
  nomorSurat   : string
  tujuan       : string
  cc           : string
}

interface SuratItem {
  id           : string
  perihal      : string
  noSurat      : string
  lampiran     : string
  tanggalSurat : string
  tujuan       : string
}

interface Props {
  role:     Role
  basePath: string
}

const PI_DEPT_ID = "PI"

const EMPTY_PI_ITEM = (): PIItem => ({
  id           : crypto.randomUUID(),
  namaSupplier : "",
  noInvoice    : "",
  tanggalSurat : "",
  nomorSurat   : "",
  tujuan       : "",
  cc           : "",
})

const EMPTY_SURAT_ITEM = (): SuratItem => ({
  id           : crypto.randomUUID(),
  perihal      : "",
  noSurat      : "",
  lampiran     : "",
  tanggalSurat : "",
  tujuan       : "",
})

const parseLocalDate = (str: string) => {
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

const getLampiranNum = (val: string) => val.replace(/[^0-9]/g, "")

export default function TambahForm({ role, basePath }: Props) {
  const router       = useRouter()
  const isNavigating = useRef(false)

  // Selalu baca fresh dari sessionStorage saat dipanggil
  const getReturnPath = () => {
    try {
      return sessionStorage.getItem("add_return_mode") === "pi"
        ? `${basePath}?mode=pi`
        : basePath
    } catch {
      return basePath
    }
  }

  const [deptId,        setDeptId]        = useState("")
  const [tanggalTerima, setTanggalTerima] = useState(format(new Date(), "yyyy-MM-dd"))
  const [asalSurat,     setAsalSurat]     = useState("")
  const [deptList,      setDeptList]      = useState<DeptOption[]>([])
  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [previewNomor,  setPreviewNomor]  = useState<string | null>(null)
  const [loadingNomor,  setLoadingNomor]  = useState(false)

  const [piList,             setPiList]          = useState<PIItem[]>([EMPTY_PI_ITEM()])
  const [suratList,          setSuratList]       = useState<SuratItem[]>([EMPTY_SURAT_ITEM()])
  const [focusedLampiran,    setFocusedLampiran] = useState<string | null>(null)

  const isPIDept     = deptId === PI_DEPT_ID
  const selectedDept = deptList.find(d => d.id === deptId)
  const itemCount    = isPIDept ? piList.length : suratList.length
  const itemLabel    = isPIDept ? "Invoice" : "Surat"

  useEffect(() => {
    fetch("/api/dept")
      .then(r => r.json())
      .then(d => {
        if (!Array.isArray(d)) return
        setDeptList(d.map((x: any) => ({ id: x.id, shortName: x.shortName, tujuan: x.tujuan ?? "" })))
      })
      .catch(err => console.error("Fetch dept gagal:", err))
      .finally(() => setLoading(false))

    window.dispatchEvent(new CustomEvent("breadcrumb:sub",    { detail: "Tambah Data" }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [])

  useEffect(() => {
    setPiList([EMPTY_PI_ITEM()])
    setSuratList([EMPTY_SURAT_ITEM()])
  }, [isPIDept])

  useEffect(() => {
    if (!selectedDept || !isPIDept) return
    setPiList(prev => prev.map(p => ({ ...p, tujuan: selectedDept.tujuan })))
  }, [deptId])

  useEffect(() => {
    if (!selectedDept || isPIDept) return
    setSuratList(prev => prev.map(s => ({ ...s, tujuan: selectedDept.tujuan })))
  }, [deptId])

  useEffect(() => {
    if (!deptId) { setPreviewNomor(null); return }
    setLoadingNomor(true)
    fetch(`/api/surat/preview-nomor?deptId=${deptId}`)
      .then(r => r.json())
      .then(data => setPreviewNomor(data.nomor ?? null))
      .catch(() => setPreviewNomor(null))
      .finally(() => setLoadingNomor(false))
  }, [deptId])

  const addPI    = () => setPiList(prev => [...prev, { ...EMPTY_PI_ITEM(), tujuan: selectedDept?.tujuan ?? "" }])
  const removePI = (id: string) => setPiList(prev => prev.filter(p => p.id !== id))
  const updatePI = (id: string, field: keyof Omit<PIItem, "id">, value: string) =>
    setPiList(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))

  const addSurat    = () => setSuratList(prev => [...prev, { ...EMPTY_SURAT_ITEM(), tujuan: selectedDept?.tujuan ?? "" }])
  const removeSurat = (id: string) => setSuratList(prev => prev.filter(s => s.id !== id))
  const updateSurat = (id: string, field: keyof Omit<SuratItem, "id">, value: string) =>
    setSuratList(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))

  const updateLampiranNum = (id: string, raw: string) => {
    const num = raw.replace(/[^0-9]/g, "")
    setSuratList(prev => prev.map(s => s.id === id ? { ...s, lampiran: num ? `${num} SET` : "" } : s))
  }

  function validateForm(): boolean {
    const missing: string[] = []
    if (!deptId)           missing.push("Departemen")
    if (!asalSurat.trim()) missing.push("Asal surat")
    if (!tanggalTerima)    missing.push("Tanggal terima")

    if (isPIDept) {
      piList.forEach((p, i) => {
        const no = piList.length > 1 ? ` (Invoice ${i + 1})` : ""
        if (!p.namaSupplier.trim()) missing.push(`Nama supplier${no}`)
        if (!p.tanggalSurat)        missing.push(`Tanggal surat${no}`)
        if (!p.noInvoice.trim())    missing.push(`No. invoice${no}`)
      })
    } else {
      suratList.forEach((s, i) => {
        const no = suratList.length > 1 ? ` (Surat ${i + 1})` : ""
        if (!s.perihal.trim()) missing.push(`Perihal${no}`)
        if (!s.tanggalSurat)   missing.push(`Tanggal surat${no}`)
      })
    }

    if (missing.length > 0) {
      toast.error("Tidak dapat menyimpan", { description: `${missing.join(", ")} wajib diisi.` })
      return false
    }
    return true
  }

  function handleBack() {
    if (isNavigating.current) return
    isNavigating.current = true
    const path = getReturnPath()
    try { sessionStorage.removeItem("add_return_mode") } catch {}
    router.push(path)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return
    if (isNavigating.current) return
    isNavigating.current = true

    setSaving(true)
    try {
      const payload = isPIDept
        ? {
            deptId,
            asalSurat,
            tujuan        : selectedDept?.tujuan || "",
            tanggalTerima : parseLocalDate(tanggalTerima).toISOString(),
            piList        : piList.map(p => ({
              namaSupplier : p.namaSupplier,
              noInvoice    : p.noInvoice    || null,
              nomorSurat   : p.nomorSurat   || null,
              tujuan       : p.tujuan       || null,
              cc           : p.cc           || null,
              tanggalSurat : parseLocalDate(p.tanggalSurat).toISOString(),
            })),
          }
        : {
            deptId,
            asalSurat,
            tujuan        : selectedDept?.tujuan || "",
            tanggalTerima : parseLocalDate(tanggalTerima).toISOString(),
            suratList     : suratList.map(s => ({
              perihal      : s.perihal,
              noSurat      : s.noSurat      || null,
              lampiran     : s.lampiran     || null,
              tanggalSurat : parseLocalDate(s.tanggalSurat).toISOString(),
              tujuan       : s.tujuan       || null,
            })),
          }

      const res     = await fetch("/api/surat", {
        method  : "POST",
        headers : { "Content-Type": "application/json" },
        body    : JSON.stringify(payload),
      })
      const resBody = await res.json().catch(() => null)
      if (!res.ok) throw new Error(resBody?.error || "Gagal menyimpan data")

      toast.success("Berhasil Ditambahkan", {
        description: isPIDept
          ? `${piList.length} invoice berhasil disimpan.`
          : `${suratList.length} surat berhasil disimpan.`,
      })

      const path = getReturnPath()
      try { sessionStorage.removeItem("add_return_mode") } catch {}
      router.push(path)

    } catch (err) {
      isNavigating.current = false  // reset agar bisa coba lagi
      setSaving(false)
      toast.error("Gagal Menyimpan", { description: (err as Error).message })
    }
  }

  if (loading) return (
    <div className="w-full mt-2">
      <LoadingSkeleton type="form" />
    </div>
  )
  
  return (
    <form onSubmit={handleSubmit} 
          className="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col lg:flex-row gap-6 
                     lg:h-[calc(100vh-120px)] lg:overflow-hidden pb-28 lg:pb-0 pt-2 animate-in fade-in duration-300">

      {/* ── SISI KIRI: Register Info ─────────────────────────────────────── */}
      <div className="w-full lg:w-4/12 xl:w-4/12 flex flex-col gap-4 lg:h-full lg:pb-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm flex flex-col max-h-full">
          <div className="px-5 py-4 bg-linear-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Informasi Register
            </h3>
          </div>
          
          <div className="px-5 py-5 flex flex-col gap-5 lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
              <div className={cn(readonlyClass, "flex items-center gap-2")}>
                <CalendarIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-[13px] text-slate-700 dark:text-slate-300">
                  {format(parseLocalDate(tanggalTerima), "dd MMM yyyy", { locale: localeID })}
                </span>
              </div>
            </FormField>

            <FormField label="Asal Surat">
              <input className={inputClass} value={asalSurat}
                onChange={e => setAsalSurat(e.target.value)}
                placeholder="Masukkan asal surat" />
            </FormField>

            <FormField label="Nomor Registrasi">
              <div className={cn(readonlyClass, "flex items-center gap-2")}>
                <Hash className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className={cn(
                  "font-mono text-[13px]",
                  loadingNomor || !previewNomor
                    ? "text-slate-400 dark:text-slate-500 italic font-sans text-[12px]"
                    : "text-slate-700 dark:text-slate-300 font-medium"
                )}>
                  {loadingNomor
                    ? <span className="animate-pulse">Memuat…</span>
                    : previewNomor ?? "Pilih departemen dulu"
                  }
                </span>
                {selectedDept && (
                  <span className="ml-auto shrink-0 text-[11px] font-medium
                    text-blue-700 dark:text-blue-300
                    bg-blue-50 dark:bg-blue-900/30
                    border border-blue-200 dark:border-blue-800
                    rounded-full px-2 py-0.5">
                    {selectedDept.shortName}
                  </span>
                )}
              </div>
            </FormField>
          </div>
        </div>
      </div>

      {/* ── SISI KANAN: Daftar PI / Surat ───────────────────────────────── */}
      <div className="w-full lg:w-8/12 xl:w-8/12 flex flex-col gap-4 lg:overflow-y-auto pb-10 lg:pb-32 lg:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {!deptId ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 px-6 py-12 text-center lg:h-full flex flex-col items-center justify-center min-h-[200px]">
            <FileText className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
            <p className="text-[13px] text-slate-400 dark:text-slate-500">
              Silakan pilih <strong>Departemen</strong> terlebih dahulu di sebelah kiri untuk menambahkan data.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {isPIDept ? (
              <>
                {piList.map((pi, index) => (
                  <div key={pi.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm shrink-0">
                    <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                          <FileText size={12} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Invoice {index + 1}
                        </span>
                      </div>
                      {piList.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removePI(pi.id)} className="h-7 px-2.5 text-[11px] gap-1 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 size={11} /> Hapus
                        </Button>
                      )}
                    </div>
                    <div className="px-5 py-4 flex flex-col gap-4">
                      <FormField label="Nama Supplier">
                        <input className={inputClass} value={pi.namaSupplier}
                          onChange={e => updatePI(pi.id, "namaSupplier", e.target.value)}
                          placeholder="Masukkan nama supplier" />
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="No. Invoice">
                          <input className={inputClass} value={pi.noInvoice}
                            onChange={e => updatePI(pi.id, "noInvoice", e.target.value)}
                            placeholder="Masukkan no. invoice" />
                        </FormField>
                        <FormField label="No. Surat">
                          <input className={inputClass} value={pi.nomorSurat}
                            onChange={e => updatePI(pi.id, "nomorSurat", e.target.value)}
                            placeholder="Opsional" />
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Tujuan">
                          <div className={cn(readonlyClass, "flex items-center gap-2")}>
                            <span className="text-[13px] text-slate-700 dark:text-slate-300">
                              {pi.tujuan || "-"}
                            </span>
                          </div>
                        </FormField>
                        <FormField label="CC">
                          <input className={inputClass} value={pi.cc}
                            onChange={e => updatePI(pi.id, "cc", e.target.value)}
                            placeholder="Opsional" />
                        </FormField>
                      </div>

                      <FormField label="Tanggal Surat">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button type="button" variant="outline"
                              className={cn(inputClass, "h-10 justify-start text-left shadow-none font-normal",
                                !pi.tanggalSurat && "text-slate-400 dark:text-slate-500")}>
                              <CalendarIcon className="mr-2 h-3.5 w-3.5 text-slate-400" />
                              {pi.tanggalSurat
                                ? format(parseLocalDate(pi.tanggalSurat), "dd MMM yyyy", { locale: localeID })
                                : "Pilih tanggal"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800" align="start">
                            <Calendar mode="single"
                              selected={pi.tanggalSurat ? parseLocalDate(pi.tanggalSurat) : undefined}
                              onSelect={d => updatePI(pi.id, "tanggalSurat", d ? format(d, "yyyy-MM-dd") : "")} />
                          </PopoverContent>
                        </Popover>
                      </FormField>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addPI}
                  className="w-full inline-flex items-center justify-center gap-2
                    text-[13px] font-medium text-blue-600 dark:text-blue-400
                    border border-dashed border-blue-300 dark:border-blue-700
                    rounded-2xl py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20
                    hover:border-blue-400 dark:hover:border-blue-600 transition-all">
                  <Plus size={14} />
                  Tambah Invoice Lainnya
                </button>
              </>
            ) : (
              <>
                {suratList.map((surat, index) => (
                  <div key={surat.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm shrink-0">
                    <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                          <FileText size={12} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Surat {index + 1}
                        </span>
                      </div>
                      {suratList.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeSurat(surat.id)} className="h-7 px-2.5 text-[11px] gap-1 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 size={11} /> Hapus
                        </Button>
                      )}
                    </div>
                    <div className="px-5 py-4 flex flex-col gap-4">
                      <FormField label="Perihal">
                        <input className={inputClass} value={surat.perihal}
                          onChange={e => updateSurat(surat.id, "perihal", e.target.value)}
                          placeholder="Masukkan perihal surat" />
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="No. Surat">
                          <input className={inputClass} value={surat.noSurat}
                            onChange={e => updateSurat(surat.id, "noSurat", e.target.value)}
                            placeholder="Opsional" />
                        </FormField>

                        <FormField label="Lampiran">
                          <div className={cn(
                            "relative flex h-10 rounded-xl overflow-hidden",
                            "border border-slate-200 dark:border-slate-800",
                            "bg-white dark:bg-slate-950 transition-all",
                            "focus-within:ring-2 focus-within:ring-blue-500/20",
                            "focus-within:border-blue-500 dark:focus-within:border-blue-500",
                          )}>
                            <input
                              type="text" inputMode="numeric" pattern="[0-9]*"
                              value={getLampiranNum(surat.lampiran)}
                              onChange={e => updateLampiranNum(surat.id, e.target.value)}
                              onFocus={() => setFocusedLampiran(surat.id)}
                              onBlur={()  => setFocusedLampiran(null)}
                              placeholder="Masukkan jumlah"
                              style={{ color: focusedLampiran === surat.id && !getLampiranNum(surat.lampiran) ? 'transparent' : undefined }}
                              className={cn(
                                "flex-1 min-w-0 px-3.5 h-full",
                                "bg-transparent border-0 outline-none",
                                "text-[13px] text-center font-medium",
                                "text-slate-700 dark:text-slate-300",
                                "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                                "placeholder:text-center placeholder:font-normal",
                              )}
                            />
                            <div className={cn(
                              "flex items-center justify-center px-3.5 shrink-0",
                              "border-l border-slate-200 dark:border-slate-800",
                              "bg-slate-50 dark:bg-slate-900",
                              "text-[11px] font-bold tracking-widest",
                              "text-slate-400 dark:text-slate-500 select-none",
                            )}>
                              SET
                            </div>
                          </div>
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Tujuan">
                          <div className={cn(readonlyClass, "flex items-center gap-2")}>
                            <span className="text-[13px] text-slate-700 dark:text-slate-300">
                              {surat.tujuan || "-"}
                            </span>
                          </div>
                        </FormField>

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
                      </div>

                    </div>
                  </div>
                ))}
                <button type="button" onClick={addSurat}
                  className="w-full inline-flex items-center justify-center gap-2
                    text-[13px] font-medium text-blue-600 dark:text-blue-400
                    border border-dashed border-blue-300 dark:border-blue-700
                    rounded-2xl py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20
                    hover:border-blue-400 dark:hover:border-blue-600 transition-all">
                  <Plus size={14} />
                  Tambah Surat Lainnya
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Action Bar Bawah (Melayang) ────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl
          border border-slate-200/80 dark:border-slate-700/60
          bg-white/90 dark:bg-slate-950/90
          backdrop-blur-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/50">
          <Button type="button" variant="ghost" onClick={handleBack}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
              text-slate-600 dark:text-slate-300
              hover:text-slate-900 dark:hover:text-white
              hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={14} />
            Batal
          </Button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
          <Button type="submit" variant="ghost" disabled={saving || !deptId}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
              text-blue-600 dark:text-blue-400
              hover:text-blue-700 dark:hover:text-blue-300
              hover:bg-blue-50 dark:hover:bg-blue-900/30
              disabled:opacity-50 disabled:cursor-not-allowed">
            {saving
              ? <><Loader2 size={14} className="animate-spin" /> Menyimpan…</>
              : <><Save size={14} /> Simpan{itemCount > 1 ? ` ${itemCount} ${itemLabel}` : ""}</>
            }
          </Button>
        </div>
      </div>

    </form>
  )
}