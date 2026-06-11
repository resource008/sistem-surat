"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter }                 from "next/navigation"
import { useSearch }                 from "@/app/(dashboard)/admin/layout"
import { useUsers }                  from "@/hooks/use-users"
import { Badge }                     from "@/components/ui/badge"
import { Button }                    from "@/components/ui/button"
import { Plus }                      from "lucide-react"
import type { User }                 from "@/domain/user/types"
import UsersFormModal                from "./users-form-modal"
import UsersEmpty                    from "./users-empty"
import { getAvatarColor, getInitials } from "@/lib/avatar"

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

  const { data, loading, refetch } = useUsers({ page, limit, search: debouncedSearch })

  useEffect(() => {
    setPage(1)
    setUsers([])
    setHasMore(true)
  }, [debouncedSearch])

  useEffect(() => {
    if (!data) return

    setUsers((current) => {
      if (data.meta.page === 1) return data.data

      const existingIds = new Set(current.map((user) => user.id))
      const nextUsers = data.data.filter((user) => !existingIds.has(user.id))
      return [...current, ...nextUsers]
    })
    setHasMore(data.meta.page < data.meta.totalPages)
  }, [data])

  useEffect(() => {
    if (loading || !hasMore) return

    const observers: IntersectionObserver[] = []
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setPage((current) => current + 1)
      }
    }

    if (desktopScrollRef.current && desktopLoadMoreRef.current) {
      const desktopObserver = new IntersectionObserver(handleIntersect, {
        root: desktopScrollRef.current,
        rootMargin: "160px",
      })
      desktopObserver.observe(desktopLoadMoreRef.current)
      observers.push(desktopObserver)
    }

    if (mobileLoadMoreRef.current) {
      const mobileObserver = new IntersectionObserver(handleIntersect, {
        rootMargin: "160px",
      })
      mobileObserver.observe(mobileLoadMoreRef.current)
      observers.push(mobileObserver)
    }

    return () => observers.forEach((observer) => observer.disconnect())
  }, [hasMore, loading, users.length])

  function handleRowClick(user: User) {
    router.push(`/admin/users/${user.id}`)
  }

  function handleAdd() {
    setSelectedUser(null)
    setFormOpen(true)
  }

  function handleFormSuccess() {
    setPage(1)
    setUsers([])
    setHasMore(true)
    refetch()
  }

  const meta = data?.meta

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
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    style={{ backgroundColor: getAvatarColor(user.name) }}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  >
                    {getInitials(user.name)}
                  </div>
                  <span className="truncate text-sm font-medium">{user.name}</span>
                </div>
                <div className="min-w-0 truncate text-sm">{ROLE_LABEL[user.role] ?? user.role}</div>
                <div className="hidden truncate text-sm text-muted-foreground lg:block">
                  {user.email}
                </div>
                <div className="hidden min-w-0 truncate text-sm text-muted-foreground tabular-nums lg:block">
                  {formatTimestamp(user.lastLogin)}
                </div>
                <div className="min-w-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <Badge
                    variant="outline"
                    className={user.status === "Sedang Aktif"
                      ? "max-w-full truncate whitespace-nowrap bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "max-w-full truncate whitespace-nowrap bg-slate-500/10 text-slate-400 border-slate-500/30"}
                  >
                    {user.status ?? "Tidak Aktif"}
                  </Badge>
                </div>
              </div>
            ))
          )}

          <div ref={desktopLoadMoreRef} className="flex min-h-10 items-center justify-center text-xs text-muted-foreground">
            {loading && users.length > 0
              ? "Memuat data..."
              : meta && !hasMore && users.length > 0
                ? `${meta.total} pengguna ditampilkan`
                : null
            }
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4">
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
                <div
                  style={{ backgroundColor: getAvatarColor(user.name) }}
                  className="size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                >
                  {getInitials(user.name)}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 border-t border-border/50 pt-3 mt-1">
                <Badge
                  variant="outline"
                  className={user.status === "Sedang Aktif"
                    ? "max-w-full truncate whitespace-nowrap bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "max-w-full truncate whitespace-nowrap bg-slate-500/10 text-slate-400 border-slate-500/30"}
                >
                  {user.status ?? "Tidak Aktif"}
                </Badge>
                <span className="min-w-0 max-w-[45%] truncate rounded-md bg-muted px-2 py-1 text-xs font-medium">
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden w-full overflow-hidden rounded-xl border border-border/50 bg-background md:block">
        {renderDesktopContent()}
      </div>

      <div ref={mobileLoadMoreRef} className="flex min-h-10 items-center justify-center text-xs text-muted-foreground md:hidden">
        {loading && users.length > 0
          ? "Memuat data..."
          : meta && !hasMore && users.length > 0
            ? `${meta.total} pengguna ditampilkan`
            : null
        }
      </div>

      <Button
        onClick={handleAdd}
        size="icon"
        className="fixed bottom-8 right-8 size-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
      >
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
