"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import type { User } from "@/domain/user/types"
import { ROLE_LABEL } from "./constants"
import { formatDateTime, isSameTimestamp } from "./date-utils"
import type { AccountForm } from "./types"

const EMPTY_FORM: AccountForm = {
  name: "",
  email: "",
  username: "",
}

function userToForm(user: User): AccountForm {
  return {
    name: user.name,
    email: user.email,
    username: user.username,
  }
}

export function useAccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState<AccountForm>(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)

  const roleLabel = user ? ROLE_LABEL[user.role] ?? user.role : "-"
  const created = formatDateTime(user?.createdAt)
  const updated = useMemo(() => {
    if (!user || isSameTimestamp(user.updatedAt, user.createdAt)) {
      return { date: "-", time: "" }
    }

    return formatDateTime(user.updatedAt)
  }, [user])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    fetch("/api/me/account")
      .then(async (response) => {
        const json = await response.json()
        if (!response.ok) throw new Error(json.error ?? "Gagal memuat data akun")
        return json as User
      })
      .then((data) => {
        setUser(data)
        setForm(userToForm(data))
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Gagal memuat data akun")
      })
      .finally(() => setLoading(false))
  }, [])

  function updateForm(next: Partial<AccountForm>) {
    setForm((current) => ({ ...current, ...next }))
  }

  function handleCancel() {
    if (user) setForm(userToForm(user))
    setEditing(false)
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

    setSaving(true)
    try {
      const response = await fetch("/api/me/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          username: form.username,
        }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Gagal menyimpan akun")

      setUser(json)
      setForm(userToForm(json))
      setEditing(false)
      window.dispatchEvent(new CustomEvent("account:updated"))
      toast.success("Akun berhasil disimpan")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan akun")
    } finally {
      setSaving(false)
    }
  }

  return {
    user,
    form,
    loading,
    saving,
    editing,
    roleLabel,
    created,
    updated,
    setEditing,
    updateForm,
    handleCancel,
    handleSave,
  }
}
