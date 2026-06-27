import { ArrowDown, ArrowUp, ChevronDown, CirclePlus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DepartemenColumn, DepartemenColumnType } from "@/types"
import { DepartemenFieldTip } from "./departemen-field-tip"
import {
  fieldClass,
  innerPanelClass,
  panelClass,
  readonlyFieldClass,
} from "./styles/form"
import {
  getColumnLabel,
  getDefaultValueLabel,
  getTypeLabel,
} from "./utils/kolom"
import { DepartemenFormFieldRow } from "./departemen-form-field-row"
import { DepartemenSectionToggle } from "./departemen-section-toggle"

type DepartemenEditorKolomPanelProps = {
  orderedColumns: DepartemenColumn[]
  customColumns: DepartemenColumn[]
  open: boolean
  openColumnIds: Set<string>
  disabled?: boolean
  readOnly?: boolean
  addButtonIcon?: boolean
  columnNamePlaceholder?: string
  typeSelectPlaceholder?: string
  onToggle: () => void
  onToggleColumn: (columnId: string) => void
  onAddColumn: () => void
  onRemoveColumn: (columnId: string) => void
  onMoveColumn: (columnId: string, direction: -1 | 1) => void
  onUpdateColumn: (
    columnId: string,
    updater: (column: DepartemenColumn) => DepartemenColumn,
  ) => void
}

export function DepartemenEditorKolomPanel({
  orderedColumns,
  customColumns,
  open,
  openColumnIds,
  disabled,
  readOnly = false,
  addButtonIcon = false,
  columnNamePlaceholder,
  typeSelectPlaceholder,
  onToggle,
  onToggleColumn,
  onAddColumn,
  onRemoveColumn,
  onMoveColumn,
  onUpdateColumn,
}: DepartemenEditorKolomPanelProps) {
  return (
    <div className={panelClass}>
      <DepartemenSectionToggle
        icon={<CirclePlus size={21} />}
        title="Tambah kolom"
        description="Silahkan masukkan data dibawah ini untuk memasukkan data baru"
        open={open}
        onClick={onToggle}
      />

      {open && (
        <div className="space-y-4 px-4 pb-4 pt-3">
          {orderedColumns.map((column) => {
            const label = getColumnLabel(column)
            const customIndex = customColumns.findIndex((item) => item.id === column.id)
            const isColumnOpen = openColumnIds.has(column.id)
            const columnTitle = label || `Kolom ${customIndex + 1}`

            return (
              <div
                key={column.id}
                className={`${innerPanelClass} px-4 py-4 ${column.isDefault && !readOnly ? "opacity-80" : ""}`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center justify-between gap-4 outline-none"
                  onClick={() => onToggleColumn(column.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onToggleColumn(column.id)
                    }
                  }}
                  aria-expanded={isColumnOpen}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {!column.isDefault && !readOnly && (
                      <div
                        className="flex shrink-0 items-center gap-1"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button
                          type="button"
                          variant="action-neutral"
                          size="icon-sm"
                          disabled={disabled || customIndex <= 0}
                          aria-label={`Pindahkan ${label} ke atas`}
                          onClick={() => onMoveColumn(column.id, -1)}
                        >
                          <ArrowUp size={16} />
                        </Button>
                        <Button
                          type="button"
                          variant="action-neutral"
                          size="icon-sm"
                          disabled={disabled || customIndex === customColumns.length - 1}
                          aria-label={`Pindahkan ${label} ke bawah`}
                          onClick={() => onMoveColumn(column.id, 1)}
                        >
                          <ArrowDown size={16} />
                        </Button>
                      </div>
                    )}
                    <span className="truncate text-sm font-medium">
                      {columnTitle}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {!column.isDefault && (
                      <div
                        className="flex shrink-0 items-center gap-3 text-sm font-medium"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <span className="text-muted-foreground">Wajib diisi</span>
                        <Checkbox
                          className="size-5 disabled:opacity-100"
                          checked={column.isRequired}
                          disabled={disabled || readOnly || column.label.trim().length === 0}
                          onCheckedChange={(value) => onUpdateColumn(column.id, (current) => ({
                            ...current,
                            isRequired: value === true,
                          }))}
                        />
                        {!readOnly && (
                          <Button
                            type="button"
                            variant="action-danger-soft"
                            size="icon"
                            aria-label={`Hapus kolom ${customIndex + 1}`}
                            disabled={disabled}
                            onClick={(event) => {
                              event.stopPropagation()
                              onRemoveColumn(column.id)
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      className="pointer-events-none flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors"
                      aria-label={isColumnOpen ? `Tutup ${columnTitle}` : `Buka ${columnTitle}`}
                      aria-expanded={isColumnOpen}
                    >
                      <ChevronDown className={`size-4 transition-transform ${isColumnOpen ? "rotate-0" : "-rotate-90"}`} />
                    </button>
                  </div>
                </div>

                {isColumnOpen && (
                  <div className="mt-5 grid gap-5">
                    <DepartemenFormFieldRow label="Nama kolom">
                      <Input
                        value={label}
                        onChange={(event) => onUpdateColumn(column.id, (current) => ({
                          ...current,
                          label: event.target.value,
                          isRequired: event.target.value.trim().length > 0 ? current.isRequired : false,
                        }))}
                        placeholder={columnNamePlaceholder}
                        className={fieldClass}
                        disabled={disabled || readOnly || column.isDefault}
                      />
                    </DepartemenFormFieldRow>
                    <DepartemenFormFieldRow label="Tipe data">
                      {column.isDefault || readOnly ? (
                        <div className={`flex items-center ${readonlyFieldClass}`}>
                          {getTypeLabel(column)}
                        </div>
                      ) : (
                        <Select
                          value={column.type}
                          onValueChange={(value) => onUpdateColumn(column.id, (current) => ({
                            ...current,
                            type: value as DepartemenColumnType,
                            defaultValue: value === "date" ? "" : current.defaultValue,
                          }))}
                          disabled={disabled}
                        >
                          <SelectTrigger className={`${fieldClass} w-full`}>
                            <SelectValue placeholder={typeSelectPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Teks</SelectItem>
                            <SelectItem value="date">Tanggal</SelectItem>
                            <SelectItem value="number">Angka</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </DepartemenFormFieldRow>
                    <DepartemenFormFieldRow label="Isian awal" tip={<DepartemenFieldTip />}>
                      <Input
                        value={getDefaultValueLabel(column)}
                        onChange={(event) => onUpdateColumn(column.id, (current) => ({
                          ...current,
                          defaultValue: event.target.value,
                        }))}
                        placeholder="Masukkan nilai"
                        className={fieldClass}
                        disabled={disabled || readOnly || column.isDefault || column.type === "date"}
                      />
                    </DepartemenFormFieldRow>
                  </div>
                )}
              </div>
            )
          })}

          {!readOnly && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onAddColumn}
                disabled={disabled}
              >
                {addButtonIcon && <Plus />} Tambah
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
