"use client"

import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import useSWR from "swr"
import { ArrowLeft, CalendarIcon, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { TrackRecordFieldControl } from "@/components/shared/track-record-field-control"
import { routes } from "@/constants/routes"
import { formatDateDisplay } from "@/lib/format-date-display"
import { getTrackCategoryStyle } from "@/lib/track-category-color"
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
const EDIT_CATEGORY_NAME_STORAGE_PREFIX = "guest-track-edit-category-name"

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

function isDefaultIdField(field: TrackField) {
  return field.columnName.trim().toLowerCase() === "id"
}

function getRecordValue(record: TrackRecord, field: TrackField) {
  const value = record.values[field.id]?.trim()
  if (!value) return "-"
  return field.type === "date" ? formatDateDisplay(value) : value
}

function getRecordRawValue(record: TrackRecord, field: TrackField) {
  return record.values[field.id]?.trim() ?? ""
}

function isEditableField(field: TrackField, group: FieldGroup) {
  return !isDefaultIdField(field) && !field.fillByHrd && !(group.category?.fillByHrd ?? false)
}

function getGroupKey(group: FieldGroup) {
  return group.category?.id ?? "uncategorized"
}

function getEditCategoryNameStorageKey(recordId: string, sheetId: string, categoryKey: string) {
  return `${EDIT_CATEGORY_NAME_STORAGE_PREFIX}:${recordId}:${sheetId}:${categoryKey || "first"}`
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

function readStoredEditCategoryName(recordId: string, sheetId: string, categoryKey: string) {
  if (typeof window === "undefined") return ""

  return window.sessionStorage.getItem(getEditCategoryNameStorageKey(recordId, sheetId, categoryKey)) ?? ""
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

export function GuestLacakSuratEditPage() {
  const router = useRouter()
  const params = useParams<{ recordId: string; categoryParam?: string }>()
  const searchParams = useSearchParams()
  const recordId = decodeURIComponent(params.recordId)
  const routeCategoryName = parseCategorySegment(params.categoryParam)
  const sheetId = searchParams.get("sheet") ?? ""
  const requestedGroupKey = searchParams.get("category") ?? ""
  const requestedGroupName = searchParams.get("categoryName") ?? routeCategoryName
  const [cachedGroupName, setCachedGroupName] = useState(() => (
    requestedGroupName || readStoredEditCategoryName(recordId, sheetId, requestedGroupKey)
  ))
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
  const { data: recordData, error: recordsError, isLoading: recordsLoading } = useSWR<TrackRecordResponse>(
    recordsKey,
    recordsFetcher
  )
  const record = recordData?.records.find((item) => item.id === recordId) ?? lookupRecord
  const groups = useMemo(() => sheet ? buildDisplayGroups(sheet) : [], [sheet])
  const firstGroup = groups[0]
  const selectedGroup = requestedGroupKey
    ? groups.find((group) => getGroupKey(group) === requestedGroupKey)
    : routeCategoryName
      ? groups.find((group) => group.name.toLowerCase() === routeCategoryName.toLowerCase())
      : firstGroup
  const editableFields = useMemo(
    () => selectedGroup?.fields.filter((field) => isEditableField(field, selectedGroup)) ?? [],
    [selectedGroup]
  )
  const detailHref = selectedGroup
    ? buildGuestCategoryRoute("view-detail", selectedGroup.name, recordId)
    : routes.guest.lacakSurat
  const displayCategoryName = selectedGroup?.name || cachedGroupName
  const title = displayCategoryName ? `Edit Data ${displayCategoryName}` : "Edit Data"
  const submitLabel = "Simpan Data"
  const readonlyFirstGroup = firstGroup && selectedGroup && firstGroup !== selectedGroup ? firstGroup : null

  useEffect(() => {
    if (!record || editableFields.length === 0) return
    setValues(
      editableFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = record.values[field.id] ?? ""
        return acc
      }, {})
    )
  }, [editableFields, record])

  useEffect(() => {
    if (!selectedGroup?.name) return

    setCachedGroupName(selectedGroup.name)
    window.sessionStorage.setItem(
      getEditCategoryNameStorageKey(recordId, sheetId, requestedGroupKey),
      selectedGroup.name
    )
  }, [recordId, requestedGroupKey, selectedGroup?.name, sheetId])

  useEffect(() => {
    if (params.categoryParam || !sheet || !selectedGroup?.name) return
    if (requestedGroupKey && requestedGroupName === selectedGroup.name) return

    router.replace(buildGuestCategoryRoute("edit-category", selectedGroup.name, recordId), { scroll: false })
  }, [params.categoryParam, recordId, requestedGroupKey, requestedGroupName, router, selectedGroup, sheet])

  function updateValue(fieldId: string, value: string) {
    setValues((current) => ({ ...current, [fieldId]: value.slice(0, TRACK_RECORD_VALUE_MAX_LENGTH) }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!record || !sheet || !selectedGroup || editableFields.length === 0) return
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
      router.push(detailHref)
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memperbarui data lacak surat"))
    } finally {
      setSaving(false)
    }
  }

  const isLoading = sheetsLoading || lookupRecordLoading || recordsLoading
  const error = sheetsError ?? lookupRecordError ?? recordsError

  return (
    <main className="min-h-svh bg-[#fbfbfb] text-black">
      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-6 py-3 max-sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon-lg"
            className="shrink-0 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <Link href={detailHref} aria-label="Kembali">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="truncate text-sm font-semibold">{title}</h1>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 py-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))] max-md:px-4">
        {isLoading ? (
          <div className="grid max-w-5xl gap-4">
            <Skeleton className="h-10 w-full rounded-xl bg-neutral-200" />
            <Skeleton className="h-52 w-full rounded-xl bg-neutral-200" />
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
        ) : !selectedGroup || editableFields.length === 0 ? (
          <EmptyState
            title="Kategori tidak bisa diedit"
            description="Kategori ini tidak memiliki field yang bisa diedit."
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : (
          <div className="grid max-w-5xl gap-4">
            {readonlyFirstGroup ? (
              <section className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div
                  className="inline-flex w-fit min-w-36 items-center justify-center rounded-lg px-5 py-2 text-sm font-medium max-sm:w-full max-sm:min-w-0"
                  style={getTrackCategoryStyle(readonlyFirstGroup.color)}
                >
                  {readonlyFirstGroup.name}
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {readonlyFirstGroup.fields.map((field) => (
                    <div key={field.id} className="grid gap-2">
                      <span className="text-sm font-medium tracking-[0px] text-neutral-700">
                        {field.columnName}
                      </span>
                      {field.type === "date" ? (
                        <Button
                          type="button"
                          variant="outline"
                          disabled
                          className="min-h-10 w-full justify-start rounded-lg border-neutral-200 bg-neutral-100 px-3 text-xs font-medium text-neutral-900 shadow-none disabled:cursor-default disabled:opacity-100"
                        >
                          <CalendarIcon className="size-4 shrink-0 text-neutral-700" />
                          <span className="min-w-0 truncate">
                            {getRecordRawValue(record, field)
                              ? formatDateDisplay(getRecordRawValue(record, field))
                              : "-"}
                          </span>
                        </Button>
                      ) : (
                        <span className="min-h-10 break-words rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-3 text-xs font-medium text-neutral-900">
                          {getRecordValue(record, field)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <form id="guest-track-category-edit-form" onSubmit={submit} className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div
                className="inline-flex w-fit min-w-36 items-center justify-center rounded-lg px-5 py-2 text-sm font-medium max-sm:w-full max-sm:min-w-0"
                style={getTrackCategoryStyle(selectedGroup.color)}
              >
                {selectedGroup.name}
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {editableFields.map((field) => {
                  const inputId = `guest-track-category-edit-${field.id}`
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
              </div>
            </form>
          </div>
        )}
      </section>

      <Button
        type={editableFields.length > 0 ? "submit" : "button"}
        form={editableFields.length > 0 ? "guest-track-category-edit-form" : undefined}
        disabled={saving || isLoading || Boolean(error) || !record || !sheet || editableFields.length === 0}
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-40 h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 max-sm:left-4 max-sm:right-4 max-sm:w-auto"
      >
        <Save className="size-4" />
        {saving ? "Menyimpan" : submitLabel}
      </Button>
    </main>
  )
}
