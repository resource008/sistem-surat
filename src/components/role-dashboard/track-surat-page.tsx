"use client"

import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import { CalendarIcon, ChevronLeft, ChevronRight, Eye, FileSpreadsheet, Pencil, Plus, Rows3, Save, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrackRecordFieldControl } from "@/components/shared/track-record-field-control"
import type { DataSuratSearchColumn } from "@/components/surat/data-surat/topbar-search"
import { useIsMobile } from "@/hooks/use-mobile"
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
const TRACK_RECORDS_PER_PAGE = 10
const TRACK_SHEET_DISMISS_ANIMATION_MS = 280

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

const currentUserFetcher = async (url: string): Promise<{ role: string }> => {
  const res = await fetch(url)
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil role pengguna")
  return json
}

function isDefaultIdField(field: TrackField) {
  return field.columnName.trim().toLowerCase() === "id"
}

function getFieldValue(record: TrackRecord, field: TrackField, displayNumber: number) {
  if (isDefaultIdField(field)) return String(displayNumber)
  const value = record.values[field.id]?.trim()
  if (!value) return "Belum diisi"
  return field.type === "date" ? formatDateDisplay(value) : value
}

function getEmptyFieldValue(field: TrackField, displayNumber: number) {
  if (isDefaultIdField(field)) return displayNumber > 0 ? String(displayNumber) : ""
  return "Belum diisi"
}

function isEditableTrackField(field: TrackField) {
  return !isDefaultIdField(field) && (field.editRoleValues ?? []).length > 0
}

function isAddableTrackField(field: TrackField, role?: string | null) {
  if (isDefaultIdField(field)) return false
  return hasRoleAccess(field.addRoleValues, role)
}

function hasRoleAccess(roleValues: string[] | undefined, role?: string | null) {
  if (!role) return false
  if (role === "ADMIN") return true
  return (roleValues ?? []).includes(role)
}

function canEditTrackField(field: TrackField, role?: string | null) {
  if (isDefaultIdField(field)) return false
  return hasRoleAccess(field.editRoleValues, role)
}

function canDeleteTrackField(field: TrackField, role?: string | null) {
  if (isDefaultIdField(field)) return false
  return hasRoleAccess(field.deleteRoleValues, role)
}

function getTrackFillCategories({
  record,
  groups,
  role,
}: {
  record: TrackRecord
  groups: FieldGroup[]
  role?: string | null
}) {
  return groups.reduce<{ filled: FieldGroup[]; unfilled: FieldGroup[] }>((result, group) => {
    const editableFields = group.fields.filter((field) => canEditTrackField(field, role))
    if (editableFields.length === 0) return result

    const allFieldsFilled = editableFields.every((field) => Boolean(record.values[field.id]?.trim()))
    if (allFieldsFilled) {
      result.filled.push(group)
    } else {
      result.unfilled.push(group)
    }

    return result
  }, { filled: [], unfilled: [] })
}

function TrackCategoryFillBadges({
  groups,
  emptyLabel,
}: {
  groups: FieldGroup[]
  emptyLabel: string
}) {
  if (groups.length === 0) {
    return <span className="text-muted-foreground">{emptyLabel}</span>
  }

  return (
    <div className="flex flex-wrap gap-1.5 pr-4">
      {groups.map((group) => (
        <Badge
          key={getGroupKey(group)}
          variant="outline"
          className="max-w-full truncate transition-all duration-200 animate-in fade-in zoom-in-95 hover:-translate-y-0.5 hover:shadow-sm"
          style={getTrackCategoryStyle(group.color)}
        >
          {group.name}
        </Badge>
      ))}
    </div>
  )
}

