"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2, Save, Calendar as CalendarIcon, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { FormField, FormState, inputClass, readonlyClass, formatTanggal, Role, EMPTY_FORM } from "./shared"
import { toast } from "sonner"

interface SuratMeta { nomor: string; tanggalTerima: string }

interface Props {
  role: Role
  basePath: string
}

export default function EditSuratPage({ role, basePath }: Props) {
  const router = useRouter()
  const { dept, id } = useParams<{ dept: string; id: string }>()

  const [form,          setForm]          = useState<FormState>(EMPTY_FORM)
  const [meta,          setMeta]          = useState<SuratMeta | null>(null)
  const [deptList,      setDeptList]      = useState<{ id: string; shortName: string }[]>([])
  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  const [originalDept,  setOriginalDept]  = useState<string>("")
  const [previewNomor,  setPreviewNomor]  = useState<string | null>(null)
  const [fetchingNomor, setFetchingNomor] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/surat/${dept}/${id}`).then(r => {
        if (!r.ok) throw new Error("Surat tidak ditemukan")
        return r.json()
      }),
      fetch("/api/dept").then(r => r.json()),
    ])
      .then(([data, depts]: [any, any[]]) => {
        const deptsMapped = depts.map((d: any) => ({ id: d.id, shortName: d.shortName }))
        setDeptList(deptsMapped)

        const deptShortName = deptsMapped.find(d => d.id === data.deptId)?.shortName ?? data.deptId

        setForm({
          perihal:       data.perihal,
          asalSurat:     data.asalSurat,
          tujuan:        data.tujuan,
          noSurat:       data.noSurat      ?? "",
          lampiran:      data.lampiran     ?? "",
          tanggalSurat:  data.tanggalSurat?.slice(0, 10)  ?? "",
          tanggalTerima: data.tanggalTerima?.slice(0, 10) ?? "",
          deptId:        deptShortName,
          nomor:         data.nomor      ?? "",
        })
        setMeta({ nomor: data.nomor, tanggalTerima: data.tanggalTerima })
        setOriginalDept(deptShortName)

        window.dispatchEvent(new CustomEvent("breadcrumb:sub", {
          detail: `View Data Surat - ${deptShortName} `,
        }))
        window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: "Edit Data Surat" }))
      })
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [dept, id])

  useEffect(() => {
    if (!form.deptId || form.deptId === originalDept) {
      setPreviewNomor(null)
      return
    }

    let cancelled = false
    setFetchingNomor(true)
    setPreviewNomor(null)

    fetch(`/api/surat/next-nomor?deptId=${form.deptId}`)
      .then(r => {
        if (!r.ok) throw new Error("Gagal fetch nomor")
        return r.json()
      })
      .then(data => {
        if (!cancelled) setPreviewNomor(data.nomor)
      })
      .catch(() => {
        if (!cancelled) setPreviewNomor(null)
      })
      .finally(() => {
        if (!cancelled) setFetchingNomor(false)
      })

    return () => { cancelled = true }
  }, [form.deptId, originalDept])

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  // ✅ Validasi hanya pakai sonner toast
  function validateForm(): boolean {
    const missing: string[] = []

    if (!form.deptId)              missing.push("Departemen")
    if (!form.perihal.trim())      missing.push("Perihal surat")
    if (!form.asalSurat.trim())    missing.push("Asal surat")
    if (!form.tanggalSurat)        missing.push("Tanggal surat")
    if (!form.lampiran.trim())     missing.push("Lampiran")

    if (missing.length > 0) {
      toast.error("Tidak dapat menyimpan data", {
        description: `${missing.join(", ")} wajib diisi.`,
      })
      return false
    }

    return true
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)
    setError(null)
    try {
      const payload = {
        deptId:        form.deptId,
        perihal:       form.perihal,
        asalSurat:     form.asalSurat,
        tujuan:        form.tujuan,
        noSurat:       form.noSurat  || null,
        lampiran:      form.lampiran || null,
        tanggalSurat:  form.tanggalSurat  ? new Date(form.tanggalSurat).toISOString()  : undefined,
        tanggalTerima: form.tanggalTerima ? new Date(form.tanggalTerima).toISOString() : undefined,
      }

      const res = await fetch(`/api/surat/${dept}/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })

      const resBody = await res.json()

      if (!res.ok) {
        throw new Error(resBody.error || "Gagal menyimpan perubahan")
      }

      toast.success("Berhasil Diperbarui", {
        description: `Data surat ${dept || ""} berhasil diperbarui.`,
      })

      router.push(basePath)
    } catch (e) {
      const msg = (e as Error).message
      toast.error("Gagal Menyimpan", {
        description: msg,
      })
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      <p className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">Memuat data...</p>
    </div>
  )

  if (error && form.perihal === "") return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <p className="text-[13px] text-red-500 bg-red-50 dark:bg-red-950 px-4 py-2 rounded-lg">{error}</p>
    </div>
  )

  const deptChanged = form.deptId !== originalDept

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Nomor Registrasi
            </span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[14px] font-medium transition-colors",
                deptChanged
                  ? "text-slate-400 dark:text-slate-600 line-through"
                  : "text-slate-900 dark:text-slate-100"
              )}>
                {meta?.nomor ?? "—"}
              </span>

              {fetchingNomor && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
              )}

              {deptChanged && previewNomor && !fetchingNomor && (
                <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 dark:text-blue-400">
                  <ArrowRight size={13} className="text-slate-400" />
                  {previewNomor}
                </span>
              )}
            </div>

            {deptChanged && previewNomor && !fetchingNomor && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                Nomor akan berubah saat disimpan
              </span>
            )}
          </div>

          <span className={cn(
            "text-[11px] font-medium rounded-full px-3 py-1 border transition-colors",
            deptChanged
              ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
              : "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
          )}>
            {form.deptId || "—"}
          </span>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="p-5 flex flex-col gap-5">

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Departemen">
                <Select
                  value={form.deptId}
                  onValueChange={v => {
                    const selected = deptList.find(d => d.shortName === v)
                    setForm(prev => ({
                      ...prev,
                      deptId: v,
                      tujuan: selected?.shortName ?? prev.tujuan,
                    }))
                  }}
                >
                  <SelectTrigger className={cn(
                    inputClass, "h-10 shadow-none",
                    deptChanged && "border-amber-300 dark:border-amber-700 focus:ring-amber-200 dark:focus:ring-amber-800"
                  )}>
                    <SelectValue placeholder="Pilih departemen" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    {deptList.map(d => (
                      <SelectItem key={d.id} value={d.shortName}
                        className="text-[13px] cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-700 dark:focus:text-blue-300">
                        {d.shortName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Tanggal terima">
                <div className={readonlyClass}>
                  {meta?.tanggalTerima ? formatTanggal(meta.tanggalTerima) : "—"}
                </div>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tanggal surat">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn(
                      inputClass, "h-10 justify-start text-left shadow-none",
                      !form.tanggalSurat && "text-slate-400 dark:text-slate-500"
                    )}>
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                      {form.tanggalSurat
                        ? format(new Date(form.tanggalSurat), "dd MMMM yyyy", { locale: localeID })
                        : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800" align="start">
                    <Calendar mode="single"
                      selected={form.tanggalSurat ? new Date(form.tanggalSurat) : undefined}
                      onSelect={d => setForm(prev => ({ ...prev, tanggalSurat: d?.toISOString() || "" }))}
                      initialFocus className="bg-white dark:bg-slate-950" />
                  </PopoverContent>
                </Popover>
              </FormField>

              <FormField label="No. surat" optional>
                <input className={inputClass} value={form.noSurat} onChange={set("noSurat")}
                  placeholder="Masukkan nomor surat" />
              </FormField>
            </div>

            <FormField label="Perihal surat">
              <textarea className={cn(inputClass, "resize-none leading-relaxed min-h-20")}
                rows={3} value={form.perihal} onChange={set("perihal")}
                placeholder="Masukkan perihal surat" />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Asal surat">
                <input className={inputClass} value={form.asalSurat} onChange={set("asalSurat")}
                  placeholder="Masukkan asal surat" />
              </FormField>

              <FormField label="Tujuan">
                <div className={readonlyClass}>
                  {form.tujuan || "—"}
                </div>
              </FormField>
            </div>

            <FormField label="Lampiran">
              <input className={inputClass} value={form.lampiran} onChange={set("lampiran")}
                placeholder="Masukkan lampiran bentuk set" />
            </FormField>
          </div>

          <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button type="button"
              onClick={() => router.push(basePath)}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 disabled:cursor-not-allowed rounded-lg px-5 py-2 transition-colors shadow-sm">
              {saving
                ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
                : <><Save size={14} /> Simpan Perubahan</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}