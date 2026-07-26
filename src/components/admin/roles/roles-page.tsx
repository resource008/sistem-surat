"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit3, Plus, ShieldCheck, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import useSWR from "swr"

type RoleItem = {
  id: string
  name: string
  value: string
  isSystem: boolean
  userCount: number
}

type RoleResponse = {
  roles: RoleItem[]
}

const fetcher = async (url: string): Promise<RoleResponse> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil role")
  return json
}

function RoleTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="px-5 py-3">
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell className="pr-5">
            <div className="flex justify-end gap-1">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function RolesPage() {
  const { data, error, mutate, isLoading } = useSWR<RoleResponse>("/api/admin/user-roles", fetcher)
  const [name, setName] = useState("")
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null)
  const [editName, setEditName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Kelola Role" }))
    return () => {
      window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    }
  }, [])

  async function createRole() {
    if (!name.trim()) {
      toast.error("Nama role wajib diisi")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/admin/user-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) throw new Error(json?.error ?? json?.message ?? "Gagal menyimpan role")

      toast.success(json?.message ?? "Role berhasil disimpan")
      setName("")
      await mutate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan role")
    } finally {
      setSaving(false)
    }
  }

  async function updateRole() {
    if (!editingRole) return
    if (!editName.trim()) {
      toast.error("Nama role wajib diisi")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/user-roles/${encodeURIComponent(editingRole.value)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) throw new Error(json?.error ?? json?.message ?? "Gagal mengubah role")

      toast.success(json?.message ?? "Role berhasil diubah")
      setEditingRole(null)
      setEditName("")
      await mutate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengubah role")
    } finally {
      setSaving(false)
    }
  }

  async function deleteRole(role: RoleItem) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/user-roles/${encodeURIComponent(role.value)}`, {
        method: "DELETE",
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) throw new Error(json?.error ?? json?.message ?? "Gagal menghapus role")

      toast.success(json?.message ?? "Role berhasil dihapus")
      await mutate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus role")
    } finally {
      setSaving(false)
    }
  }

  const roles = data?.roles ?? (error ? [
    { id: "fallback-admin", name: "Admin", value: "ADMIN", isSystem: true, userCount: 0 },
    { id: "fallback-staff", name: "Staff", value: "STAFF", isSystem: false, userCount: 0 },
    { id: "fallback-pkl", name: "PKL", value: "PKL", isSystem: false, userCount: 0 },
  ] : [])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 pb-24">
      <section className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-sm shadow-black/[0.02]">
        <div className="flex flex-col gap-1 border-b border-border/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <ShieldCheck size={16} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">Tambah Role</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Admin adalah satu-satunya role bawaan.
              </p>
            </div>
          </div>
        </div>

        <form
          className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            void createRole()
          }}
        >
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Role</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contoh: Staff"
              className="h-11 rounded-xl"
              disabled={saving}
            />
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="submit" className="h-11 rounded-xl" disabled={saving}>
              <Plus size={16} /> Tambah Role
            </Button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-sm shadow-black/[0.02]">
        <div className="flex items-center justify-between gap-3 border-b border-border/50 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Daftar Role</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{roles.length} role terdaftar</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="h-11 px-5">Role</TableHead>
              <TableHead className="w-[120px]">Jenis</TableHead>
              <TableHead className="w-[140px]">Pengguna</TableHead>
              <TableHead className="w-[132px] pr-5 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <RoleTableSkeleton />
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-16 text-center text-sm text-muted-foreground">
                  Belum ada role.
                </TableCell>
              </TableRow>
            ) : roles.map((role) => (
              <TableRow key={role.value} className="group">
                <TableCell className="px-5 py-3">
                  <div className="font-medium">{role.name}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={role.isSystem ? "secondary" : "outline"}>
                    {role.isSystem ? "Bawaan" : "Custom"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{role.userCount}</TableCell>
                <TableCell className="pr-5">
                  <div className="flex justify-end gap-1">
                    {!role.isSystem ? (
                      <>
                        <Dialog
                          open={editingRole?.value === role.value}
                          onOpenChange={(open) => {
                            if (open) {
                              setEditingRole(role)
                              setEditName(role.name)
                            } else {
                              setEditingRole(null)
                              setEditName("")
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="action-neutral"
                              size="icon-sm"
                              aria-label={`Edit ${role.name}`}
                              disabled={saving}
                            >
                              <Edit3 size={15} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit role</DialogTitle>
                              <DialogDescription>
                                Silahkan edit nama role sesuai kebutuhan.
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              className="grid gap-4"
                              onSubmit={(event) => {
                                event.preventDefault()
                                void updateRole()
                              }}
                            >
                              <div className="grid gap-1.5">
                                <Label className="text-xs text-muted-foreground">Role</Label>
                                <Input
                                  value={editName}
                                  onChange={(event) => setEditName(event.target.value)}
                                  placeholder="Contoh: Staff"
                                  className="h-11 rounded-xl"
                                  disabled={saving}
                                />
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" variant="outline" disabled={saving}>
                                    Batal
                                  </Button>
                                </DialogClose>
                                <Button type="submit" disabled={saving}>
                                  Simpan
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="action-danger-soft"
                              size="icon-sm"
                              aria-label={`Hapus ${role.name}`}
                              disabled={saving || role.userCount > 0}
                              title={role.userCount > 0 ? "Role masih digunakan pengguna" : "Hapus role"}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus role ini?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Role {role.name} akan dihapus permanen dari daftar role.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => deleteRole(role)}
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : (
                      <Badge variant="outline" className="border-transparent text-muted-foreground">
                        Bawaan
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
