"use client"

import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import useSWR from "swr"
import { ArrowLeft, ArrowRight, Pencil, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { TrackRecordFieldControl } from "@/components/shared/track-record-field-control"
import { routes } from "@/constants/routes"
import { getErrorMessage } from "@/lib/utils"
import type { TrackCategory, TrackField, TrackRecord, TrackRecordResponse, TrackSheet, TrackTableResponse } from "@/types"

type FieldGroup = {
  category?: TrackCategory
  name: string
  color: string
  fields: TrackField[]
}

const TRACK_RECORD_VALUE_MAX_LENGTH = 50
const GUEST_EMPTY_STATE_COLORS = {
  iconClassName: "text-[#1f2f46] dark:text-[#1f2f46]",
  titleClassName: "text-[#1f2f46] dark:text-[#1f2f46]",
  descriptionClassName: "text-[#546783] dark:text-[#546783]",
}

const sheetsFetcher = async (url: string): Promise<TrackTableResponse> => {
  const res = await fetch(url)
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil sheet lacak")
  return json
}

const recordsFetcher = async (url: string): Promise<TrackRecordResponse> => {
  const res = await fetch(url)
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil data lacak surat")
  return json
}

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

function isDefaultIdField(field: TrackField) {
  return field.columnName.trim().toLowerCase() === "id"
}

function getRecordValue(record: TrackRecord, field: TrackField, index = 0) {
  if (isDefaultIdField(field)) return String(index + 1)
  return record.values[field.id]?.trim() || "-"
}

function isEditableField(field: TrackField, group: FieldGroup) {
  return !isDefaultIdField(field) && !field.fillByHrd && !(group.category?.fillByHrd ?? false)
}

function getGroupKey(group: FieldGroup) {
  return group.category?.id ?? "uncategorized"
}

function buildEditSearchParams(sheet: TrackSheet, group: FieldGroup) {
  const params = new URLSearchParams({
    sheet: sheet.id,
    category: getGroupKey(group),
    categoryName: group.name,
  })

  return params.toString()
}

function parseCategorySegment(segment?: string) {
  if (!segment) return ""

  const decoded = decodeURIComponent(segment)
  return decoded.startsWith("category=") ? decoded.slice("category=".length) : decoded
}

function buildCategorySegment(categoryName: string) {
  return `category=${encodeURIComponent(categoryName)}`
}

function buildGuestCategoryRoute(action: "view-detail" | "edit-category" | "fill-data", categoryName: string, recordId: string) {
  return `${routes.guest.lacakSurat}/${action}/${buildCategorySegment(categoryName)}/${encodeURIComponent(recordId)}`
}

function buildDisplayGroups(sheet: TrackSheet): FieldGroup[] {
  const visibleFields = sheet.fields.filter((field) => !isDefaultIdField(field))
  const groups: FieldGroup[] = []

  sheet.categories.forEach((category) => {
    const fields = visibleFields.filter((field) => field.categoryId === category.id)
    if (fields.length === 0) return
    groups.push({
      category,
      name: category.name,
      color: category.color,
      fields,
    })
  })

  const uncategorized = visibleFields.filter((field) => !field.categoryId)
  if (uncategorized.length > 0 || groups.length === 0) {
    groups.push({
      name: groups.length > 0 ? "Tanpa Kategori" : sheet.name,
      color: "#fff7a8",
      fields: uncategorized.length > 0 ? uncategorized : visibleFields,
    })
  }

  return groups
}

export function GuestLacakSuratDetailPage() {
  const params = useParams<{ recordId: string; categoryParam?: string }>()
  const searchParams = useSearchParams()
  const recordId = decodeURIComponent(params.recordId)
  const routeCategoryName = parseCategorySegment(params.categoryParam)
  const sheetId = searchParams.get("sheet") ?? ""
  const [activeGroupKey, setActiveGroupKey] = useState("")
  const [editingGroupKey, setEditingGroupKey] = useState("")
  const [editing, setEditing] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const { data: sheetData, error: sheetsError, isLoading: sheetsLoading } = useSWR<TrackTableResponse>(
    "/api/guest/track-sheets",
    sheetsFetcher
  )
  const sheets = sheetData?.sheets ?? []
  const lookupRecordKey = sheetId ? null : `/api/guest/track-records?recordId=${encodeURIComponent(recordId)}`
  const {
    data: lookupRecordData,
    error: lookupRecordError,
    isLoading: lookupRecordLoading,
  } = useSWR<TrackRecordResponse>(lookupRecordKey, recordsFetcher)
  const lookupRecord = lookupRecordData?.records[0]
  const effectiveSheetId = sheetId || lookupRecord?.sheetId || ""
  const sheet = sheets.find((item) => item.id === effectiveSheetId)
  const recordsKey = sheet ? `/api/guest/track-records?sheetId=${encodeURIComponent(sheet.id)}` : null
  const { data: recordData, error: recordsError, isLoading: recordsLoading, mutate } = useSWR<TrackRecordResponse>(
    recordsKey,
    recordsFetcher
  )
  const record = recordData?.records.find((item) => item.id === recordId) ?? lookupRecord
  const recordIndex = Math.max(0, recordData?.records.findIndex((item) => item.id === recordId) ?? 0)
  const groups = useMemo(() => sheet ? buildDisplayGroups(sheet) : [], [sheet])
  const firstGroup = groups[0]
  const routeGroup = routeCategoryName
    ? groups.find((group) => group.name.toLowerCase() === routeCategoryName.toLowerCase())
    : undefined
  const activeGroup = activeGroupKey
    ? groups.find((group) => (group.category?.id ?? "uncategorized") === activeGroupKey)
    : routeGroup && routeGroup !== firstGroup
      ? routeGroup
      : undefined
  const selectedGroup = activeGroup && activeGroup !== firstGroup ? activeGroup : undefined
  const displayedGroups = [firstGroup, selectedGroup].filter(Boolean) as FieldGroup[]
  const editingGroup = editingGroupKey
    ? groups.find((group) => getGroupKey(group) === editingGroupKey)
    : undefined
  const categoryBarGroups = groups.slice(1)
  const firstGroupEditableFields = useMemo(
    () => firstGroup?.fields.filter((field) => isEditableField(field, firstGroup)) ?? [],
    [firstGroup]
  )
  const selectedGroupEditableFields = useMemo(
    () => selectedGroup?.fields.filter((field) => isEditableField(field, selectedGroup)) ?? [],
    [selectedGroup]
  )
  const editableFields = useMemo(
    () => editingGroup?.fields.filter((field) => isEditableField(field, editingGroup)) ?? [],
    [editingGroup]
  )
  const editHref = sheet && firstGroup
    ? buildGuestCategoryRoute("edit-category", firstGroup.name, recordId)
    : routes.guest.lacakSurat

  useEffect(() => {
    setEditing(false)
    setEditingGroupKey("")
    setValues({})
    setActiveGroupKey("")
  }, [recordId, effectiveSheetId])

  useEffect(() => {
    if (!record || !editingGroup || !editing) return
    setValues(
      editableFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = record.values[field.id] ?? ""
        return acc
      }, {})
    )
  }, [editingGroup, editableFields, editing, record])

  function startEditingGroup(group: FieldGroup) {
    setEditingGroupKey(getGroupKey(group))
    setEditing(true)
  }

  function updateValue(fieldId: string, value: string) {
    setValues((current) => ({ ...current, [fieldId]: value.slice(0, TRACK_RECORD_VALUE_MAX_LENGTH) }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!record || !sheet || editableFields.length === 0) return
    setSaving(true)

    try {
      const payloadValues = editableFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = values[field.id]?.trim() ?? ""
        return acc
      }, {})

      const res = await fetch("/api/guest/track-records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: record.id,
          sheetId: sheet.id,
          values: payloadValues,
        }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? "Gagal memperbarui data lacak surat")
      }

      toast.success(json?.message ?? "Data lacak surat berhasil diperbarui")
      setEditing(false)
      setEditingGroupKey("")
      await mutate()
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memperbarui data lacak surat"))
    } finally {
      setSaving(false)
    }
  }

  const isLoading = sheetsLoading || lookupRecordLoading || recordsLoading
  const error = sheetsError ?? lookupRecordError ?? recordsError
  const pageTitle = editing
    ? editingGroup?.name
      ? `Isi Data ${editingGroup.name}`
      : "Isi Data"
    : "Detail Surat"

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
          <h1 className="truncate text-sm font-semibold">{pageTitle}</h1>
        </div>

        {!editing ? (
          <div className="hidden items-center gap-2 max-sm:flex">
            {firstGroup && firstGroupEditableFields.length > 0 ? (
              <Link
                href={editHref}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 px-3 text-sm font-semibold text-neutral-700 shadow-sm [-webkit-tap-highlight-color:transparent] hover:bg-neutral-100 active:bg-neutral-100 active:text-neutral-700"
              >
                <Pencil className="size-4" />
                Edit
              </Link>
            ) : null}

            {selectedGroup && selectedGroupEditableFields.length > 0 ? (
              <Link
                href={buildGuestCategoryRoute("fill-data", selectedGroup.name, recordId)}
                className="inline-flex h-9 items-center gap-1 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white shadow-sm [-webkit-tap-highlight-color:transparent] hover:bg-blue-600 active:bg-blue-600 active:text-white"
              >
                Isi Data
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </header>

      <section className="mx-auto w-full px-8 py-8 pb-[calc(7rem+env(safe-area-inset-bottom))] max-md:px-4">
        {isLoading ? (
          <div className="grid gap-4">
            <Skeleton className="h-12 w-full rounded-xl bg-neutral-200" />
            <Skeleton className="h-80 w-full rounded-xl bg-neutral-200" />
          </div>
        ) : error ? (
          <EmptyState
            title="Gagal memuat data"
            description={error.message}
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : !sheet ? (
          <EmptyState
            title="Sheet tidak ditemukan"
            description="Pilih data dari halaman Lacak Surat terlebih dahulu."
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : !record ? (
          <EmptyState
            title="Data tidak ditemukan"
            description="Data lacak surat yang dipilih tidak tersedia."
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : displayedGroups.length > 0 ? (
          <div className="grid gap-7">
            {displayedGroups.map((group) => {
              const isEditingGroup = editing && editingGroup === group
              const fields = isEditingGroup ? editableFields : group.fields

              return (
                <section
                  key={group.category?.id ?? group.name}
                  className="grid gap-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm max-sm:p-4"
                >
                  <div
                    className="inline-flex w-fit min-w-44 items-center justify-center rounded-lg px-6 py-2 text-sm font-medium max-sm:min-w-36"
                    style={getSoftCategoryStyle(group.color)}
                  >
                    {group.name}
                  </div>

                  {isEditingGroup ? (
                    <form
                      id="guest-track-detail-edit-form"
                      onSubmit={submit}
                      className="grid grid-cols-1 gap-x-9 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                    >
                      {fields.map((field) => {
                        const inputId = `guest-track-detail-${field.id}`
                        return (
                          <div key={field.id} className="grid gap-2">
                            <Label
                              htmlFor={inputId}
                              className="text-sm font-medium tracking-[0px] text-neutral-700"
                            >
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
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 gap-x-9 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                      {fields.map((field) => (
                        <div key={field.id} className="grid gap-2">
                          <span className="text-sm font-medium tracking-[0px] text-neutral-700">
                            {field.columnName}
                          </span>
                          <span className="min-h-10 break-words rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-3 text-xs font-medium text-neutral-900">
                            {getRecordValue(record, field, recordIndex)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        ) : null}
      </section>

      {!editing && firstGroup && firstGroupEditableFields.length > 0 ? (
        <Link
          href={editHref}
          className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] left-8 z-40 inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-200 max-sm:hidden"
        >
          <Pencil className="size-4" />
          Edit
        </Link>
      ) : null}

      {!editing && selectedGroup && selectedGroupEditableFields.length > 0 ? (
        <Link
          href={buildGuestCategoryRoute("fill-data", selectedGroup.name, recordId)}
          className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] right-8 z-40 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 max-sm:hidden"
        >
          Isi Data
          <ArrowRight className="size-4" />
        </Link>
      ) : null}

      {editing ? (
        <Button
          type="submit"
          form="guest-track-detail-edit-form"
          disabled={saving || editableFields.length === 0}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-40 h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 max-sm:left-4 max-sm:right-4 max-sm:w-auto"
        >
          <Save className="size-4" />
          {saving ? "Menyimpan" : "Simpan Data"}
        </Button>
      ) : null}

      {sheet && categoryBarGroups.length > 0 && !editing ? (
        <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-40 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-x-auto rounded-full border border-neutral-200 bg-white/95 p-1 shadow-sm backdrop-blur">
          <div className="flex min-w-max items-center gap-1">
            {categoryBarGroups.map((group) => {
              const key = group.category?.id ?? "uncategorized"
              const active = activeGroupKey === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setEditingGroupKey("")
                    setActiveGroupKey((current) => current === key ? "" : key)
                  }}
                  aria-pressed={active}
                  className="h-9 rounded-full border px-4 text-[13px] font-semibold transition-colors"
                  style={{
                    backgroundColor: active ? "#2563eb" : "#ffffff",
                    borderColor: "#2563eb",
                    color: active ? "#ffffff" : "#2563eb",
                  }}
                >
                  {group.name}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </main>
  )
}
