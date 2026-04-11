"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2, Save, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { cn } from "@/lib/utils"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormState {
  perihal:       string
  asalSurat:     string
  tujuan:        string
  noSurat:       string
  lampiran:      string
  tanggalSurat:  string
  tanggalTerima: string
  deptId:        string
}

interface SuratMeta {
  nomor:         string
  tanggalTerima: string
}

const EMPTY: FormState = {
  perihal:       "",
  asalSurat:     "",
  tujuan:        "",
  noSurat:       "",
  lampiran:      "",
  tanggalSurat:  "",
  tanggalTerima: "",
  deptId:        "",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const inputClass = cn(
  "w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
  "border border-slate-200 dark:border-slate-800",
  "bg-white dark:bg-slate-950",
  "text-slate-800 dark:text-slate-200",
  "placeholder:text-slate-400 dark:placeholder:text-slate-500",
  // Hover states
  "hover:border-blue-400 dark:hover:border-blue-700",
  // Focus states
  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500"
)

const readonlyClass = cn(
  "w-full px-3 py-2 rounded-lg text-[13px] font-medium",
  "border border-slate-100 dark:border-slate-800/60",
  "bg-slate-50 dark:bg-slate-900/50",
  "text-slate-400 dark:text-slate-500",
  "cursor-not-allowed select-none"
)

// ─── FormField ────────────────────────────────────────────────────────────────

function FormField({
  label,
  optional = false,
  hint,
  children,
}: {
  label:     string
  optional?: boolean
  hint?:     string
  children:  React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        {optional && (
          <span className="text-[10px] normal-case font-normal text-slate-400 dark:text-slate-500">
            (opsional)
          </span>
        )}
        {hint && (
          <span className="text-[10px] normal-case font-normal text-blue-500 dark:text-blue-400">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditSuratPage() {
  const router = useRouter()
  const { dept, id } = useParams<{ dept: string; id: string }>()

  const [form,     setForm]     = useState<FormState>(EMPTY)
  const [meta,     setMeta]     = useState<SuratMeta | null>(null)
  const [deptList, setDeptList] = useState<{ id: string; shortName: string }[]>([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/surat/${dept}/${id}`).then(r => {
        if (!r.ok) throw new Error("Surat tidak ditemukan")
        return r.json()
      }),
      fetch("/api/dept").then(r => r.json()),
    ])
      .then(([data, depts]: [any, any[]]) => {
        setDeptList(depts.map((d: any) => ({
          id:        d.id,
          shortName: d.shortName,
        })))

        setForm({
          perihal:       data.perihal,
          asalSurat:     data.asalSurat,
          tujuan:        data.tujuan,
          noSurat:       data.noSurat      ?? "",
          lampiran:      data.lampiran     ?? "",
          tanggalSurat:  data.tanggalSurat?.slice(0, 10)  ?? "",
          tanggalTerima: data.tanggalTerima?.slice(0, 10) ?? "",
          deptId:        data.deptId,
        })

        setMeta({
          nomor:         data.nomor,
          tanggalTerima: data.tanggalTerima,
        })
      })
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [dept, id])

  const handleDeptChange = (shortName: string) => {
    setForm(prev => ({ ...prev, deptId: shortName }))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/surat/${dept}/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deptId:        form.deptId,
          perihal:       form.perihal,
          asalSurat:     form.asalSurat,
          tujuan:        form.tujuan,
          noSurat:       form.noSurat  || null,
          lampiran:      form.lampiran || null,
          tanggalSurat:  form.tanggalSurat
            ? new Date(form.tanggalSurat).toISOString()
            : undefined,
          tanggalTerima: form.tanggalTerima
            ? new Date(form.tanggalTerima).toISOString()
            : undefined,
        }),
      })

      if (!res.ok) throw new Error("Gagal menyimpan perubahan")
      router.push(`/staff/view/${form.deptId}/${id}`)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (loading) return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      <p className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">
        Memuat data...
      </p>
    </div>
  )

  if (error && form.perihal === "") return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <p className="text-[13px] text-red-500 bg-red-50 dark:bg-red-950 px-4 py-2 rounded-lg">{error}</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(`/staff/view/${dept}/${id}`)}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
      </div>

      {/* Card Form */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Nomor Registrasi
            </span>
            <span className="text-[14px] font-medium text-slate-900 dark:text-slate-100">
              {meta?.nomor ?? "—"}
            </span>
          </div>
          <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1">
            {form.deptId || "—"}
          </span>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="p-5 flex flex-col gap-5">
            {error && (
              <div className="px-4 py-3 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/50 text-[13px] text-red-600 dark:text-red-400 flex items-center gap-2">
                {error}
              </div>
            )}

            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Departemen">
                <Select value={form.deptId} onValueChange={handleDeptChange}>
                  <SelectTrigger className={cn(
                    inputClass, 
                    "h-10 shadow-none hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}>
                    <SelectValue placeholder="Pilih departemen" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    {deptList.map(d => (
                      <SelectItem 
                        key={d.id} 
                        value={d.shortName} 
                        className="text-[13px] cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-700 dark:focus:text-blue-300"
                      >
                        {d.shortName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Tanggal terima" hint="· otomatis">
                <div className={readonlyClass}>
                  {meta?.tanggalTerima ? formatTanggal(meta.tanggalTerima) : "—"}
                </div>
              </FormField>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tanggal surat">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        inputClass,
                        "h-10 justify-start text-left shadow-none hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100",
                        !form.tanggalSurat && "text-slate-400 dark:text-slate-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                      {form.tanggalSurat ? (
                        format(new Date(form.tanggalSurat), "dd MMMM yyyy", { locale: localeID })
                      ) : (
                        <span>Pilih tanggal surat</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800" align="start">
                    <Calendar
                      mode="single"
                      selected={form.tanggalSurat ? new Date(form.tanggalSurat) : undefined}
                      onSelect={(date) => 
                        setForm(prev => ({ ...prev, tanggalSurat: date?.toISOString() || "" }))
                      }
                      initialFocus
                      className="bg-white dark:bg-slate-950"
                    />
                  </PopoverContent>
                </Popover>
              </FormField>

              <FormField label="No. surat" optional>
                <input
                  className={inputClass}
                  value={form.noSurat}
                  onChange={set("noSurat")}
                  placeholder="Nomor surat dari pengirim"
                />
              </FormField>
            </div>

            <FormField label="Perihal surat">
              <textarea
                className={cn(inputClass, "resize-none leading-relaxed min-h-[80px]")}
                rows={3}
                value={form.perihal}
                onChange={set("perihal")}
                placeholder="Ringkasan isi surat..."
                required
              />
            </FormField>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Asal surat">
                <input
                  className={inputClass}
                  value={form.asalSurat}
                  onChange={set("asalSurat")}
                  placeholder="Instansi pengirim"
                  required
                />
              </FormField>
              
              <FormField label="Tujuan">
                <input
                  className={inputClass}
                  value={form.tujuan}
                  onChange={set("tujuan")}
                  placeholder="Penerima di dalam perusahaan"
                  required
                />
              </FormField>
            </div>

            <FormField label="Lampiran" optional>
              <input
                className={inputClass}
                value={form.lampiran}
                onChange={set("lampiran")}
                placeholder="Misal: 2 Lembar, 1 Berkas"
              />
            </FormField>

          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/staff/view/${dept}/${id}`)}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 disabled:cursor-not-allowed rounded-lg px-5 py-2 transition-colors shadow-sm"
            >
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