"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit3, Loader2, Trash2 } from "lucide-react"

interface Surat {
  id:            number
  nomor:         string
  deptId:        string
  dept:          { id: string; name: string; shortName: string }
  asalSurat:     string
  perihal:       string
  tujuan:        string
  noSurat:       string | null
  lampiran:      string | null
  tanggalSurat:  string
  tanggalTerima: string
}

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

function FormField({
  label,
  value,
  mono = false,
  fullWidth = false,
}: {
  label: string
  value: string
  mono?: boolean
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <label className="block text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className={[
        "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800",
        "bg-slate-50 dark:bg-slate-900",
        "text-[13px] text-slate-700 dark:text-slate-300",
        mono ? "font-mono text-[12px]" : "font-medium",
      ].join(" ")}>
        {value}
      </div>
    </div>
  )
}

export default function ViewSuratPage() {
  const { dept, id } = useParams<{ dept: string; id: string }>()
  const router = useRouter()

  const [surat,   setSurat]   = useState<Surat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/surat/${dept}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Surat tidak ditemukan")
        return res.json()
      })
      .then(data => {
        setSurat(data)
        window.dispatchEvent(
          new CustomEvent("breadcrumb:sub", {
            detail: `View: ${data.dept.shortName} - ${data.nomor}`
          })
        )
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [dept, id])

  const handleDelete = async () => {
    if (!confirm("Hapus data surat ini?")) return
    const res = await fetch(`/api/surat/${dept}/${id}`, { method: "DELETE" })
    if (res.ok) router.push("/staff/data-surat")
    else alert("Gagal menghapus surat")
  }

  if (loading) return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      <p className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">Memuat data...</p>
    </div>
  )

  if (error || !surat) return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-[13px] text-red-400">{error ?? "Surat tidak ditemukan"}</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-3.5">

      {/* Topbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/staff/data-surat")}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/staff/edit/${dept}/${id}`)}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-600 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg px-3 py-1.5 hover:opacity-80 transition-opacity"
          >
            <Edit3 size={13} /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-red-600 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-lg px-3 py-1.5 hover:opacity-80 transition-opacity"
          >
            <Trash2 size={13} /> Hapus
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 overflow-hidden">

        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Nomor Reg
            </span>
            <span className="text-[13px] font-medium text-slate-800 dark:text-slate-200">
              {surat.nomor}
            </span>
          </div>
          <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-full px-2.5 py-0.5">
            {surat.dept.shortName}
          </span>
        </div>

        {/* Form body */}
        <div className="px-5 py-5 flex flex-col gap-4">

          {/* Perihal — full width */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Perihal surat
            </label>
            <div className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
              {surat.perihal}
            </div>
          </div>

          {/* Row 1: Asal surat + Tujuan */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Asal surat"  value={surat.asalSurat} />
            <FormField label="Tujuan"      value={surat.tujuan} />
          </div>

          {/* Row 2: Nomor surat + Lampiran */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nomor surat" value={surat.noSurat ?? "—"}          mono />
            <FormField label="Lampiran"    value={surat.lampiran ?? "Tidak ada"} />
          </div>

          {/* Row 3: Tanggal surat + Tanggal terima */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal surat"  value={formatTanggal(surat.tanggalSurat)}  />
            <FormField label="Tanggal terima" value={formatTanggal(surat.tanggalTerima)} />
          </div>

        </div>
      </div>
    </div>
  )
}