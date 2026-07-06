"use client"

import UsersDelete from "@/components/admin/users/users-delete"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { USER_PERMISSION_LABELS, USER_ROLE_LABEL } from "@/constants/user"
import type { User } from "@/domain/user/types"
import {
  AlertTriangle, ArrowLeft, FileText, KeyRound, Pencil, Trash2,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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

function AccountDateInfo({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:text-right">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Diperbarui</span>
        <span className="text-sm font-medium">{formatDate(user.updatedAt)}</span>
        <span className="text-xs text-muted-foreground">{formatTime(user.updatedAt)}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Ditambahkan</span>
        <span className="text-sm font-medium">{formatDate(user.createdAt)}</span>
        <span className="text-xs text-muted-foreground">{formatTime(user.createdAt)}</span>
      </div>
    </div>
  )
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [adminCount, setAdminCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    async function loadUser() {
      try {
        const response = await fetch(`/api/admin/users/${id}`)
        const data = await response.json().catch(() => null)
        if (!response.ok) throw new Error(data?.error ?? "Gagal memuat data user")

        if (!active) return
        setUser(data)

        if (data.role === "ADMIN") {
          const adminResponse = await fetch("/api/admin/users?role=ADMIN&page=1&limit=1")
          const adminData = await adminResponse.json().catch(() => null)
          if (adminResponse.ok && active) {
            setAdminCount(adminData?.meta?.total ?? null)
          }
        } else {
          setAdminCount(null)
        }

        window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Info Akun" }))
      } catch (error) {
        if (active) {
          toast.error(error instanceof Error ? error.message : "Gagal memuat data user")
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadUser()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <LoadingSkeleton type="profile" />
    )
  }

  if (!user) {
    return (
      <div className="empty-state-viewport flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">User tidak ditemukan</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={14} className="mr-1.5" /> Kembali
        </Button>
      </div>
    )
  }

  const isLastAdmin = user.role === "ADMIN" && adminCount !== null && adminCount <= 1

  return (
    <div className="flex flex-col gap-4 pb-32">
      {isLastAdmin && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            Akun ini adalah satu-satunya admin, jadi tidak bisa dihapus.
            Informasi akun tetap bisa diubah.
          </p>
        </div>
      )}

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
                  {USER_ROLE_LABEL[user.role] ?? user.role}
                </span>
              </div>
            </div>

            <div className="hidden shrink-0 gap-6 sm:flex">
              <AccountDateInfo user={user} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Lengkap" value={user.name} />
            <Field label="Nama Pengguna" value={user.username} />
            <Field label="Email" value={user.email} />
            <Field label="Role" value={USER_ROLE_LABEL[user.role] ?? user.role} />
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
              {USER_PERMISSION_LABELS.map(({ key, label }) => {
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

      <div className="rounded-2xl border border-border/50 bg-background px-6 py-5 sm:hidden">
        <AccountDateInfo user={user} />
      </div>

      <div className="fixed bottom-8 left-[var(--topbar-left,0px)] right-8 z-40 flex items-center justify-end gap-3 transition-[left] duration-300 ease-in-out max-sm:bottom-5 max-sm:right-5">
        {!isLastAdmin && (
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
        )}
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
