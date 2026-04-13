"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { FormField, FormState, EMPTY_FORM, inputClass, readonlyClass, Role } from "./shared"
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

  const [form,         setForm]         = useState<FormState>(EMPTY_FORM)
  const [deptList,     setDeptList]     = useState<DeptOption[]>([])
  const [saving,       setSaving]       = useState(false)
  const [previewNomor, setPreviewNomor] = useState<string | null>(null)
  const [loadingNomor, setLoadingNomor] = useState(false)

  useEffect(() => {
    fetch("/api/dept")
      .then(r => r.json())
      .then(d => setDeptList(d.map((x: any) => ({
        id:        x.id,
        shortName: x.shortName,
        tujuan:    x.tujuan ?? "",
      }))))

    setForm(prev => ({
      ...prev,
      tanggalTerima: format(new Date(), "yyyy-MM-dd"),
    }))

    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Tambah Data" }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [])

  const selectedDept = deptList.find(d => d.id === form.deptId)

  useEffect(() => {
    if (!form.deptId || deptList.length === 0) {
      setPreviewNomor(null)
      return
    }

    const deptData = deptList.find(d => d.id === form.deptId)
    if (!deptData) {
      setPreviewNomor(null)
      return
    }

    setForm(prev => ({ ...prev, tujuan: deptData.tujuan }))

    setLoadingNomor(true)
    fetch(`/api/surat/preview-nomor?deptId=${deptData.id}`)
      .then(r => r.json())
      .then(data => setPreviewNomor(data.nomor ?? null))
      .catch(() => setPreviewNomor(null))
      .finally(() => setLoadingNomor(false))
  }, [form.deptId, deptList])

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
    if (!form.tanggalTerima)       missing.push("Tanggal terima")
    if (!form.lampiran.trim())     missing.push("Lampiran")

    if (missing.length > 0) {
      toast.error("Tidak dapat menyimpan", {
        description: `${missing.join(", ")} wajib diisi.`,
      })
      return false
    }

    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // ✅ Validasi dulu
    if (!validateForm()) return

    setSaving(true)
    try {
      const payload = {
        deptId:        form.deptId,
        perihal:       form.perihal,
        asalSurat:     form.asalSurat,
        tujuan:        form.tujuan,
        noSurat:       form.noSurat  || null,
        lampiran:      form.lampiran || null,
        tanggalSurat:  form.tanggalSurat
          ? parseLocalDate(form.tanggalSurat).toISOString()
          : undefined,
        tanggalTerima: form.tanggalTerima
          ? parseLocalDate(form.tanggalTerima).toISOString()
          : undefined,
      }

      const res = await fetch("/api/surat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })

      const resBody = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(resBody?.error || "Gagal menyimpan data")
      }

      toast.success("Berhasil Ditambahkan", {
        description: `Data surat ${previewNomor ?? ""} berhasil disimpan.`,
      })

      router.push(basePath)
    } catch (e) {
      const msg = (e as Error).message
      toast.error("Gagal Menyimpan", {
        description: msg,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm">

        <div className="flex items-center justify-between px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Nomor Registrasi
            </span>
            <span className="text-[14px] font-mono font-medium text-slate-900 dark:text-slate-100">
              {loadingNomor
                ? <span className="text-slate-400 text-[12px] font-sans">Memuat...</span>
                : previewNomor
                  ? previewNomor
                  : <span className="text-slate-400 text-[12px] font-sans">Pilih departemen dulu</span>
              }
            </span>
          </div>
          {selectedDept && (
            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1">
              {selectedDept.shortName}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 flex flex-col gap-5">

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Departemen">
                <Select
                  value={form.deptId}
                  onValueChange={v => setForm(prev => ({ ...prev, deptId: v }))}
                >
                  <SelectTrigger className={cn(inputClass, "h-10 shadow-none")}>
                    <SelectValue placeholder="Pilih departemen" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    {deptList.map(d => (
                      <SelectItem
                        key={d.id}
                        value={d.id}
                        className="text-[13px] cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-700 dark:focus:text-blue-300"
                      >
                        {d.shortName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Tanggal terima">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline"
                      className={cn(
                        inputClass, "h-10 justify-start text-left shadow-none",
                        !form.tanggalTerima && "text-slate-400 dark:text-slate-500"
                      )}>
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                      {form.tanggalTerima
                        ? format(parseLocalDate(form.tanggalTerima), "dd MMM yyyy", { locale: localeID })
                        : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800" align="start">
                    <Calendar mode="single"
                      selected={form.tanggalTerima ? parseLocalDate(form.tanggalTerima) : undefined}
                      onSelect={d => setForm(prev => ({ ...prev, tanggalTerima: d ? format(d, "yyyy-MM-dd") : "" }))}
                      initialFocus />
                  </PopoverContent>
                </Popover>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tanggal surat">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline"
                      className={cn(
                        inputClass, "h-10 justify-start text-left shadow-none",
                        !form.tanggalSurat && "text-slate-400 dark:text-slate-500"
                      )}>
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                      {form.tanggalSurat
                        ? format(parseLocalDate(form.tanggalSurat), "dd MMM yyyy", { locale: localeID })
                        : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800" align="start">
                    <Calendar mode="single"
                      selected={form.tanggalSurat ? parseLocalDate(form.tanggalSurat) : undefined}
                      onSelect={d => setForm(prev => ({ ...prev, tanggalSurat: d ? format(d, "yyyy-MM-dd") : "" }))}
                    />
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
                  {form.tujuan || "Otomatis terisi berdasarkan departemen"}
                </div>
              </FormField>
            </div>

            <FormField label="Lampiran">
              <input className={inputClass} value={form.lampiran} onChange={set("lampiran")}
                placeholder="Masukkan lampiran dalam bentuk set" />
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
                : <><Save size={14} /> Simpan</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}