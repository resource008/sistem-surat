"use client"

import type { UserPermissions } from "@/domain/user/types"
import { useUserActions } from "@/hooks/use-users"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { UserAddAccountSection } from "./user-add-account-section"
import { UserAddActionBar } from "./user-add-action-bar"
import { UserAddPermissionsSection } from "./user-add-permissions-section"
import {
  DISABLED_PERMISSIONS,
  EMPTY_USER_FORM,
  type UserAddFormState,
} from "./types/user-add"

export default function UserAddPage() {
  const router = useRouter()
  const { createUser, loading } = useUserActions()
  const [form, setForm] = useState<UserAddFormState>(EMPTY_USER_FORM)
  const [permissions, setPermissions] = useState<UserPermissions>(DISABLED_PERMISSIONS)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Tambah Akun" }))
    return () => {
      window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    }
  }, [])

  function setField<K extends keyof UserAddFormState>(key: K, value: UserAddFormState[K]) {
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

    if (result.success) router.push("/admin/users")
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      <UserAddAccountSection
        form={form}
        onFieldChange={setField}
        onPermissionsReset={() => setPermissions(DISABLED_PERMISSIONS)}
      />

      {form.role !== "ADMIN" && (
        <UserAddPermissionsSection
          permissions={permissions}
          onPermissionsChange={setPermissions}
        />
      )}

      <UserAddActionBar
        loading={loading}
        onCancel={() => router.push("/admin/users")}
        onSave={handleSave}
      />
    </div>
  )
}
