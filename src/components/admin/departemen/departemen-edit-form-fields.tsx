"use client"

import type { Dispatch, ReactNode, SetStateAction } from "react"
import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, CirclePlus, Eye, Printer, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DepartemenFieldTip } from "./departemen-field-tip"
import type {
  Departemen,
  DepartemenColumn,
  DepartemenColumnType,
  DepartemenFormState,
} from "@/types"

const TUJUAN_DEFAULT_ID = "default_tujuan"
const NOMOR_DEFAULT_ID = "default_nomor_register"
const TANGGAL_DEFAULT_ID = "default_tanggal_terima"
const DISPLAY_SLOT_COUNT = 4

const panelClass = "overflow-hidden rounded-xl border border-slate-300/70 bg-background dark:border-slate-700/60"
const innerPanelClass = "rounded-xl border border-slate-200/80 bg-background dark:border-slate-800/70"
const fieldClass = "h-10 rounded-xl border border-transparent bg-muted px-5 text-[14px] font-medium text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-ring/40 focus-visible:ring-0 disabled:opacity-100"

const TYPE_LABEL: Record<DepartemenColumnType, string> = {
  text: "Teks",
  date: "Tanggal",
  number: "Angka",
}

interface Props {
  form: DepartemenFormState
  departments?: Departemen[]
  disabled?: boolean
  readOnly?: boolean
  onChange: Dispatch<SetStateAction<DepartemenFormState>>
}

function getColumnLabel(column?: DepartemenColumn | null) {
  if (!column) return ""
  if (column.id.includes(NOMOR_DEFAULT_ID)) return "Nomor Registrasi"
  return column.label
}

function getTypeLabel(column: DepartemenColumn) {
  if (column.id.includes(NOMOR_DEFAULT_ID)) return "Angka (otomatis)"
  if (column.id.includes(TANGGAL_DEFAULT_ID)) return "Tanggal"
  if (column.isDefault) return "Teks (otomatis)"
  return TYPE_LABEL[column.type]
}

function getDefaultValueLabel(column: DepartemenColumn) {
  if (column.isDefault) return column.defaultValue || "N/A"
  return column.defaultValue
}

function createColumn(sortOrder: number): DepartemenColumn {
  return {
    id: `draft_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    label: "",
    type: "text",
    defaultValue: "",
    isDefault: false,
    isRequired: false,
    showInDataSurat: false,
    showInPrint: true,
    sortOrder,
  }
}

function orderColumnsWithTujuanLast(columns: DepartemenColumn[]) {
  const defaultBeforeTujuan = columns.filter((column) =>
    column.isDefault && !column.id.includes(TUJUAN_DEFAULT_ID)
  )
  const custom = columns.filter((column) => !column.isDefault)
  const tujuanColumn = columns.find((column) => column.isDefault && column.id.includes(TUJUAN_DEFAULT_ID))

  return [
    ...defaultBeforeTujuan.map((column, index) => ({ ...column, sortOrder: index })),
    ...custom.map((column, index) => ({ ...column, sortOrder: defaultBeforeTujuan.length + index })),
    ...(tujuanColumn ? [{ ...tujuanColumn, sortOrder: defaultBeforeTujuan.length + custom.length }] : []),
  ]
}

function SectionButton({
  icon,
  title,
  description,
  open,
  onClick,
}: {
  icon: ReactNode
  title: string
  description: string
  open: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="flex min-h-[88px] w-full items-center justify-between gap-4 px-6 py-5 text-left"
      onClick={onClick}
    >
      <span className="flex min-w-0 items-center gap-4">
        <span className="flex size-6 shrink-0 items-center justify-center text-slate-950 dark:text-slate-50">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-[16px] font-bold leading-tight text-slate-950 dark:text-slate-50">
            {title}
          </span>
          <span className="mt-1.5 block text-sm leading-snug text-slate-900 dark:text-slate-200">
            {description}
          </span>
        </span>
      </span>
      <ChevronDown className={`size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  )
}

