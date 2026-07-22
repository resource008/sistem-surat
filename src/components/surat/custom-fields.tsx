import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { COLUMN_AUTO_FILL_LABEL, getColumnAutoFill } from "@/constants/departemen-columns"
import { CalendarIcon, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DepartemenColumn } from "@/types"
import {
  formatCustomFieldValue,
  formatNumberFieldInput,
  getCustomFieldExactValue,
  getCustomFieldValue,
  getSuratBuiltInColumnKey,
  isAutoFilledSuratColumn,
  isDetailBuiltInColumn,
} from "@/domain/surat/custom-fields"
import { DatePicker, FormField } from "./shared"
import { Field } from "./view-surat/field"

export const ADD_RIGHT_SURAT_GROUP_EVENT = "surat:right-group:add"

interface CustomFieldsFormProps {
  columns?: DepartemenColumn[]
  values?: Record<string, string>
  errors?: Record<string, string>
  onChange: (columnId: string, value: string) => void
  autoFillPreviewValues?: Partial<Record<"sequence" | "currentDate" | "department", string>>
  includeBuiltIn?: boolean
  adaptiveLayout?: boolean
  splitLayout?: boolean
  splitSide?: "left" | "right"
  strictValueKey?: boolean
  disableSplitScroll?: boolean
  splitPanelClassName?: string
}

