"use client"

import { useState, useEffect }        from "react"
import { useParams, useRouter }       from "next/navigation"
import { toast }                      from "sonner"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { Button }  from "@/components/ui/button"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import type { User, UserPermissions } from "@/domain/user/types"
import { UserEditAccountSection } from "./user-edit-account-section"
import { UserEditActionBar } from "./user-edit-action-bar"
import { UserEditPermissionsSection } from "./user-edit-permissions-section"
import {
  EMPTY_USER_EDIT_FORM,
  EMPTY_USER_PERMISSIONS,
  type UserEditFormState,
} from "./user-edit-types"

export default function UserEditPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()

  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [adminCount, setAdminCount] = useState<number | null>(null)

  const [form, setForm] = useState<UserEditFormState>(EMPTY_USER_EDIT_FORM)
  const [permissions, setPermissions] =
    useState<UserPermissions>(EMPTY_USER_PERMISSIONS)

  useEffect(() => {
    let active = true

    async function loadUser() {
      try {
        const response = await fetch(`/api/users/${id}`)
        const data = await response.json().catch(() => null)
        if (!response.ok) throw new Error(data?.error ?? "Gagal memuat data user")
        if (!active) return

        setUser(data)
        setForm({
          name:     data.name,
          email:    data.email,
          username: data.username,
          role:     data.role,
          password: "",
        })
        setPermissions({
          canCreate: data.permissions?.canCreate ?? false,
          canEdit:   data.permissions?.canEdit   ?? false,
          canDelete: data.permissions?.canDelete ?? false,
          canPrint:  data.permissions?.canPrint  ?? false,
          canTrack:  data.permissions?.canTrack  ?? false,
        })

        if (data.role === "ADMIN") {
          const adminResponse = await fetch("/api/users?role=ADMIN&page=1&limit=1")
          const adminData = await adminResponse.json().catch(() => null)
          if (adminResponse.ok && active) {
            setAdminCount(adminData?.meta?.total ?? null)
          }
        } else {
          setAdminCount(null)
        }

        window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Edit Akun" }))
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

  function setField<K extends keyof UserEditFormState>(
    key: K,
    value: UserEditFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSave() {
    if (isLastAdmin && form.role !== "ADMIN") {
      toast.error("Role admin terakhir tidak bisa diubah")
      return
    }

    if (!form.name.trim()) { toast.error("Nama lengkap wajib diisi"); setSaving(false); return }
    if (!form.username.trim()) { toast.error("Nama pengguna wajib diisi"); setSaving(false); return }
    if (!form.email.trim()) { toast.error("Email wajib diisi"); setSaving(false); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Format email tidak valid"); setSaving(false); return }
    if (form.password && form.password.length < 8) { toast.error("Password minimal 8 karakter"); setSaving(false); return }
    if (form.password && form.password.length > 72) { toast.error("Password maksimal 72 karakter"); setSaving(false); return }
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        name:        form.name,
        email:       form.email,
        username:    form.username,
        role:        form.role,
        permissions,
      }
      if (form.password) body.password = form.password

      const res  = await fetch(`/api/users/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(getApiMessage(json, "Gagal menyimpan"))
      toast.success(json.message ?? "Data akun berhasil diubah")
      router.push(`/admin/users/${id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <LoadingSkeleton type="profile" />
  )

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <p className="text-sm text-muted-foreground">User tidak ditemukan</p>
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft size={14} className="mr-1.5" /> Kembali
      </Button>
    </div>
  )

  const isLastAdmin = user.role === "ADMIN" && adminCount !== null && adminCount <= 1

  return (
    <div className="flex flex-col gap-4 pb-32">
      {isLastAdmin && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            Akun ini adalah satu-satunya admin. Informasi akun tetap bisa diubah,
            tetapi role admin tidak bisa diganti.
          </p>
        </div>
      )}

      <UserEditAccountSection
        user={user}
        form={form}
        disabled={saving}
        roleDisabled={isLastAdmin}
        onFieldChange={setField}
      />

      {form.role !== "ADMIN" && (
        <UserEditPermissionsSection
          permissions={permissions}
          onPermissionsChange={setPermissions}
        />
      )}

      <UserEditActionBar
        saving={saving}
        disabled={false}
        onCancel={() => router.push(`/admin/users/${id}`)}
        onSave={handleSave}
      />

    </div>
  )
}

function getApiMessage(json: unknown, fallback: string): string {
  if (typeof json !== "object" || json === null) return fallback
  const body = json as { message?: unknown; error?: unknown; errors?: unknown }
  const baseMessage = typeof body.message === "string"
    ? body.message
    : typeof body.error === "string"
      ? body.error
      : fallback

  if (typeof body.errors === "object" && body.errors !== null) {
    const details = Object.values(body.errors as Record<string, string[]>)
      .flat()
      .filter(Boolean)
      .join(". ")

    if (details) return `${baseMessage}: ${details}`
  }

  return baseMessage
}
