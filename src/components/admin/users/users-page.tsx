// src/components/admin/users/users-page.tsx
"use client"

import { useEffect, useCallback, useState } from "react"
import { useSearch }          from "@/app/(dashboard)/admin/layout"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge }              from "@/components/ui/badge"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

// ── Types ─────────────────────────────────────────────────────

type Role   = "ADMIN" | "STAFF" | "PKL"
type Status = "Aktif" | "Tidak Aktif"

interface User {
  id:         string
  name:       string
  email:      string
  role:       Role
  lastLogin:  string | null
  lastLogout: string | null
  status:     Status
}

// ── Helpers ───────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function formatTimestamp(dateStr: string | null) {
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

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  PKL:   "PKL",
}

const AVATAR_COLORS: Record<Role, string> = {
  ADMIN: "bg-teal-500",
  STAFF: "bg-blue-500",
  PKL:   "bg-violet-500",
}

// ── Component ─────────────────────────────────────────────────

export default function UsersPage() {
  const { search } = useSearch()

  const [users,   setUsers]   = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async (q = "") => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: "1", limit: "50" })
      if (q) params.set("search", q)

      const res  = await fetch(`/api/users?${params}`)
      const data = await res.json()

      const normalized: User[] = (data.data ?? data).map((u: any) => ({
        id:         u.id,
        name:       u.name,
        email:      u.email,
        role:       u.role,
        lastLogin:  u.lastLogin  ?? u.createdAt ?? null,
        lastLogout: u.lastLogout ?? null,
        status:     u.status ?? "Tidak Aktif",
      }))
      setUsers(normalized)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch awal
  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Debounce search 600ms
  useEffect(() => {
    const t = setTimeout(() => fetchUsers(search), 600)
    return () => clearTimeout(t)
  }, [search, fetchUsers])

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-background">
      
      {/* 📱 MOBILE & TABLET VIEW (Tampilan Card) */}
      <div className="flex flex-col divide-y divide-border/50 md:hidden">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-muted animate-pulse rounded-full shrink-0" />
                <div className="h-4 bg-muted animate-pulse rounded-md w-1/2" />
              </div>
              <div className="h-3 bg-muted animate-pulse rounded-md w-full" />
              <div className="h-3 bg-muted animate-pulse rounded-md w-2/3" />
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            {search ? `Tidak ada pengguna "${search}"` : "Belum ada pengguna"}
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="p-4 flex flex-col gap-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback className={`text-sm font-semibold text-white ${AVATAR_COLORS[user.role]}`}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    user.status === "Aktif"
                      ? "bg-green-50 text-green-600 border-green-200 gap-1.5 shrink-0"
                      : "bg-red-50 text-red-500 border-red-200 gap-1.5 shrink-0"
                  }
                >
                  {user.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg mt-1">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">Role</span>
                  <span>{ROLE_LABEL[user.role]}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">Terakhir Masuk</span>
                  <span>{formatTimestamp(user.lastLogin)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 💻 DESKTOP VIEW (Tampilan Tabel Asli) */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-medium text-muted-foreground">Nama Pengguna</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground w-[100px]">Role</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground w-[160px]">Terakhir Masuk</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground w-[160px]">Terakhir Keluar</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-[120px] bg-muted animate-pulse rounded-md" /></TableCell>
                  <TableCell><div className="h-4 w-[150px] bg-muted animate-pulse rounded-md" /></TableCell>
                  <TableCell><div className="h-4 w-[60px] bg-muted animate-pulse rounded-md" /></TableCell>
                  <TableCell><div className="h-4 w-[100px] bg-muted animate-pulse rounded-md" /></TableCell>
                  <TableCell><div className="h-4 w-[100px] bg-muted animate-pulse rounded-md" /></TableCell>
                  <TableCell><div className="h-4 w-[80px] bg-muted animate-pulse rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-sm text-muted-foreground">
                  {search ? `Tidak ada pengguna dengan nama "${search}"` : "Belum ada pengguna"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors whitespace-nowrap">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className={`text-xs font-semibold text-white ${AVATAR_COLORS[user.role]}`}>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-sm">{ROLE_LABEL[user.role]}</TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">{formatTimestamp(user.lastLogin)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">{formatTimestamp(user.lastLogout)}</TableCell>
                  <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.status === "Aktif"
                        ? "bg-black text-white "
                        : "bg-white text-black "
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
    </div>
  )
}