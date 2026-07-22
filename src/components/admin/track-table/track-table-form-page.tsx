"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Menu,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PragmaticSortableItem } from "@/components/shared/pragmatic-sortable-item"
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

type TrackCategoryErrors = {
  name?: string
}

type TrackFormErrors = {
  sheetName?: string
  categoryMode?: string
  categories: Record<string, TrackCategoryErrors>
  fields: Record<string, TrackFieldErrors>
}

type TrackFieldUsageResponse = {
  usage: Record<string, number>
}

type PendingFieldDelete = {
  field: TrackField
  valueCount: number
  reason: "saved-values" | "filled-config"
} | null

type RoleItem = {
  name: string
  value: string
}

type RoleResponse = {
  roles: RoleItem[]
}

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
type CategoryMode = "categorized" | "uncategorized"

type CategorizedDraft = Pick<TrackSheet, "displayCategoryId" | "categories" | "fields">

function normalizeRoleValues(values?: string[]) {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)))
}

function toggleRoleValue(values: string[] | undefined, roleValue: string, checked: boolean) {
  const current = normalizeRoleValues(values)
  if (checked) return current.includes(roleValue) ? current : [...current, roleValue]
  return current.filter((value) => value !== roleValue)
}

function getRoleAccessLabel(values: string[] | undefined, roles: RoleItem[]) {
  const normalizedValues = normalizeRoleValues(values)
  if (normalizedValues.length === 0) return "Pilih role"

  const roleNameMap = new Map(roles.map((role) => [role.value, role.name]))
  const roleNames = normalizedValues.map((value) => roleNameMap.get(value) ?? value)

  if (roleNames.length <= 2) return roleNames.join(", ")
  return `${roleNames.slice(0, 2).join(", ")} +${roleNames.length - 2}`
}

