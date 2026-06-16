"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
import {
  EMPTY_DEPARTEMEN_FORM,
  type Departemen,
  type DepartemenFormState,
} from "@/types"

export function useEditDepartemen(id: string) {
  const router = useRouter()
  const [departemen, setDepartemen] = useState<Departemen | null>(null)
  const [form, setForm] = useState<DepartemenFormState>(EMPTY_DEPARTEMEN_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Edit Departemen" }))
    return () => {
      window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadDepartemen() {
      setLoading(true)
      try {
        const res = await fetch(`/api/dept/${encodeURIComponent(id)}`)
        const json = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error(json?.error ?? "Gagal mengambil data departemen")
        }

        if (ignore) return
        const data = json as Departemen
        setDepartemen(data)
        setForm({
          fullName: data.fullName,
          shortName: data.shortName,
        })
      } catch (err) {
        if (!ignore) toast.error(getErrorMessage(err, "Gagal mengambil data departemen"))
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadDepartemen()
    return () => {
      ignore = true
    }
  }, [id])

  function cancel() {
    router.push("/admin/departemen")
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.fullName.trim()) {
      toast.error("Nama departemen wajib diisi")
      return
    }
    if (!form.shortName.trim()) {
      toast.error("Singkatan departemen wajib diisi")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/dept/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          shortName: form.shortName,
        }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(getApiMessage(json, "Gagal menyimpan departemen"))
      }

      toast.success(json?.message ?? "Data departemen berhasil diubah")
      router.push("/admin/departemen")
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan departemen"))
    } finally {
      setSaving(false)
    }
  }

  return {
    state: { departemen, form, loading, saving },
    actions: { setForm, submit, cancel },
  }
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
