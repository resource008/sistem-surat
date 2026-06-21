"use client"

import { useAdminSearch } from "@/components/admin/layout/admin-search-context"
import { UserAvatar } from "@/components/shared/user-avatar"
import { UserStatusBadge } from "@/components/shared/user-status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { User } from "@/domain/user/types"
import { useUsers } from "@/hooks/use-users"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import UsersEmpty from "./users-empty"

function formatTimestamp(dateStr: Date | string | null | undefined) {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  const dateLabel = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  const timeLabel = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${dateLabel}, ${timeLabel}`
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  PKL: "PKL",
}

function DesktopSkeletonRow() {
  return (
    <TableRow>
      <TableCell><div className="h-4 rounded-md bg-muted animate-pulse" /></TableCell>
      <TableCell><div className="h-4 rounded-md bg-muted animate-pulse" /></TableCell>
      <TableCell className="hidden lg:table-cell"><div className="h-4 rounded-md bg-muted animate-pulse" /></TableCell>
      <TableCell className="hidden lg:table-cell"><div className="h-4 rounded-md bg-muted animate-pulse" /></TableCell>
      <TableCell><div className="h-4 rounded-md bg-muted animate-pulse" /></TableCell>
    </TableRow>
  )
}

function MobileSkeletonCard() {
  return (
    <div className="space-y-3 rounded-xl border border-border/50 p-4">
      <div className="flex items-center gap-3">
        <div className="size-10 shrink-0 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse" />
      </div>
      <div className="h-3 w-full rounded-md bg-muted animate-pulse" />
    </div>
  )
}

export default function UsersPage() {
  const router = useRouter()
  const { debouncedSearch } = useAdminSearch()
  const [page, setPage] = useState(1)

  const { data, loading } = useUsers({
    page,
    limit: 15,
    search: debouncedSearch,
  })

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  function handleRowClick(user: User) {
    router.push(`/admin/users/${user.id}`)
  }

  function handleAdd() {
    router.push("/admin/users/add")
  }

  const users = data?.data ?? []
  const meta = data?.meta
  const showEmpty = users.length === 0 && !loading

  const renderDesktopContent = () => {
    if (showEmpty) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <UsersEmpty searchQuery={debouncedSearch} />
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-xs font-medium text-muted-foreground">Nama Pengguna</TableHead>
            <TableHead className="w-[90px] text-xs font-medium text-muted-foreground">Role</TableHead>
            <TableHead className="hidden text-xs font-medium text-muted-foreground lg:table-cell">Email</TableHead>
            <TableHead className="hidden w-[190px] text-xs font-medium text-muted-foreground lg:table-cell">Terakhir Masuk</TableHead>
            <TableHead className="w-[120px] text-xs font-medium text-muted-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <DesktopSkeletonRow key={index} />
            ))
          ) : users.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer transition-colors hover:bg-muted/30"
              onClick={() => handleRowClick(user)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar name={user.name} />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {ROLE_LABEL[user.role] ?? user.role}
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                {user.email}
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground tabular-nums lg:table-cell">
                {formatTimestamp(user.lastLogin)}
              </TableCell>
              <TableCell onClick={(event) => event.stopPropagation()}>
                <UserStatusBadge status={user.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <MobileSkeletonCard key={index} />
          ))
        ) : showEmpty ? (
          <div className="overflow-hidden rounded-xl border border-border/50 bg-background">
            <UsersEmpty searchQuery={debouncedSearch} />
          </div>
        ) : users.map((user) => (
          <div
            key={user.id}
            className="flex cursor-pointer flex-col gap-3 rounded-xl border border-border/50 p-4 transition-colors hover:bg-muted/20"
            onClick={() => handleRowClick(user)}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <UserAvatar name={user.name} />
              <div className="flex flex-col truncate">
                <span className="truncate text-sm font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between border-t border-border/50 pt-3">
              <UserStatusBadge status={user.status} />
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                {ROLE_LABEL[user.role] ?? user.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-border/50 bg-background md:block">
        {renderDesktopContent()}
      </div>

      {meta && users.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/95 p-1.5 text-sm shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/40">
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-xl"
              disabled={meta.page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              aria-label="Halaman sebelumnya"
              title="Sebelumnya"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-16 px-2 text-center text-xs font-medium text-muted-foreground tabular-nums">
              {meta.page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-xl"
              disabled={meta.page >= meta.totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
              aria-label="Halaman selanjutnya"
              title="Selanjutnya"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={handleAdd}
        size="icon"
        className="fixed bottom-8 right-8 size-14 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700"
      >
        <Plus className="size-6 text-white" />
        <span className="sr-only">Tambah Pengguna</span>
      </Button>

    </div>
  )
}