function RoleAccessDropdown({
  label,
  roles,
  values,
  disabled,
  onChange,
}: {
  label: string
  roles: RoleItem[]
  values: string[]
  disabled?: boolean
  onChange: (values: string[]) => void
}) {
  const managedRoles = roles.filter((role) => role.value !== "ADMIN")
  const normalizedValues = normalizeRoleValues(values)

  if (managedRoles.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border/60 px-3 py-3 text-xs text-muted-foreground">
        Tambahkan role non-admin terlebih dahulu dari menu Kelola Pengguna &gt; Kelola Role.
      </p>
    )
  }

  return (
    <div className="grid min-w-0 gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent py-2 pl-4 pr-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50"
          >
            <span className={cn(
              "min-w-0 truncate",
              normalizedValues.length === 0 ? "text-muted-foreground" : "text-foreground"
            )}>
              {getRoleAccessLabel(normalizedValues, managedRoles)}
            </span>
            <ChevronDown className="pointer-events-none size-5 shrink-0 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-64 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10">
          <DropdownMenuLabel>Pilih role</DropdownMenuLabel>
          {managedRoles.map((role) => (
            <DropdownMenuCheckboxItem
              key={`${label}-${role.value}`}
              checked={normalizedValues.includes(role.value)}
              onCheckedChange={(checked) => {
                onChange(toggleRoleValue(normalizedValues, role.value, checked === true))
              }}
              onSelect={(event) => event.preventDefault()}
              className="min-h-9 focus:bg-black focus:text-white focus:[&_*]:!text-current data-[state=checked]:bg-transparent data-[state=checked]:text-popover-foreground data-[state=checked]:focus:bg-black data-[state=checked]:focus:text-white dark:focus:bg-white dark:focus:text-black dark:data-[state=checked]:focus:bg-white dark:data-[state=checked]:focus:text-black [&_[data-slot=dropdown-menu-checkbox-item-indicator]]:text-current"
            >
              {role.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function RoleAccessDropdowns({
  roles,
  addValues,
  editValues,
  deleteValues,
  disabled,
  onAddChange,
  onEditChange,
  onDeleteChange,
}: {
  roles: RoleItem[]
  addValues: string[]
  editValues: string[]
  deleteValues: string[]
  disabled?: boolean
  onAddChange: (values: string[]) => void
  onEditChange: (values: string[]) => void
  onDeleteChange: (values: string[]) => void
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <RoleAccessDropdown
        label="Boleh tambah data"
        roles={roles}
        values={addValues}
        disabled={disabled}
        onChange={onAddChange}
      />
      <RoleAccessDropdown
        label="Boleh edit data"
        roles={roles}
        values={editValues}
        disabled={disabled}
        onChange={onEditChange}
      />
      <RoleAccessDropdown
        label="Boleh hapus data"
        roles={roles}
        values={deleteValues}
        disabled={disabled}
        onChange={onDeleteChange}
      />
    </div>
  )
}

function createEmptyFormErrors(): TrackFormErrors {
  return { categories: {}, fields: {} }
}

function hasTrackCategoryErrors(error?: TrackCategoryErrors) {
  if (!error) return false
  return Boolean(error.name)
}

function hasTrackFieldErrors(error?: TrackFieldErrors) {
  if (!error) return false
  return Boolean(
    error.columnName
    || error.categoryOptions
    || Object.keys(error.optionErrors ?? {}).length > 0
  )
}

function hasFilledFieldConfig(field: TrackField) {
  return Boolean(
    field.columnName.trim()
    || field.defaultValue.trim()
    || field.categoryOptions.some((option) => option.trim())
    || normalizeRoleValues(field.addRoleValues).length > 0
    || normalizeRoleValues(field.editRoleValues).length > 0
    || normalizeRoleValues(field.deleteRoleValues).length > 0
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
    name: `Kategori ${sortOrder + 1}`,
    color: DEFAULT_TRACK_CATEGORY_COLOR,
    fillRequired: false,
    addRoleValues: [],
    editRoleValues: [],
    deleteRoleValues: [],
    sortOrder,
  }
}

const fieldUsageFetcher = async (url: string): Promise<TrackFieldUsageResponse> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Gagal mengambil penggunaan kolom")
  return json
}

const rolesFetcher = async (url: string): Promise<RoleResponse> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil role")
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
    fillRequired: category?.fillRequired ?? false,
    addRoleValues: category?.addRoleValues ?? [],
    editRoleValues: category?.editRoleValues ?? [],
    deleteRoleValues: category?.deleteRoleValues ?? [],
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
    fillRequired: isDefaultIdField(field) ? false : category?.fillRequired ?? field.fillRequired ?? false,
    addRoleValues: isDefaultIdField(field) ? [] : category?.addRoleValues ?? field.addRoleValues ?? [],
    editRoleValues: isDefaultIdField(field) ? [] : category?.editRoleValues ?? field.editRoleValues ?? [],
    deleteRoleValues: isDefaultIdField(field) ? [] : category?.deleteRoleValues ?? field.deleteRoleValues ?? [],
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
    fillRequired: false,
    addRoleValues: [],
    editRoleValues: [],
    deleteRoleValues: [],
    hiddenAt: null,
    sortOrder,
  }, category)
}

function ensureDraftFieldLabels(sheet: TrackSheet): TrackSheet {
  const labelCounters = new Map<string, number>()
  const fields = sheet.fields.map((field) => {
    if (field.columnName.trim() || isDefaultIdField(field)) return field

    const key = field.categoryId || "__uncategorized__"
    const nextIndex = (labelCounters.get(key) ?? 0) + 1
    labelCounters.set(key, nextIndex)

    return {
      ...field,
      draftLabel: field.draftLabel ?? `Kolom ${nextIndex}`,
    }
  })

  return { ...sheet, fields }
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
    fillRequired: false,
    hiddenAt: null,
  }
  const fields = [
    applyFieldCategory(normalizedDefaultField, firstCategory),
    ...otherFields,
  ].map((field, index) => ({ ...field, sortOrder: index }))

  return ensureDraftFieldLabels({
    ...sheet,
    fields,
  })
}

function createCategorizedDraft(sheet: TrackSheet): CategorizedDraft | null {
  if (sheet.categories.length === 0) return null
  return {
    displayCategoryId: sheet.displayCategoryId,
    categories: sheet.categories,
    fields: sheet.fields,
  }
}

function restoreCategorizedDraft(current: TrackSheet, draft: CategorizedDraft): TrackSheet {
  const categories = draft.categories.map((category, index) => ({ ...category, sortOrder: index }))
  const categoryMap = new Map(categories.map((category) => [category.id, category]))
  const draftFieldMap = new Map(draft.fields.map((field) => [field.id, field]))
  const fields = current.fields.map((field, index) => {
    const draftField = draftFieldMap.get(field.id)
    const category = draftField ? categoryMap.get(draftField.categoryId) : undefined

    if (!category) {
      return {
        ...field,
        categoryId: "",
        category: "",
        categoryColor: DEFAULT_TRACK_CATEGORY_COLOR,
        region: "",
        sortOrder: index,
      }
    }

    return {
      ...applyFieldCategory({ ...field, categoryId: category.id }, category),
      sortOrder: index,
    }
  })

  return ensureDefaultIdField({
    ...current,
    displayCategoryId: categories.some((category) => category.id === draft.displayCategoryId)
      ? draft.displayCategoryId
      : categories[0]?.id ?? "",
    categories,
    fields,
  })
}

