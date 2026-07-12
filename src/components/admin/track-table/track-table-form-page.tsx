"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Plus,
  RotateCcw,
  Save,
  Tags,
  Trash2,
  X,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DEFAULT_TRACK_CATEGORY_COLOR,
  normalizeTrackCategoryColor,
} from "@/lib/track-category-color"
import { cn, getErrorMessage } from "@/lib/utils"
import {
  EMPTY_TRACK_SHEET,
  TRACK_FIELD_TYPES,
  type TrackCategory,
  type TrackField,
  type TrackFieldType,
  type TrackSheet,
  type TrackTableResponse,
} from "@/types"
import { TrackTableFormSkeleton } from "./track-table-skeletons"

type TrackTableFormPageProps = {
  mode: "create" | "edit"
  sheetId?: string
}

type TrackFieldErrors = {
  columnName?: string
  categoryOptions?: string
  optionErrors?: Record<number, string>
}

type TrackFormErrors = {
  sheetName?: string
  fields: Record<string, TrackFieldErrors>
}

type TrackFieldUsageResponse = {
  usage: Record<string, number>
}

type PendingFieldDelete = {
  field: TrackField
  valueCount: number
} | null

const DEFAULT_ID_COLUMN_NAME = "ID"
const sectionIconClass = [
  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
  "border border-border/50 bg-muted/40 text-muted-foreground",
].join(" ")
const categoryColorInputClass = [
  "size-5 shrink-0 cursor-pointer overflow-hidden rounded-full",
  "border border-border/60 bg-transparent p-0 transition hover:scale-110",
  "focus-visible:ring-2 focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "[&::-webkit-color-swatch-wrapper]:p-0",
  "[&::-webkit-color-swatch]:rounded-full",
  "[&::-webkit-color-swatch]:border-0",
].join(" ")
const mobileDeleteCategoryClass = [
  "w-full border border-red-100 bg-red-50/60 text-red-600",
  "hover:bg-red-100 hover:text-red-700 sm:hidden",
].join(" ")
const activeGroupBadgeClass = [
  "h-auto min-h-9 w-full max-w-full justify-center whitespace-normal",
  "px-3 py-1.5 text-center leading-snug",
  "sm:w-fit sm:justify-start sm:text-left",
].join(" ")
const floatingActionBarClass = [
  "pointer-events-none fixed bottom-4 z-30 flex -translate-x-1/2 justify-center",
  "px-2 pb-1 transition-[left,width] duration-300 ease-in-out",
].join(" ")
const floatingActionControlsClass = [
  "pointer-events-auto flex w-max max-w-full flex-nowrap items-center gap-1",
  "overflow-x-auto rounded-xl border bg-background/95 p-1.5 shadow-lg backdrop-blur",
].join(" ")
const dialogCloseButtonClass = [
  "absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-lg",
  "text-muted-foreground transition hover:bg-muted hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
].join(" ")
const TRACK_PERMISSION_MODES = [
  {
    value: "user-edit",
    label: "Region user bisa edit",
    summary: "Regional User bisa Edit, HRD sebagai View",
  },
  {
    value: "hrd-edit",
    label: "HRD bisa edit",
    summary: "Regional User sebagai View, HRD bisa Edit",
  },
] as const

type TrackPermissionMode = typeof TRACK_PERMISSION_MODES[number]["value"]

function getPermissionMode(fillByHrd: boolean): TrackPermissionMode {
  return fillByHrd ? "hrd-edit" : "user-edit"
}

function getPermissionSummary(fillByHrd: boolean) {
  return TRACK_PERMISSION_MODES.find((mode) => mode.value === getPermissionMode(fillByHrd))?.summary
    ?? TRACK_PERMISSION_MODES[0].summary
}

function createEmptyFormErrors(): TrackFormErrors {
  return { fields: {} }
}

function hasTrackFieldErrors(error?: TrackFieldErrors) {
  if (!error) return false
  return Boolean(
    error.columnName
    || error.categoryOptions
    || Object.keys(error.optionErrors ?? {}).length > 0
  )
}

const listFetcher = async (url: string): Promise<TrackTableResponse> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Gagal mengambil tabel lacak")
  return json
}

const sheetFetcher = async (url: string): Promise<TrackSheet> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Gagal mengambil sheet lacak")
  return json
}

