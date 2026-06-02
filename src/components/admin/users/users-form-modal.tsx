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

// ── Component ─────────────────────────────────────────────────

export default function UsersFormModal({ open, onOpenChange, user, onSuccess }: Props) {
  const isEdit = !!user
  const { createUser, updateUser, loading } = useUserActions(() => {
    onSuccess()
    onOpenChange(false)
  })

  const [form,   setForm]   = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})

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
            <Input
              type="password"
              placeholder={isEdit ? "Kosongkan jika tidak diubah" : "Min. 8 karakter"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
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