function validateTrackForm(sheet: TrackSheet, categoryMode: CategoryMode) {
  const errors = createEmptyFormErrors()
  const categoryNameMap = new Map<string, TrackCategory>()
  let firstInvalidCategory: TrackCategory | undefined
  let firstInvalidField: TrackField | undefined

  if (!sheet.name.trim()) {
    errors.sheetName = "Nama sheet wajib diisi"
  }

  if (categoryMode === "categorized" && sheet.categories.length === 0) {
    errors.categoryMode = "Tambahkan minimal 1 kategori"
  }

  sheet.categories.forEach((category) => {
    const categoryErrors: TrackCategoryErrors = {}
    const categoryName = category.name.trim()

    if (!categoryName) {
      categoryErrors.name = "Nama kategori wajib diisi"
    } else {
      const key = categoryName.toLowerCase()
      const previous = categoryNameMap.get(key)

      if (previous) {
        categoryErrors.name = "Nama kategori tidak boleh duplikat"
      } else {
        categoryNameMap.set(key, category)
      }
    }

    if (hasTrackCategoryErrors(categoryErrors)) {
      errors.categories[category.id] = categoryErrors
      firstInvalidCategory ??= category
    }
  })

  sheet.fields.forEach((field) => {
    if (isDefaultIdField(field)) return

    const fieldErrors: TrackFieldErrors = {}
    const columnName = field.columnName.trim()

    if (!columnName) {
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
    firstInvalidCategory,
    firstInvalidField,
    isValid: !errors.sheetName
      && !errors.categoryMode
      && Object.keys(errors.categories).length === 0
      && Object.keys(errors.fields).length === 0,
  }
}

function createBlankSheet(): TrackSheet {
  return ensureDraftFieldLabels(ensureDefaultIdField({
    ...EMPTY_TRACK_SHEET,
    displayCategoryId: "",
    categories: [],
    fields: [],
  }))
}

function normalizeSheetForForm(sheet: TrackSheet): TrackSheet {
  const categories = sheet.categories.length > 0
    ? sheet.categories.map((category, index) => ({
        ...category,
        color: normalizeTrackCategoryColor(category.color),
        fillRequired: category.fillRequired ?? false,
        addRoleValues: normalizeRoleValues(category.addRoleValues),
        editRoleValues: normalizeRoleValues(category.editRoleValues),
        deleteRoleValues: normalizeRoleValues(category.deleteRoleValues),
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
          fillRequired: isDefaultIdField(field) ? false : category?.fillRequired ?? field.fillRequired ?? false,
          addRoleValues: isDefaultIdField(field) ? [] : category?.addRoleValues ?? normalizeRoleValues(field.addRoleValues),
          editRoleValues: isDefaultIdField(field) ? [] : category?.editRoleValues ?? normalizeRoleValues(field.editRoleValues),
          deleteRoleValues: isDefaultIdField(field) ? [] : category?.deleteRoleValues ?? normalizeRoleValues(field.deleteRoleValues),
          hiddenAt: isDefaultIdField(field) ? null : field.hiddenAt ?? null,
          sortOrder: index,
        }
      })
    : [createBlankField(0)]

  return ensureDefaultIdField({
    ...sheet,
    displayCategoryId: categories.some((category) => category.id === sheet.displayCategoryId)
      ? sheet.displayCategoryId
      : categories[0]?.id ?? "",
    categories,
    fields,
  })
}

export function TrackTableFormPage({ mode, sheetId }: TrackTableFormPageProps) {
  const router = useRouter()
  const [form, setForm] = useState<TrackSheet>(createBlankSheet)
  const [formErrors, setFormErrors] = useState<TrackFormErrors>(createEmptyFormErrors)
  const [openFieldIds, setOpenFieldIds] = useState<Set<string>>(() => new Set())
  const [activeColumnGroupId, setActiveColumnGroupId] = useState("")
  const [saving, setSaving] = useState(false)
  const [pendingFieldDelete, setPendingFieldDelete] = useState<PendingFieldDelete>(null)
  const [categoryMode, setCategoryMode] = useState<CategoryMode>("uncategorized")
  const [categorizedDraft, setCategorizedDraft] = useState<CategorizedDraft | null>(null)
  const isEdit = mode === "edit"
  const { data: tableData } = useSWR<TrackTableResponse>("/api/admin/track-table", listFetcher)
  const { data: sheetData, error, isLoading } = useSWR<TrackSheet>(
    isEdit && sheetId ? `/api/admin/track-table/${encodeURIComponent(sheetId)}` : null,
    sheetFetcher,
  )
  const { data: fieldUsageData } = useSWR<TrackFieldUsageResponse>(
    isEdit && sheetId ? `/api/admin/track-table/${encodeURIComponent(sheetId)}/field-usage` : null,
    fieldUsageFetcher,
  )
  const { data: roleData } = useSWR<RoleResponse>("/api/admin/user-roles", rolesFetcher)
  const roleOptions = roleData?.roles ?? [
    { name: "Staff", value: "STAFF" },
    { name: "PKL", value: "PKL" },
  ]

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
    setOpenFieldIds(new Set(nextForm.fields[0]?.id ? [nextForm.fields[0].id] : []))
    setActiveColumnGroupId(nextForm.categories[0]?.id ?? "")
    setCategoryMode(nextForm.categories.length > 0 ? "categorized" : "uncategorized")
    setCategorizedDraft(createCategorizedDraft(nextForm))
  }, [sheetData])

  useEffect(() => {
    if (openFieldIds.size > 0 || form.fields.length === 0) return
    setOpenFieldIds(new Set([form.fields[0].id]))
  }, [form.fields, openFieldIds.size])

  useEffect(() => {
    if (!form.fields.some((field) => !field.columnName.trim() && !isDefaultIdField(field) && !field.draftLabel)) {
      return
    }

    setForm((current) => ensureDraftFieldLabels(current))
  }, [form.fields])

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
      setOpenFieldIds(new Set(nextForm.fields[0]?.id ? [nextForm.fields[0].id] : []))
      setActiveColumnGroupId(nextForm.categories[0]?.id ?? "")
      setCategoryMode(nextForm.categories.length > 0 ? "categorized" : "uncategorized")
      setCategorizedDraft(createCategorizedDraft(nextForm))
      return
    }
    const nextSheet = createBlankSheet()
    setForm(nextSheet)
    setFormErrors(createEmptyFormErrors())
    setOpenFieldIds(new Set(nextSheet.fields[0]?.id ? [nextSheet.fields[0].id] : []))
    setActiveColumnGroupId("")
    setCategoryMode("uncategorized")
    setCategorizedDraft(null)
  }

  function changeCategoryMode(mode: CategoryMode) {
    setCategoryMode(mode)
    setFormErrors((current) => ({ ...current, categoryMode: undefined }))

    if (mode === "categorized") {
      if (form.categories.length > 0) {
        setActiveColumnGroupId(form.categories[0].id)
        return
      }
      if (categorizedDraft?.categories.length) {
        const nextForm = restoreCategorizedDraft(form, categorizedDraft)
        setForm(nextForm)
        setActiveColumnGroupId(nextForm.displayCategoryId || nextForm.categories[0]?.id || "")
        return
      }
      addCategory()
      return
    }

    setCategorizedDraft((current) => createCategorizedDraft(form) ?? current)
    setForm((current) => ({
      ...current,
      displayCategoryId: "",
      categories: [],
      fields: current.fields.map((field) => ({
        ...field,
        categoryId: "",
        category: "",
        categoryColor: DEFAULT_TRACK_CATEGORY_COLOR,
        region: "",
        fillRequired: false,
      })),
    }))
    setActiveColumnGroupId("")
    setFormErrors((current) => ({ ...current, categories: {} }))
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
            fillRequired: isDefaultIdField(field) ? false : category.fillRequired,
            addRoleValues: isDefaultIdField(field) ? [] : category.addRoleValues,
            editRoleValues: isDefaultIdField(field) ? [] : category.editRoleValues,
            deleteRoleValues: isDefaultIdField(field) ? [] : category.deleteRoleValues,
          }
        }),
      }
    })
  }

  function addCategory() {
    setCategoryMode("categorized")
    setFormErrors((current) => ({ ...current, categoryMode: undefined }))

    setForm((current) => {
      const nextCategory = createBlankCategory(current.categories.length)
      const shouldAttachEmptyFields = current.categories.length === 0
      setActiveColumnGroupId(nextCategory.id)

      return {
        ...current,
        displayCategoryId: current.displayCategoryId || nextCategory.id,
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
                  fillRequired: nextCategory.fillRequired,
                  addRoleValues: nextCategory.addRoleValues,
                  editRoleValues: nextCategory.editRoleValues,
                  deleteRoleValues: nextCategory.deleteRoleValues,
                })
          : current.fields,
      }
    })
  }

  function removeCategory(categoryId: string) {
    setForm((current) => {
      const categories = current.categories
        .filter((category) => category.id !== categoryId)
        .map((category, index) => ({ ...category, sortOrder: index }))
      const fallback = categories[0]

      return {
        ...current,
        displayCategoryId: categories.some((category) => category.id === current.displayCategoryId)
          ? current.displayCategoryId
          : fallback?.id ?? "",
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
              fillRequired: false,
              addRoleValues: [],
              editRoleValues: [],
              deleteRoleValues: [],
            }
          }
          return {
            ...field,
            categoryId: fallback.id,
            category: fallback.name,
            categoryColor: fallback.color,
            region: fallback.name,
            fillRequired: fallback.fillRequired,
            addRoleValues: fallback.addRoleValues,
            editRoleValues: fallback.editRoleValues,
            deleteRoleValues: fallback.deleteRoleValues,
          }
        }),
      }
    })
    clearCategoryError(categoryId)
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

  function clearCategoryError(categoryId: string) {
    setFormErrors((current) => {
      const categoryErrors = { ...current.categories }
      delete categoryErrors[categoryId]
      return { ...current, categories: categoryErrors }
    })
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
    const categoryId = category?.id ?? ""
    const nextDraftIndex = form.fields.filter((field) =>
      field.categoryId === categoryId
      && !isDefaultIdField(field)
      && !field.columnName.trim()
    ).length + 1
    const nextField = {
      ...createBlankField(form.fields.length, category),
      draftLabel: `Kolom ${nextDraftIndex}`,
    }
    setForm((current) => ({
      ...current,
      fields: [...current.fields, nextField],
    }))
    setOpenFieldIds((current) => new Set(current).add(nextField.id))
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
    setOpenFieldIds((current) => {
      const next = new Set(current)
      next.delete(fieldId)
      return next
    })
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
      setPendingFieldDelete({ field, valueCount, reason: "saved-values" })
      return
    }

    if (hasFilledFieldConfig(field)) {
      setPendingFieldDelete({ field, valueCount: 0, reason: "filled-config" })
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

  function reorderFields(categoryId: string, startIndex: number, finishIndex: number) {
    setForm((current) => {
      const labeledCurrent = ensureDraftFieldLabels(current)
      const categoryFields = labeledCurrent.fields.filter((field) => field.categoryId === categoryId)
      const lockedFields = categoryFields.filter(isDefaultIdField)
      const movableFields = categoryFields.filter((field) => !isDefaultIdField(field))
      if (
        startIndex < 0 ||
        finishIndex < 0 ||
        startIndex >= movableFields.length ||
        finishIndex >= movableFields.length
      ) {
        return current
      }

      const reorderedCategoryFields = [
        ...lockedFields,
        ...reorder({
          list: movableFields,
          startIndex,
          finishIndex,
        }),
      ]
      const reorderedCategoryIds = new Set(reorderedCategoryFields.map((item) => item.id))
      const fieldsByCategory = new Map<string, TrackField[]>()

      labeledCurrent.categories.forEach((category) => {
        fieldsByCategory.set(
          category.id,
          category.id === categoryId
            ? reorderedCategoryFields
            : labeledCurrent.fields.filter((item) => item.categoryId === category.id)
        )
      })

      const uncategorized = labeledCurrent.fields.filter((item) =>
        !fieldsByCategory.has(item.categoryId) && !reorderedCategoryIds.has(item.id)
      )
      const categorizedFields = labeledCurrent.categories.flatMap((category) => fieldsByCategory.get(category.id) ?? [])
      const fields = categoryId === ""
        ? [...categorizedFields, ...reorderedCategoryFields, ...uncategorized]
        : [...categorizedFields, ...uncategorized]

      return {
        ...labeledCurrent,
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
      fillRequired: category.fillRequired ?? false,
      addRoleValues: normalizeRoleValues(category.addRoleValues),
      editRoleValues: normalizeRoleValues(category.editRoleValues),
      deleteRoleValues: normalizeRoleValues(category.deleteRoleValues),
      sortOrder: index,
    }))
    const displayCategoryId = categories.some((category) => category.id === form.displayCategoryId)
      ? form.displayCategoryId ?? ""
      : categories[0]?.id ?? ""
    const preparedForm = ensureDefaultIdField({ ...form, categories, displayCategoryId })
    const validation = validateTrackForm(preparedForm, categoryMode)

    if (!validation.isValid) {
      setFormErrors(validation.errors)
      if (validation.firstInvalidCategory) {
        setActiveColumnGroupId(validation.firstInvalidCategory.id)
      }
      if (validation.firstInvalidField) {
        setActiveColumnGroupId(validation.firstInvalidField.categoryId)
        setOpenFieldIds((current) => new Set(current).add(validation.firstInvalidField!.id))
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
        sortOrder: isEdit ? preparedForm.sortOrder : tableData?.sheets.length ?? preparedForm.sortOrder,
        displayCategoryId: preparedForm.displayCategoryId ?? "",
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
            fillRequired: isDefaultIdField(field) ? false : category?.fillRequired ?? field.fillRequired ?? false,
            addRoleValues: isDefaultIdField(field) ? [] : normalizeRoleValues(category?.addRoleValues ?? field.addRoleValues),
            editRoleValues: isDefaultIdField(field) ? [] : normalizeRoleValues(category?.editRoleValues ?? field.editRoleValues),
            deleteRoleValues: isDefaultIdField(field) ? [] : normalizeRoleValues(category?.deleteRoleValues ?? field.deleteRoleValues),
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
      router.push(isEdit && sheetId ? `/admin/lacak-surat/${encodeURIComponent(sheetId)}` : "/admin/lacak-surat")
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan sheet lacak"))
    } finally {
      setSaving(false)
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
    fillRequired: false,
    addRoleValues: [],
    editRoleValues: [],
    deleteRoleValues: [],
    sortOrder: form.categories.length,
  }

  function requestRemoveCategory(category: TrackCategory) {
    removeCategory(category.id)
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
                <h2 className="text-base font-semibold">{isEdit ? "Edit Sheet Lacak" : "Tambah Sheet Lacak"}</h2>
                {form.hiddenAt ? <Badge variant="outline">Disembunyikan</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {isEdit
                  ? "Perbarui nama sheet yang tampil di menu lacak surat."
                  : "Buat nama sheet yang jelas agar mudah dipilih di menu lacak surat."}
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
              <h2 className="text-base font-semibold">Mode Kategori</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isEdit
                  ? "Ubah cara kolom dikelompokkan tanpa kehilangan susunan kategori selama perubahan belum disimpan."
                  : "Tentukan dari awal apakah kolom sheet ini dipisah per kategori atau dibuat sebagai satu daftar kolom."}
              </p>
            </div>
          </div>
          {categoryMode === "categorized" ? (
            <Button type="button" variant="outline" onClick={addCategory} disabled={saving} className="w-full sm:w-auto">
              <Plus /> Tambah Kategori
            </Button>
          ) : null}
        </div>

        <div className="grid gap-4 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              {
                value: "categorized" as const,
                title: "Buat Kategori",
                description: "Kelompokkan kolom per kategori. Jika baru digabung tanpa kategori, susunan kategori sebelumnya akan dipulihkan.",
              },
              {
                value: "uncategorized" as const,
                title: "Tidak buat Kategori",
                description: "Gabungkan semua kolom menjadi satu daftar. Sebelum disimpan, mode kategori masih bisa dikembalikan.",
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => changeCategoryMode(option.value)}
                disabled={saving}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-3 py-3 text-left transition",
                  "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  categoryMode === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border/40 bg-background"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                    categoryMode === option.value ? "border-primary" : "border-muted-foreground/40"
                  )}
                >
                  {categoryMode === option.value ? <span className="size-2 rounded-full bg-primary" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{option.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{option.description}</span>
                </span>
              </button>
            ))}
          </div>

          {categoryMode === "categorized" && form.categories.length > 0 ? (
            <div className="grid gap-2 rounded-lg border border-border/40 bg-muted/20 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,360px)] sm:items-center">
              <div>
                <Label htmlFor="track-display-category" className="text-sm font-medium">
                  Kategori tampil pertama
                </Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pilih kategori yang kolomnya muncul di Track Surat.
                </p>
              </div>
              <Select
                value={form.displayCategoryId || form.categories[0]?.id}
                onValueChange={(value) => {
                  setForm((current) => ({ ...current, displayCategoryId: value }))
                }}
                disabled={saving}
              >
                <SelectTrigger id="track-display-category" className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {form.categories.map((category, index) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name.trim() || `Kategori ${index + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {categoryMode === "uncategorized" ? (
            <div className="rounded-lg border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
              Semua kolom sedang digabung tanpa kategori. Hak akses dapat diatur pada masing-masing kolom.
            </div>
          ) : form.categories.length === 0 ? (
            <div
              className={cn(
                "rounded-lg border border-dashed px-3 py-4 text-sm",
                formErrors.categoryMode
                  ? "border-destructive/60 text-destructive"
                  : "border-border/60 text-muted-foreground"
              )}
            >
              <div>Kategori belum ditambahkan.</div>
              {formErrors.categoryMode ? (
                <div className="mt-1 text-xs font-medium">{formErrors.categoryMode}</div>
              ) : null}
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
                      onChange={(event) => {
                        updateCategory(category.id, (current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                        clearCategoryError(category.id)
                      }}
                      placeholder={`Kategori ${index + 1}`}
                      aria-invalid={Boolean(formErrors.categories[category.id]?.name)}
                      disabled={saving}
                      className="min-w-0 flex-1"
                    />
                  </div>
                  <div className="grid gap-2 sm:w-auto">
                    <Button
                      type="button"
                      variant="action-danger-soft"
                      aria-label="Hapus kategori"
                      onClick={() => requestRemoveCategory(category)}
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
                      onClick={() => requestRemoveCategory(category)}
                      disabled={saving}
                      className="hidden shrink-0 sm:inline-flex"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                {formErrors.categories[category.id]?.name ? (
                  <p className="mt-2 text-xs font-medium text-destructive">
                    {formErrors.categories[category.id]?.name}
                  </p>
                ) : null}
                <div className="mt-3 rounded-lg border border-border/40 bg-background/70 p-3">
                  <div className="mb-3">
                    <Label className="text-sm font-medium">Hak akses role</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Atur role yang boleh menambah atau mengedit data pada kategori ini.
                    </p>
                  </div>
                  <RoleAccessDropdowns
                    roles={roleOptions}
                    addValues={category.addRoleValues}
                    editValues={category.editRoleValues}
                    deleteValues={category.deleteRoleValues}
                    disabled={saving}
                    onAddChange={(values) => updateCategory(category.id, (current) => ({
                      ...current,
                      addRoleValues: values,
                    }))}
                    onEditChange={(values) => updateCategory(category.id, (current) => ({
                      ...current,
                      editRoleValues: values,
                    }))}
                    onDeleteChange={(values) => updateCategory(category.id, (current) => ({
                      ...current,
                      deleteRoleValues: values,
                    }))}
                  />
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
              <h2 className="text-base font-semibold">{isEdit ? "Atur Kolom Sheet Lacak" : "Tambah Kolom Sheet Lacak"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {categoryMode === "categorized"
                  ? "Tambahkan dan susun kolom pada kategori yang sedang dipilih."
                  : "Tambahkan dan susun kolom pada daftar tanpa kategori."}
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
                  const canSetFieldRoleAccess = !isDefaultId && (form.categories.length === 0 || !field.categoryId)
                  const isFieldOpen = openFieldIds.has(field.id)

                  const fieldContent = (
                    <Collapsible
                      open={isFieldOpen}
                      onOpenChange={(open) => {
                        setOpenFieldIds((current) => {
                          const next = new Set(current)
                          open ? next.add(field.id) : next.delete(field.id)
                          return next
                        })
                      }}
                      className="rounded-lg border border-border/40 bg-background"
                    >
                    <div className="grid gap-3 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <div
                        className={cn(
                          "flex min-w-0 items-center gap-2",
                          !isDefaultId && "cursor-default"
                        )}
                      >
                        {!isDefaultId ? (
                          <Menu
                            data-drag-surface="true"
                            aria-hidden="true"
                            className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                          />
                        ) : null}
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            data-no-drag="true"
                            className="flex min-w-0 w-full flex-1 items-center gap-3 text-left outline-none"
                          >
                            <ChevronDown
                              className={cn(
                                "size-4 shrink-0 text-muted-foreground transition-transform",
                                isFieldOpen ? "rotate-0" : "-rotate-90"
                              )}
                            />
                            <div className="min-w-0">
                              <div className="flex min-w-0 flex-wrap items-center gap-2">
                                <span className="truncate text-sm font-medium">
                                  {field.columnName.trim() || field.draftLabel || `Kolom ${index + 1}`}
                                </span>
                                {isHidden ? <Badge variant="outline">Disembunyikan</Badge> : null}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {TRACK_FIELD_TYPES.find((type) => type.value === field.type)?.label ?? "Teks"}
                              </div>
                            </div>
                          </button>
                        </CollapsibleTrigger>
                      </div>
                      <div data-no-drag="true" className="flex shrink-0 items-center justify-end gap-1">
                        {!isDefaultId ? (
                          <Button
                            type="button"
                            variant="action-neutral"
                            size="icon-sm"
                            aria-label={isHidden ? "Tampilkan kolom" : "Sembunyikan kolom"}
                            title={isHidden ? "Tampilkan kolom" : "Sembunyikan kolom"}
                            onClick={() => toggleFieldHidden(field.id, !isHidden)}
                            disabled={saving}
                            className="w-full sm:w-7"
                          >
                            {isHidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                          </Button>
                        ) : null}
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
                          <p
                            className={cn(
                              "min-h-4 text-xs font-medium leading-4",
                              fieldError?.columnName ? "text-destructive" : "invisible"
                            )}
                          >
                            {fieldError?.columnName ?? "Tidak ada error"}
                          </p>
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
                          <p className="invisible min-h-4 text-xs font-medium leading-4">
                            Tidak ada error
                          </p>
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
                          <p className="invisible min-h-4 text-xs font-medium leading-4">
                            Tidak ada error
                          </p>
                        </div>
                        {canSetFieldRoleAccess ? (
                          <div className="grid gap-3 rounded-lg border border-border/40 bg-muted/10 p-3 md:col-span-3">
                            <div>
                              <Label className="text-sm font-medium">Hak akses role</Label>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Atur role yang boleh menambah atau mengedit data pada kolom ini.
                              </p>
                            </div>
                            <RoleAccessDropdowns
                              roles={roleOptions}
                              addValues={field.addRoleValues}
                              editValues={field.editRoleValues}
                              deleteValues={field.deleteRoleValues}
                              disabled={saving}
                              onAddChange={(values) => updateField(field.id, (current) => ({
                                ...current,
                                addRoleValues: values,
                              }))}
                              onEditChange={(values) => updateField(field.id, (current) => ({
                                ...current,
                                editRoleValues: values,
                              }))}
                              onDeleteChange={(values) => updateField(field.id, (current) => ({
                                ...current,
                                deleteRoleValues: values,
                              }))}
                            />
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

                    if (isDefaultId) {
                      return <div key={field.id}>{fieldContent}</div>
                  }

                  return (
                    <PragmaticSortableItem
                      key={field.id}
                      id={field.id}
                      index={movableIndex}
                      type={`track-field-${activeGroup.id || "uncategorized"}`}
                      disabled={saving || movableIndex < 0}
                      dragSurfaceOnly
                      className="rounded-lg"
                      onReorder={(startIndex, finishIndex) => {
                        reorderFields(activeGroup.id, startIndex, finishIndex)
                      }}
                    >
                      <div>
                        {fieldContent}
                      </div>
                    </PragmaticSortableItem>
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
            <AlertDialogTitle>
              {pendingFieldDelete?.reason === "saved-values"
                ? "Kolom sudah memiliki data"
                : "Hapus kolom yang sudah diisi?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left leading-relaxed">
              {pendingFieldDelete?.reason === "saved-values" ? (
                <>
                  Kolom "{pendingFieldDelete?.field.columnName || "ini"}" sudah dipakai pada {pendingFieldDelete?.valueCount ?? 0} data.
                  {" "}
                  Jika dihapus, kolom tidak tampil lagi di admin.
                  {" "}
                  Sebaiknya sembunyikan kolom agar data lama tetap aman dan bisa ditampilkan kembali.
                </>
              ) : (
                <>
                  Kolom "{pendingFieldDelete?.field.columnName || "ini"}" sudah berisi pengaturan.
                  {" "}
                  Jika dihapus, nama kolom, tipe, isian awal, pilihan kategori, dan hak aksesnya ikut hilang.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mx-0 mb-0 justify-end gap-2 rounded-none px-5 py-4 sm:flex-row sm:flex-wrap">
            {pendingFieldDelete?.reason === "saved-values" ? (
              <AlertDialogAction
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={hidePendingField}
              >
                Sembunyikan
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setPendingFieldDelete(null)}
              >
                Batal
              </AlertDialogAction>
            )}
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
