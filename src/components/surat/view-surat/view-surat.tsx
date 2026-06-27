"use client"

import { useEffect, useState }    from "react"
import { useRouter, useParams }   from "next/navigation"
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react"

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
import { ViewActionBar }     from "./action-bar"

import { toast } from "sonner"
import useSWR from "swr"
import type { UserPermissions } from "@/domain/user/types"

interface Props { role: Role; basePath: string }

type PermissionResponse = {
  role: Role
  permissions: UserPermissions
}

const fetchPermissions = async (url: string): Promise<PermissionResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Gagal mengambil hak akses")
  return res.json()
}

export default function ViewSuratPage({ role, basePath }: Props) {
  const { dept, id } = useParams<{ dept: string; id: string }>()
  const router       = useRouter()
  const { data: access } = useSWR<PermissionResponse>(
    "/api/me/permissions",
    fetchPermissions,
    { refreshInterval: 5_000, revalidateOnFocus: true }
  )
  const canDelete = access?.role === "ADMIN" || (access?.permissions.canDelete ?? false)
  const canEdit = access?.role === "ADMIN" || (access?.permissions.canEdit ?? false)

  const [register,       setRegister]       = useState<RegisterSurat | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState<string | null>(null)
  const [deleting,       setDeleting]       = useState(false)
  const [showDeleteConf, setShowDeleteConf] = useState(false)

  /* Fetch --------------------------------------------------------- */
  useEffect(() => {
    fetch(`/api/surat/${dept}/${id}?includeColumns=true`)
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
    if (!canDelete) {
      toast.error("Tidak punya izin menghapus", {
        description: "Permission Hapus Data Surat sedang dinonaktifkan.",
      })
      setShowDeleteConf(false)
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/surat/${dept}/${id}`, { method: "DELETE" })
      const json = await res.json().catch(() => null) as { message?: string } | null
      if (res.status === 403) {
        throw new Error("FORBIDDEN")
      }
      if (!res.ok) throw new Error(json?.message)
      toast.success(json?.message ?? "Data surat berhasil dihapus", {
        description: `Data ${register?.nomor} telah dihapus permanen.`,
      })
      router.push(basePath)
    } catch (error) {
      if (error instanceof Error && error.message === "FORBIDDEN") {
        toast.error("Tidak punya izin menghapus", {
          description: "Permission Hapus Data Surat sedang dinonaktifkan.",
        })
      } else {
        toast.error("Gagal menghapus register", {
          description: "Terjadi kesalahan, silakan coba lagi.",
        })
      }
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
      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-neutral-900
                      flex items-center justify-center">
        <AlertTriangle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      </div>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
        {error ?? "Data tidak ditemukan"}
      </p>
      <Button
        variant="action-secondary"
        size="action-sm"
        onClick={() => router.push(basePath)}
        className="mt-1"
      >
        <ArrowLeft size={12} /> Kembali
      </Button>
    </div>
  )

  /* Render -------------------------------------------------------- */
  return (
    <>
      {/* Modal Konfirmasi Hapus */}
      <AlertDialog open={showDeleteConf} onOpenChange={setShowDeleteConf}>
        <AlertDialogContent className="bg-white dark:bg-neutral-950
                                       border border-slate-200 dark:border-neutral-800
                                       shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-100
                                         text-[15px] font-semibold">
              Hapus Register Surat?
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
            <AlertDialogCancel
              disabled={deleting}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              variant="destructive"
              onClick={e => { e.preventDefault(); handleDelete() }}
            >
              {deleting
                ? <><Loader2 size={13} className="animate-spin" /> Menghapus…</>
                : "Hapus Permanen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Action Bar */}
      <ViewActionBar
        deleting={deleting}
        canEdit={canEdit}
        canDelete={canDelete}
        onBack={()          => router.push(basePath)}
        onEdit={()          => router.push(`${basePath}/edit/${dept}/${id}`)}
        onDeleteRequest={() => setShowDeleteConf(true)}
      />

      {/* Layout Utama */}
      <div className="w-full flex flex-col lg:flex-row gap-6
                      lg:h-[calc(100vh-120px)] lg:overflow-hidden
                      pb-28 lg:pb-0 pt-2">

        <RegisterInfoPanel register={register} />

        <div className="w-full lg:w-8/12 xl:w-8/12 flex flex-col gap-4
                        lg:overflow-y-auto pb-10 lg:pb-32 lg:pr-2
                        [&::-webkit-scrollbar]:hidden
                        [-ms-overflow-style:none]
                        [scrollbar-width:none]">
          <SuratListPanel register={register} />
        </div>

      </div>
    </>
  )
}
