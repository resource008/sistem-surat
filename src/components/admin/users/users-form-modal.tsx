// ============================================================
// src/components/admin/users/users-form-modal.tsx
// Modal form untuk Create dan Edit user
// ============================================================

"use client"

import { useEffect, useState }  from "react"
import { useUserActions }       from "@/hooks/use-users"
import type { User }            from "@/domain/user/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
}                               from "@/components/ui/dialog"
import { Button }               from "@/components/ui/button"
import { Input }                from "@/components/ui/input"
import { Label }                from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}                               from "@/components/ui/select"

// ── Tipe ─────────────────────────────────────────────────────

interface Props {
  open:      boolean
  onClose:   () => void
  onSuccess: () => void
  user?:     User | null   // jika ada → mode Edit, jika null → mode Create
}

interface FormState {
  name:            string
  email:           string
  username:        string
  password:        string
  confirmPassword: string
  role:            string
}

const EMPTY_FORM: FormState = {
  name:            "",
  email:           "",
  username:        "",
  password:        "",
  confirmPassword: "",
  role:            "STAFF",
}

// ── Komponen ──────────────────────────────────────────────────

export function UsersFormModal({ open, onClose, onSuccess, user }: Props) {
  const isEdit                    = !!user
  const { createUser, updateUser, loading } = useUserActions(onSuccess)

  const [form,   setForm]   = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  // Isi form saat mode Edit
  useEffect(() => {
    if (user) {
      setForm({
        name:            user.name,
        email:           user.email,
        username:        user.username,
        password:        "",
        confirmPassword: "",
        role:            user.role,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [user, open])

  // Validasi sisi client (ringan — validasi utama di server)
  function validate(): boolean {
    const errs: Partial<FormState> = {}

    if (!form.name.trim())            errs.name     = "Nama wajib diisi"
    if (!form.email.trim())           errs.email    = "Email wajib diisi"
    if (!form.username.trim())        errs.username = "Username wajib diisi"
    if (!isEdit && !form.password)    errs.password = "Password wajib diisi untuk user baru"

    if (form.password && form.password.length < 8) {
      errs.password = "Password minimal 8 karakter"
    }
    if (form.password && form.password !== form.confirmPassword) {
      errs.confirmPassword = "Konfirmasi password tidak cocok"
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return

    if (isEdit && user) {
      // Hanya kirim field yang berubah
      const payload: Record<string, string> = {}
      if (form.name     !== user.name)     payload.name     = form.name
      if (form.email    !== user.email)    payload.email    = form.email
      if (form.username !== user.username) payload.username = form.username
      if (form.role     !== user.role)     payload.role     = form.role
      if (form.password)                   payload.password = form.password

      if (Object.keys(payload).length === 0) {
        onClose()
        return
      }

      const result = await updateUser(user.id, payload)
      if (result.success) onClose()
    } else {
      const result = await createUser({
        name:     form.name,
        email:    form.email,
        username: form.username,
        password: form.password,
        role:     form.role,
      })
      if (result.success) onClose()
    }
  }

  function handleChange(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Tambah User Baru"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* Nama */}
          <div className="space-y-1">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Budi Santoso"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="budi@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="budi_santoso"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value.toLowerCase())}
            />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Select value={form.role} onValueChange={(v) => handleChange("role", v)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="PKL">PKL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">
              {isEdit ? "Password Baru (opsional)" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEdit ? "Kosongkan jika tidak ingin diubah" : "Min. 8 karakter"}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Konfirmasi Password */}
          {form.password && (
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          )}

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}