// src/components/admin/users/users-page.tsx
"use client"

import { useState }              from "react"
import { useSearch }             from "@/app/(dashboard)/admin/layout"
import { useUsers, useUserActions } from "@/hooks/use-users"
import { Avatar, AvatarFallback }   from "@/components/ui/avatar"
import { Badge }                 from "@/components/ui/badge"
import { Button }                from "@/components/ui/button"
import { Plus }                  from "lucide-react"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { User }             from "@/domain/user/types"
import UsersFormModal            from "./users-form-modal"
import UsersEmpty                from "./users-empty"

// ── Helpers ───────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

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

const AVATAR_COLORS: Record<string, string> = {
  ADMIN: "bg-teal-500",
  STAFF: "bg-blue-500",
  PKL:   "bg-violet-500",
}

// ── Component ─────────────────────────────────────────────────

export default function UsersPage() {
  const { search, debouncedSearch } = useSearch()

  const [page, setPage] = useState(1)

  // Modal state
  const [formOpen,      setFormOpen]      = useState(false)
  const [selectedUser,  setSelectedUser]  = useState<User | null>(null)

  const { data, loading, refetch } = useUsers({ page, limit: 10, search: debouncedSearch })
  
  const { loading: actionLoading } = useUserActions(refetch)

  function handleEdit(user: User) {
    setSelectedUser(user)
    setFormOpen(true)
  }

  function handleAdd() {
    setSelectedUser(null)
    setFormOpen(true)
  }

  const users = data?.data ?? []
  const meta  = data?.meta

  // ── Render Helpers ──────────────────────────────────────────

  const renderDesktopContent = () => {
    // Tampilkan Empty State jika data kosong
    if (users.length === 0 && !loading) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <UsersEmpty searchQuery={debouncedSearch} />
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-xs font-medium text-muted-foreground">Nama Pengguna</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground w-[90px]">Role</TableHead>
            <TableHead className="hidden lg:table-cell text-xs font-medium text-muted-foreground">Email</TableHead>
            <TableHead className="hidden lg:table-cell text-xs font-medium text-muted-foreground w-[190px]">Terakhir Masuk</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground w-[120px]">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="h-4 bg-muted animate-pulse rounded-md" /></TableCell>
                <TableCell><div className="h-4 bg-muted animate-pulse rounded-md" /></TableCell>
                <TableCell className="hidden lg:table-cell"><div className="h-4 bg-muted animate-pulse rounded-md" /></TableCell>
                <TableCell className="hidden lg:table-cell"><div className="h-4 bg-muted animate-pulse rounded-md" /></TableCell>
                <TableCell><div className="h-4 bg-muted animate-pulse rounded-md" /></TableCell>
              </TableRow>
            ))
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => handleEdit(user)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className={`text-xs font-semibold text-white ${AVATAR_COLORS[user.role] ?? "bg-gray-500"}`}>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {ROLE_LABEL[user.role] ?? user.role}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{user.email}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground tabular-nums">
                  {formatTimestamp(user.lastLogin)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Badge
                    variant="outline"
                    className={user.status === "Sedang Aktif"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30"
                      : "bg-slate-500/10 text-slate-400 border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30"}
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

      {/* ── Tampilan Mobile (Card) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
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
              onClick={() => handleEdit(user)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className={`text-sm font-semibold text-white ${AVATAR_COLORS[user.role] ?? "bg-gray-500"}`}>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-1">
                <Badge
                  variant="outline"
                  className={user.status === "Sedang Aktif"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30"}
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

      {/* ── Tampilan Desktop (Tabel) ── */}
      <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden bg-background">
        {renderDesktopContent()}
      </div>

      {/* ── Pagination ── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
          <span>
            {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} pengguna
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <span className="tabular-nums">{meta.page} / {meta.totalPages}</span>
            <Button
              variant="outline" size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      {/* ── FAB Tambah ── */}
      <Button
        onClick={handleAdd}
        size="icon"
        className="fixed bottom-8 right-8 size-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="size-6 text-white" />
        <span className="sr-only">Tambah Pengguna</span>
      </Button>

      {/* ── Modal Form ── */}
      <UsersFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
        onSuccess={refetch}
      />
    </div>
  )
}