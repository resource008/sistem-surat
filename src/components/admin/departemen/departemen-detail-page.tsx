"use client"

import { useState } from "react"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
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
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function deleteDepartemen() {
    if (!state.departemen) return
    setDeletingId(state.departemen.id)

    try {
      const res = await fetch(`/api/dept/${encodeURIComponent(state.departemen.id)}`, {
        method: "DELETE",
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal menghapus departemen")
      }

      toast.success("Departemen berhasil dihapus")
      router.push("/admin/departemen")
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus departemen"))
    } finally {
      setDeletingId(null)
    }
  }

  if (state.loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
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

  return (
    <div className="flex flex-col gap-4 pb-32">
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
        dangerAction={{
          icon: <Trash2 size={14} />,
          label: "Hapus",
          onClick: () => setDeleteOpen(true),
        }}
        secondaryAction={{
          icon: <Pencil size={14} />,
          label: "Edit",
          onClick: () => router.push(`/admin/departemen/${encodeURIComponent(id)}/edit`),
        }}
      />
      <DepartemenDeleteDialog
        departemen={deleteOpen ? state.departemen : null}
        deletingId={deletingId}
        onOpenChange={setDeleteOpen}
        onDelete={deleteDepartemen}
      />
    </div>
  )
}
