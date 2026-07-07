"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react"
import useSWR from "swr"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { TrackRecordFieldControl } from "@/components/shared/track-record-field-control"
import { routes } from "@/constants/routes"
import { getErrorMessage } from "@/lib/utils"
import type { TrackCategory, TrackField, TrackTableResponse, TrackSheet } from "@/types"

type FieldGroup = {
  category?: TrackCategory
  name: string
  color: string
  fields: TrackField[]
}

const GUEST_EMPTY_STATE_COLORS = {
  iconClassName: "text-[#1f2f46] dark:text-[#1f2f46]",
  titleClassName: "text-[#1f2f46] dark:text-[#1f2f46]",
  descriptionClassName: "text-[#546783] dark:text-[#546783]",
}
const TRACK_RECORD_VALUE_MAX_LENGTH = 50

function getCategoryTextColor(backgroundColor: string) {
  const hex = backgroundColor.replace("#", "")
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return "#1f2937"

  const red = parseInt(hex.slice(0, 2), 16)
  const green = parseInt(hex.slice(2, 4), 16)
  const blue = parseInt(hex.slice(4, 6), 16)
  const mix = 0.68

  return `rgb(${Math.round(red * mix)}, ${Math.round(green * mix)}, ${Math.round(blue * mix)})`
}

function getSoftCategoryStyle(backgroundColor: string) {
  const hex = backgroundColor.replace("#", "")
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return {
      backgroundColor: "#f5f5f5",
      color: "#374151",
    }
  }

  const red = parseInt(hex.slice(0, 2), 16)
  const green = parseInt(hex.slice(2, 4), 16)
  const blue = parseInt(hex.slice(4, 6), 16)
  const mix = 0.78
  const softRed = Math.round(red + (255 - red) * mix)
  const softGreen = Math.round(green + (255 - green) * mix)
  const softBlue = Math.round(blue + (255 - blue) * mix)
  const softColor = `rgb(${softRed}, ${softGreen}, ${softBlue})`

  return {
    backgroundColor: softColor,
    color: getCategoryTextColor(backgroundColor),
  }
}

const sheetsFetcher = async (url: string): Promise<TrackTableResponse> => {
  const res = await fetch(url)
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil sheet lacak")
  return json
}

function isDefaultIdField(field: TrackField) {
  return field.columnName.trim().toLowerCase() === "id"
}

function buildFormGroups(sheet: TrackSheet): FieldGroup[] {
  const fields = sheet.fields.filter((field) => !isDefaultIdField(field))
  const groups: FieldGroup[] = []

  sheet.categories.forEach((category) => {
    const categoryFields = fields.filter((field) => field.categoryId === category.id)
    if (categoryFields.length === 0) return
    groups.push({
      category,
      name: category.name,
      color: category.color,
      fields: categoryFields,
    })
  })

  const uncategorized = fields.filter((field) => !field.categoryId)
  if (uncategorized.length > 0 || groups.length === 0) {
    groups.push({
      name: groups.length > 0 ? "Tanpa Kategori" : sheet.name,
      color: "#fff7a8",
      fields: uncategorized.length > 0 ? uncategorized : fields,
    })
  }

  return groups
}

function GuestLacakSuratAddContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const { data, error, isLoading } = useSWR<TrackTableResponse>("/api/guest/track-sheets", sheetsFetcher)

  const sheets = data?.sheets ?? []
  const sheetFromQuery = searchParams.get("sheet") ?? ""
  const selectedSheet = sheets.find((sheet) => sheet.id === sheetFromQuery)
  const groups = useMemo(() => selectedSheet ? buildFormGroups(selectedSheet) : [], [selectedSheet])
  const firstGroup = groups[0]
  const fields = useMemo(() => firstGroup?.fields ?? [], [firstGroup])

  useEffect(() => {
    setValues({})
  }, [selectedSheet?.id])

  function updateValue(fieldId: string, value: string) {
    setValues((current) => ({ ...current, [fieldId]: value.slice(0, TRACK_RECORD_VALUE_MAX_LENGTH) }))
  }

  function changeSheet(sheetId: string) {
    router.replace(`${routes.guest.lacakSurat}/add?sheet=${encodeURIComponent(sheetId)}`)
  }

  function validateBeforeSave() {
    if (sheets.length === 0) {
      toast.error("Sheet lacak belum tersedia")
      return false
    }

    if (!selectedSheet) {
      toast.error("Pilih sheet terlebih dahulu")
      return false
    }

    if (fields.length === 0) {
      toast.error("Sheet ini belum memiliki field")
      return false
    }

    return true
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validateBeforeSave() || !selectedSheet) return
    setSaving(true)

    try {
      const payloadValues = fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = values[field.id]?.trim() ?? ""
        return acc
      }, {})

      const res = await fetch("/api/guest/track-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetId: selectedSheet.id,
          values: payloadValues,
        }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? "Gagal menambahkan data lacak surat")
      }

      toast.success(json?.message ?? "Data lacak surat berhasil ditambahkan")
      router.push(routes.guest.lacakSurat)
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menambahkan data lacak surat"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-svh bg-[#fbfbfb] text-black">
      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-6 py-3 max-sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={routes.guest.lacakSurat}
            aria-label="Kembali"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-neutral-700 transition hover:bg-neutral-100"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="truncate text-sm font-semibold">Tambah Data Lacak</h1>
        </div>

        <div className="w-52 shrink-0 max-sm:w-36">
          <Select value={selectedSheet?.id ?? ""} onValueChange={changeSheet} disabled={saving || sheets.length === 0}>
            <SelectTrigger className="w-full rounded-xl border-neutral-200 bg-white text-sm shadow-sm">
              <SelectValue placeholder="Pilih Sheet" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {sheets.map((sheet) => (
                <SelectItem key={sheet.id} value={sheet.id}>
                  {sheet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 py-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))] max-md:px-4">
        {isLoading ? (
          <div className="grid gap-4">
            <Skeleton className="h-12 w-full rounded-xl bg-neutral-200" />
            <Skeleton className="h-72 w-full rounded-xl bg-neutral-200" />
          </div>
        ) : error ? (
          <EmptyState
            title="Gagal memuat sheet"
            description={error.message}
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : sheets.length === 0 ? (
          <EmptyState
            title="Belum ada sheet lacak"
            description="Sheet lacak belum tersedia untuk menambahkan data."
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : !selectedSheet ? (
          <EmptyState
            title="Pilih sheet terlebih dahulu"
            description="Gunakan dropdown Pilih Sheet untuk menentukan sheet yang akan diisi."
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : fields.length === 0 ? (
          <EmptyState
            title="Belum ada field"
            description="Admin belum mengatur field untuk sheet ini."
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : (
          <form id="guest-track-add-form" onSubmit={submit} className="grid gap-4">
            <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              {firstGroup?.category ? (
                <div
                  className="border-b border-neutral-200 px-4 py-2 text-center text-xs font-bold"
                  style={getSoftCategoryStyle(firstGroup.color)}
                >
                  {firstGroup.name}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
                {fields.map((field) => {
                  const inputId = `guest-track-add-${field.id}`
                  return (
                    <div key={field.id} className="grid gap-2">
                      <Label htmlFor={inputId} className="text-xs font-semibold text-neutral-700">
                        {field.columnName}
                      </Label>
                      <TrackRecordFieldControl
                        field={field}
                        inputId={inputId}
                        value={values[field.id] ?? ""}
                        onChange={(value) => updateValue(field.id, value)}
                        disabled={saving}
                        maxLength={TRACK_RECORD_VALUE_MAX_LENGTH}
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          </form>
        )}
      </section>

      <Button
        type={selectedSheet && fields.length > 0 ? "submit" : "button"}
        form={selectedSheet && fields.length > 0 ? "guest-track-add-form" : undefined}
        onClick={() => {
          if (!selectedSheet || fields.length === 0) validateBeforeSave()
        }}
        disabled={saving || isLoading || Boolean(error)}
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-40 h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 max-sm:left-4 max-sm:right-4 max-sm:w-auto"
      >
        <Save className="size-4" />
        {saving ? "Menyimpan" : "Simpan"}
      </Button>
    </main>
  )
}

export function GuestLacakSuratAddPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfbfb]" />}>
      <GuestLacakSuratAddContent />
    </Suspense>
  )
}