export function getCustomSuratColumns(columns?: DepartemenColumn[], includeBuiltIn = false) {
  return (columns ?? [])
    .filter((column) => !column.isDefault && (includeBuiltIn || !isDetailBuiltInColumn(column)))
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getFillableSuratColumns(columns?: DepartemenColumn[], includeBuiltIn = false) {
  return getCustomSuratColumns(columns, includeBuiltIn)
    .filter((column) => !isAutoFilledSuratColumn(column))
}

function getNumberCaretPosition(value: string) {
  return value.match(/-?\d+(?:[.,]\d*)?/)?.[0].length ?? 0
}

function hasNumberValue(value: string) {
  return /-?\d+(?:[.,]\d*)?/.test(value)
}

function getManualColumnPlaceholder(column: DepartemenColumn) {
  if (column.type === "number") return "Masukkan Angka"
  if (column.type === "date") return "Pilih Tanggal"
  return "Masukkan data"
}

function getInputFieldKey(column: DepartemenColumn, index: number) {
  const id = column.id?.trim()
  if (id) return id

  const order = Number.isFinite(column.sortOrder) ? column.sortOrder : index
  return `column_${order}_${index}_${column.label.trim().toLowerCase()}`
}

function getRestoredRightGroupCount(values: Record<string, string>) {
  return Object.keys(values).reduce((count, key) => {
    const match = key.match(/_group_(\d+)$/)
    if (!match) return count

    return Math.max(count, Number(match[1]) + 1)
  }, 1)
}

function NumberFieldInput({
  column,
  error,
  value,
  onChange,
  disabled = false,
}: {
  column: DepartemenColumn
  error?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingCaretRef = useRef<number | null>(null)
  const displayValue = formatNumberFieldInput(column, value)

  const moveCaretAfterNumber = () => {
    const input = inputRef.current
    if (!input) return
    if (!hasNumberValue(input.value)) return

    const caret = getNumberCaretPosition(input.value)
    input.setSelectionRange(caret, caret)
  }

  useLayoutEffect(() => {
    if (pendingCaretRef.current === null) return

    const input = inputRef.current
    if (input) input.setSelectionRange(pendingCaretRef.current, pendingCaretRef.current)
    pendingCaretRef.current = null
  }, [displayValue])

  return (
    <Input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={(event) => {
        const nextValue = formatNumberFieldInput(column, event.target.value)
        pendingCaretRef.current = hasNumberValue(nextValue) ? getNumberCaretPosition(nextValue) : null
        onChange(nextValue)
      }}
      onClick={moveCaretAfterNumber}
      onFocus={moveCaretAfterNumber}
      onKeyUp={moveCaretAfterNumber}
      placeholder="Masukkan Angka"
      aria-invalid={Boolean(error)}
      disabled={disabled}
      className="h-10 rounded-xl text-[14px]"
    />
  )
}

export function CustomFieldsForm({
  columns,
  values = {},
  errors = {},
  onChange,
  autoFillPreviewValues = {},
  includeBuiltIn = false,
  adaptiveLayout = false,
  splitLayout = false,
  splitSide,
  strictValueKey = false,
  disableSplitScroll = false,
  splitPanelClassName,
}: CustomFieldsFormProps) {
  const customColumns = getCustomSuratColumns(columns, includeBuiltIn)
  const [rightGroupCount, setRightGroupCount] = useState(1)
  const [highlightedRightGroup, setHighlightedRightGroup] = useState<number | null>(null)
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!splitLayout) return

    setRightGroupCount((count) => Math.max(count, getRestoredRightGroupCount(values)))
  }, [splitLayout, values])

  useEffect(() => {
    if (!splitLayout) return

    const handleAddRightGroup = () => {
      setRightGroupCount((count) => {
        const nextGroupIndex = count
        setHighlightedRightGroup(nextGroupIndex)

        if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current)
        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightedRightGroup(null)
          highlightTimeoutRef.current = null
        }, 1600)

        return count + 1
      })
    }

    window.addEventListener(ADD_RIGHT_SURAT_GROUP_EVENT, handleAddRightGroup)
    return () => window.removeEventListener(ADD_RIGHT_SURAT_GROUP_EVENT, handleAddRightGroup)
  }, [splitLayout])

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current)
    }
  }, [])

  if (customColumns.length === 0) return null
  const getInputValue = (column: DepartemenColumn, fieldKey: string) => {
    return strictValueKey
      ? values[fieldKey] ?? ""
      : getCustomFieldExactValue(column, values) ?? getCustomFieldValue(column, values) ?? ""
  }

  const getAutomaticPreviewValue = (column: DepartemenColumn) => {
    const autoFill = getColumnAutoFill(column.defaultValue)
    if (autoFill !== "none") return autoFillPreviewValues[autoFill] ?? ""

    const builtInKey = getSuratBuiltInColumnKey(column)
    if (builtInKey === "noSurat") return autoFillPreviewValues.sequence ?? ""
    if (builtInKey === "tanggalSurat") return autoFillPreviewValues.currentDate ?? ""
    if (builtInKey === "tujuan") return autoFillPreviewValues.department ?? ""

    return ""
  }

  const getDisplayInputValue = (column: DepartemenColumn, fieldKey: string) => {
    const value = getInputValue(column, fieldKey)
    if (value || !isAutoFilledSuratColumn(column)) return value

    return getAutomaticPreviewValue(column)
  }

  const renderInput = (column: DepartemenColumn, fieldKey: string) => {
    const autoFill = getColumnAutoFill(column.defaultValue)
    const isAutomatic = isAutoFilledSuratColumn(column)
    const placeholder = isAutomatic
      ? `Otomatis: ${COLUMN_AUTO_FILL_LABEL[autoFill]}`
      : getManualColumnPlaceholder(column)

    if (column.type === "date") {
      return (
        <DatePicker
          value={getDisplayInputValue(column, fieldKey)}
          onChange={(value) => onChange(fieldKey, value)}
          placeholder={placeholder}
          hasError={Boolean(errors[column.id])}
          disabled={isAutomatic}
        />
      )
    }

    if (isAutomatic) {
      return (
        <Input
          type="text"
          value={getDisplayInputValue(column, fieldKey)}
          placeholder={placeholder}
          disabled
          className="h-10 rounded-xl text-[14px]"
        />
      )
    }

    if (column.type === "number") {
      return (
        <NumberFieldInput
          column={column}
          error={errors[column.id]}
          value={getDisplayInputValue(column, fieldKey)}
          onChange={(value) => onChange(fieldKey, value)}
          disabled={isAutomatic}
        />
      )
    }

    return (
      <Input
        type="text"
        value={getDisplayInputValue(column, fieldKey)}
        onChange={(event) => onChange(fieldKey, event.target.value)}
        placeholder={placeholder}
        disabled={isAutomatic}
        className="h-10 rounded-xl text-[14px]"
      />
    )
  }

  const renderField = (column: DepartemenColumn, index: number) => {
    const fieldKey = getInputFieldKey(column, index)

    return (
    <FormField key={fieldKey} label={column.label} error={errors[column.id]}>
      {renderInput(column, fieldKey)}
    </FormField>
  )
  }

  const renderStructureField = (column: DepartemenColumn, index: number, keySuffix = "") => {
    const baseFieldKey = getInputFieldKey(column, index)
    const fieldKey = keySuffix ? `${baseFieldKey}_${keySuffix}` : baseFieldKey
    const error = errors[fieldKey] ?? errors[column.id]

    return (
    <div
      key={fieldKey}
      className={cn(
        "rounded-2xl border bg-background p-4 transition-all duration-200 hover:border-border hover:shadow-sm",
        error ? "border-red-500 ring-2 ring-red-500/15" : "border-border/60"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {column.label}
            {column.isRequired && !isAutoFilledSuratColumn(column) ? (
              <span className="ml-1 text-red-500" aria-label="Wajib diisi">*</span>
            ) : null}
          </p>
        </div>
      </div>
      {renderInput(column, fieldKey)}
      {error ? (
        <p className="mt-2 text-xs font-medium leading-none text-red-500 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
  }

  if (splitLayout) {
    const leftColumns = customColumns.filter((_, index) => index % 2 === 0)
    const rightColumns = customColumns.filter((_, index) => index % 2 === 1)
    const splitPanelClass = cn(
      "min-h-24 self-start rounded-2xl border border-border/60 bg-background p-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
      disableSplitScroll
        ? ""
        : "lg:max-h-[calc(100vh-290px)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2",
      splitPanelClassName
    )

    const leftPanel = (
        <div className={splitPanelClass}>
          <div className="mb-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Data utama</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Isi informasi utama surat sesuai struktur kolom kiri.
            </p>
          </div>
          <div className="grid gap-4">
            {leftColumns.length > 0 ? (
              leftColumns.map((column) => {
                const originalIndex = customColumns.findIndex((item) => item === column)
                return renderStructureField(column, originalIndex)
              })
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
                Tidak ada kolom di sisi ini.
              </p>
            )}
          </div>
        </div>
    )

    const rightPanel = (
        <div className={splitPanelClass}>
          <div className="mb-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Data tambahan</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tambahkan satu atau beberapa data sesuai struktur kolom kanan.
            </p>
          </div>
          <div className="grid gap-4">
            {rightColumns.length > 0 ? (
              Array.from({ length: rightGroupCount }).map((_, groupIndex) => (
                <div
                  key={groupIndex}
                  className={cn(
                    "rounded-2xl border bg-background p-3 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2",
                    highlightedRightGroup === groupIndex
                      ? "border-blue-400/80 shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_0_32px_rgba(59,130,246,0.35)] ring-2 ring-blue-400/25"
                      : "border-border/60"
                  )}
                >
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-2">
                    <p className="text-sm font-semibold text-foreground">Data {groupIndex + 1}</p>
                    {groupIndex > 0 ? (
                      <button
                        type="button"
                        className="inline-flex size-7 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        aria-label={`Hapus Data ${groupIndex + 1}`}
                        title={`Hapus Data ${groupIndex + 1}`}
                        onClick={() => setRightGroupCount((count) => Math.max(1, count - 1))}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-4">
                    {rightColumns.map((column) => {
                      const originalIndex = customColumns.findIndex((item) => item === column)
                      return renderStructureField(
                        column,
                        originalIndex,
                        groupIndex === 0 ? "" : `group_${groupIndex}`
                      )
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
                Tidak ada kolom di sisi ini.
              </p>
            )}
          </div>
        </div>
    )

    if (splitSide === "left") return leftPanel
    if (splitSide === "right") return rightPanel

    return (
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        {leftPanel}
        {rightPanel}
      </div>
    )
  }

  const gridClassName = adaptiveLayout
    ? customColumns.length === 1
      ? "grid grid-cols-1 gap-4"
      : customColumns.length <= 4
        ? "grid grid-cols-1 gap-4 md:grid-cols-2"
        : "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
    : "grid grid-cols-1 gap-4 sm:grid-cols-2"

  return (
    <div className={gridClassName}>
      {customColumns.map(renderField)}
    </div>
  )
}

interface CustomFieldsViewProps {
  columns?: DepartemenColumn[]
  values?: Record<string, string>
  includeBuiltIn?: boolean
  splitLayout?: boolean
  splitSide?: "left" | "right"
  splitPanelClassName?: string
}

function CustomReadonlyField({
  column,
  value,
}: {
  column: DepartemenColumn
  value?: string
}) {
  const displayValue = formatCustomFieldValue(column, value)
  const inputValue = displayValue === "-" ? "" : displayValue

  return (
    <div className="rounded-2xl border border-border/60 bg-background p-4">
      <p className="truncate text-sm font-semibold text-foreground">
        {column.label}
        {column.isRequired && !isAutoFilledSuratColumn(column) ? (
          <span className="ml-1 text-red-500" aria-label="Wajib diisi">*</span>
        ) : null}
      </p>
      <div className="mt-3">
        {column.type === "date" ? (
          <div className="flex h-10 w-full items-center rounded-xl border border-input bg-background px-3 text-[14px] text-foreground shadow-sm">
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className={cn("truncate", inputValue ? "text-foreground" : "text-muted-foreground")}>
              {inputValue || "Tidak ada"}
            </span>
          </div>
        ) : (
          <Input
            value={inputValue}
            placeholder="Tidak ada"
            readOnly
            className="h-10 cursor-default rounded-xl text-[14px] text-foreground opacity-100"
          />
        )}
      </div>
    </div>
  )
}

export function CustomFieldsView({
  columns,
  values = {},
  includeBuiltIn = false,
  splitLayout = false,
  splitSide,
  splitPanelClassName,
}: CustomFieldsViewProps) {
  const customColumns = getCustomSuratColumns(columns, includeBuiltIn)
  if (customColumns.length === 0) return null

  if (splitLayout) {
    const leftColumns = customColumns.filter((_, index) => index % 2 === 0)
    const rightColumns = customColumns.filter((_, index) => index % 2 === 1)
    const rightGroupCount = getRestoredRightGroupCount(values)
    const splitPanelClass = cn(
      "self-start rounded-2xl border border-border/60 bg-background p-3",
      splitPanelClassName
    )
    const getReadonlyValue = (column: DepartemenColumn, index: number, groupIndex = 0) => {
      const baseFieldKey = getInputFieldKey(column, index)
      const fieldKey = groupIndex === 0 ? baseFieldKey : `${baseFieldKey}_group_${groupIndex}`
      const rawValue = values[fieldKey]

      return rawValue
    }

    const leftPanel = (
        <div className={splitPanelClass}>
          <div className="mb-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Data utama</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Informasi utama surat sesuai struktur kolom kiri.
            </p>
          </div>
          <div className="grid gap-4">
            {leftColumns.length > 0 ? (
              leftColumns.map((column) => {
                const originalIndex = customColumns.findIndex((item) => item === column)

                return (
                <CustomReadonlyField
                  key={column.id}
                  column={column}
                  value={getReadonlyValue(column, originalIndex)}
                />
                )
              })
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
                Tidak ada kolom di sisi ini.
              </p>
            )}
          </div>
        </div>
    )

    const rightPanel = (
        <div className={splitPanelClass}>
          <div className="mb-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Data tambahan</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tambahkan satu atau beberapa data sesuai struktur kolom kanan.
            </p>
          </div>
          <div className="grid gap-4">
            {rightColumns.length > 0 ? (
              Array.from({ length: rightGroupCount }).map((_, groupIndex) => (
                <div
                  key={groupIndex}
                  className="rounded-2xl border border-border/60 bg-background p-3"
                >
                  <div className="mb-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-2">
                    <p className="text-sm font-semibold text-foreground">Data {groupIndex + 1}</p>
                  </div>
                  <div className="grid gap-4">
                    {rightColumns.map((column) => {
                      const originalIndex = customColumns.findIndex((item) => item === column)

                      return (
                        <CustomReadonlyField
                          key={`${column.id}-${groupIndex}`}
                          column={column}
                          value={getReadonlyValue(column, originalIndex, groupIndex)}
                        />
                      )
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
                Tidak ada kolom di sisi ini.
              </p>
            )}
          </div>
        </div>
    )

    if (splitSide === "left") return leftPanel
    if (splitSide === "right") return rightPanel

    return (
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        {leftPanel}
        {rightPanel}
      </div>
    )
  }

  return (
    <>
      {customColumns.map((column) => {
        const rawValue = getCustomFieldValue(column, values)?.trim() ?? ""
        const value = rawValue ? formatCustomFieldValue(column, rawValue) : undefined

        return (
          <Field
            key={column.id}
            label={column.label}
            value={value}
            placeholder="Tidak ada data"
          />
        )
      })}
    </>
  )
}
