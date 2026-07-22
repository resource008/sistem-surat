"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEditDepartemen } from "@/hooks/use-edit-departemen"
import { getErrorMessage } from "@/lib/utils"
import { DepartemenEditFormFields } from "./departemen-edit-form-fields"
import { DepartemenDeleteDialog } from "./departemen-delete-dialog"
import { DepartemenFormActionBar } from "./departemen-form-action-bar"

export default function DepartemenDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { state, actions } = useEditDepartemen(id, "Detail Departemen")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingAction, setDeletingAction] = useState<"permanent" | null>(null)

  useEffect(() => {
    const shortName = state.departemen?.shortName
    if (!shortName || id === shortName) return
    router.replace(`/admin/departemen/${encodeURIComponent(shortName)}`)
  }, [id, router, state.departemen?.shortName])

  async function deleteDepartemen() {
    if (!state.departemen) return
    setDeletingAction("permanent")

    try {
      const res = await fetch(`/api/admin/dept/${encodeURIComponent(state.departemen.id)}`, {
        method: "DELETE",
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal menghapus departemen")
      }

      toast.success(json?.message ?? "Departemen berhasil dihapus")
      router.push("/admin/departemen")
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus departemen"))
    } finally {
      setDeletingAction(null)
    }
  }

  if (state.loading) {
    return (
      <LoadingSkeleton type="departemen-form" />
    )
  }

  if (!state.departemen) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">Departemen tidak ditemukan</p>
        <Button variant="outline" onClick={actions.cancel}>
          Kembali
        </Button>
      </div>
    )
  }

  const isActive = state.departemen.isActive !== false

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="rounded-xl border border-border/40 bg-background px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Status Departemen</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Kondisi tampilan departemen pada daftar dan pilihan data surat.
            </p>
          </div>
          <Badge variant={isActive ? "secondary" : "outline"} className="shrink-0">
            {isActive ? "Ditampilkan" : "Disembunyikan"}
          </Badge>
        </div>
      </div>

      <DepartemenEditFormFields
        form={state.form}
        departments={state.departments}
        onChange={actions.setForm}
        disabled={state.saving}
        readOnly
      />

      <DepartemenFormActionBar
        saving={state.saving}
        onCancel={actions.cancel}
        showSubmit={false}
        secondaryAction={{
          icon: <Pencil size={14} />,
          label: "Edit",
          onClick: () => router.push(`/admin/departemen/${encodeURIComponent(state.departemen?.shortName || id)}/edit`),
        }}
        dangerAction={{
          icon: <Trash2 size={14} />,
          label: "Hapus",
          onClick: () => setDeleteOpen(true),
        }}
      />
      <DepartemenDeleteDialog
        departemen={deleteOpen ? state.departemen : null}
        deletingAction={deletingAction}
        onOpenChange={setDeleteOpen}
        onPermanentDelete={deleteDepartemen}
      />
    </div>
  )
}
