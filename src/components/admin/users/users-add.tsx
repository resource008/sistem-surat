"use client"

import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserPermissions } from "@/domain/user/types"
import { useUserActions } from "@/hooks/use-users"
import { Check, Eye, EyeOff, FileText, KeyRound, Loader2, Save, Shuffle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type FormState = {
  name: string
  email: string
  username: string
  password: string
  role: "ADMIN" | "STAFF" | "PKL"
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  username: "",
  password: "",
  role: "STAFF",
}

const DISABLED_PERMISSIONS: UserPermissions = {
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canPrint: false,
  canTrack: false,
}

const PERMISSIONS = [
  { key: "canCreate", label: "Tambah Data Surat" },
  { key: "canPrint", label: "Cetak Surat" },
  { key: "canEdit", label: "Edit Data Surat" },
  { key: "canTrack", label: "Lacak Surat" },
  { key: "canDelete", label: "Hapus Data Surat" },
] as const

function generatePassword(length = 12) {
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const number = "0123456789"
  const symbol = "!@#$%^&*"
  const all = lower + upper + number + symbol
  const required = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    number[Math.floor(Math.random() * number.length)],
    symbol[Math.floor(Math.random() * symbol.length)],
  ]

  for (let i = required.length; i < length; i++) {
    required.push(all[Math.floor(Math.random() * all.length)])
  }

  return required.sort(() => Math.random() - 0.5).join("")
}

function PermissionToggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors
          ${!value
            ? "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700"
            : "border-slate-200 bg-transparent text-slate-400 dark:border-slate-800"}`}
      >
        <X size={14} />
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors
          ${value
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-200 bg-transparent text-slate-400 dark:border-slate-800"}`}
      >
        <Check size={14} strokeWidth={3} />
      </button>
    </div>
  )
}

export default function UserAddPage() {
  const router = useRouter()
  const { createUser, loading } = useUserActions()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [permissions, setPermissions] = useState<UserPermissions>(DISABLED_PERMISSIONS)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Tambah Akun" }))
    return () => {
      window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    }
  }, [])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Nama lengkap wajib diisi")
      return
    }
    if (!form.username.trim()) {
      toast.error("Nama pengguna wajib diisi")
      return
    }
    if (!form.email.trim()) {
      toast.error("Email wajib diisi")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Format email tidak valid")
      return
    }
    if (!form.password) {
      toast.error("Password wajib diisi")
      return
    }
    if (form.password.length < 8) {
      toast.error("Password minimal 8 karakter")
      return
    }
    if (form.password.length > 72) {
      toast.error("Password maksimal 72 karakter")
      return
    }

    const result = await createUser({
      name: form.name,
      email: form.email,
      username: form.username,
      password: form.password,
      role: form.role,
      permissions: form.role === "ADMIN" ? undefined : permissions,
    })

    if (result.success) {
      router.push(result.data?.id ? `/admin/users/${result.data.id}` : "/admin/users")
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-background">
        <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
          <FileText size={16} className="text-muted-foreground" />
          <span className="text-sm font-semibold">Data Akun</span>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={form.name || "Pengguna Baru"}
              className="size-10 text-sm transition-colors"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">
                {form.name || "Pengguna Baru"}
              </span>
              <span className="text-xs text-muted-foreground">{form.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nama Lengkap">
              <Input
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                className="h-10 rounded-xl text-sm"
                placeholder="Nama lengkap"
              />
            </Field>

            <Field label="Nama Pengguna">
              <Input
                value={form.username}
                onChange={(event) => setField("username", event.target.value.toLowerCase())}
                className="h-10 rounded-xl text-sm"
                placeholder="username"
                autoComplete="new-password"
              />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                className="h-10 rounded-xl text-sm"
                placeholder="email@contoh.com"
                autoComplete="off"
              />
            </Field>

            <Field label="Role">
              <Select
                value={form.role}
                onValueChange={(value) => {
                  const role = value as FormState["role"]
                  setField("role", role)
                  setPermissions(DISABLED_PERMISSIONS)
                }}
              >
                <SelectTrigger className="h-10 rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="PKL">PKL</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Password">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => setField("password", event.target.value)}
                    placeholder="Min. 8 karakter"
                    className="h-10 rounded-xl pr-11 text-sm"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    title={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setField("password", generatePassword())
                    setShowPassword(true)
                  }}
                  className="h-10 gap-2 rounded-xl text-sm"
                >
                  <Shuffle size={14} /> Generate
                </Button>
              </div>
            </Field>
          </div>
        </div>
      </div>

      {form.role !== "ADMIN" && (
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-background">
          <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
            <KeyRound size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Hak Akses</span>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PERMISSIONS.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between border-b border-border/30 py-2 last:border-0 sm:[&:nth-last-child(2)]:border-0"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <PermissionToggle
                    value={permissions[key]}
                    onChange={(value) => {
                      setPermissions((current) => ({ ...current, [key]: value }))
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/90 dark:shadow-black/50">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/users")}
            className="h-10 gap-2 rounded-xl px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={14} /> Batal
          </Button>
          <Button
            disabled={loading}
            onClick={handleSave}
            className="h-10 gap-2 rounded-xl bg-blue-600 px-5 text-[13px] font-semibold text-white hover:bg-blue-700"
          >
            {loading
              ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
              : <><Save size={14} /> Simpan</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}
