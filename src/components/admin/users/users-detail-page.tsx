"use client"

import { useState, useEffect }        from "react"
import { useParams, useRouter }       from "next/navigation"
import { toast }                      from "sonner"
import {
  ArrowLeft, FileText, Loader2, KeyRound, Pencil,
} from "lucide-react"
import { Button }  from "@/components/ui/button"
import type { User } from "@/domain/user/types"
import { getAvatarColor, getInitials } from "@/lib/avatar"

// ── Helpers ───────────────────────────────────────────────────

function formatDate(dateStr: Date | string | null | undefined) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

function formatTime(dateStr: Date | string | null | undefined) {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit",
  })
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  PKL:   "PKL",
}

const PERMISSIONS = [
  { key: "canCreate", label: "Tambah Data Surat" },
  { key: "canPrint",  label: "Cetak Surat"       },
  { key: "canEdit",   label: "Edit Data Surat"   },
  { key: "canTrack",  label: "Lacak Surat"       },
  { key: "canDelete", label: "Hapus Data Surat"  },
] as const

type PermissionKey = typeof PERMISSIONS[number]["key"]

// ── Read-only Field ───────────────────────────────────────────

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium min-h-[36px] flex items-center px-3
        rounded-xl border border-border/50 bg-muted/30 text-foreground">
        {value || "-"}
      </span>
    </div>
  )
}

// ── Permission Toggle Badge ───────────────────────────────────

function PermissionBadge({
  active,
  loading,
  onClick,
}: {
  active:  boolean
  loading: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        relative text-xs font-semibold px-2.5 py-1 rounded-full
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${!loading ? "cursor-pointer hover:opacity-80 active:scale-95" : "cursor-wait"}
        ${active
          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
          : "bg-slate-500/10  text-slate-400  hover:bg-slate-500/20"
        }
      `}
    >
      {loading ? (
        <span className="flex items-center gap-1">
          <Loader2 size={10} className="animate-spin" />
          {active ? "Aktif" : "Nonaktif"}
        </span>
      ) : (
        active ? "Aktif" : "Nonaktif"
      )}
    </button>
  )
}

// ── Main Component ────────────────────────────────────────────

export default function UserDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()

  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // loadingPerms: menyimpan key permission yang sedang dalam proses toggle
  const [loadingPerms, setLoadingPerms] = useState<Set<PermissionKey>>(new Set())

  // ── Fetch ─────────────────────────────────────────────────

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(r => r.json())
      .then((data: User) => {
        setUser(data)
        window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Info Akun" }))
      })
      .catch(() => toast.error("Gagal memuat data user"))
      .finally(() => setLoading(false))
  }, [id])

  // ── Toggle Permission ─────────────────────────────────────

  async function handleTogglePermission(key: PermissionKey) {
    if (!user) return

    const currentValue = user.permissions?.[key] ?? false
    const newValue     = !currentValue

    // Tandai permission ini sedang loading
    setLoadingPerms(prev => new Set(prev).add(key))

    // Optimistic update — UI langsung berubah
    setUser(prev => {
      if (!prev) return prev
      return {
        ...prev,
        permissions: {
          canCreate: prev.permissions?.canCreate ?? false,
          canEdit:   prev.permissions?.canEdit   ?? false,
          canDelete: prev.permissions?.canDelete ?? false,
          canPrint:  prev.permissions?.canPrint  ?? false,
          canTrack:  prev.permissions?.canTrack  ?? false,
          [key]:     newValue,
        },
      }
    })

    try {
      const res = await fetch(`/api/users/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ permissions: { [key]: newValue } }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? "Gagal mengubah permission")
      }

      const label = PERMISSIONS.find(p => p.key === key)?.label ?? key
      toast.success(`${label} berhasil ${newValue ? "diaktifkan" : "dinonaktifkan"}`)

    } catch (err) {
      // Rollback — kembalikan nilai semula
      setUser(prev => {
        if (!prev) return prev
        return {
          ...prev,
          permissions: {
            canCreate: prev.permissions?.canCreate ?? false,
            canEdit:   prev.permissions?.canEdit   ?? false,
            canDelete: prev.permissions?.canDelete ?? false,
            canPrint:  prev.permissions?.canPrint  ?? false,
            canTrack:  prev.permissions?.canTrack  ?? false,
            [key]:     currentValue,
          },
        }
      })

      const message = err instanceof Error ? err.message : "Gagal mengubah permission"
      toast.error(message)

    } finally {
      // Hapus dari set loading
      setLoadingPerms(prev => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  // ── Loading ───────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-muted-foreground" size={24} />
    </div>
  )

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <p className="text-sm text-muted-foreground">User tidak ditemukan</p>
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft size={14} className="mr-1.5" /> Kembali
      </Button>
    </div>
  )

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 pb-32">

      {/* Data Akun */}
      <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
          <FileText size={16} className="text-muted-foreground" />
          <span className="text-sm font-semibold">Data Akun</span>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">

          {/* Avatar + Timestamps */}
          <div className="flex items-center justify-between gap-4">

            {/* Kiri: Avatar + nama */}
            <div className="flex items-center gap-4">
              <div
                style={{ backgroundColor: getAvatarColor(user.name) }}
                className="size-10 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              >
                {getInitials(user.name)}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </div>
            </div>

            {/* Kanan: Timestamps */}
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

          {/* Read-only fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Lengkap"  value={user.name}     />
            <Field label="Nama Pengguna" value={user.username} />
            <Field label="Email"         value={user.email}    />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Role</span>
              <div className="min-h-[36px] flex items-center px-3 rounded-xl border border-border/50 bg-muted/30">
                <span className="text-sm font-medium">
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hak Akses — hanya untuk STAFF dan PKL */}
      {user.role !== "ADMIN" && (
        <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
            <KeyRound size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Hak Akses</span>
          </div>
          <div className="px-6 py-6">
            <div className="flex flex-col">
              {PERMISSIONS.map(({ key, label }) => {
                const active      = user.permissions?.[key] ?? false
                const isToggling  = loadingPerms.has(key)

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3
                      border-b border-border/30 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <PermissionBadge
                      active={active}
                      loading={isToggling}
                      onClick={() => handleTogglePermission(key)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* FAB Edit — kanan bawah */}
      <Button
        size="icon"
        onClick={() => router.push(`/admin/users/${id}/edit`)}
        className="fixed bottom-8 right-8 size-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
      >
        <Pencil size={20} className="text-white" />
        <span className="sr-only">Edit Pengguna</span>
      </Button>

    </div>
  )
}