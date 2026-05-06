"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Loader2, Save, Plus,
  Trash2, FileText, AlertTriangle, X,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { Button }  from "@/components/ui/button"
import { Input }   from "@/components/ui/input"
import { Badge }   from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"

import {
  RegisterSurat, SuratItem, PIItem, FormState,
  EMPTY_SURAT_ITEM, EMPTY_PI_ITEM, FormField, DatePicker, Role,
} from "./shared"
import React from "react"

interface Props { role: Role; basePath: string }

const DEPT_OPTIONS = [
  "HRD","IT","ENG","BPA","SND","SMD","IAD",
  "MD","GIS","FAD","TAX","PS","ERP","CID","MED", "OMD"
]

const getLampiranNum = (val: string) => val.replace(/[^0-9]/g, "")

export default function EditSuratPage({ role, basePath }: Props) {
  const { dept, id } = useParams<{ dept: string; id: string }>()
  const router       = useRouter()
  const isPI         = dept === "PI"

  const [original,        setOriginal]        = useState<any | null>(null)
  const [loading,         setLoading]         = useState(true)
  const [saving,          setSaving]          = useState(false)
  const [error,           setError]           = useState<string | null>(null)
  const [form,            setForm]            = useState<FormState>({
    deptId:        "",
    asalSurat:     "",
    tujuan:        "",
    tanggalTerima: new Date().toISOString().slice(0, 10),
  })
  const [suratList,       setSuratList]       = useState<SuratItem[]>([])
  const [piList,          setPiList]          = useState<PIItem[]>([])
  const [formErrors,      setFormErrors]      = useState<Record<string, string>>({})
  const [focusedLampiran, setFocusedLampiran] = useState<number | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/surat/${dept}/${id}`)
      .then(r => { if (!r.ok) throw new Error("Data tidak ditemukan"); return r.json() })
      .then((data: any) => {
        setOriginal(data)
        setForm({
          deptId:        data.dept?.shortName ?? "",
          asalSurat:     data.asalSurat       ?? "",
          tujuan:        data.tujuan          ?? "",
          tanggalTerima: data.tanggalTerima?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        })

        if (isPI) {
          setPiList((data.detailPI ?? []).map((p: any) => ({
            id:           String(p.id),
            namaSupplier: p.namaSupplier ?? "",
            noInvoice:    p.noInvoice    ?? "",
            nomorSurat:   p.nomorSurat   ?? "",
            tujuan:       p.tujuan       ?? "",
            cc:           p.cc           ?? "",
            tanggalSurat: p.tanggalSurat?.slice(0, 10) ?? "",
          })))
        } else {
          setSuratList((data.detailSurat ?? []).map((d: any) => ({
            id:           String(d.id),
            perihal:      d.perihal                      ?? "",
            noSurat:      d.noSurat                      ?? "",
            lampiran:     d.lampiran                     ?? "",
            tanggalSurat: d.tanggalSurat?.slice(0, 10)  ?? "",
          })))
        }

        window.dispatchEvent(new CustomEvent("breadcrumb:sub", {
          detail: `Edit · ${data.dept?.shortName} / ${data.nomor}`,
        }))
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [dept, id, isPI])

  // ── Helpers form ───────────────────────────────────────────────────────
  const setField = (key: keyof FormState, value: string) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === "deptId" && value) next.tujuan = value
      return next
    })
    setFormErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  // ── Helpers Surat ──────────────────────────────────────────────────────
  const setSuratField = (idx: number, key: keyof SuratItem, value: string) => {
    setSuratList(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s))
    setFormErrors(prev => { const n = { ...prev }; delete n[`surat_${idx}_${key}`]; return n })
  }

  const setLampiranNum = (idx: number, raw: string) => {
    const num = raw.replace(/[^0-9]/g, "")
    setSuratList(prev => prev.map((s, i) =>
      i === idx ? { ...s, lampiran: num ? `${num} SET` : "" } : s
    ))
  }

  const addSurat    = () => setSuratList(p => [...p, EMPTY_SURAT_ITEM()])
  const removeSurat = (idx: number) => setSuratList(p => p.filter((_, i) => i !== idx))

  // ── Helpers PI ─────────────────────────────────────────────────────────
  const setPiField = (idx: number, key: keyof PIItem, value: string) => {
    setPiList(prev => prev.map((p, i) => i === idx ? { ...p, [key]: value } : p))
    setFormErrors(prev => { const n = { ...prev }; delete n[`pi_${idx}_${key}`]; return n })
  }

  const addPI    = () => setPiList(p => [...p, EMPTY_PI_ITEM()])
  const removePI = (idx: number) => setPiList(p => p.filter((_, i) => i !== idx))

  // ── Validate ───────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.asalSurat) errs.asalSurat = "Asal surat wajib diisi"

    if (isPI) {
      if (piList.length === 0) {
        errs.piList = "Minimal 1 PI harus ada"
      } else {
        piList.forEach((p, i) => {
          if (!p.namaSupplier) errs[`pi_${i}_namaSupplier`] = "Nama supplier wajib diisi"
          if (!p.tanggalSurat) errs[`pi_${i}_tanggalSurat`] = "Tanggal surat wajib diisi"
        })
      }
    } else {
      if (!form.deptId) errs.deptId = "Departemen wajib dipilih"
      if (suratList.length === 0) {
        errs.suratList = "Minimal 1 surat harus ada"
      } else {
        suratList.forEach((s, i) => {
          if (!s.perihal)      errs[`surat_${i}_perihal`]      = "Perihal wajib diisi"
          if (!s.tanggalSurat) errs[`surat_${i}_tanggalSurat`] = "Tanggal surat wajib diisi"
        })
      }
    }

    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const body = isPI
        ? {
            asalSurat:     form.asalSurat,
            tanggalTerima: form.tanggalTerima,
            piList: piList.map(p => ({
              namaSupplier: p.namaSupplier,
              noInvoice:    p.noInvoice    || null,
              nomorSurat:   p.nomorSurat   || null,
              tujuan:       p.tujuan       || null,
              cc:           p.cc           || null,
              tanggalSurat: p.tanggalSurat,
            })),
          }
        : {
            deptId:        form.deptId,
            asalSurat:     form.asalSurat,
            tujuan:        form.tujuan,
            tanggalTerima: form.tanggalTerima,
            suratList: suratList.map(s => ({
              perihal:      s.perihal,
              noSurat:      s.noSurat   || null,
              lampiran:     s.lampiran  || null,
              tanggalSurat: s.tanggalSurat,
            })),
          }

      const res = await fetch(`/api/surat/${dept}/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Gagal menyimpan perubahan")
      const result = await res.json()
      router.push(`${basePath}/view/${result.dept.id}/${result.id}`)
    } catch (e: any) {
      alert(e.message ?? "Terjadi kesalahan")
    } finally {
      setSaving(false)
    }
  }

  // ── Guards ─────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex h-100 w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-[15px] font-normal text-slate-500 dark:text-slate-400">Memuat form data...</p>
    </div>
  )

  if (error || !original) return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <p className="text-[13px] text-red-400 font-medium">
        {error ?? "Data tidak ditemukan"}
      </p>
    </div>
  )

  // ── UI ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Action bar ───────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl
          border border-slate-200/80 dark:border-slate-700/60
          bg-white/90 dark:bg-slate-950/90
          backdrop-blur-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/50">

          <Button variant="ghost"
            onClick={() => router.push(`${basePath}/view/${dept}/${id}`)}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
              text-slate-600 dark:text-slate-300
              hover:text-slate-900 dark:hover:text-white
              hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={14} /> Batal
          </Button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          <Button variant="ghost"
            onClick={isPI ? addPI : addSurat}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
              text-slate-500 dark:text-slate-400
              hover:text-slate-700 dark:hover:text-slate-200
              hover:bg-slate-100 dark:hover:bg-slate-800">
            <Plus size={14} strokeWidth={2.5} /> Tambah
          </Button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          <Button disabled={saving} onClick={handleSave}
            className="gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold
              bg-blue-600 hover:bg-blue-700 text-white">
            {saving
              ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
              : <><Save    size={14} /> Simpan</>
            }
          </Button>
        </div>
      </div>

      {/* ── Konten ───────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto flex flex-col gap-4 animate-in fade-in duration-300">

        {/* Card Register */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800
                        bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
          <div className="px-6 py-4
            bg-linear-to-r from-slate-50 to-white
            dark:from-slate-900 dark:to-slate-950
            border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500
                              uppercase tracking-widest mb-1">
                  Nomor Register
                </p>
                <span className="text-[22px] font-mono font-bold
                                 text-slate-800 dark:text-slate-100 leading-none">
                  {original.nomor}
                </span>
              </div>
              <Badge className="shrink-0 mt-0.5 text-[11px] font-semibold px-2.5 py-0.5
                                rounded-full bg-blue-100 dark:bg-blue-900/40
                                text-blue-700 dark:text-blue-300 border-0">
                {form.deptId || original.dept?.shortName}
              </Badge>
            </div>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">

            {/* Departemen — hanya untuk non-PI */}
            {!isPI && (
              <FormField label="Departemen" error={formErrors.deptId}>
                <Select value={form.deptId} onValueChange={val => setField("deptId", val)}>
                  <SelectTrigger className={cn(
                    "text-[13px] rounded-xl h-10",
                    formErrors.deptId && "border-red-500 dark:border-red-500"
                  )}>
                    <SelectValue placeholder="Pilih departemen..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {DEPT_OPTIONS.map(d => (
                      <SelectItem key={d} value={d}
                        className="text-[13px] cursor-pointer rounded-lg
                          focus:bg-blue-50 dark:focus:bg-blue-900/40
                          focus:text-slate-900 dark:focus:text-white">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}

            {/* Asal Surat + Tujuan */}
            <div className={cn("grid gap-3", isPI ? "grid-cols-1" : "grid-cols-2")}>
              <FormField label="Asal Surat" error={formErrors.asalSurat}>
                <Input
                  value={form.asalSurat}
                  onChange={e => setField("asalSurat", e.target.value)}
                  placeholder="Contoh: PT. Maju Mundur"
                  className={cn(
                    "text-[13px] rounded-xl h-10",
                    formErrors.asalSurat && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormField>
              {!isPI && (
                <FormField label="Tujuan">
                  <div className={cn(
                    "w-full px-3.5 h-10 flex items-center rounded-xl border text-[13px] font-medium",
                    "border-slate-100 dark:border-slate-800/50",
                    "bg-slate-50 dark:bg-slate-900/40",
                    form.tujuan
                      ? "text-slate-600 dark:text-slate-400"
                      : "text-slate-400 dark:text-slate-500",
                    "cursor-not-allowed select-none"
                  )}>
                    {form.tujuan || "Otomatis dari departemen"}
                  </div>
                </FormField>
              )}
            </div>

            {/* Tanggal Terima — readonly */}
            <FormField label="Tanggal Terima">
              <div className={cn(
                "w-full px-3.5 h-10 flex items-center rounded-xl border text-[13px] font-medium",
                "border-slate-100 dark:border-slate-800/50",
                "bg-slate-50 dark:bg-slate-900/40",
                "text-slate-400 dark:text-slate-500 cursor-not-allowed select-none"
              )}>
                {new Date(original.tanggalTerima).toLocaleDateString("id-ID", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
              </div>
            </FormField>
          </div>
        </div>

        {/* ── Daftar PI ──────────────────────────────────────────── */}
        {isPI && (
          <div className="flex flex-col gap-3">
            {formErrors.piList && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertTriangle size={13} className="text-red-500 shrink-0" />
                <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">
                  {formErrors.piList}
                </p>
              </div>
            )}

            {piList.map((pi, idx) => (
              <div key={pi.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800
                           bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-3
                  bg-slate-50/80 dark:bg-slate-900/80
                  border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40
                                    flex items-center justify-center">
                      <FileText size={12} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300
                                     uppercase tracking-wider">
                      Invoice {idx + 1}
                    </span>
                  </div>
                  <Button type="button" variant="ghost" size="sm"
                    onClick={() => removePI(idx)}
                    className="h-7 px-2.5 text-[11px] gap-1 rounded-lg
                      text-red-500 hover:text-red-600
                      hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={11} /> Hapus
                  </Button>
                </div>

                <div className="px-5 py-4 flex flex-col gap-4">
                  <FormField label="Nama Supplier" error={formErrors[`pi_${idx}_namaSupplier`]}>
                    <Input
                      value={pi.namaSupplier}
                      onChange={e => setPiField(idx, "namaSupplier", e.target.value)}
                      placeholder="Nama supplier..."
                      className={cn(
                        "text-[13px] rounded-xl h-10",
                        formErrors[`pi_${idx}_namaSupplier`] && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="No. Invoice">
                      <Input
                        value={pi.noInvoice}
                        onChange={e => setPiField(idx, "noInvoice", e.target.value)}
                        placeholder="Nomor invoice..."
                        className="text-[13px] rounded-xl h-10 font-mono"
                      />
                    </FormField>
                    <FormField label="No. Surat">
                      <Input
                        value={pi.nomorSurat}
                        onChange={e => setPiField(idx, "nomorSurat", e.target.value)}
                        placeholder="Nomor surat..."
                        className="text-[13px] rounded-xl h-10 font-mono"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Tujuan">
                      <Input
                        value={pi.tujuan}
                        onChange={e => setPiField(idx, "tujuan", e.target.value)}
                        placeholder="Tujuan..."
                        className="text-[13px] rounded-xl h-10"
                      />
                    </FormField>
                    <FormField label="CC">
                      <Input
                        value={pi.cc}
                        onChange={e => setPiField(idx, "cc", e.target.value)}
                        placeholder="CC..."
                        className="text-[13px] rounded-xl h-10"
                      />
                    </FormField>
                  </div>

                  <FormField label="Tanggal Surat" error={formErrors[`pi_${idx}_tanggalSurat`]}>
                    <DatePicker
                      value={pi.tanggalSurat}
                      onChange={val => setPiField(idx, "tanggalSurat", val)}
                      hasError={!!formErrors[`pi_${idx}_tanggalSurat`]}
                    />
                  </FormField>
                </div>
              </div>
            ))}

            {piList.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200
                              dark:border-slate-800 px-6 py-10 text-center">
                <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p className="text-[13px] text-slate-400 dark:text-slate-500">
                  Belum ada PI. Klik <span className="font-semibold">Tambah</span> untuk menambahkan.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Daftar Surat ───────────────────────────────────────── */}
        {!isPI && (
          <div className="flex flex-col gap-3">
            {formErrors.suratList && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertTriangle size={13} className="text-red-500 shrink-0" />
                <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">
                  {formErrors.suratList}
                </p>
              </div>
            )}

            {suratList.map((surat, idx) => (
              <div key={surat.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800
                           bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-3
                  bg-slate-50/80 dark:bg-slate-900/80
                  border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40
                                    flex items-center justify-center">
                      <FileText size={12} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300
                                     uppercase tracking-wider">
                      Surat {idx + 1}
                    </span>
                  </div>
                  <Button type="button" variant="ghost" size="sm"
                    onClick={() => removeSurat(idx)}
                    className="h-7 px-2.5 text-[11px] gap-1 rounded-lg
                      text-red-500 hover:text-red-600
                      hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={11} /> Hapus
                  </Button>
                </div>

                <div className="px-5 py-4 flex flex-col gap-4">
                  <FormField label="Perihal Surat" error={formErrors[`surat_${idx}_perihal`]}>
                    <Input
                      value={surat.perihal}
                      onChange={e => setSuratField(idx, "perihal", e.target.value)}
                      placeholder="Isi perihal / pokok surat..."
                      className={cn(
                        "text-[13px] rounded-xl h-10",
                        formErrors[`surat_${idx}_perihal`] && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Nomor Surat">
                      <Input
                        value={surat.noSurat}
                        onChange={e => setSuratField(idx, "noSurat", e.target.value)}
                        placeholder="Masukkan nomor surat"
                        className="text-[13px] rounded-xl h-10 font-mono"
                      />
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
                          onChange={e => setLampiranNum(idx, e.target.value)}
                          onFocus={() => setFocusedLampiran(idx)}
                          onBlur={()  => setFocusedLampiran(null)}
                          placeholder="Masukkan jumlah"
                          style={{ color: focusedLampiran === idx && !getLampiranNum(surat.lampiran) ? 'transparent' : undefined }}
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

                  <FormField label="Tanggal Surat" error={formErrors[`surat_${idx}_tanggalSurat`]}>
                    <DatePicker
                      value={surat.tanggalSurat}
                      onChange={val => setSuratField(idx, "tanggalSurat", val)}
                      hasError={!!formErrors[`surat_${idx}_tanggalSurat`]}
                    />
                  </FormField>
                </div>
              </div>
            ))}

            {suratList.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200
                              dark:border-slate-800 px-6 py-10 text-center">
                <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p className="text-[13px] text-slate-400 dark:text-slate-500">
                  Belum ada surat. Klik <span className="font-semibold">Tambah</span> untuk menambahkan.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="h-20" />
      </div>
    </>
  )
}