function createClientId(prefix: string) {
  if (typeof crypto?.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function createBlankCategory(sortOrder: number): TrackCategory {
  return {
    id: createClientId("category"),
    name: "",
    color: DEFAULT_TRACK_CATEGORY_COLOR,
    fillByHrd: false,
    sortOrder,
  }
}

const fieldUsageFetcher = async (url: string): Promise<TrackFieldUsageResponse> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Gagal mengambil penggunaan kolom")
  return json
}

function createBlankField(sortOrder: number, category?: TrackCategory): TrackField {
  return {
    id: createClientId("field"),
    categoryId: category?.id ?? "",
    category: category?.name ?? "",
    categoryColor: category?.color ?? DEFAULT_TRACK_CATEGORY_COLOR,
    region: category?.name ?? "",
    columnName: "",
    type: "text",
    defaultValue: "",
    categoryOptions: [],
    fillByHrd: category?.fillByHrd ?? false,
    hiddenAt: null,
    sortOrder,
  }
}

function isDefaultIdField(field: TrackField) {
  return field.columnName.trim().toLowerCase() === DEFAULT_ID_COLUMN_NAME.toLowerCase()
}

function applyFieldCategory(field: TrackField, category?: TrackCategory): TrackField {
  return {
    ...field,
    categoryId: category?.id ?? "",
    category: category?.name ?? "",
    categoryColor: category?.color ?? DEFAULT_TRACK_CATEGORY_COLOR,
    region: category?.name ?? "",
    fillByHrd: isDefaultIdField(field) ? false : category?.fillByHrd ?? field.fillByHrd ?? false,
  }
}

function createDefaultIdField(sortOrder: number, category?: TrackCategory): TrackField {
  return applyFieldCategory({
    id: createClientId("field"),
    categoryId: "",
    category: "",
    categoryColor: DEFAULT_TRACK_CATEGORY_COLOR,
    region: "",
    columnName: DEFAULT_ID_COLUMN_NAME,
    type: "number",
    defaultValue: "",
    categoryOptions: [],
    fillByHrd: false,
    hiddenAt: null,
    sortOrder,
  }, category)
}

function ensureDefaultIdField(sheet: TrackSheet): TrackSheet {
  const firstCategory = sheet.categories[0]
  const defaultField = sheet.fields.find(isDefaultIdField)
  const otherFields = sheet.fields.filter((field) => !isDefaultIdField(field))
  const normalizedDefaultField = {
    ...(defaultField ?? createDefaultIdField(0, firstCategory)),
    columnName: DEFAULT_ID_COLUMN_NAME,
    type: "number" as TrackFieldType,
    defaultValue: "",
    categoryOptions: [],
    fillByHrd: false,
    hiddenAt: null,
  }
  const fields = [
    applyFieldCategory(normalizedDefaultField, firstCategory),
    ...otherFields,
  ].map((field, index) => ({ ...field, sortOrder: index }))

  return {
    ...sheet,
    fields,
  }
}

function validateTrackForm(sheet: TrackSheet) {
  const errors = createEmptyFormErrors()
  let firstInvalidField: TrackField | undefined

  if (!sheet.name.trim()) {
    errors.sheetName = "Nama sheet wajib diisi"
  }

  sheet.fields.forEach((field) => {
    if (isDefaultIdField(field)) return

    const fieldErrors: TrackFieldErrors = {}

    if (!field.columnName.trim()) {
      fieldErrors.columnName = "Nama kolom wajib diisi"
    }

    if (field.type === "category") {
      const optionErrors: Record<number, string> = {}
      const filledOptions = field.categoryOptions.map((option) => option.trim()).filter(Boolean)

      field.categoryOptions.forEach((option, index) => {
        if (!option.trim()) optionErrors[index] = "Pilihan wajib diisi"
      })

      if (filledOptions.length === 0) {
        fieldErrors.categoryOptions = "Tambahkan minimal satu pilihan kategori"
      }

      if (Object.keys(optionErrors).length > 0) {
        fieldErrors.optionErrors = optionErrors
      }
    }

    if (hasTrackFieldErrors(fieldErrors)) {
      errors.fields[field.id] = fieldErrors
      firstInvalidField ??= field
    }
  })

  return {
    errors,
    firstInvalidField,
    isValid: !errors.sheetName && Object.keys(errors.fields).length === 0,
  }
}

function createBlankSheet(): TrackSheet {
  return ensureDefaultIdField({
    ...EMPTY_TRACK_SHEET,
    categories: [],
    fields: [],
  })
}

function normalizeSheetForForm(sheet: TrackSheet): TrackSheet {
  const categories = sheet.categories.length > 0
    ? sheet.categories.map((category, index) => ({
        ...category,
        color: normalizeTrackCategoryColor(category.color),
        fillByHrd: category.fillByHrd ?? false,
        sortOrder: index,
      }))
    : []
  const categoryIds = new Set(categories.map((category) => category.id))
  const fields = sheet.fields.length > 0
    ? sheet.fields.map((field, index) => {
        const category = categories.find((item) => item.id === field.categoryId)
          ?? categories.find((item) => item.name.trim().toLowerCase() === field.category.trim().toLowerCase())

        return {
          ...field,
          categoryId: category && categoryIds.has(category.id) ? category.id : "",
          category: category?.name ?? "",
          categoryColor: category?.color ?? normalizeTrackCategoryColor(field.categoryColor),
          region: category?.name ?? "",
          fillByHrd: isDefaultIdField(field) ? false : category?.fillByHrd ?? field.fillByHrd ?? false,
          hiddenAt: isDefaultIdField(field) ? null : field.hiddenAt ?? null,
          sortOrder: index,
        }
      })
    : [createBlankField(0)]

  return ensureDefaultIdField({
    ...sheet,
    categories,
    fields,
  })
}

export function TrackTableFormPage({ mode, sheetId }: TrackTableFormPageProps) {
  const router = useRouter()
  const [form, setForm] = useState<TrackSheet>(createBlankSheet)
  const [formErrors, setFormErrors] = useState<TrackFormErrors>(createEmptyFormErrors)
  const [openFieldId, setOpenFieldId] = useState<string | null>(null)
  const [activeColumnGroupId, setActiveColumnGroupId] = useState("")
  const [saving, setSaving] = useState(false)
  const [showing, setShowing] = useState(false)
  const [pendingFieldDelete, setPendingFieldDelete] = useState<PendingFieldDelete>(null)
  const isEdit = mode === "edit"
  const { data: tableData } = useSWR<TrackTableResponse>("/api/admin/track-table", listFetcher)
  const { data: sheetData, error, isLoading, mutate: mutateSheet } = useSWR<TrackSheet>(
    isEdit && sheetId ? `/api/admin/track-table/${encodeURIComponent(sheetId)}` : null,
    sheetFetcher,
  )
  const { data: fieldUsageData } = useSWR<TrackFieldUsageResponse>(
    isEdit && sheetId ? `/api/admin/track-table/${encodeURIComponent(sheetId)}/field-usage` : null,
    fieldUsageFetcher,
  )

  useEffect(() => {
    const title = isEdit ? "Edit Sheet Lacak" : "Tambah Sheet Lacak"
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: title }))
    return () => {
      window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    }
  }, [isEdit])

  useEffect(() => {
    if (!sheetData) return
    const nextForm = normalizeSheetForForm(sheetData)
    setForm(nextForm)
    setFormErrors(createEmptyFormErrors())
    setOpenFieldId(nextForm.fields[0]?.id ?? null)
    setActiveColumnGroupId(nextForm.categories[0]?.id ?? "")
  }, [sheetData])

  useEffect(() => {
    if (openFieldId || form.fields.length === 0) return
    setOpenFieldId(form.fields[0].id)
  }, [form.fields, openFieldId])

  function cancel() {
    if (isEdit && sheetId) {
      router.push(`/admin/lacak-surat/${encodeURIComponent(sheetId)}`)
      return
    }
    router.push("/admin/lacak-surat")
  }

  function resetForm() {
    if (isEdit && sheetData) {
      const nextForm = normalizeSheetForForm(sheetData)
      setForm(nextForm)
      setFormErrors(createEmptyFormErrors())
      setOpenFieldId(nextForm.fields[0]?.id ?? null)
      setActiveColumnGroupId(nextForm.categories[0]?.id ?? "")
      return
    }
    const nextSheet = createBlankSheet()
    setForm(nextSheet)
    setFormErrors(createEmptyFormErrors())
    setOpenFieldId(nextSheet.fields[0]?.id ?? null)
    setActiveColumnGroupId("")
  }

  function updateCategory(categoryId: string, updater: (category: TrackCategory) => TrackCategory) {
    setForm((current) => {
      const categories = current.categories.map((category) =>
        category.id === categoryId ? updater(category) : category
      )
      const categoryMap = new Map(categories.map((category) => [category.id, category]))

      return {
        ...current,
        categories,
        fields: current.fields.map((field) => {
          const category = categoryMap.get(field.categoryId)
          if (!category) return field

          return {
            ...field,
            category: category.name,
            categoryColor: category.color,
            region: category.name,
            fillByHrd: isDefaultIdField(field) ? false : category.fillByHrd,
          }
        }),
      }
    })
  }

  function addCategory() {
    const nextCategory = createBlankCategory(form.categories.length)

    setForm((current) => {
      const shouldAttachEmptyFields = current.categories.length === 0

      return {
        ...current,
        categories: [...current.categories, nextCategory],
        fields: shouldAttachEmptyFields
          ? current.fields.map((field) => field.categoryId
              ? field
              : {
                  ...field,
                  categoryId: nextCategory.id,
                  category: nextCategory.name,
                  categoryColor: nextCategory.color,
                  region: nextCategory.name,
                  fillByHrd: nextCategory.fillByHrd,
                })
          : current.fields,
      }
    })
    setActiveColumnGroupId(nextCategory.id)
  }

  function removeCategory(categoryId: string) {
    setForm((current) => {
      const categories = current.categories
        .filter((category) => category.id !== categoryId)
        .map((category, index) => ({ ...category, sortOrder: index }))
      const fallback = categories[0]

      return {
        ...current,
        categories,
        fields: current.fields.map((field) => {
          if (field.categoryId !== categoryId) return field
          if (!fallback) {
            return {
              ...field,
              categoryId: "",
              category: "",
              categoryColor: DEFAULT_TRACK_CATEGORY_COLOR,
              region: "",
              fillByHrd: false,
            }
          }
          return {
            ...field,
            categoryId: fallback.id,
            category: fallback.name,
            categoryColor: fallback.color,
            region: fallback.name,
            fillByHrd: fallback.fillByHrd,
          }
        }),
      }
    })
    if (activeColumnGroupId === categoryId) {
      const nextCategory = form.categories.find((category) => category.id !== categoryId)
      setActiveColumnGroupId(nextCategory?.id ?? "")
    }
  }

  function getCategory(categoryId: string) {
    return form.categories.find((category) => category.id === categoryId)
  }

  function updateField(fieldId: string, updater: (field: TrackField) => TrackField) {
    setForm((current) => ({
      ...current,
      fields: current.fields.map((field) => field.id === fieldId ? updater(field) : field),
    }))
  }

  function clearSheetNameError() {
    setFormErrors((current) => ({ ...current, sheetName: undefined }))
  }

  function clearFieldError(fieldId: string, key: keyof Omit<TrackFieldErrors, "optionErrors">) {
    setFormErrors((current) => {
      const fieldErrors = { ...current.fields }
      const nextError = { ...fieldErrors[fieldId] }
      delete nextError[key]

      if (hasTrackFieldErrors(nextError)) {
        fieldErrors[fieldId] = nextError
      } else {
        delete fieldErrors[fieldId]
      }

      return { ...current, fields: fieldErrors }
    })
  }

  function clearFieldOptionError(fieldId: string, optionIndex: number) {
    setFormErrors((current) => {
      const fieldErrors = { ...current.fields }
      const nextError = { ...fieldErrors[fieldId] }
      const optionErrors = { ...(nextError.optionErrors ?? {}) }

      delete optionErrors[optionIndex]
      delete nextError.categoryOptions

      if (Object.keys(optionErrors).length > 0) {
        nextError.optionErrors = optionErrors
      } else {
        delete nextError.optionErrors
      }

      if (hasTrackFieldErrors(nextError)) {
        fieldErrors[fieldId] = nextError
      } else {
        delete fieldErrors[fieldId]
      }

      return { ...current, fields: fieldErrors }
    })
  }

  function addFieldCategoryOption(fieldId: string) {
    updateField(fieldId, (field) => ({
      ...field,
      categoryOptions: [...field.categoryOptions, ""],
    }))
  }

  function updateFieldCategoryOption(fieldId: string, optionIndex: number, value: string) {
    updateField(fieldId, (field) => ({
      ...field,
      categoryOptions: field.categoryOptions.map((option, index) => index === optionIndex ? value : option),
    }))
  }

  function removeFieldCategoryOption(fieldId: string, optionIndex: number) {
    updateField(fieldId, (field) => {
      const removedOption = field.categoryOptions[optionIndex]
      const categoryOptions = field.categoryOptions.filter((_, index) => index !== optionIndex)

      return {
        ...field,
        categoryOptions,
        defaultValue: field.defaultValue === removedOption ? "" : field.defaultValue,
      }
    })
    setFormErrors((current) => {
      const fieldErrors = { ...current.fields }
      const nextError = { ...fieldErrors[fieldId] }
      delete nextError.categoryOptions
      delete nextError.optionErrors

      if (hasTrackFieldErrors(nextError)) {
        fieldErrors[fieldId] = nextError
      } else {
        delete fieldErrors[fieldId]
      }

      return { ...current, fields: fieldErrors }
    })
  }

  function addField(category?: TrackCategory) {
    const nextField = createBlankField(form.fields.length, category)
    setForm((current) => ({
      ...current,
      fields: [...current.fields, nextField],
    }))
    setOpenFieldId(nextField.id)
  }

  function removeFieldFromForm(fieldId: string) {
    if (form.fields.some((field) => field.id === fieldId && isDefaultIdField(field))) return

    setForm((current) => ({
      ...current,
      fields: current.fields
        .filter((field) => field.id !== fieldId)
        .map((field, index) => ({ ...field, sortOrder: index })),
    }))
    setFormErrors((current) => {
      const fieldErrors = { ...current.fields }
      delete fieldErrors[fieldId]
      return { ...current, fields: fieldErrors }
    })
    if (openFieldId === fieldId) {
      const nextField = form.fields.find((field) => field.id !== fieldId)
      setOpenFieldId(nextField?.id ?? null)
    }
  }

  function toggleFieldHidden(fieldId: string, hidden: boolean) {
    if (form.fields.some((field) => field.id === fieldId && isDefaultIdField(field))) return

    updateField(fieldId, (field) => ({
      ...field,
      hiddenAt: hidden ? new Date().toISOString() : null,
    }))
  }

  function requestRemoveField(field: TrackField) {
    if (isDefaultIdField(field)) return

    const valueCount = fieldUsageData?.usage[field.id] ?? 0
    if (isEdit && valueCount > 0) {
      setPendingFieldDelete({ field, valueCount })
      return
    }

    removeFieldFromForm(field.id)
  }

  function hidePendingField() {
    if (!pendingFieldDelete) return
    toggleFieldHidden(pendingFieldDelete.field.id, true)
    setPendingFieldDelete(null)
  }

  function removePendingField() {
    if (!pendingFieldDelete) return
    removeFieldFromForm(pendingFieldDelete.field.id)
    setPendingFieldDelete(null)
  }

  function moveField(fieldId: string, categoryId: string, direction: -1 | 1) {
    setForm((current) => {
      const categoryFields = current.fields.filter((field) => field.categoryId === categoryId)
      const lockedFields = categoryFields.filter(isDefaultIdField)
      const movableFields = categoryFields.filter((field) => !isDefaultIdField(field))
      const index = movableFields.findIndex((field) => field.id === fieldId)
      const target = index + direction
      if (index < 0 || target < 0 || target >= movableFields.length) return current

      const [field] = movableFields.splice(index, 1)
      movableFields.splice(target, 0, field)
      const reorderedCategoryFields = [...lockedFields, ...movableFields]
      const reorderedCategoryIds = new Set(reorderedCategoryFields.map((item) => item.id))
      const fieldsByCategory = new Map<string, TrackField[]>()

      current.categories.forEach((category) => {
        fieldsByCategory.set(
          category.id,
          category.id === categoryId
            ? reorderedCategoryFields
            : current.fields.filter((item) => item.categoryId === category.id)
        )
      })

      const uncategorized = current.fields.filter((item) =>
        !fieldsByCategory.has(item.categoryId) && !reorderedCategoryIds.has(item.id)
      )
      const categorizedFields = current.categories.flatMap((category) => fieldsByCategory.get(category.id) ?? [])
      const fields = categoryId === ""
        ? [...categorizedFields, ...reorderedCategoryFields, ...uncategorized]
        : [...categorizedFields, ...uncategorized]

      return {
        ...current,
        fields: fields.map((item, itemIndex) => ({ ...item, sortOrder: itemIndex })),
      }
    })
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const categories = form.categories.map((category, index) => ({
      id: category.id,
      name: category.name,
      color: normalizeTrackCategoryColor(category.color),
      fillByHrd: category.fillByHrd ?? false,
      sortOrder: index,
    }))
    const preparedForm = ensureDefaultIdField({ ...form, categories })
    const validation = validateTrackForm(preparedForm)

    if (!validation.isValid) {
      setFormErrors(validation.errors)
      if (validation.firstInvalidField) {
        setActiveColumnGroupId(validation.firstInvalidField.categoryId)
        setOpenFieldId(validation.firstInvalidField.id)
      }
      toast.error("Lengkapi data yang masih kosong")
      return
    }

    const categoryMap = new Map(preparedForm.categories.map((category) => [category.id, category]))
    setFormErrors(createEmptyFormErrors())
    setSaving(true)

    try {
      const payload = {
        name: preparedForm.name,
        description: "",
        sortOrder: isEdit ? preparedForm.sortOrder : tableData?.sheets.length ?? preparedForm.sortOrder,
        categories: preparedForm.categories,
        fields: preparedForm.fields.map((field, index) => {
          const category = categoryMap.get(field.categoryId)

          return {
            id: field.id,
            categoryId: category?.id ?? "",
            category: category?.name ?? "",
            categoryColor: category?.color ?? DEFAULT_TRACK_CATEGORY_COLOR,
            region: category?.name ?? "Global",
            columnName: field.columnName,
            type: field.type,
            defaultValue: field.defaultValue,
            categoryOptions: field.type === "category" ? field.categoryOptions : [],
            fillByHrd: isDefaultIdField(field) ? false : category?.fillByHrd ?? field.fillByHrd ?? false,
            hiddenAt: isDefaultIdField(field) ? null : field.hiddenAt ?? null,
            sortOrder: index,
          }
        }),
      }

      const url = isEdit && sheetId
        ? `/api/admin/track-table/${encodeURIComponent(sheetId)}`
        : "/api/admin/track-table"

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? "Gagal menyimpan sheet lacak")
      }

      toast.success(json?.message ?? "Sheet lacak berhasil disimpan")
      const nextId = json?.sheet?.id ?? sheetId
      router.push(nextId ? `/admin/lacak-surat/${encodeURIComponent(nextId)}` : "/admin/lacak-surat")
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan sheet lacak"))
    } finally {
      setSaving(false)
    }
  }

  async function showSheet() {
    if (!isEdit || !sheetId) return
    setShowing(true)

    try {
      const res = await fetch(`/api/admin/track-table/${encodeURIComponent(sheetId)}?action=show`, {
        method: "PATCH",
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? "Gagal menampilkan sheet lacak")
      }

      toast.success(json?.message ?? "Sheet lacak berhasil ditampilkan")
      const nextSheet = json?.sheet as TrackSheet | undefined
      if (nextSheet) {
        const normalized = normalizeSheetForForm(nextSheet)
        setForm(normalized)
        await mutateSheet(nextSheet, { revalidate: true })
      } else {
        await mutateSheet()
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menampilkan sheet lacak"))
    } finally {
      setShowing(false)
    }
  }

  if (isEdit && isLoading) {
    return <TrackTableFormSkeleton />
  }

  if (isEdit && error) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button variant="outline" onClick={cancel}>Kembali</Button>
      </div>
    )
  }

  const uncategorizedGroup: TrackCategory = {
    id: "",
    name: "Tanpa kategori",
    color: DEFAULT_TRACK_CATEGORY_COLOR,
    fillByHrd: false,
    sortOrder: form.categories.length,
  }
  const hasUncategorizedGroup = form.categories.length === 0 || form.fields.some((field) => !field.categoryId)
  const columnGroups = [
    ...form.categories,
    ...(hasUncategorizedGroup ? [uncategorizedGroup] : []),
  ]
  const activeGroupIndex = Math.max(0, columnGroups.findIndex((group) => group.id === activeColumnGroupId))
  const activeGroup = columnGroups[activeGroupIndex] ?? uncategorizedGroup
  const activeFields = form.fields.filter((field) => field.categoryId === activeGroup.id)

  function goToColumnGroup(direction: -1 | 1) {
    const nextIndex = activeGroupIndex + direction
    const nextGroup = columnGroups[nextIndex]
    if (!nextGroup) return
    setActiveColumnGroupId(nextGroup.id)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 pb-28 [overflow-anchor:none]">
      <div className="rounded-xl border border-border/40 bg-background">
        <div className="border-b border-border/40 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className={sectionIconClass}>
              <FileSpreadsheet className="size-4" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold">{isEdit ? "Ubah Nama Sheet" : "Buat Nama Sheet"}</h2>
                {form.hiddenAt ? <Badge variant="outline">Disembunyikan</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Isi nama sheet yang akan dipakai untuk tabel lacak
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-2 px-4 py-4">
          <Label htmlFor="track-sheet-name">Nama sheet</Label>
          <Input
            id="track-sheet-name"
            value={form.name}
            onChange={(event) => {
              setForm((current) => ({ ...current, name: event.target.value }))
              clearSheetNameError()
            }}
            placeholder="Contoh: BG Region"
            aria-invalid={Boolean(formErrors.sheetName)}
            disabled={saving}
          />
          {formErrors.sheetName ? (
            <p className="text-xs font-medium text-destructive">{formErrors.sheetName}</p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-background">
        <div className="flex flex-col gap-3 border-b border-border/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className={sectionIconClass}>
              <Tags className="size-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Tambah Kategori</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Buat kategori untuk mengelompokkan kolom
              </p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={addCategory} disabled={saving} className="w-full sm:w-auto">
            <Plus /> Tambah Kategori
          </Button>
        </div>

        <div className="grid gap-3 p-4">
          {form.categories.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
              Kategori Belum Ditambahkan.
            </div>
          ) : (
            form.categories.map((category, index) => (
              <div key={category.id} className="rounded-lg border border-border/40 bg-muted/20 p-3">
                <div className="grid gap-3 sm:flex sm:items-center">
                  <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                    <Input
                      id={`category-color-${category.id}`}
                      type="color"
                      aria-label="Pilih warna kategori"
                      title="Pilih warna kategori"
                      value={normalizeTrackCategoryColor(category.color)}
                      onChange={(event) => updateCategory(category.id, (current) => ({
                        ...current,
                        color: event.target.value,
                      }))}
                      disabled={saving}
                      className={categoryColorInputClass}
                    />
                    <Input
                      id={`category-name-${category.id}`}
                      aria-label="Nama kategori"
                      value={category.name}
                      onChange={(event) => updateCategory(category.id, (current) => ({
                        ...current,
                        name: event.target.value,
                      }))}
                      placeholder={`Kategori ${index + 1}`}
                      disabled={saving}
                      className="min-w-0 flex-1"
                    />
                  </div>
                  <div className="grid gap-2 sm:w-[330px] sm:grid-cols-[minmax(0,1fr)_auto]">
                    <Select
                      value={getPermissionMode(category.fillByHrd)}
                      onValueChange={(value) => updateCategory(category.id, (current) => ({
                        ...current,
                        fillByHrd: value === "hrd-edit",
                      }))}
                      disabled={saving}
                    >
                      <SelectTrigger
                        id={`category-permission-${category.id}`}
                        aria-label="Izin kategori"
                        className="h-9 w-full"
                      >
                        <SelectValue placeholder="Izin kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRACK_PERMISSION_MODES.map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            {mode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="action-danger-soft"
                      aria-label="Hapus kategori"
                      onClick={() => removeCategory(category.id)}
                      disabled={saving}
                      className={mobileDeleteCategoryClass}
                    >
                      <Trash2 /> Hapus
                    </Button>
                    <Button
                      type="button"
                      variant="action-danger-soft"
                      size="icon"
                      aria-label="Hapus kategori"
                      onClick={() => removeCategory(category.id)}
                      disabled={saving}
                      className="hidden shrink-0 sm:inline-flex"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-background">
        <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className={sectionIconClass}>
              <Columns3 className="size-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Tambah Kolom</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Buat kolom bisa dibuat tanpa kategori atau di dalam kategori yang dibuat.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4">
          <div className="rounded-xl border border-border/40 bg-muted/10">
            <div className="border-b border-border/40 px-4 py-3">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-3 shrink-0 rounded-full border border-border/60"
                    style={{ backgroundColor: normalizeTrackCategoryColor(activeGroup.color) }}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {activeGroup.name || "Kategori tanpa nama"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activeFields.length} kolom
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  {activeGroup.id ? (
                    <Badge
                      variant="secondary"
                      className={activeGroupBadgeClass}
                    >
                      {getPermissionSummary(activeGroup.fillByHrd)}
                    </Badge>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addField(activeGroup.id ? activeGroup : undefined)}
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    <Plus /> Tambah Kolom
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-3">
              {activeFields.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
                  Belum ada kolom di kategori ini.
                </div>
              ) : (
                activeFields.map((field, index) => {
                  const isDefaultId = isDefaultIdField(field)
                  const isHidden = Boolean(field.hiddenAt)
                  const fieldError = formErrors.fields[field.id]
                  const movableFields = activeFields.filter((item) => !isDefaultIdField(item))
                  const movableIndex = movableFields.findIndex((item) => item.id === field.id)
                  const canSetFieldHrd = !isDefaultId && (form.categories.length === 0 || !field.categoryId)

                  return (
                    <Collapsible
                      key={field.id}
                      open={openFieldId === field.id}
                      onOpenChange={(open) => setOpenFieldId(open ? field.id : null)}
                      className="rounded-lg border border-border/40 bg-background"
                    >
                    <div className="grid gap-3 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none"
                        >
                          <ChevronDown
                            className={cn(
                              "size-4 shrink-0 text-muted-foreground transition-transform",
                              openFieldId === field.id ? "rotate-0" : "-rotate-90"
                            )}
                          />
                          <div className="min-w-0">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <span className="truncate text-sm font-medium">
                                {field.columnName.trim() || `Kolom ${index + 1}`}
                              </span>
                              {isHidden ? <Badge variant="outline">Disembunyikan</Badge> : null}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {TRACK_FIELD_TYPES.find((type) => type.value === field.type)?.label ?? "Teks"}
                            </div>
                          </div>
                        </button>
                      </CollapsibleTrigger>
                      <div className="grid grid-cols-4 gap-1 sm:flex sm:shrink-0 sm:items-center">
                        <Button
                          type="button"
                          variant="action-neutral"
                          size="icon-sm"
                          aria-label="Pindah kolom ke atas"
                          onClick={() => moveField(field.id, activeGroup.id, -1)}
                          disabled={saving || isDefaultId || movableIndex <= 0}
                          className="w-full sm:w-7"
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          type="button"
                          variant="action-neutral"
                          size="icon-sm"
                          aria-label="Pindah kolom ke bawah"
                          onClick={() => moveField(field.id, activeGroup.id, 1)}
                          disabled={saving || isDefaultId || movableIndex === movableFields.length - 1}
                          className="w-full sm:w-7"
                        >
                          <ArrowDown />
                        </Button>
                        <Button
                          type="button"
                          variant={isHidden ? "action-primary" : "action-neutral"}
                          size="icon-sm"
                          aria-label={isHidden ? "Tampilkan kolom" : "Sembunyikan kolom"}
                          onClick={() => toggleFieldHidden(field.id, !isHidden)}
                          disabled={saving || isDefaultId}
                          className="w-full sm:w-7"
                        >
                          {isHidden ? <Eye /> : <EyeOff />}
                        </Button>
                        <Button
                          type="button"
                          variant="action-danger-soft"
                          size="icon-sm"
                          aria-label="Hapus kolom"
                          onClick={() => requestRemoveField(field)}
                          disabled={saving || isDefaultId}
                          className="w-full sm:w-7"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="grid gap-3 border-t border-border/40 p-3 md:grid-cols-3">
                        <div className="grid gap-2">
                          <Label htmlFor={`column-${field.id}`}>Nama kolom</Label>
                          <Input
                            id={`column-${field.id}`}
                            value={field.columnName}
                            onChange={(event) => {
                              updateField(field.id, (current) => ({ ...current, columnName: event.target.value }))
                              clearFieldError(field.id, "columnName")
                            }}
                            placeholder="Contoh: Posisi Surat"
                            aria-invalid={Boolean(fieldError?.columnName)}
                            disabled={saving || isDefaultId}
                          />
                          {fieldError?.columnName ? (
                            <p className="text-xs font-medium text-destructive">{fieldError.columnName}</p>
                          ) : null}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`type-${field.id}`}>Tipe kolom</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value) => {
                              updateField(field.id, (current) => ({
                                ...current,
                                type: value as TrackFieldType,
                                defaultValue: value === "date" ? "" : current.defaultValue,
                                categoryOptions: value === "category" && current.categoryOptions.length === 0
                                  ? [""]
                                  : current.categoryOptions,
                              }))
                              clearFieldError(field.id, "categoryOptions")
                            }}
                            disabled={saving || isDefaultId}
                          >
                            <SelectTrigger id={`type-${field.id}`} className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TRACK_FIELD_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`default-value-${field.id}`}>Isian awal</Label>
                          <Input
                            id={`default-value-${field.id}`}
                            value={field.defaultValue}
                            onChange={(event) => updateField(field.id, (current) => ({ ...current, defaultValue: event.target.value }))}
                            placeholder={isDefaultId ? "Tidak ada" : field.type === "date" ? "Kosongkan untuk tanggal" : "Opsional"}
                            disabled={saving || isDefaultId || field.type === "date"}
                          />
                        </div>
                        {canSetFieldHrd ? (
                          <div className="grid gap-2 rounded-lg border border-border/40 bg-muted/10 px-3 py-2 md:col-span-3">
                            <Label htmlFor={`field-permission-${field.id}`}>Izin kolom</Label>
                            <Select
                              value={getPermissionMode(field.fillByHrd)}
                              onValueChange={(value) => updateField(field.id, (current) => ({
                                ...current,
                                fillByHrd: value === "hrd-edit",
                              }))}
                              disabled={saving}
                            >
                              <SelectTrigger id={`field-permission-${field.id}`} className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TRACK_PERMISSION_MODES.map((mode) => (
                                  <SelectItem key={mode.value} value={mode.value}>
                                    {mode.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : null}

                        {field.type === "category" ? (
                          <div className="grid gap-3 rounded-lg border border-border/40 bg-muted/10 p-3 md:col-span-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <Label>Pilihan kategori</Label>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Isi opsi yang akan muncul pada kolom ini.
                                </p>
                                {fieldError?.categoryOptions ? (
                                  <p className="mt-1 text-xs font-medium text-destructive">
                                    {fieldError.categoryOptions}
                                  </p>
                                ) : null}
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addFieldCategoryOption(field.id)}
                                disabled={saving}
                              >
                                <Plus /> Pilihan
                              </Button>
                            </div>

                            <div className="grid gap-2">
                              {field.categoryOptions.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border/60 px-3 py-3 text-sm text-muted-foreground">
                                  Belum ada pilihan kategori.
                                </div>
                              ) : (
                                field.categoryOptions.map((option, optionIndex) => (
                                  <div key={`${field.id}-option-${optionIndex}`} className="grid gap-1">
                                    <div className="flex items-center gap-2">
                                      <Input
                                        value={option}
                                        onChange={(event) => {
                                          updateFieldCategoryOption(field.id, optionIndex, event.target.value)
                                          clearFieldOptionError(field.id, optionIndex)
                                        }}
                                        placeholder={`Pilihan ${optionIndex + 1}`}
                                        aria-invalid={Boolean(fieldError?.optionErrors?.[optionIndex])}
                                        disabled={saving}
                                      />
                                      <Button
                                        type="button"
                                        variant="action-danger-soft"
                                        size="icon-sm"
                                        aria-label="Hapus pilihan kategori"
                                        onClick={() => removeFieldCategoryOption(field.id, optionIndex)}
                                        disabled={saving}
                                      >
                                        <Trash2 />
                                      </Button>
                                    </div>
                                    {fieldError?.optionErrors?.[optionIndex] ? (
                                      <p className="text-xs font-medium text-destructive">
                                        {fieldError.optionErrors[optionIndex]}
                                      </p>
                                    ) : null}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </CollapsibleContent>
                    </Collapsible>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={floatingActionBarClass}
        style={{
          left: "calc(var(--topbar-left, 0px) + ((100vw - var(--topbar-left, 0px)) / 2))",
          width: "calc(100vw - var(--topbar-left, 0px) - 1rem)",
        }}
      >
        <div className={floatingActionControlsClass}>
          <div className="flex shrink-0 items-center justify-start gap-1 justify-self-start">
            <Button
              type="button"
              variant="action-neutral"
              size="fab-action"
              onClick={cancel}
              disabled={saving}
              className="shrink-0"
            >
              <X size={14} /> Batal
            </Button>
            {!isEdit ? (
              <Button
                type="button"
                variant="action-secondary"
                size="fab-action"
                onClick={resetForm}
                disabled={saving}
                className="shrink-0"
              >
                <RotateCcw /> Reset
              </Button>
            ) : null}
            {isEdit && form.hiddenAt ? (
              <Button
                type="button"
                variant="action-primary"
                size="fab-action"
                onClick={showSheet}
                disabled={saving || showing}
                className="shrink-0"
              >
                <Eye /> {showing ? "Menampilkan" : "Tampilkan"}
              </Button>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center justify-center gap-1 justify-self-center">
            <Button
              type="button"
              variant="action-neutral"
              size="fab-action"
              onClick={() => goToColumnGroup(-1)}
              disabled={saving || activeGroupIndex === 0}
              className="shrink-0"
            >
              <ChevronLeft size={14} /> Previous
            </Button>
            <span className="flex h-9 shrink-0 items-center rounded-lg px-2 text-sm font-medium text-muted-foreground">
              {activeGroupIndex + 1}/{columnGroups.length}
            </span>
            <Button
              type="button"
              variant="action-neutral"
              size="fab-action"
              onClick={() => goToColumnGroup(1)}
              disabled={saving || activeGroupIndex === columnGroups.length - 1}
              className="shrink-0"
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-1 justify-self-end">
            <Button
              type="submit"
              variant="action-primary"
              size="fab-action"
              disabled={saving}
              className="shrink-0"
            >
              <Save /> {saving ? "Menyimpan" : "Simpan"}
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={Boolean(pendingFieldDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingFieldDelete(null)
        }}
      >
        <AlertDialogContent className="max-w-[386px] gap-0 overflow-hidden p-0">
          <button
            type="button"
            aria-label="Batal"
            onClick={() => setPendingFieldDelete(null)}
            className={dialogCloseButtonClass}
          >
            <X className="size-4" />
          </button>
          <AlertDialogHeader className="items-start gap-2 px-5 pb-4 pt-5 text-left">
            <AlertDialogTitle>Kolom sudah memiliki data</AlertDialogTitle>
            <AlertDialogDescription className="text-left leading-relaxed">
              Kolom "{pendingFieldDelete?.field.columnName || "ini"}" sudah dipakai pada {pendingFieldDelete?.valueCount ?? 0} data.
              {" "}
              Jika dihapus, kolom tidak tampil lagi di admin.
              {" "}
              Sebaiknya sembunyikan kolom agar data lama tetap aman dan bisa ditampilkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mx-0 mb-0 justify-end gap-2 rounded-none px-5 py-4 sm:flex-row sm:flex-wrap">
            <AlertDialogAction
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={hidePendingField}
            >
              Sembunyikan
            </AlertDialogAction>
            <AlertDialogAction
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={removePendingField}
            >
              Tetap hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}
