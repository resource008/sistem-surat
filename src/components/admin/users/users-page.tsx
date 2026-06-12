"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter }                 from "next/navigation"
import { useSearch }                 from "@/app/(dashboard)/admin/layout"
import { useUsers, useUserActions }  from "@/hooks/use-users"
import { Badge }                     from "@/components/ui/badge"
import { Button }                    from "@/components/ui/button"
import { Plus }                      from "lucide-react"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { User }                 from "@/domain/user/types"
import UsersFormModal                from "./users-form-modal"
import UsersEmpty                    from "./users-empty"
import { getAvatarColor, getInitials } from "@/lib/avatar"  // ← shared utility

// ── Helpers ───────────────────────────────────────────────────

function formatTimestamp(dateStr: Date | string | null | undefined) {
  if (!dateStr) return "-"
  const date      = new Date(dateStr)
  const dateLabel = date.toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  })
  const timeLabel = date.toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit",
  })
  return `${dateLabel}, ${timeLabel}`
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  PKL:   "PKL",
}

export default function UsersPage() {
  const router                      = useRouter()
  const { debouncedSearch }         = useSearch()
  const [page, setPage]             = useState(1)
  const [users, setUsers]           = useState<User[]>([])
  const [hasMore, setHasMore]       = useState(true)
  const [formOpen, setFormOpen]     = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const desktopScrollRef            = useRef<HTMLDivElement | null>(null)
  const desktopLoadMoreRef          = useRef<HTMLDivElement | null>(null)
  const mobileLoadMoreRef           = useRef<HTMLDivElement | null>(null)
  const limit                       = 10

  const { data, loading, refetch } = useUsers({ page, limit: 10, search: debouncedSearch })
  const { loading: actionLoading } = useUserActions(refetch)

  function handleRowClick(user: User) {
    router.push(`/admin/users/${user.id}`)
  }

  function handleAdd() {
    setSelectedUser(null)
    setFormOpen(true)
  }

  const users = data?.data ?? []
  const meta  = data?.meta

  // ── Render Helpers ──────────────────────────────────────────

  const renderDesktopContent = () => {
    if (users.length === 0 && !loading) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <UsersEmpty searchQuery={debouncedSearch} />
        </div>
      )
    }

    return (
      <>
        <div className="grid w-full grid-cols-[minmax(0,1fr)_90px_120px] border-b border-border bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground lg:grid-cols-[minmax(0,1fr)_90px_minmax(0,1fr)_190px_120px]">
          <div className="min-w-0">Nama Pengguna</div>
          <div className="min-w-0">Role</div>
          <div className="hidden min-w-0 lg:block">Email</div>
          <div className="hidden min-w-0 lg:block">Terakhir Masuk</div>
          <div className="min-w-0">Status</div>
        </div>

        <div
          ref={desktopScrollRef}
          className="max-h-[calc(100vh-260px)] w-full overflow-y-auto"
        >
          {loading && users.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid w-full grid-cols-[minmax(0,1fr)_90px_120px] items-center border-b border-border px-4 py-3 lg:grid-cols-[minmax(0,1fr)_90px_minmax(0,1fr)_190px_120px]"
              >
                <div className="h-4 rounded-md bg-muted animate-pulse" />
                <div className="h-4 rounded-md bg-muted animate-pulse" />
                <div className="hidden h-4 rounded-md bg-muted animate-pulse lg:block" />
                <div className="hidden h-4 rounded-md bg-muted animate-pulse lg:block" />
                <div className="h-4 rounded-md bg-muted animate-pulse" />
              </div>
            ))
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_90px_120px] items-center border-b border-border px-4 py-3 transition-colors hover:bg-muted/30 lg:grid-cols-[minmax(0,1fr)_90px_minmax(0,1fr)_190px_120px]"
                onClick={() => handleRowClick(user)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: getAvatarColor(user.name) }}
                      className="size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                    >
                      {getInitials(user.name)}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <span className="truncate text-sm font-medium">{user.name}</span>
                </div>
                <div className="min-w-0 truncate text-sm">{ROLE_LABEL[user.role] ?? user.role}</div>
                <div className="hidden truncate text-sm text-muted-foreground lg:block">
                  {user.email}
                </div>
                <div className="hidden min-w-0 truncate text-sm text-muted-foreground tabular-nums lg:block">
                  {formatTimestamp(user.lastLogin)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Badge
                    variant="outline"
                    className={user.status === "Sedang Aktif"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-slate-500/10 text-slate-400 border-slate-500/30"}
                  >
                    {user.status ?? "Tidak Aktif"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
  }

  // ── Render Utama ────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">

      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading && users.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border/50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-muted animate-pulse rounded-full shrink-0" />
                <div className="h-4 bg-muted animate-pulse rounded-md w-1/2" />
              </div>
              <div className="h-3 bg-muted animate-pulse rounded-md w-full" />
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="border border-border/50 rounded-xl overflow-hidden bg-background">
            <UsersEmpty searchQuery={debouncedSearch} />
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-xl border border-border/50 flex flex-col gap-3 hover:bg-muted/20 transition-colors cursor-pointer"
              onClick={() => handleRowClick(user)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <UserAvatar name={user.name} />
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-1">
                <Badge
                  variant="outline"
                  className={user.status === "Sedang Aktif"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/30"}
                >
                  {user.status ?? "Tidak Aktif"}
                </Badge>
                <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden bg-background">
        {renderDesktopContent()}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
          <span>
            {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} pengguna
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={meta.page <= 1}
              onClick={() => setPage((p) => p - 1)}>
              Sebelumnya
            </Button>
            <span className="tabular-nums">{meta.page} / {meta.totalPages}</span>
            <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}>
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      {/* FAB */}
      <Button onClick={handleAdd} size="icon"
        className="fixed bottom-8 right-8 size-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700">
        <Plus className="size-6 text-white" />
        <span className="sr-only">Tambah Pengguna</span>
      </Button>

      <UsersFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