function TrackCategoryStatusCell({
  filled,
  unfilled,
}: {
  filled: FieldGroup[]
  unfilled: FieldGroup[]
}) {
  return (
    <div className="grid min-w-0 gap-2 pr-4">
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <span className="shrink-0 text-xs font-medium text-muted-foreground">Sudah Diisi:</span>
        <TrackCategoryFillBadges groups={filled} emptyLabel="-" />
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <span className="shrink-0 text-xs font-medium text-muted-foreground">Belum diisi:</span>
        <TrackCategoryFillBadges groups={unfilled} emptyLabel="-" />
      </div>
    </div>
  )
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

function getDisplayFields(sheet: TrackSheet, fields: TrackField[]) {
  if (sheet.categories.length === 0) return fields

  const displayCategory = sheet.categories.find((category) => category.id === sheet.displayCategoryId)
    ?? sheet.categories[0]

  return fields.filter((field) => field.categoryId === displayCategory.id)
}

function normalizeSearchText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function getGroupKey(group: FieldGroup) {
  return group.category?.id ?? "uncategorized"
}

function getGroupClearScope(group?: FieldGroup) {
  return group?.category ? "kategori" : "kolom"
}

function canClearTrackGroup(group: FieldGroup, record: TrackRecord | null | undefined, role?: string | null) {
  if (!record) return false

  return group.fields.some((field) => {
    return canDeleteTrackField(field, role) && Boolean(record.values[field.id]?.trim())
  })
}

function getRecordSearchValue(record: TrackRecord, field: TrackField, displayNumber: number) {
  if (isDefaultIdField(field)) return String(displayNumber)
  return record.values[field.id] ?? ""
}

function sortTrackRecords(records: TrackRecord[]) {
  return records
    .slice()
    .sort((a, b) => {
      const sequenceDiff = (a.sequenceNo ?? 0) - (b.sequenceNo ?? 0)
      if (sequenceDiff !== 0) return sequenceDiff
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
}

function TrackReadonlyFieldValue({
  field,
  inputId,
  value,
  variant = "default",
}: {
  field: TrackField
  inputId: string
  value: string
  variant?: "default" | "mobile"
}) {
  const isDate = field.type === "date"
  const className = variant === "mobile"
    ? "min-h-10 break-words rounded-lg border-2 border-border/60 bg-muted/30 px-3 py-2 text-sm font-normal leading-relaxed text-foreground"
    : "min-h-10 break-words rounded-lg border border-border/40 bg-muted/40 px-3 py-2 text-sm font-normal text-foreground"

  return (
    <span id={inputId} className={className}>
      <span className="flex min-w-0 items-center gap-2">
        {isDate ? <CalendarIcon className="size-4 shrink-0 text-muted-foreground" /> : null}
        <span className="min-w-0 break-words">{value}</span>
      </span>
    </span>
  )
}

function TrackFormSidebar({
  groups,
  open,
  record,
  recordIndex,
  sheet,
  currentUserRole,
  onOpenChange,
  onSaved,
}: {
  groups: FieldGroup[]
  open: boolean
  record?: TrackRecord | null
  recordIndex: number
  sheet: TrackSheet
  currentUserRole?: string | null
  onOpenChange: (open: boolean) => void
  onSaved: (record?: TrackRecord) => void
}) {
  const isMobile = useIsMobile()
  const [values, setValues] = useState<Record<string, string>>({})
  const [editing, setEditing] = useState(false)
  const [editingGroupKey, setEditingGroupKey] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteGroupKey, setDeleteGroupKey] = useState("")
  const dragStartYRef = useRef(0)
  const dragPointerIdRef = useRef<number | null>(null)
  const dragLatestOffsetRef = useRef(0)
  const dragSheetElementRef = useRef<HTMLElement | null>(null)
  const dragCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAddMode = !record
  const editingGroup = editingGroupKey
    ? groups.find((group) => getGroupKey(group) === editingGroupKey)
    : undefined
  const deleteGroup = deleteGroupKey
    ? groups.find((group) => getGroupKey(group) === deleteGroupKey)
    : undefined
  const editableFields = useMemo(
    () => editingGroup?.fields.filter((field) => {
      return isAddMode
        ? isAddableTrackField(field, currentUserRole)
        : canEditTrackField(field, currentUserRole)
    }) ?? [],
    [currentUserRole, editingGroup, isAddMode]
  )
  const deletableFields = useMemo(
    () => deleteGroup?.fields.filter((field) => canDeleteTrackField(field, currentUserRole)) ?? [],
    [currentUserRole, deleteGroup]
  )
  const hasSavableChanges = useMemo(() => {
    if (editableFields.length === 0) return false

    return editableFields.some((field) => {
      const nextValue = values[field.id]?.trim() ?? ""
      if (isAddMode) return nextValue.length > 0

      const currentValue = record?.values[field.id]?.trim() ?? ""
      return nextValue !== currentValue
    })
  }, [editableFields, isAddMode, record, values])

  useEffect(() => {
    if (!open) {
      setEditing(false)
      setEditingGroupKey("")
      setValues({})
      setDeleteOpen(false)
      setDeleteGroupKey("")
      dragPointerIdRef.current = null
      dragLatestOffsetRef.current = 0
      if (dragCloseTimeoutRef.current) {
        clearTimeout(dragCloseTimeoutRef.current)
        dragCloseTimeoutRef.current = null
      }
      if (dragSheetElementRef.current) {
        dragSheetElementRef.current.style.transition = ""
        dragSheetElementRef.current.style.transform = ""
      }
      dragSheetElementRef.current = null
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

  useEffect(() => {
    if (!open || !isAddMode) return

    const firstWritableGroup = groups.find((group) => {
      return group.fields.some((field) => isAddableTrackField(field, currentUserRole))
    })
    setEditing(true)
    setEditingGroupKey(firstWritableGroup ? getGroupKey(firstWritableGroup) : "")
  }, [currentUserRole, groups, isAddMode, open])

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

  function requestDeleteGroup(group: FieldGroup) {
    if (saving || isAddMode) return
    if (!canClearTrackGroup(group, record, currentUserRole)) return
    setDeleteGroupKey(getGroupKey(group))
    setDeleteOpen(true)
  }

  function setFieldValue(fieldId: string, value: string) {
    setValues((current) => ({ ...current, [fieldId]: value.slice(0, TRACK_RECORD_VALUE_MAX_LENGTH) }))
  }

  function getDragSheetElement(event: PointerEvent<HTMLDivElement>) {
    return event.currentTarget.parentElement as HTMLElement | null
  }

  function startDragging(event: PointerEvent<HTMLDivElement>) {
    if (!isMobile || saving || !event.isPrimary) return
    const sheetElement = getDragSheetElement(event)
    if (!sheetElement) return

    dragStartYRef.current = event.clientY
    dragPointerIdRef.current = event.pointerId
    dragLatestOffsetRef.current = 0
    dragSheetElementRef.current = sheetElement
    if (dragCloseTimeoutRef.current) {
      clearTimeout(dragCloseTimeoutRef.current)
      dragCloseTimeoutRef.current = null
    }
    sheetElement.style.transition = "none"
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function dragSheet(event: PointerEvent<HTMLDivElement>) {
    if (dragPointerIdRef.current !== event.pointerId) return
    const sheetElement = dragSheetElementRef.current
    if (!sheetElement) return

    const nextOffset = Math.max(0, event.clientY - dragStartYRef.current)
    dragLatestOffsetRef.current = nextOffset
    sheetElement.style.transform = `translateY(${nextOffset}px)`
    event.preventDefault()
  }

  function stopDragging(event: PointerEvent<HTMLDivElement>) {
    if (dragPointerIdRef.current !== event.pointerId) return
    const sheetElement = dragSheetElementRef.current

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const shouldClose = dragLatestOffsetRef.current > 96
    dragPointerIdRef.current = null
    dragLatestOffsetRef.current = 0
    dragSheetElementRef.current = null

    if (sheetElement) {
      sheetElement.style.transition = "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)"

      if (shouldClose) {
        sheetElement.style.transform = "translateY(100%)"
        dragCloseTimeoutRef.current = setTimeout(() => {
          dragCloseTimeoutRef.current = null
          onOpenChange(false)
        }, TRACK_SHEET_DISMISS_ANIMATION_MS)
        return
      }

      sheetElement.style.transform = ""
    }

    if (shouldClose) {
      onOpenChange(false)
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing || !hasSavableChanges) return
    setSaving(true)

    try {
      const payloadValues = editableFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = values[field.id]?.trim() ?? ""
        return acc
      }, {})

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
      onSaved(json?.record)
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan data track surat"))
    } finally {
      setSaving(false)
    }
  }

  async function clearCategoryData() {
    if (!record || saving || deletableFields.length === 0) return

    const clearScope = getGroupClearScope(deleteGroup)
    setSaving(true)
    try {
      const payloadValues = deletableFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = ""
        return acc
      }, {})
      const res = await fetch("/api/track-records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: record.id,
          sheetId: sheet.id,
          action: "clear",
          values: payloadValues,
        }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? `Gagal membersihkan isi ${clearScope}`)
      }

      toast.success("Data berhasil dibersihkan")
      setDeleteOpen(false)
      setDeleteGroupKey("")
      setValues((current) => {
        const next = { ...current }
        deletableFields.forEach((field) => {
          next[field.id] = ""
        })
        return next
      })
      onSaved(json?.record)
    } catch (err) {
      toast.error(getErrorMessage(err, `Gagal membersihkan isi ${clearScope}`))
    } finally {
      setSaving(false)
    }
  }

  if (isMobile) {
    return (
      <>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="h-[88svh] max-h-[88svh] w-full gap-0 overflow-hidden rounded-t-[22px] border-x-0 border-b-0 bg-background p-0 shadow-2xl"
          >
          <div
            className="touch-none cursor-grab active:cursor-grabbing"
            onPointerDown={startDragging}
            onPointerMove={dragSheet}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
          >
            <div className="px-4 pb-2 pt-3">
              <div className="flex justify-center">
                <span className="h-1 w-10 rounded-full bg-muted-foreground/20" />
              </div>
            </div>
            <SheetHeader className="gap-0 border-b-2 border-border/70 px-4 pb-4 pt-2">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="truncate text-base font-semibold">
                    {isAddMode ? "Tambah Data" : editing ? "Edit Data" : "Detail Surat"}
                  </SheetTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Tutup"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => onOpenChange(false)}
                  className="-mr-2 text-muted-foreground"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </SheetHeader>
          </div>

          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="grid gap-4">
                {groups.map((group) => {
                  const groupKey = getGroupKey(group)
                  const groupEditableFields = group.fields.filter((field) => {
                    return isAddMode
                      ? isAddableTrackField(field, currentUserRole)
                      : canEditTrackField(field, currentUserRole)
                  })
                  const isEditingGroup = editing && editingGroupKey === groupKey
                  const isOtherGroupEditing = editing && !isEditingGroup
                  const isEditButtonDisabled = saving || isOtherGroupEditing || groupEditableFields.length === 0
                  const editButtonLabel = isEditButtonDisabled ? "Hanya View" : isAddMode ? "Isi" : "Edit"
                  const lockedByActiveEdit = isOtherGroupEditing || saving
                  const canDeleteGroup = !isAddMode && group.fields.some((field) => canDeleteTrackField(field, currentUserRole))
                  const canClearGroup = canClearTrackGroup(group, record, currentUserRole)
                  const clearButtonLabel = `Bersihkan isi ${getGroupClearScope(group)}`

                  return (
                  <section
                    key={groupKey}
                    className="overflow-hidden rounded-xl border-2 border-border/70 bg-background"
                  >
                    <div className="flex items-center justify-between gap-2 border-b-2 border-border/60 px-3 py-3">
                      <span
                        className="inline-flex min-w-0 flex-1 rounded-md px-3 py-1 text-xs font-medium"
                        style={getTrackCategoryStyle(group.color)}
                      >
                        <span className="truncate">{group.name}</span>
                      </span>
                      {isEditingGroup ? (
                        <div className="flex shrink-0 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-lg"
                            onClick={cancelEditing}
                            disabled={saving}
                            aria-label="Batal"
                            title="Batal"
                            className="bg-background text-foreground hover:bg-muted hover:text-foreground focus-visible:text-foreground"
                          >
                            <X className="size-4" />
                          </Button>
                          <Button
                            type="submit"
                            variant="action-primary"
                            size="icon-lg"
                            disabled={saving || !hasSavableChanges}
                            aria-label={saving ? "Menyimpan" : "Simpan"}
                            title={saving ? "Menyimpan" : "Simpan"}
                          >
                            <Save className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex shrink-0 gap-2">
                          {canDeleteGroup ? (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon-lg"
                              onClick={() => requestDeleteGroup(group)}
                              disabled={saving || isOtherGroupEditing || !canClearGroup}
                              aria-label={clearButtonLabel}
                              title={clearButtonLabel}
                              className={lockedByActiveEdit ? "disabled:opacity-40" : "disabled:opacity-50"}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-lg"
                            onClick={() => startEditingGroup(group)}
                            disabled={isEditButtonDisabled}
                            aria-label={editButtonLabel}
                            title={editButtonLabel}
                            className={`shrink-0 ${lockedByActiveEdit ? "disabled:opacity-40" : "disabled:opacity-100"}`}
                          >
                            {isEditButtonDisabled ? <Eye className="size-4" /> : <Pencil className="size-4" />}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-3 p-3">
                      {group.fields.map((field) => {
                        const inputId = `track-mobile-field-${field.id}`
                        const editable = isEditingGroup && (isAddMode
                          ? isAddableTrackField(field, currentUserRole)
                          : canEditTrackField(field, currentUserRole))

                        return (
                          <div
                            key={field.id}
                            className="grid gap-2"
                          >
                            <Label
                              htmlFor={inputId}
                              className="text-sm font-normal text-foreground"
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
                              <TrackReadonlyFieldValue
                                field={field}
                                inputId={inputId}
                                value={record ? getFieldValue(record, field, recordIndex) : getEmptyFieldValue(field, recordIndex)}
                                variant="mobile"
                              />
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
        <DeleteTrackRecordDialog
          open={deleteOpen}
          deleting={saving}
          onOpenChange={(nextOpen) => {
            setDeleteOpen(nextOpen)
            if (!nextOpen) setDeleteGroupKey("")
          }}
          groupName={deleteGroup?.name}
          clearScope={getGroupClearScope(deleteGroup)}
          onConfirm={clearCategoryData}
        />
      </>
    )
  }

  return (
    <>
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
          <SheetTitle className="font-semibold">{isAddMode ? "Tambah Data" : editing ? "Edit Data" : "Detail Surat"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 py-2">
            {groups.map((group) => {
              const groupKey = getGroupKey(group)
              const groupEditableFields = group.fields.filter((field) => {
                return isAddMode
                  ? isAddableTrackField(field, currentUserRole)
                  : canEditTrackField(field, currentUserRole)
              })
              const isEditingGroup = editing && editingGroupKey === groupKey
              const isOtherGroupEditing = editing && !isEditingGroup
              const isEditButtonDisabled = saving || isOtherGroupEditing || groupEditableFields.length === 0
              const editButtonLabel = isEditButtonDisabled ? "Hanya View" : isAddMode ? "Isi" : "Edit"
              const lockedByActiveEdit = isOtherGroupEditing || saving
              const canDeleteGroup = !isAddMode && group.fields.some((field) => canDeleteTrackField(field, currentUserRole))
              const canClearGroup = canClearTrackGroup(group, record, currentUserRole)
              const clearButtonLabel = `Bersihkan isi ${getGroupClearScope(group)}`

              return (
              <section key={groupKey} className="rounded-xl border border-border/40 bg-muted/10">
                <div className="flex flex-col gap-3 border-b border-border/40 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className="inline-flex max-w-full rounded-md px-3 py-1 text-xs font-semibold"
                    style={getTrackCategoryStyle(group.color)}
                  >
                    <span className="truncate">{group.name}</span>
                  </span>
                  {isEditingGroup ? (
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-lg"
                        onClick={cancelEditing}
                        disabled={saving}
                        aria-label="Batal"
                        title="Batal"
                        className="bg-background text-foreground hover:bg-muted hover:text-foreground focus-visible:text-foreground"
                      >
                        <X className="size-4" />
                      </Button>
                      <Button
                        type="submit"
                        size="icon-lg"
                        disabled={saving || !hasSavableChanges}
                        aria-label={saving ? "Menyimpan" : "Simpan"}
                        title={saving ? "Menyimpan" : "Simpan"}
                      >
                        <Save className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {canDeleteGroup ? (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => requestDeleteGroup(group)}
                          disabled={saving || isOtherGroupEditing || !canClearGroup}
                          className={`w-fit ${lockedByActiveEdit ? "disabled:opacity-40" : "disabled:opacity-50"}`}
                        >
                          <Trash2 className="size-4" />
                          Bersihkan
                        </Button>
                      ) : null}
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
                    </div>
                  )}
                </div>
                <div className="grid gap-3 p-3">
                  {group.fields.map((field) => {
                    const inputId = `track-field-${field.id}`
                    const editable = isEditingGroup && (isAddMode
                      ? isAddableTrackField(field, currentUserRole)
                      : canEditTrackField(field, currentUserRole))

                    return (
                      <div key={field.id} className="grid gap-2">
                        <Label htmlFor={inputId} className="font-normal">{field.columnName}</Label>
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
                          <TrackReadonlyFieldValue
                            field={field}
                            inputId={inputId}
                            value={record ? getFieldValue(record, field, recordIndex) : getEmptyFieldValue(field, recordIndex)}
                          />
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
      <DeleteTrackRecordDialog
        open={deleteOpen}
        deleting={saving}
        onOpenChange={(nextOpen) => {
          setDeleteOpen(nextOpen)
          if (!nextOpen) setDeleteGroupKey("")
        }}
        groupName={deleteGroup?.name}
        clearScope={getGroupClearScope(deleteGroup)}
        onConfirm={clearCategoryData}
      />
    </>
  )
}

function DeleteTrackRecordDialog({
  open,
  deleting,
  groupName,
  clearScope,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  deleting: boolean
  groupName?: string
  clearScope: "kategori" | "kolom"
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  const targetLabel = groupName ?? clearScope

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bersihkan isi {clearScope}?</AlertDialogTitle>
          <AlertDialogDescription>
            Seluruh data dari {targetLabel} akan dikosongkan. Apakah anda yakin?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleting}
            onClick={onConfirm}
          >
            {deleting ? "Membersihkan" : `Bersihkan isi ${clearScope}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function TrackSuratInner() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const selectedSheetId = searchParams.get("sheet")
  const [formOpen, setFormOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRecord, setSelectedRecord] = useState<TrackRecord | null>(null)
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0)
  const closeResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const {
    data: tableData,
    error: sheetsError,
    isLoading: sheetsLoading,
  } = useSWR<TrackTableResponse>("/api/track-sheets", sheetsFetcher)
  const { data: currentUser } = useSWR<{ role: string }>("/api/me/permissions", currentUserFetcher)

  const sheets = useMemo(
    () => (tableData?.sheets ?? []).filter((sheet) => !sheet.hiddenAt),
    [tableData?.sheets]
  )
  const effectiveSelectedSheetId = selectedSheetId || sheets[0]?.id || ""
  const sheet = effectiveSelectedSheetId ? sheets.find((item) => item.id === effectiveSelectedSheetId) : undefined
  const visibleFields = useMemo(
    () => (sheet?.fields ?? []).filter((field) => !field.hiddenAt),
    [sheet]
  )
  const allGroups = useMemo(
    () => sheet ? buildFieldGroups(sheet, visibleFields) : [],
    [visibleFields, sheet]
  )
  const displayFields = useMemo(() => {
    if (!sheet) return []
    return getDisplayFields(sheet, visibleFields)
  }, [sheet, visibleFields])
  const searchColumns = useMemo<DataSuratSearchColumn[]>(
    () => displayFields.map((field) => ({ id: field.id, label: field.columnName })),
    [displayFields]
  )
  const requestedSearchColumn = searchParams.get("column")
  const selectedSearchColumn = requestedSearchColumn && displayFields.some((field) => field.id === requestedSearchColumn)
    ? requestedSearchColumn
    : ""
  const searchQuery = searchParams.get("search") ?? ""
  const tableColumnCount = displayFields.length + 1

  const recordsKey = sheet ? `/api/track-records?sheetId=${encodeURIComponent(sheet.id)}` : null
  const {
    data: recordData,
    error: recordsError,
    isLoading: recordsLoading,
    mutate: mutateRecords,
  } = useSWR<TrackRecordResponse>(recordsKey, recordsFetcher)
  const records = useMemo(
    () => sortTrackRecords(recordData?.records ?? []),
    [recordData?.records]
  )
  const nextSequenceNo = records.length + 1
  const canAddRecord = visibleFields.some((field) => isAddableTrackField(field, currentUser?.role))
  const filteredRecords = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery)
    if (!normalizedQuery) return records

    const fields = selectedSearchColumn
      ? displayFields.filter((item) => item.id === selectedSearchColumn)
      : displayFields
    if (fields.length === 0) return records

    return records.filter((record, index) => {
      return fields.some((field) => {
        return normalizeSearchText(getRecordSearchValue(record, field, index + 1)).includes(normalizedQuery)
      })
    })
  }, [displayFields, records, searchQuery, selectedSearchColumn])
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / TRACK_RECORDS_PER_PAGE))
  const pageStartIndex = (currentPage - 1) * TRACK_RECORDS_PER_PAGE
  const pageEndIndex = Math.min(filteredRecords.length, pageStartIndex + TRACK_RECORDS_PER_PAGE)
  const paginatedRecords = filteredRecords.slice(pageStartIndex, pageEndIndex)
  const showPagination = filteredRecords.length > TRACK_RECORDS_PER_PAGE

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedSearchColumn, selectedSheetId])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("track-surat:search-columns", {
      detail: { columns: searchColumns },
    }))
    return () => {
      window.dispatchEvent(new CustomEvent("track-surat:search-columns", {
        detail: { columns: [] },
      }))
    }
  }, [searchColumns])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
  }, [formOpen, selectedRecord])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    return () => {
      if (closeResetTimeoutRef.current) {
        clearTimeout(closeResetTimeoutRef.current)
      }
    }
  }, [])

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

  if (!sheet) {
    return (
      <EmptyState
        icon={<FileSpreadsheet size={96} strokeWidth={1.25} />}
        title="Sheet tidak ditemukan"
        description="Pilih sheet lain untuk menampilkan data track surat."
      />
    )
  }

  function openRecord(record: TrackRecord, displayNumber: number) {
    if (closeResetTimeoutRef.current) {
      clearTimeout(closeResetTimeoutRef.current)
      closeResetTimeoutRef.current = null
    }
    setSelectedRecord(record)
    setSelectedRecordIndex(displayNumber)
    setFormOpen(true)
  }

  function openAddForm() {
    if (closeResetTimeoutRef.current) {
      clearTimeout(closeResetTimeoutRef.current)
      closeResetTimeoutRef.current = null
    }
    setSelectedRecord(null)
    setSelectedRecordIndex(nextSequenceNo)
    setFormOpen(true)
  }

  function handleSheetTabChange(sheetId: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sheet", sheetId)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open)

    if (open) {
      if (closeResetTimeoutRef.current) {
        clearTimeout(closeResetTimeoutRef.current)
        closeResetTimeoutRef.current = null
      }
      return
    }

    closeResetTimeoutRef.current = setTimeout(() => {
      closeResetTimeoutRef.current = null
      setSelectedRecord(null)
      setSelectedRecordIndex(0)
    }, TRACK_SHEET_DISMISS_ANIMATION_MS)
  }

  function handleRecordSaved(record?: TrackRecord) {
    if (record) {
      setSelectedRecord(record)
    }

    void mutateRecords((current) => {
      if (!current || !record) return current

      const recordExists = current.records.some((item) => item.id === record.id)
      const nextRecords = recordExists
        ? current.records.map((item) => item.id === record.id ? record : item)
        : [...current.records, record]

      return { ...current, records: sortTrackRecords(nextRecords) }
    }, { revalidate: true })
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <Tabs
        value={effectiveSelectedSheetId}
        onValueChange={handleSheetTabChange}
        className="min-w-0"
      >
        <div className="overflow-x-auto pb-1">
          <TabsList className="min-w-max">
            {sheets.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

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
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            icon={<Rows3 size={72} strokeWidth={1.25} />}
            title="Data tidak ditemukan"
            description="Coba ubah kata kunci atau kolom pencarian."
            className="min-h-[360px]"
          />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div
                className="grid border-b border-border/40 bg-muted/40 px-4 py-3 text-[12px] font-medium text-muted-foreground"
                style={{ gridTemplateColumns: `repeat(${tableColumnCount}, minmax(140px, 1fr))` }}
              >
                {displayFields.map((field) => (
                  <div key={field.id} className="truncate pr-4">{field.columnName}</div>
                ))}
                <div className="truncate pr-4">Status</div>
              </div>
              {paginatedRecords.map((record, pageRecordIndex) => {
                const displayNumber = pageStartIndex + pageRecordIndex + 1
                const fillCategories = getTrackFillCategories({
                  record,
                  groups: allGroups,
                  role: currentUser?.role,
                })

                return (
                  <div
                    key={record.id}
                    role="button"
                    tabIndex={0}
                    className="grid cursor-pointer border-b border-border/40 px-4 py-3 text-sm outline-none transition-all duration-200 animate-in fade-in slide-in-from-bottom-1 last:border-b-0 hover:bg-muted/25 hover:shadow-[inset_3px_0_0_hsl(var(--primary))] focus-visible:bg-muted/30"
                    style={{ gridTemplateColumns: `repeat(${tableColumnCount}, minmax(140px, 1fr))` }}
                    onClick={() => openRecord(record, displayNumber)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        openRecord(record, displayNumber)
                      }
                    }}
                  >
                    {displayFields.map((field) => (
                      <div key={`${record.id}-${field.id}`} className="truncate pr-4">
                        {getFieldValue(record, field, displayNumber)}
                      </div>
                    ))}
                    <TrackCategoryStatusCell
                      filled={fillCategories.filled}
                      unfilled={fillCategories.unfilled}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showPagination ? (
        <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {pageStartIndex + 1}-{pageEndIndex} dari {filteredRecords.length} data
          </p>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="size-4" />
              Sebelumnya
            </Button>
            <span className="shrink-0 text-sm text-muted-foreground">
              {currentPage}/{totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              aria-label="Halaman selanjutnya"
            >
              Berikutnya
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <TrackFormSidebar
        groups={allGroups}
        open={formOpen}
        record={selectedRecord}
        recordIndex={selectedRecordIndex}
        sheet={sheet}
        currentUserRole={currentUser?.role}
        onOpenChange={handleFormOpenChange}
        onSaved={handleRecordSaved}
      />

      {canAddRecord ? (
        <button
          type="button"
          onClick={openAddForm}
          title="Tambah Data"
          className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95 active:bg-blue-800 sm:bottom-6 sm:right-6"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>
      ) : null}
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
