"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import { Eye, FileSpreadsheet, Pencil, Rows3, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { TrackRecordFieldControl } from "@/components/shared/track-record-field-control"
import { useIsMobile } from "@/hooks/use-mobile"
import { getErrorMessage } from "@/lib/utils"
import type { TrackCategory, TrackField, TrackRecord, TrackRecordResponse, TrackSheet, TrackTableResponse } from "@/types"

type FieldGroup = {
  category?: TrackCategory
  name: string
  color: string
  fields: TrackField[]
}

const TRACK_RECORD_VALUE_MAX_LENGTH = 50

const sheetsFetcher = async (url: string): Promise<TrackTableResponse> => {
  const res = await fetch(url)
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil sheet lacak")
  return json
}

const recordsFetcher = async (url: string): Promise<TrackRecordResponse> => {
  const res = await fetch(url)
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil data track surat")
  return json
}

function isDefaultIdField(field: TrackField) {
  return field.columnName.trim().toLowerCase() === "id"
}

function getFieldValue(record: TrackRecord, field: TrackField, index: number) {
  if (isDefaultIdField(field)) return String(index + 1)
  return record.values[field.id]?.trim() || "Belum diisi"
}

function isEditableTrackField(field: TrackField) {
  return field.fillByHrd && !isDefaultIdField(field)
}

function getSoftCategoryColor(color: string) {
  const hex = color.replace("#", "")
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return "#e5e7eb"

  const red = parseInt(hex.slice(0, 2), 16)
  const green = parseInt(hex.slice(2, 4), 16)
  const blue = parseInt(hex.slice(4, 6), 16)
  const mix = 0.72

  return `rgb(${Math.round(red + (255 - red) * mix)}, ${Math.round(green + (255 - green) * mix)}, ${Math.round(blue + (255 - blue) * mix)})`
}

function getCategoryTextColor(color: string) {
  const hex = color.replace("#", "")
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return "#374151"

  const red = parseInt(hex.slice(0, 2), 16)
  const green = parseInt(hex.slice(2, 4), 16)
  const blue = parseInt(hex.slice(4, 6), 16)
  const mix = 0.72

  return `rgb(${Math.round(red * mix)}, ${Math.round(green * mix)}, ${Math.round(blue * mix)})`
}

function buildFieldGroups(sheet: TrackSheet, fields: TrackField[]): FieldGroup[] {
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
  if (uncategorized.length > 0) {
    groups.push({
      name: "Tanpa kategori",
      color: "#64748b",
      fields: uncategorized,
    })
  }

  return groups
}

function getFirstCategoryFields(sheet: TrackSheet) {
  const firstCategory = sheet.categories[0]
  if (!firstCategory) return sheet.fields

  const fields = sheet.fields.filter((field) => field.categoryId === firstCategory.id)
  return fields.length > 0 ? fields : sheet.fields
}

function getGroupKey(group: FieldGroup) {
  return group.category?.id ?? "uncategorized"
}

