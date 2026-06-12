"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft, FileText, KeyRound, Loader2, Pencil, Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/shared/user-avatar"
import type { User } from "@/domain/user/types"
import { getAvatarColor, getInitials } from "@/lib/avatar"

function formatDate(dateStr: Date | string | null | undefined) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function formatTime(dateStr: Date | string | null | undefined) {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  PKL: "PKL",
}

const PERMISSIONS = [
  { key: "canCreate", label: "Tambah Data Surat" },
  { key: "canPrint", label: "Cetak Surat" },
  { key: "canEdit", label: "Edit Data Surat" },
  { key: "canTrack", label: "Lacak Surat" },
  { key: "canDelete", label: "Hapus Data Surat" },
] as const

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium min-h-[36px] flex items-center px-3 rounded-xl border border-border/50 bg-muted/30 text-foreground">
        {value || "-"}
      </span>
    </div>
  )
}

function PermissionBadge({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "relative text-xs font-semibold px-2.5 py-1 rounded-full select-none",
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-slate-500/10 text-slate-400",
      ].join(" ")}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  )
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(async (response) => {
        const data = await response.json().catch(() => null)
        if (!response.ok) throw new Error(data?.error ?? "Gagal memuat data user")
        return data
      })
      .then((data: User) => {
        setUser(data)
        window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Info Akun" }))
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Gagal memuat data user"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <p className="text-sm text-muted-foreground">User tidak ditemukan</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={14} className="mr-1.5" /> Kembali
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
          <FileText size={16} className="text-muted-foreground" />
          <span className="text-sm font-semibold">Data Akun</span>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <UserAvatar name={user.name} className="size-10 text-sm" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </div>
            </div>

            <div className="flex gap-6 shrink-0">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs text-muted-foreground">Diperbarui</span>
                <span className="text-sm font-medium">{formatDate(user.updatedAt)}</span>
                <span className="text-xs text-muted-foreground">{formatTime(user.updatedAt)}</span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs text-muted-foreground">Ditambahkan</span>
                <span className="text-sm font-medium">{formatDate(user.createdAt)}</span>
                <span className="text-xs text-muted-foreground">{formatTime(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Lengkap" value={user.name} />
            <Field label="Nama Pengguna" value={user.username} />
            <Field label="Email" value={user.email} />
            <Field label="Role" value={ROLE_LABEL[user.role] ?? user.role} />
          </div>
        </div>
      </div>

      {user.role !== "ADMIN" && (
        <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
            <KeyRound size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Hak Akses</span>
          </div>
          <div className="px-6 py-6">
            <div className="flex flex-col">
              {PERMISSIONS.map(({ key, label }) => {
                const active = user.permissions?.[key] ?? false

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <PermissionBadge active={active} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setDeleteOpen(true)}
          className="size-14 rounded-full shadow-lg bg-red-500 text-white hover:bg-red-600"
          title="Hapus Pengguna"
        >
          <Trash2 size={20} />
          <span className="sr-only">Hapus Pengguna</span>
        </Button>
        <Button
          size="icon"
          onClick={() => router.push(`/admin/users/${id}/edit`)}
          className="size-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          title="Edit Pengguna"
        >
          <Pencil size={20} className="text-white" />
          <span className="sr-only">Edit Pengguna</span>
        </Button>
      </div>

      <UsersDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={user}
        onSuccess={() => window.location.assign("/admin/users")}
      />
    </div>
  )
}
