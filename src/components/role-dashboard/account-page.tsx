"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/domain/user/types"
import { getAvatarColor, getInitials } from "@/lib/avatar"
import { Eye, EyeOff, Loader2, Pencil, Save, X } from "lucide-react"
import { type ReactNode, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  PKL: "PKL",
}

function formatDateTime(dateStr: Date | string | null | undefined) {
  if (!dateStr) return { date: "-", time: "" }
  const date = new Date(dateStr)
  return {
    date: date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

function ReadField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="min-h-12 flex items-center rounded-lg border border-border/60 bg-background/70 px-4 text-sm text-foreground">
        {value || "-"}
      </div>
    </div>
  )
}

function EditField({
  label,
  value,
  type = "text",
  autoComplete,
  placeholder,
  trailing,
  onChange,
}: {
  label: string
  value: string
  type?: string
  autoComplete?: string
  placeholder?: string
  trailing?: ReactNode
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        <Input
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 rounded-lg bg-background/70 ${trailing ? "pr-12" : ""}`}
        />
        {trailing}
      </div>
    </div>
  )
}

export function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  })

  useEffect(() => {
    let mounted = true

    fetch("/api/profile")
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Gagal memuat akun")
        return json as User
      })
      .then((data) => {
        if (!mounted) return
        setUser(data)
        setForm({
          name: data.name,
          email: data.email,
          username: data.username,
          password: "",
        })
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Gagal memuat akun")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [])

  const timestamps = useMemo(() => ({
    updated: formatDateTime(user?.updatedAt),
    created: formatDateTime(user?.createdAt),
  }), [user?.createdAt, user?.updatedAt])

  function resetForm() {
    if (!user) return
    setForm({
      name: user.name,
      email: user.email,
      username: user.username,
      password: "",
    })
    setShowPassword(false)
    setEditing(false)
  }

  async function handleSave() {
    if (!user) return
    if (!form.name.trim()) return toast.error("Nama lengkap wajib diisi")
    if (!form.username.trim()) return toast.error("Nama pengguna wajib diisi")
    if (!form.email.trim()) return toast.error("Email wajib diisi")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error("Format email tidak valid")
    }

    const body: Record<string, string> = {}
    if (form.name !== user.name) body.name = form.name
    if (form.email !== user.email) body.email = form.email
    if (form.username !== user.username) body.username = form.username
    if (form.password) body.password = form.password

    if (Object.keys(body).length === 0) {
      toast.info("Tidak ada perubahan")
      setShowPassword(false)
      setEditing(false)
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Gagal menyimpan akun")

      setUser(json as User)
      setForm({
        name: json.name,
        email: json.email,
        username: json.username,
        password: "",
      })
      setShowPassword(false)
      setEditing(false)
      window.dispatchEvent(new CustomEvent("profile:updated", { detail: json }))
      toast.success("Akun berhasil diperbarui")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan akun")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground">
        Data akun tidak ditemukan
      </div>
    )
  }

  const displayName = editing ? form.name : user.name

  return (
    <div className="pb-28">
      <div className="rounded-2xl bg-muted/60 px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div
                  className="size-24 rounded-full text-3xl font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: getAvatarColor(displayName || "User") }}
                >
                  {getInitials(displayName || "User")}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-foreground">{displayName}</p>
                <p className="text-sm text-muted-foreground">{ROLE_LABEL[user.role] ?? user.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-12 lg:pt-3">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">Diperbarui</span>
                <span className="text-sm text-muted-foreground">
                  {timestamps.updated.date}
                  {timestamps.updated.time && <><br />{timestamps.updated.time}</>}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">Ditambahkan</span>
                <span className="text-sm text-muted-foreground">
                  {timestamps.created.date}
                  {timestamps.created.time && <><br />{timestamps.created.time}</>}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            {editing ? (
              <>
                <EditField
                  label="Nama Lengkap"
                  value={form.name}
                  onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                />
                <EditField
                  label="Nama Pengguna"
                  value={form.username}
                  autoComplete="username"
                  onChange={(value) => setForm((prev) => ({ ...prev, username: value }))}
                />
                <EditField
                  label="Email"
                  type="email"
                  value={form.email}
                  autoComplete="email"
                  onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                />
                <ReadField label="Role" value={ROLE_LABEL[user.role] ?? user.role} />
                <EditField
                  label="Kata Sandi"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  autoComplete="new-password"
                  placeholder="Kosongkan jika tidak diubah"
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      title={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
                />
              </>
            ) : (
              <>
                <ReadField label="Nama Lengkap" value={user.name} />
                <ReadField label="Nama Pengguna" value={user.username} />
                <ReadField label="Email" value={user.email} />
                <ReadField label="Role" value={ROLE_LABEL[user.role] ?? user.role} />
                <ReadField label="Kata Sandi" value="************" />
              </>
            )}
          </div>
        </div>
      </div>

      {editing ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="inline-flex items-center gap-1 rounded-2xl border border-border/70 bg-background/95 p-1.5 shadow-2xl backdrop-blur">
            <Button
              variant="ghost"
              onClick={resetForm}
              disabled={saving}
              className="h-10 gap-2 rounded-xl px-4 text-[13px]"
            >
              <X size={14} /> Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-10 gap-2 rounded-xl bg-blue-600 px-5 text-[13px] font-semibold text-white hover:bg-blue-700"
            >
              {saving ? (
                <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
              ) : (
                <><Save size={14} /> Simpan</>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          size="icon"
          onClick={() => setEditing(true)}
          className="fixed bottom-8 right-8 size-14 rounded-2xl bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        >
          <Pencil size={20} />
          <span className="sr-only">Edit Akun</span>
        </Button>
      )}
    </div>
  )
}