function TrackFormSidebar({
  groups,
  open,
  record,
  recordIndex,
  sheet,
  onOpenChange,
  onSaved,
}: {
  groups: FieldGroup[]
  open: boolean
  record?: TrackRecord | null
  recordIndex: number
  sheet: TrackSheet
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const isMobile = useIsMobile()
  const [values, setValues] = useState<Record<string, string>>({})
  const [editing, setEditing] = useState(false)
  const [editingGroupKey, setEditingGroupKey] = useState("")
  const [saving, setSaving] = useState(false)
  const editingGroup = editingGroupKey
    ? groups.find((group) => getGroupKey(group) === editingGroupKey)
    : undefined
  const editableFields = useMemo(
    () => editingGroup?.fields.filter(isEditableTrackField) ?? [],
    [editingGroup]
  )

  useEffect(() => {
    if (!open) {
      setEditing(false)
      setEditingGroupKey("")
      setValues({})
      return
    }

    if (!editingGroup) return
    setValues(
      editableFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = record?.values[field.id] ?? ""
        return acc
      }, {})
    )
  }, [editableFields, editingGroup, open, record])

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

  function setFieldValue(fieldId: string, value: string) {
    setValues((current) => ({ ...current, [fieldId]: value.slice(0, TRACK_RECORD_VALUE_MAX_LENGTH) }))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing || editableFields.length === 0) return
    setSaving(true)

    try {
      const payloadValues = editableFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = values[field.id]?.trim() ?? ""
        return acc
      }, record ? { ...record.values } : {})

      const res = await fetch("/api/track-records", {
        method: record ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: record?.id,
          sheetId: sheet.id,
          values: payloadValues,
        }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? "Gagal menyimpan data track surat")
      }

      toast.success(json?.message ?? (record ? "Data track surat berhasil diperbarui" : "Data track surat berhasil disimpan"))
      setValues({})
      setEditing(false)
      setEditingGroupKey("")
      onSaved()
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan data track surat"))
    } finally {
      setSaving(false)
    }
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="h-[88svh] max-h-[88svh] w-full gap-0 overflow-hidden rounded-t-[22px] border-x-0 border-b-0 bg-background p-0 shadow-2xl"
        >
          <div className="flex justify-center px-4 pb-2 pt-3">
            <span className="h-1 w-10 rounded-full bg-muted-foreground/20" />
          </div>
          <SheetHeader className="gap-0 border-b-2 border-border/70 px-4 pb-4 pt-2">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <SheetTitle className="truncate text-base font-semibold">
                  {editing ? "Edit Data" : "Detail Surat"}
                </SheetTitle>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                aria-label="Tutup"
                onClick={() => onOpenChange(false)}
                className="-mr-2 text-muted-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>
          </SheetHeader>

          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="grid gap-4">
                {groups.map((group) => {
                  const groupKey = getGroupKey(group)
                  const groupEditableFields = group.fields.filter(isEditableTrackField)
                  const isEditingGroup = editing && editingGroupKey === groupKey
                  const isOtherGroupEditing = editing && !isEditingGroup
                  const isEditButtonDisabled = saving || isOtherGroupEditing || groupEditableFields.length === 0
                  const editButtonLabel = isEditButtonDisabled ? "Hanya View" : "Edit"
                  const lockedByActiveEdit = isOtherGroupEditing || saving

                  return (
                  <section
                    key={groupKey}
                    className="overflow-hidden rounded-xl border-2 border-border/70 bg-background"
                  >
                    <div className="flex flex-col gap-3 border-b-2 border-border/60 px-3 py-3">
                      <span
                        className="inline-flex max-w-full rounded-md px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: getSoftCategoryColor(group.color),
                          color: getCategoryTextColor(group.color),
                        }}
                      >
                        <span className="truncate">{group.name}</span>
                      </span>
                      {isEditingGroup ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={cancelEditing}
                            disabled={saving}
                            className="bg-background text-foreground hover:bg-muted hover:text-foreground focus-visible:text-foreground"
                          >
                            Batal
                          </Button>
                          <Button type="submit" variant="action-primary" size="sm" disabled={saving || editableFields.length === 0}>
                            <Save className="size-4" />
                            {saving ? "Menyimpan" : "Simpan Data"}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingGroup(group)}
                          disabled={isEditButtonDisabled}
                          className={`w-fit ${lockedByActiveEdit ? "disabled:opacity-40" : "disabled:opacity-100"}`}
                        >
                          {isEditButtonDisabled ? <Eye className="size-4" /> : <Pencil className="size-4" />}
                          {editButtonLabel}
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-3 p-3">
                      {group.fields.map((field) => {
                        const inputId = `track-mobile-field-${field.id}`
                        const editable = isEditingGroup && isEditableTrackField(field)

                        return (
                          <div
                            key={field.id}
                            className="grid gap-2"
                          >
                            <Label
                              htmlFor={inputId}
                              className="text-sm font-medium text-foreground"
                            >
                              {field.columnName}
                            </Label>
                            {editable ? (
                              <TrackRecordFieldControl
                                field={field}
                                inputId={inputId}
                                value={values[field.id] ?? ""}
                                onChange={(value) => setFieldValue(field.id, value)}
                                disabled={saving}
                                maxLength={TRACK_RECORD_VALUE_MAX_LENGTH}
                              />
                            ) : (
                              <span
                                id={inputId}
                                className="min-h-10 break-words rounded-lg border-2 border-border/60 bg-muted/30 px-3 py-2 text-sm font-medium leading-relaxed text-foreground"
                              >
                                {record ? getFieldValue(record, field, recordIndex) : "Belum diisi"}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </section>
                  )
                })}
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={
          isMobile
            ? "h-[85svh] max-h-[85svh] w-full overflow-hidden rounded-t-2xl"
            : "w-[92vw] overflow-hidden sm:max-w-lg"
        }
      >
        <SheetHeader className="border-b border-border/40">
          <SheetTitle className="font-semibold">{editing ? "Edit Data" : "Detail Surat"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 py-2">
            {groups.map((group) => {
              const groupKey = getGroupKey(group)
              const groupEditableFields = group.fields.filter(isEditableTrackField)
              const isEditingGroup = editing && editingGroupKey === groupKey
              const isOtherGroupEditing = editing && !isEditingGroup
              const isEditButtonDisabled = saving || isOtherGroupEditing || groupEditableFields.length === 0
              const editButtonLabel = isEditButtonDisabled ? "Hanya View" : "Edit"
              const lockedByActiveEdit = isOtherGroupEditing || saving

              return (
              <section key={groupKey} className="rounded-xl border border-border/40 bg-muted/10">
                <div className="flex flex-col gap-3 border-b border-border/40 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className="inline-flex max-w-full rounded-md px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: getSoftCategoryColor(group.color),
                      color: getCategoryTextColor(group.color),
                    }}
                  >
                    <span className="truncate">{group.name}</span>
                  </span>
                  {isEditingGroup ? (
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                        disabled={saving}
                        className="bg-background text-foreground hover:bg-muted hover:text-foreground focus-visible:text-foreground"
                      >
                        Batal
                      </Button>
                      <Button type="submit" size="sm" disabled={saving || editableFields.length === 0}>
                        <Save className="size-4" />
                        {saving ? "Menyimpan" : "Simpan Data"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => startEditingGroup(group)}
                      disabled={isEditButtonDisabled}
                      className={`w-fit ${lockedByActiveEdit ? "disabled:opacity-40" : "disabled:opacity-100"}`}
                    >
                      {isEditButtonDisabled ? <Eye className="size-4" /> : <Pencil className="size-4" />}
                      {editButtonLabel}
                    </Button>
                  )}
                </div>
                <div className="grid gap-3 p-3">
                  {group.fields.map((field) => {
                    const inputId = `track-field-${field.id}`
                    const editable = isEditingGroup && isEditableTrackField(field)

                    return (
                      <div key={field.id} className="grid gap-2">
                        <Label htmlFor={inputId}>{field.columnName}</Label>
                        {editable ? (
                          <TrackRecordFieldControl
                            field={field}
                            inputId={inputId}
                            value={values[field.id] ?? ""}
                            onChange={(value) => setFieldValue(field.id, value)}
                            disabled={saving}
                            maxLength={TRACK_RECORD_VALUE_MAX_LENGTH}
                          />
                        ) : (
                          <span
                            id={inputId}
                            className="min-h-10 break-words rounded-lg border border-border/40 bg-muted/40 px-3 py-2 text-sm font-medium text-foreground"
                          >
                            {record ? getFieldValue(record, field, recordIndex) : "Belum diisi"}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
              )
            })}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function TrackSuratInner() {
  const searchParams = useSearchParams()
  const selectedSheetId = searchParams.get("sheet")
  const [formOpen, setFormOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<TrackRecord | null>(null)
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0)
  const {
    data: tableData,
    error: sheetsError,
    isLoading: sheetsLoading,
  } = useSWR<TrackTableResponse>("/api/track-sheets", sheetsFetcher)

  const sheets = useMemo(
    () => (tableData?.sheets ?? []).filter((sheet) => !sheet.hiddenAt),
    [tableData?.sheets]
  )
  const sheet = selectedSheetId ? sheets.find((item) => item.id === selectedSheetId) : undefined
  const allFields = useMemo(
    () => sheet?.fields ?? [],
    [sheet]
  )
  const allGroups = useMemo(
    () => sheet ? buildFieldGroups(sheet, allFields) : [],
    [allFields, sheet]
  )
  const displayFields = useMemo(() => {
    if (!sheet) return []
    return getFirstCategoryFields(sheet)
  }, [sheet])

  const recordsKey = sheet ? `/api/track-records?sheetId=${encodeURIComponent(sheet.id)}` : null
  const {
    data: recordData,
    error: recordsError,
    isLoading: recordsLoading,
    mutate: mutateRecords,
  } = useSWR<TrackRecordResponse>(recordsKey, recordsFetcher)
  const records = recordData?.records ?? []

  if (sheetsLoading) {
    return (
      <div className="grid gap-3 pb-24">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    )
  }

  if (sheetsError) {
    return (
      <EmptyState
        icon={<FileSpreadsheet size={96} strokeWidth={1.25} />}
        title="Gagal memuat sheet"
        description={sheetsError.message}
      />
    )
  }

  if (sheets.length === 0) {
    return (
      <EmptyState
        icon={<FileSpreadsheet size={96} strokeWidth={1.25} />}
        title="Belum ada sheet lacak"
        description="Admin perlu membuat dan menampilkan sheet lacak terlebih dahulu."
      />
    )
  }

  if (!selectedSheetId) {
    return (
      <EmptyState
        icon={<FileSpreadsheet size={96} strokeWidth={1.25} />}
        title="Pilih sheet terlebih dahulu"
        description="Klik pilihan sheet di kanan atas untuk menampilkan data track surat."
      />
    )
  }

  if (!sheet) {
    return (
      <EmptyState
        icon={<FileSpreadsheet size={96} strokeWidth={1.25} />}
        title="Sheet tidak ditemukan"
        description="Pilih sheet lain untuk menampilkan data track surat."
      />
    )
  }

  function openRecord(record: TrackRecord, index: number) {
    setSelectedRecord(record)
    setSelectedRecordIndex(index)
    setFormOpen(true)
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open)
    if (!open) {
      setSelectedRecord(null)
      setSelectedRecordIndex(0)
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="overflow-hidden rounded-2xl border border-border/40 bg-background">
        {recordsError ? (
          <EmptyState
            title="Gagal memuat data"
            description={recordsError.message}
            className="min-h-[360px]"
          />
        ) : recordsLoading ? (
          <div className="grid gap-2 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <EmptyState
            icon={<Rows3 size={72} strokeWidth={1.25} />}
            title="Tidak ada data terbaru"
            description="Tidak ada data terbaru untuk saat ini. Segarkan kembali halaman ini untuk memperbarui nya."
            className="min-h-[360px]"
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <div
                className="grid min-w-full border-b border-border/40 bg-muted/40 px-4 py-3 text-[12px] font-medium text-muted-foreground"
                style={{ gridTemplateColumns: `repeat(${displayFields.length}, minmax(clamp(120px, 22vw, 170px), 1fr))` }}
              >
                {displayFields.map((field) => (
                  <div key={field.id} className="truncate pr-4">{field.columnName}</div>
                ))}
              </div>
              {records.map((record, recordIndex) => (
                <div
                  key={record.id}
                  role="button"
                  tabIndex={0}
                  className="grid min-w-full cursor-pointer border-b border-border/40 px-4 py-3 text-sm outline-none transition-colors last:border-b-0 hover:bg-muted/25 focus-visible:bg-muted/30"
                  style={{ gridTemplateColumns: `repeat(${displayFields.length}, minmax(clamp(120px, 22vw, 170px), 1fr))` }}
                  onClick={() => openRecord(record, recordIndex)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      openRecord(record, recordIndex)
                    }
                  }}
                >
                  {displayFields.map((field) => (
                    <div key={`${record.id}-${field.id}`} className="truncate pr-4">
                      {getFieldValue(record, field, recordIndex)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="grid gap-3 p-4 md:hidden">
              {records.map((record, recordIndex) => (
                <Button
                  key={record.id}
                  type="button"
                  variant="outline"
                  className="h-auto w-full justify-start rounded-xl border-border/50 px-4 py-3 text-left hover:bg-muted/25 hover:text-foreground focus-visible:bg-muted/30"
                  onClick={() => openRecord(record, recordIndex)}
                >
                  <div className="grid gap-2">
                    {displayFields.map((field) => (
                      <div key={`${record.id}-${field.id}`} className="grid gap-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {field.columnName}
                        </span>
                        <span className="break-words text-sm font-semibold text-foreground">
                          {getFieldValue(record, field, recordIndex)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Button>
              ))}
            </div>
          </>
        )}
      </div>

      <TrackFormSidebar
        groups={allGroups}
        open={formOpen}
        record={selectedRecord}
        recordIndex={selectedRecordIndex}
        sheet={sheet}
        onOpenChange={handleFormOpenChange}
        onSaved={() => mutateRecords()}
      />
    </div>
  )
}

export default function TrackSuratPage() {
  return (
    <Suspense fallback={<div className="grid gap-3 pb-24"><Skeleton className="h-80 w-full rounded-xl" /></div>}>
      <TrackSuratInner />
    </Suspense>
  )
}
