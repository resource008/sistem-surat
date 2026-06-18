import { useLayoutEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import type { DepartemenColumn } from "@/types"
import { formatCustomFieldValue, formatNumberFieldInput, isDetailBuiltInColumn } from "@/domain/surat/custom-fields"
import { DatePicker, FormField } from "./shared"
import { Field } from "./view-surat/field"

interface CustomFieldsFormProps {
  columns?: DepartemenColumn[]
  values?: Record<string, string>
  errors?: Record<string, string>
  onChange: (columnId: string, value: string) => void
  includeBuiltIn?: boolean
}

export function getCustomSuratColumns(columns?: DepartemenColumn[], includeBuiltIn = false) {
  return (columns ?? [])
    .filter((column) => !column.isDefault && (includeBuiltIn || !isDetailBuiltInColumn(column)))
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

function getNumberCaretPosition(value: string) {
  return value.match(/-?\d+(?:[.,]\d*)?/)?.[0].length ?? 0
}

function hasNumberValue(value: string) {
  return /-?\d+(?:[.,]\d*)?/.test(value)
}

function NumberFieldInput({
  column,
  error,
  value,
  onChange,
}: {
  column: DepartemenColumn
  error?: string
  value: string
  onChange: (value: string) => void
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
      placeholder={column.isRequired ? "Wajib diisi" : "Opsional"}
      aria-invalid={Boolean(error)}
      className="h-10 rounded-xl text-[14px]"
    />
  )
}

export function CustomFieldsForm({
  columns,
  values = {},
  errors = {},
  onChange,
  includeBuiltIn = false,
}: CustomFieldsFormProps) {
  const customColumns = getCustomSuratColumns(columns, includeBuiltIn)
  if (customColumns.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {customColumns.map((column) => (
        <FormField
          key={column.id}
          label={column.label}
          error={errors[column.id]}
        >
          {column.type === "date" ? (
            <DatePicker
              value={values[column.id] ?? ""}
              onChange={(value) => onChange(column.id, value)}
              placeholder={column.isRequired ? "Wajib diisi" : "Opsional"}
              hasError={Boolean(errors[column.id])}
            />
          ) : (
            column.type === "number" ? (
              <NumberFieldInput
                column={column}
                error={errors[column.id]}
                value={values[column.id] ?? ""}
                onChange={(value) => onChange(column.id, value)}
              />
            ) : (
              <Input
                type="text"
                value={values[column.id] ?? ""}
                onChange={(event) => onChange(column.id, event.target.value)}
                placeholder={column.isRequired ? "Wajib diisi" : "Opsional"}
                className="h-10 rounded-xl text-[14px]"
              />
            )
          )}
        </FormField>
      ))}
    </div>
  )
}

interface CustomFieldsViewProps {
  columns?: DepartemenColumn[]
  values?: Record<string, string>
  includeBuiltIn?: boolean
}

export function CustomFieldsView({ columns, values = {}, includeBuiltIn = false }: CustomFieldsViewProps) {
  const customColumns = getCustomSuratColumns(columns, includeBuiltIn)
  if (customColumns.length === 0) return null

  return (
    <>
      {customColumns.map((column) => {
        const rawValue = values[column.id]?.trim() ?? ""
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
