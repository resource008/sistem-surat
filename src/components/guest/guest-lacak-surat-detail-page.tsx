"use client"

import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import useSWR from "swr"
import { ArrowLeft, CalendarIcon, Eye, Pencil, Save, X } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
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

function getRecordValue(record: TrackRecord, field: TrackField, index = 0) {
  if (isDefaultIdField(field)) return String(index + 1)
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
  const params = useParams<{ recordId: string }>()
  const searchParams = useSearchParams()
  const recordId = decodeURIComponent(params.recordId)
  const sheetId = searchParams.get("sheet") ?? ""
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
  const displayedGroups = groups
  const editingGroup = editingGroupKey
    ? groups.find((group) => getGroupKey(group) === editingGroupKey)
    : undefined
  const editableFields = useMemo(
    () => editingGroup?.fields.filter((field) => isEditableField(field, editingGroup)) ?? [],
    [editingGroup]
  )

  useEffect(() => {
    setEditing(false)
    setEditingGroupKey("")
    setValues({})
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
    if (saving || (editing && editingGroupKey !== getGroupKey(group))) return
    setEditingGroupKey(getGroupKey(group))
    setEditing(true)
  }

  function cancelEditing() {
    if (saving) return
    setEditing(false)
    setEditingGroupKey("")
    setValues({})
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
      <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-10 py-2 max-md:px-6 max-sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon-lg"
            className="shrink-0 text-neutral-800 hover:!bg-neutral-100 hover:!text-black"
          >
            <Link href={routes.guest.lacakSurat} aria-label="Kembali">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="truncate text-sm font-semibold">{pageTitle}</h1>
        </div>

      </header>

      <section className="w-full px-10 pb-6 pt-4 max-md:px-6 max-sm:px-4">
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
          <div className="grid gap-4">
            {displayedGroups.map((group) => {
              const groupKey = getGroupKey(group)
              const groupEditableFields = group.fields.filter((field) => isEditableField(field, group))
              const isEditingGroup = editing && editingGroupKey === groupKey
              const isOtherGroupEditing = editing && !isEditingGroup
              const fields = isEditingGroup ? editableFields : group.fields
              const formId = `guest-track-detail-edit-form-${groupKey}`
              const isEditButtonDisabled = saving || isOtherGroupEditing || groupEditableFields.length === 0
              const editButtonLabel = isEditButtonDisabled ? "Hanya View" : "Edit"
              const lockedByActiveEdit = isOtherGroupEditing || saving

              return (
                <Card
                  key={group.category?.id ?? group.name}
                  className="gap-0 rounded-xl border-neutral-200 bg-white py-0 shadow-sm ring-0"
                >
                  <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 max-sm:grid-cols-1 max-sm:px-4">
                    <Badge
                      variant="secondary"
                      className="h-8 w-40 max-w-full justify-center rounded-lg border-0 px-4 text-sm font-semibold max-sm:w-full"
                      style={getTrackCategoryStyle(group.color)}
                    >
                      {group.name}
                    </Badge>

                    <CardAction className="max-sm:col-start-1 max-sm:row-start-2 max-sm:w-full max-sm:justify-self-stretch">
                      {isEditingGroup ? (
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end max-sm:grid max-sm:grid-cols-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={saving}
                          aria-label="Batal"
                          title="Batal"
                          className="h-9 rounded-lg border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-100 hover:text-neutral-800 focus-visible:text-neutral-800 max-sm:w-full"
                        >
                          <X className="size-4 sm:hidden" />
                          <span>Batal</span>
                        </Button>
                        <Button
                          type="submit"
                          form={formId}
                          disabled={saving || editableFields.length === 0}
                          aria-label={saving ? "Menyimpan" : "Simpan"}
                          title={saving ? "Menyimpan" : "Simpan"}
                          className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:text-white max-sm:w-full"
                        >
                          <Save className="size-4" />
                          <span>{saving ? "Menyimpan" : "Simpan Data"}</span>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => startEditingGroup(group)}
                        disabled={isEditButtonDisabled}
                        aria-label={editButtonLabel}
                        title={editButtonLabel}
                        className={`h-9 w-fit rounded-lg border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-100 hover:text-neutral-800 ${
                          lockedByActiveEdit ? "disabled:opacity-40" : "disabled:opacity-100"
                        } max-sm:w-full`}
                      >
                        {isEditButtonDisabled ? <Eye className="size-4" /> : <Pencil className="size-4" />}
                        <span>{editButtonLabel}</span>
                      </Button>
                    )}
                    </CardAction>
                  </CardHeader>

                  <CardContent className="px-5 pb-5 max-sm:px-4">
                    {isEditingGroup ? (
                      <form
                        id={formId}
                        onSubmit={submit}
                        className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                      >
                        {fields.map((field) => {
                          const inputId = `guest-track-detail-${field.id}`
                          return (
                            <div key={field.id} className="grid gap-2">
                              <Label
                                htmlFor={inputId}
                                className="text-xs font-bold tracking-[0px] text-neutral-800"
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
                                className="h-9 rounded-lg border-neutral-200 bg-white text-sm font-medium text-neutral-900 shadow-none placeholder:text-neutral-400 hover:bg-white focus-visible:border-blue-400 focus-visible:ring-blue-200"
                              />
                            </div>
                          )
                        })}
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {fields.map((field) => (
                          <div key={field.id} className="grid gap-2">
                            <Label className="text-xs font-bold tracking-[0px] text-neutral-800">
                              {field.columnName}
                            </Label>
                            {field.type === "date" ? (
                              <Button
                                type="button"
                                variant="outline"
                                disabled
                                className="h-9 w-full justify-start gap-2 rounded-lg border-neutral-200 bg-neutral-50 px-3 text-sm font-medium text-neutral-500 shadow-none ring-1 ring-neutral-200 disabled:cursor-default disabled:opacity-100"
                              >
                                <CalendarIcon className="size-4 shrink-0 text-neutral-500" />
                                <span className="min-w-0 truncate">
                                  {getRecordRawValue(record, field)
                                    ? formatDateDisplay(getRecordRawValue(record, field))
                                    : "-"}
                                </span>
                              </Button>
                            ) : (
                              <Input
                                value={getRecordValue(record, field, recordIndex)}
                                readOnly
                                className="h-9 rounded-lg border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-500 shadow-none"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : null}
      </section>
    </main>
  )
}
