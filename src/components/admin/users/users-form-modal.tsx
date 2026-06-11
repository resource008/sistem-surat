// src/components/admin/users/users-form-modal.tsx
"use client"

import { useEffect, useState }  from "react"
import { useUserActions }       from "@/hooks/use-users"
import type { User }            from "@/domain/user/types"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button }   from "@/components/ui/button"
import { Input }    from "@/components/ui/input"
import { Label }    from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, Shuffle } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────

interface Props {
  open:         boolean
  onOpenChange: (open: boolean) => void
  user:         User | null   // null = tambah baru
  onSuccess:    () => void
}

interface FormState {
  name:     string
  email:    string
  username: string
  password: string
  role:     string
}

const EMPTY: FormState = {
  name: "", email: "", username: "", password: "", role: "STAFF",
}

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

  return required
    .sort(() => Math.random() - 0.5)
    .join("")
}

// ── Component ─────────────────────────────────────────────────

export default function UsersFormModal({ open, onOpenChange, user, onSuccess }: Props) {
  const isEdit = !!user
  const { createUser, updateUser, loading } = useUserActions(() => {
    onSuccess()
    onOpenChange(false)
  })

  const [form,   setForm]   = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [showPassword, setShowPassword] = useState(false)

  // Isi form saat edit
  useEffect(() => {
    if (user) {
      setForm({
        name:     user.name,
        email:    user.email,
        username: user.username,
        password: "",           // kosongkan — opsional saat edit
        role:     user.role,
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
    setShowPassword(false)
  }, [user, open])

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.name.trim())     e.name     = "Nama wajib diisi"
    if (!form.email.trim())    e.email    = "Email wajib diisi"
    if (!form.username.trim()) e.username = "Username wajib diisi"
    if (!isEdit && !form.password) e.password = "Password wajib diisi"
    if (form.password && form.password.length < 8) e.password = "Password minimal 8 karakter"
    if (form.password && form.password.length > 72) e.password = "Password maksimal 72 karakter"
    if (!form.role)            e.role     = "Role wajib dipilih"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return

    if (isEdit) {
      const body: Record<string, string> = {
        name: form.name, email: form.email,
        username: form.username, role: form.role,
      }
      if (form.password) body.password = form.password
      await updateUser(user!.id, body)
    } else {
      await createUser({
        name:     form.name,
        email:    form.email,
        username: form.username,
        password: form.password,
        role:     form.role,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pengguna" : "Tambah Pengguna"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi pengguna. Kosongkan password jika tidak ingin mengubahnya."
              : "Isi form berikut untuk membuat pengguna baru."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">

          {/* Nama */}
          <Field label="Nama" error={errors.name}>
            <Input
              placeholder="Nama lengkap"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>

          {/* Email */}
          <Field label="Email" error={errors.email}>
            <Input
              type="email"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>

          {/* Username */}
          <Field label="Username" error={errors.username}>
            <Input
              placeholder="username"
              value={form.username}
              onChange={(e) => set("username", e.target.value.toLowerCase())}
            />
          </Field>

          {/* Password */}
          <Field
            label={isEdit ? "Password (opsional)" : "Password"}
            error={errors.password}
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isEdit ? "Kosongkan jika tidak diubah" : "Min. 8 karakter"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
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
                  const nextPassword = generatePassword()
                  set("password", nextPassword)
                  setShowPassword(true)
                }}
                className="gap-2"
              >
                <Shuffle size={14} /> Generate
              </Button>
            </div>
          </Field>

          {/* Role */}
          <Field label="Role" error={errors.role}>
            <Select value={form.role} onValueChange={(v) => set("role", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="PKL">PKL</SelectItem>
              </SelectContent>
            </Select>
          </Field>

        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Field wrapper ─────────────────────────────────────────────

function Field({
  label, error, children,
}: {
  label: string; error?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
