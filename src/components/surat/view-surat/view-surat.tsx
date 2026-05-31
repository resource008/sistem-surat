"use client"

import { useEffect, useState }    from "react"
import { useRouter, useParams }   from "next/navigation"
import { ArrowLeft, AlertTriangle, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { RegisterSurat, Role } from "@/components/surat/shared"
import { LoadingSkeleton }     from "@/components/shared/loading-skeleton"

import { RegisterInfoPanel } from "./register-info-panel"
import { SuratListPanel }    from "./surat-list-panel"
import { PIListPanel }       from "./pi-list-panel"
import { ViewActionBar }     from "./action-bar"

import { toast } from "sonner"

interface Props { role: Role; basePath: string }

export default function ViewSuratPage({ role, basePath }: Props) {
  const { dept, id } = useParams<{ dept: string; id: string }>()
  const router       = useRouter()
  const isPI         = dept === "PI"

  const [register,       setRegister]       = useState<RegisterSurat | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState<string | null>(null)
  const [deleting,       setDeleting]       = useState(false)
  const [showDeleteConf, setShowDeleteConf] = useState(false)

  /* Fetch --------------------------------------------------------- */
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

  /* Delete -------------------------------------------------------- */
  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/surat/${dept}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Register berhasil dihapus", {
        description: `Data ${register?.nomor} telah dihapus permanen.`,
      })
      router.push(basePath)
    } catch {
      toast.error("Gagal menghapus register", {
        description: "Terjadi kesalahan, silakan coba lagi.",
      })
      setDeleting(false)
      setShowDeleteConf(false)
    }
  }

  /* States -------------------------------------------------------- */
  if (loading) return (
    <div className="w-full mt-2">
      <LoadingSkeleton type="form" />
    </div>
  )

  if (error || !register) return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 mt-20">
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

  /* Render -------------------------------------------------------- */
  return (
    <>
      {/* Modal Konfirmasi Hapus */}
      <AlertDialog open={showDeleteConf} onOpenChange={setShowDeleteConf}>
        <AlertDialogContent className="bg-white dark:bg-slate-950
                                       border border-slate-200 dark:border-slate-800
                                       shadow-xl shadow-black/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-100
                                         text-[15px] font-semibold">
              {isPI ? "Hapus Register PI?" : "Hapus Register Surat?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400
                                                text-[13px] leading-relaxed">
              Seluruh data dalam register&nbsp;
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {register.nomor}
              </span>
              &nbsp;akan terhapus <strong>permanen</strong> dan tidak dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}
              className="bg-transparent border border-slate-200 dark:border-slate-700
                         text-slate-700 dark:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         hover:text-slate-900 dark:hover:text-slate-100">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction disabled={deleting}
              onClick={e => { e.preventDefault(); handleDelete() }}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800
                         dark:bg-red-600 dark:hover:bg-red-700
                         text-white border-0 focus-visible:ring-red-500 gap-1.5">
              {deleting
                ? <><Loader2 size={13} className="animate-spin" /> Menghapus…</>
                : <><Trash2  size={13} /> Hapus Permanen</>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Action Bar */}
      <ViewActionBar
        basePath={basePath}
        dept={dept}
        id={id}
        deleting={deleting}
        onBack={()          => router.push(basePath)}
        onEdit={()          => router.push(`${basePath}/edit/${dept}/${id}`)}
        onDeleteRequest={() => setShowDeleteConf(true)}
      />

      {/* Layout Utama */}
      <div className="w-full flex flex-col lg:flex-row gap-6
                      lg:h-[calc(100vh-120px)] lg:overflow-hidden
                      pb-28 lg:pb-0 pt-2">

        <RegisterInfoPanel register={register} isPI={isPI} />

        <div className="w-full lg:w-8/12 xl:w-8/12 flex flex-col gap-4
                        lg:overflow-y-auto pb-10 lg:pb-32 lg:pr-2
                        [&::-webkit-scrollbar]:hidden
                        [-ms-overflow-style:none]
                        [scrollbar-width:none]">
          {isPI
            ? <PIListPanel    detailPI={(register as any).detailPI ?? []} />
            : <SuratListPanel register={register} />}
        </div>

      </div>
    </>
  )
}