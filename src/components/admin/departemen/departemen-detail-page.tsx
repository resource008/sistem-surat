"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader2, Pencil, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
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
  const [visibilityAction, setVisibilityAction] = useState<"show" | "hide" | null>(null)

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

  async function setDepartemenVisibility(nextActive: boolean) {
    if (!state.departemen) return
    const action = nextActive ? "show" : "hide"
    setVisibilityAction(action)

    try {
      const res = await fetch(`/api/admin/dept/${encodeURIComponent(state.departemen.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal mengubah status departemen")
      }

      toast.success(json?.message ?? (
        nextActive ? "Departemen berhasil ditampilkan" : "Departemen berhasil disembunyikan"
      ))
      actions.reload()
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mengubah status departemen"))
    } finally {
      setVisibilityAction(null)
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
        secondaryAction={isActive
          ? {
              icon: <Pencil size={14} />,
              label: "Edit",
              onClick: () => router.push(`/admin/departemen/${encodeURIComponent(id)}/edit`),
            }
          : undefined}
        extraActions={[
          isActive
            ? {
                icon: <EyeOff size={14} />,
                label: visibilityAction === "hide" ? "Menyembunyikan" : "Sembunyikan",
                onClick: () => setDepartemenVisibility(false),
                disabled: Boolean(visibilityAction),
                variant: "action-secondary",
              }
            : {
                icon: <Eye size={14} />,
                label: visibilityAction === "show" ? "Menampilkan" : "Tampilkan",
                onClick: () => setDepartemenVisibility(true),
                disabled: Boolean(visibilityAction),
                variant: "action-primary",
              },
        ]}
        dangerAction={{
          icon: <Trash2 size={14} />,
          label: "Hapus",
          onClick: () => setDeleteOpen(true),
        }}
      />
      <DepartemenDeleteDialog
        departemen={deleteOpen ? state.departemen : null}
        deletingAction={deletingAction}
        allowSoftDelete={false}
        onOpenChange={setDeleteOpen}
        onSoftDelete={() => setDepartemenVisibility(false)}
        onPermanentDelete={deleteDepartemen}
      />
    </div>
  )
}