export function DepartemenEditFormFields({
  form,
  disabled,
  readOnly = false,
  onChange,
}: Props) {
  const [openData, setOpenData] = useState(true)
  const [openDisplay, setOpenDisplay] = useState(true)
  const [openPrintIdentity, setOpenPrintIdentity] = useState(true)
  const [openColumnIds, setOpenColumnIds] = useState<Set<string>>(() => new Set())
  const orderedColumns = useMemo(() => orderColumnsWithTujuanLast(form.columns), [form.columns])
  const customColumns = orderedColumns.filter((column) => !column.isDefault)

  const updateColumn = (
    columnId: string,
    updater: (column: DepartemenColumn) => DepartemenColumn
  ) => {
    onChange((current) => ({
      ...current,
      columns: current.columns.map((column) => column.id === columnId ? updater(column) : column),
    }))
  }

  const moveCustomColumn = (columnId: string, direction: -1 | 1) => {
    onChange((current) => {
      const custom = current.columns.filter((column) => !column.isDefault)
      const fromIndex = custom.findIndex((column) => column.id === columnId)
      const toIndex = fromIndex + direction

      if (fromIndex < 0 || toIndex < 0 || toIndex >= custom.length) return current

      const reordered = [...custom]
      const [movedColumn] = reordered.splice(fromIndex, 1)
      reordered.splice(toIndex, 0, movedColumn)

      return {
        ...current,
        columns: orderColumnsWithTujuanLast([
          ...current.columns.filter((column) => column.isDefault),
          ...reordered,
        ]),
      }
    })
  }

  const removeColumn = (columnId: string) => {
    onChange((current) => ({
      ...current,
      columns: orderColumnsWithTujuanLast(
        current.columns.filter((column) => column.id !== columnId || column.isDefault)
      ),
    }))
  }

  const addColumn = () => {
    onChange((current) => ({
      ...current,
      columns: orderColumnsWithTujuanLast([
        ...current.columns,
        createColumn(current.columns.length),
      ]),
    }))
  }

  const setDisplaySlot = (slotIndex: number, columnId: string) => {
    onChange((current) => {
      const mutable = orderColumnsWithTujuanLast(current.columns).map((column) => ({ ...column }))
      const fixedIds = new Set([NOMOR_DEFAULT_ID, TANGGAL_DEFAULT_ID, TUJUAN_DEFAULT_ID])
      const selected = mutable
        .filter((column) => column.showInDataSurat && !Array.from(fixedIds).some((id) => column.id.includes(id)))
        .map((column) => column.id)

      selected[slotIndex] = columnId === "none" ? "" : columnId
      const selectedIds = new Set(selected.filter(Boolean))

      return {
        ...current,
        columns: mutable.map((column) => {
          if (column.id.includes(TANGGAL_DEFAULT_ID)) {
            return { ...column, showInDataSurat: false }
          }

          if (column.id.includes(NOMOR_DEFAULT_ID) || column.id.includes(TUJUAN_DEFAULT_ID)) {
            return { ...column, showInDataSurat: true }
          }

          return { ...column, showInDataSurat: selectedIds.has(column.id) }
        }),
      }
    })
  }

  const toggleColumn = (columnId: string) => {
    setOpenColumnIds((current) => {
      const next = new Set(current)
      next.has(columnId) ? next.delete(columnId) : next.add(columnId)
      return next
    })
  }

  const fixedNomor = orderedColumns.find((column) => column.id.includes(NOMOR_DEFAULT_ID))
  const fixedTujuan = orderedColumns.find((column) => column.id.includes(TUJUAN_DEFAULT_ID))
  const selectableDisplayColumns = orderedColumns.filter((column) =>
    !column.id.includes(NOMOR_DEFAULT_ID) &&
    !column.id.includes(TANGGAL_DEFAULT_ID) &&
    !column.id.includes(TUJUAN_DEFAULT_ID)
  )
  const selectedMiddleColumns = selectableDisplayColumns.filter((column) => column.showInDataSurat)
  return (
    <div className="flex flex-col gap-7">
      <div className="grid gap-x-20 gap-y-6 lg:grid-cols-2">
        <Label className="grid gap-3 text-left text-[16px] font-medium text-slate-950 dark:text-slate-50">
          <span>Nama Departemen</span>
          <Input
            value={form.tujuan}
            onChange={(event) => onChange((current) => ({ ...current, tujuan: event.target.value }))}
            className={fieldClass}
            disabled={disabled || readOnly}
          />
        </Label>
        <Label className="grid gap-3 text-left text-[16px] font-medium text-slate-950 dark:text-slate-50">
          <span>Singkatan</span>
          <Input
            value={form.shortName}
            onChange={(event) => onChange((current) => ({ ...current, shortName: event.target.value }))}
            className={fieldClass}
            disabled={disabled || readOnly}
          />
        </Label>
      </div>

      <div className={panelClass}>
        <SectionButton
          icon={<CirclePlus size={21} />}
          title="Tambah kolom"
          description="Silahkan masukkan data dibawah ini untuk memasukkan data baru"
          open={openData}
          onClick={() => setOpenData((current) => !current)}
        />

        {openData && (
          <div className="space-y-6 px-4 pb-5 pt-2">
            {orderedColumns.map((column) => {
              const label = getColumnLabel(column)
              const customIndex = customColumns.findIndex((item) => item.id === column.id)
              const isColumnOpen = openColumnIds.has(column.id)
              const columnTitle = label || `Kolom ${customIndex + 1}`
              return (
                <div
                  key={column.id}
                  className={`${innerPanelClass} px-4 py-4 ${column.isDefault && !readOnly ? "opacity-85" : ""}`}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex cursor-pointer items-center justify-between gap-4 outline-none"
                    onClick={() => toggleColumn(column.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        toggleColumn(column.id)
                      }
                    }}
                    aria-expanded={isColumnOpen}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {!column.isDefault && !readOnly && (
                        <div className="flex shrink-0 items-center gap-1" onClick={(event) => event.stopPropagation()}>
                          <button
                            type="button"
                            disabled={disabled || customIndex <= 0}
                            aria-label={`Pindahkan ${label} ke atas`}
                            className="flex size-7 items-center justify-center rounded-lg text-slate-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-100 dark:hover:bg-slate-800"
                            onClick={() => moveCustomColumn(column.id, -1)}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            disabled={disabled || customIndex === customColumns.length - 1}
                            aria-label={`Pindahkan ${label} ke bawah`}
                            className="flex size-7 items-center justify-center rounded-lg text-slate-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-100 dark:hover:bg-slate-800"
                            onClick={() => moveCustomColumn(column.id, 1)}
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      )}
                      <span className="truncate text-[15px] font-medium text-slate-950 dark:text-slate-50">
                        {columnTitle}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {!column.isDefault && (
                      <div className="flex shrink-0 items-center gap-3 text-[14px] font-medium" onClick={(event) => event.stopPropagation()}>
                        <span>Wajib diisi</span>
                        <Checkbox
                          className="size-5 disabled:opacity-100"
                          checked={column.isRequired}
                          disabled={disabled || readOnly || column.label.trim().length === 0}
                          onCheckedChange={(value) => updateColumn(column.id, (current) => ({
                            ...current,
                            isRequired: value === true,
                          }))}
                        />
                        {!readOnly && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Hapus kolom ${customIndex + 1}`}
                            className="size-8 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                            disabled={disabled}
                            onClick={(event) => {
                              event.stopPropagation()
                              removeColumn(column.id)
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
                      <FieldRow label="Nama kolom">
                        <Input
                          value={label}
                          onChange={(event) => updateColumn(column.id, (current) => ({
                            ...current,
                            label: event.target.value,
                            isRequired: event.target.value.trim().length > 0 ? current.isRequired : false,
                          }))}
                          className={fieldClass}
                          disabled={disabled || readOnly || column.isDefault}
                        />
                      </FieldRow>
                      <FieldRow label="Tipe data">
                        {column.isDefault || readOnly ? (
                          <div className={`flex items-center ${fieldClass}`}>
                            {getTypeLabel(column)}
                          </div>
                        ) : (
                          <Select
                            value={column.type}
                            onValueChange={(value) => updateColumn(column.id, (current) => ({
                              ...current,
                              type: value as DepartemenColumnType,
                              defaultValue: value === "date" ? "" : current.defaultValue,
                            }))}
                            disabled={disabled}
                          >
                            <SelectTrigger className={`${fieldClass} w-full`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Teks</SelectItem>
                              <SelectItem value="date">Tanggal</SelectItem>
                              <SelectItem value="number">Angka</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </FieldRow>
                      <FieldRow label="Isian awal" tip={<DepartemenFieldTip />}>
                        <Input
                          value={getDefaultValueLabel(column)}
                          onChange={(event) => updateColumn(column.id, (current) => ({
                            ...current,
                            defaultValue: event.target.value,
                          }))}
                          placeholder="Masukkan nilai"
                          className={fieldClass}
                          disabled={disabled || readOnly || column.isDefault || column.type === "date"}
                        />
                      </FieldRow>
                    </div>
                  )}
                </div>
              )
            })}

            {!readOnly && (
              <div className="flex justify-end">
                <Button type="button" onClick={addColumn} disabled={disabled} className="h-10 gap-2 rounded-full bg-blue-600 px-5 text-white hover:bg-blue-700">
                  Tambah
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={panelClass}>
        <SectionButton
          icon={<Eye size={21} />}
          title="Atur tampilan kolom"
          description="Pilih data kolom yang ingin ditampilkan"
          open={openDisplay}
          onClick={() => setOpenDisplay((current) => !current)}
        />

        {openDisplay && (
          <div className="px-4 pb-4 pt-2">
            <div className={`${innerPanelClass} space-y-4 px-4 py-4`}>
              {Array.from({ length: DISPLAY_SLOT_COUNT }).map((_, index) => {
                const fixedColumn = index === 0 ? fixedNomor : index === DISPLAY_SLOT_COUNT - 1 ? fixedTujuan : null
                const slotIndex = index - 1
                const selectedColumn = slotIndex >= 0 ? selectedMiddleColumns[slotIndex] : null
                const selectedElsewhere = selectedMiddleColumns
                  .filter((_, selectedIndex) => selectedIndex !== slotIndex)
                  .map((column) => column.id)

                return (
                  <div
                    key={index}
                    className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-4"
                  >
                    <span className="text-[15px] font-medium">Kolom {index + 1}</span>
                    {fixedColumn || readOnly ? (
                      <div className={`flex items-center ${fieldClass}`}>
                        {fixedColumn
                          ? `${getColumnLabel(fixedColumn)} (default)`
                          : getColumnLabel(selectedColumn) || "Tidak ada data"}
                      </div>
                    ) : (
                      <Select
                        value={selectedColumn?.id ?? "none"}
                        onValueChange={(value) => setDisplaySlot(slotIndex, value)}
                        disabled={disabled || selectableDisplayColumns.length === 0}
                      >
                        <SelectTrigger className={`${fieldClass} w-full`}>
                          <SelectValue placeholder="Pilih kolom" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Pilih kolom</SelectItem>
                          {selectableDisplayColumns
                            .filter((column) => column.id === selectedColumn?.id || !selectedElsewhere.includes(column.id))
                            .map((column) => (
                              <SelectItem key={column.id} value={column.id}>
                                {getColumnLabel(column) || "Kolom belum dinamai"}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className={panelClass}>
        <SectionButton
          icon={<Printer size={21} />}
          title="Identifikasi cetak"
          description="Tentukan identifikasi cetak untuk pengelompokan tab cetak"
          open={openPrintIdentity}
          onClick={() => setOpenPrintIdentity((current) => !current)}
        />

        {openPrintIdentity && (
          <div className="px-6 pb-5 pt-1">
            <div className={`${innerPanelClass} grid gap-4 px-4 py-4`}>
              <FieldRow label="Pilih">
                <div className={`flex items-center ${fieldClass}`}>
                  {form.printColumnMode === "existing" ? "Yang sudah ada" : "Buat baru"}
                </div>
              </FieldRow>

              <FieldRow label="Nama Identifikasi">
                <div className={`flex items-center ${fieldClass}`}>
                  {form.printColumnName || "Tidak ada data"}
                </div>
              </FieldRow>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FieldRow({ label, tip, children }: { label: string; tip?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <span className="flex items-center gap-2 text-[15px] font-medium">
        {label}
        {tip}
      </span>
      {children}
    </div>
  )
}
