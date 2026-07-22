"use client"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { USER_PERMISSION_GROUPS, USER_ROLE_LABEL } from "@/constants/user"
import type { User } from "@/domain/user/types"
import UsersDelete from "./users-delete"
import {
  AlertTriangle, ArrowLeft, FileText, KeyRound, Pencil, Trash2,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

function formatDate(dateStr: Date | string | null | undefined) {
  if (!dateStr) return "N/A"
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return "N/A"

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")

  return `${day}/${month}/${year}, ${hour}.${minute}`
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

function PermissionStatusView({ active }: { active: boolean }) {
  return (
    <span
      role="switch"
      aria-checked={active}
      aria-label={active ? "Akses aktif" : "Akses nonaktif"}
      className={[
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border px-1 transition-colors",
        active
          ? "border-primary bg-primary"
          : "border-border bg-muted",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-2 text-[10px] font-semibold leading-none",
          active ? "text-primary-foreground" : "text-muted-foreground",
        ].join(" ")}
      >
        I
      </span>
      <span
        className={[
          "absolute right-2 text-[10px] font-semibold leading-none",
          active ? "text-primary-foreground/70" : "text-foreground",
        ].join(" ")}
      >
        O
      </span>
      <span
        className={[
          "relative z-10 size-5 rounded-full shadow-sm transition-transform",
          active
            ? "translate-x-5 bg-primary-foreground"
            : "translate-x-0 bg-background",
        ].join(" ")}
      />
    </span>
  )
}

function AccountDateInfo({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:text-right">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Diperbarui</span>
        <span className="text-sm font-medium">{formatDate(user.updatedAt)}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Ditambahkan</span>
        <span className="text-sm font-medium">{formatDate(user.createdAt)}</span>
      </div>
    </div>
  )
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminCount, setAdminCount] = useState<number | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

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
            Informasi akun ditampilkan dalam mode view.
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
            <div className="flex flex-col gap-4">
              {USER_PERMISSION_GROUPS.map((group, groupIndex) => (
                <div key={group.label ?? `group-${groupIndex}`} className="flex flex-col">
                  {group.items.map(({ key, label, parent }) => {
                    const active = user.permissions?.[key] ?? false

                    return (
                      <div
                        key={key}
                        className={[
                          "flex items-center justify-between py-3 border-b border-border/30 last:border-0",
                          parent ? "" : "pl-4",
                        ].join(" ")}
                      >
                        <span className={parent ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>
                          {label}
                        </span>
                        <PermissionStatusView active={active} />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border/50 bg-background px-6 py-5 sm:hidden">
        <AccountDateInfo user={user} />
      </div>

      <FloatingActionBarShell contentClassName="border-slate-200 bg-white shadow-none backdrop-blur-none dark:border-neutral-700 dark:bg-neutral-950">
        <Button
          variant="action-neutral"
          size="fab-action"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft size={14} /> Kembali
        </Button>
        <Button
          variant="action-edit"
          size="fab-action"
          onClick={() => router.push(`/admin/users/${id}/edit`)}
        >
          <Pencil size={14} /> Edit
        </Button>
        {!isLastAdmin && (
          <Button
            variant="action-danger"
            size="fab-action"
            className="px-5 font-semibold"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 size={14} /> Hapus
          </Button>
        )}
      </FloatingActionBarShell>

      <UsersDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={user}
        onSuccess={() => router.push("/admin/users")}
      />
    </div>
  )
}
