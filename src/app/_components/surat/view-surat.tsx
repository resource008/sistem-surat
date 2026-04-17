"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft, Edit3, Loader2, Trash2,
  FileText, AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Badge }  from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { RegisterSurat, Role, formatTanggal } from "./shared"

interface Props { role: Role; basePath: string }

/* ------------------------------------------------------------------ */
/*  Field                                                               */
/* ------------------------------------------------------------------ */
function Field({
  label, value, mono = false, icon, fullWidth = false,
}: {
  label: string; value: string; mono?: boolean
  icon?: React.ReactNode; fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <p className="flex items-center gap-1.5 text-[10px] font-semibold
                    text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
        {icon}<span>{label}</span>
      </p>
      <div className={[
        "w-full px-3.5 py-2.5 rounded-xl",
        "border border-slate-200 dark:border-slate-800",
        "bg-slate-50/70 dark:bg-slate-900/50",
        "text-[13px] text-slate-700 dark:text-slate-300",
        mono ? "font-mono text-[12px] tracking-wide" : "font-medium",
      ].join(" ")}>
        {value}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function ViewSuratPage({ role, basePath }: Props) {
  const { dept, id } = useParams<{ dept: string; id: string }>()
  const router       = useRouter()

  const [register,       setRegister]       = useState<RegisterSurat | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState<string | null>(null)
  const [deleting,       setDeleting]       = useState(false)
  const [showDeleteConf, setShowDeleteConf] = useState(false)

  /* fetch --------------------------------------------------------- */
  useEffect(() => {
    fetch(`/api/surat/${dept}/${id}`)
      .then(r => { if (!r.ok) throw new Error("Data tidak ditemukan"); return r.json() })
      .then(data => {
        setRegister(data)
        window.dispatchEvent(new CustomEvent("breadcrumb:sub", {
          detail: `${data.dept.shortName} / ${data.nomor}`,
        }))
        window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [dept, id])

  /* delete -------------------------------------------------------- */
  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/surat/${dept}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      router.push(basePath)
    } catch {
      setDeleting(false)
      setShowDeleteConf(false)
    }
  }

  /* loading state ------------------------------------------------- */
  if (loading) return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900
                      flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
      <p className="text-[11px] font-medium text-slate-400 tracking-[0.2em] uppercase">
        Memuat data...
      </p>
    </div>
  )

  /* error state --------------------------------------------------- */
  if (error || !register) return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/20
                      flex items-center justify-center">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <p className="text-[13px] text-red-400 font-medium">
        {error ?? "Data tidak ditemukan"}
      </p>
      <Button variant="outline" size="sm" onClick={() => router.push(basePath)}
        className="text-[12px] gap-1.5 rounded-xl mt-1">
        <ArrowLeft size={12} /> Kembali
      </Button>
    </div>
  )

  /* render -------------------------------------------------------- */
  return (
    <>
      {/* ── AlertDialog konfirmasi hapus ─────────────────────────── */}
      <AlertDialog open={showDeleteConf} onOpenChange={setShowDeleteConf}>
        <AlertDialogContent
          className="
            bg-white dark:bg-slate-950
            border border-slate-200 dark:border-slate-800
            shadow-xl shadow-black/20
          "
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className="text-slate-900 dark:text-slate-100 text-[15px] font-semibold"
            >
              Hapus Register Surat?
            </AlertDialogTitle>
            <AlertDialogDescription
              className="text-slate-500 dark:text-slate-400 text-[13px] leading-relaxed"
            >
              Seluruh data surat dalam register&nbsp;
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                #{register.nomor}
              </span>
              &nbsp;akan terhapus <strong>permanen</strong> dan tidak dapat
              dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="
                bg-transparent
                border border-slate-200 dark:border-slate-700
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                hover:text-slate-900 dark:hover:text-slate-100
              "
            >
              Batal
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => { e.preventDefault(); handleDelete() }}
              className="
                bg-red-600 hover:bg-red-700 active:bg-red-800
                dark:bg-red-600 dark:hover:bg-red-700
                text-white border-0
                focus-visible:ring-red-500
                gap-1.5
              "
            >
              {deleting
                ? <><Loader2 size={13} className="animate-spin" /> Menghapus…</>
                : <><Trash2  size={13} /> Hapus Permanen</>
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ════════════════════════════════════════════════
          ACTION BAR — fixed bawah tengah
      ════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl
          border border-slate-200/80 dark:border-slate-700/60
          bg-white/90 dark:bg-slate-950/90
          backdrop-blur-xl shadow-2xl
          shadow-slate-900/10 dark:shadow-black/50">

          <Button variant="ghost" onClick={() => router.push(basePath)}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
              text-slate-600 dark:text-slate-300
              hover:text-slate-900 dark:hover:text-white
              hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={14} /> Kembali
          </Button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          <Button variant="ghost"
            onClick={() => router.push(`${basePath}/edit/${dept}/${id}`)}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
              text-blue-600 dark:text-blue-400
              hover:text-blue-700 dark:hover:text-blue-300
              hover:bg-blue-50 dark:hover:bg-blue-900/30">
            <Edit3 size={14} /> Edit
          </Button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          <Button variant="ghost" onClick={() => setShowDeleteConf(true)}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
              text-red-500 dark:text-red-400
              hover:text-red-600 dark:hover:text-red-300
              hover:bg-red-50 dark:hover:bg-red-900/30">
            {deleting
              ? <Loader2 size={14} className="animate-spin" />
              : <Trash2  size={14} />
            }
            Hapus
          </Button>

        </div>
      </div>

      {/* ── Konten ───────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto flex flex-col gap-4 animate-in fade-in duration-300">

        {/* Card Register */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800
                        bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
          <div className="px-6 py-4
            bg-gradient-to-r from-slate-50 to-white
            dark:from-slate-900 dark:to-slate-950
            border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500
                              uppercase tracking-widest mb-1">
                  Nomor Register
                </p>
                <p className="text-[22px] font-mono font-bold
                              text-slate-800 dark:text-slate-100 leading-none">
                  {register.nomor}
                </p>
              </div>
              <Badge className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full
                                bg-blue-100 dark:bg-blue-900/40
                                text-blue-700 dark:text-blue-300 border-0 mt-0.5">
                {register.dept.shortName}
              </Badge>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Asal Surat"    value={register.asalSurat} />
              <Field label="Tujuan"         value={register.tujuan || "-"} />
              <Field label="Tanggal Terima"
                value={formatTanggal(register.tanggalTerima)}
                fullWidth />
            </div>
          </div>
        </div>

        {/* Daftar Surat */}
        {register.detailSurat.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200
                          dark:border-slate-800 px-6 py-12 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
            <p className="text-[13px] text-slate-400 dark:text-slate-500">
              Belum ada surat dalam register ini.
            </p>
          </div>
        ) : (
          register.detailSurat.map((detail, idx) => (
            <div key={detail.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800
                         bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2.5 px-5 py-3
                bg-slate-50/80 dark:bg-slate-900/80
                border-b border-slate-200 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40
                                flex items-center justify-center">
                  <FileText size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-[12px] font-bold
                                 text-slate-700 dark:text-slate-300
                                 uppercase tracking-wider">
                  Surat {idx + 1}
                </span>
              </div>
              <div className="px-5 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Perihal Surat" value={detail.perihal} fullWidth />
                  <Field label="Nomor Surat"   value={detail.noSurat  ?? "-"} mono />
                  <Field label="Lampiran"       value={detail.lampiran ?? "-"} />
                  <Field label="Tanggal Surat"
                    value={format(new Date(detail.tanggalSurat), "dd MMMM yyyy", { locale: localeID })}
                    fullWidth />
                </div>
              </div>
            </div>
          ))
        )}

        <div className="h-20" />
      </div>
    </>
  )
}