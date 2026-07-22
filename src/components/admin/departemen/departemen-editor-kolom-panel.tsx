"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { ChevronDown, Columns3, Menu, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PragmaticSortableItem } from "@/components/shared/pragmatic-sortable-item"
import {
  COLUMN_AUTO_FILL_LABEL,
  COLUMN_AUTO_FILL_TOKENS,
  type ColumnAutoFill,
  getColumnAutoFill,
} from "@/constants/departemen-columns"
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
  getColumnTitle,
  getDefaultValueLabel,
  getTypeLabel,
} from "./utils/kolom"
import { DepartemenFormFieldRow } from "./departemen-form-field-row"
import { DepartemenSectionToggle } from "./departemen-section-toggle"
import { cn } from "@/lib/utils"

type DepartemenEditorKolomPanelProps = {
  orderedColumns: DepartemenColumn[]
  customColumns: DepartemenColumn[]
  open: boolean
  openColumnIds: Set<string>
  disabled?: boolean
  readOnly?: boolean
  addButtonIcon?: boolean
  title?: string
  description?: string
  columnNamePlaceholder?: string
  typeSelectPlaceholder?: string
  onToggle: () => void
  onToggleColumn: (columnId: string) => void
  onAddColumn: () => void
  onRemoveColumn: (columnId: string) => void
  onMoveColumn: (columnId: string, direction: -1 | 1) => void
  onReorderColumn: (startIndex: number, finishIndex: number) => void
  onUpdateColumn: (
    columnId: string,
    updater: (column: DepartemenColumn) => DepartemenColumn,
  ) => void
}

type ColumnDropZoneProps = {
  type: string
  targetIndex: number
  disabled?: boolean
  className?: string
  children: ReactNode
  onReorder: (startIndex: number, finishIndex: number) => void
}

function isOverSortableItem(input: { clientX: number; clientY: number }) {
  const target = document.elementFromPoint(input.clientX, input.clientY)
  return Boolean(target?.closest("[data-pragmatic-sortable-item='true']"))
}

function ColumnDropZone({
  type,
  targetIndex,
  disabled,
  className,
  children,
  onReorder,
}: ColumnDropZoneProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isOver, setIsOver] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    return dropTargetForElements({
      element,
      canDrop: ({ source, input }) =>
        !disabled
        && source.data.type === type
        && !isOverSortableItem(input),
      getData: () => ({ index: targetIndex, type }),
      getIsSticky: () => true,
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: ({ source, self }) => {
        setIsOver(false)
        const startIndex = Number(source.data.index)
        const finishIndex = Number(self.data.index)

        if (
          Number.isNaN(startIndex)
          || Number.isNaN(finishIndex)
          || startIndex === finishIndex
        ) {
          return
        }

        onReorder(startIndex, finishIndex)
      },
    })
  }, [disabled, onReorder, targetIndex, type])

  return (
    <div
      ref={ref}
      className={cn(
        "min-h-40 rounded-xl transition-colors",
        isOver && "bg-primary/5 ring-2 ring-ring/40",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DepartemenEditorKolomPanel({
  orderedColumns,
  customColumns,
  open,
  openColumnIds,
  disabled,
  readOnly = false,
  addButtonIcon = false,
  title = "Struktur kolom surat",
  description = "Atur kolom khusus yang akan diisi saat surat didaftarkan untuk departemen ini",
  columnNamePlaceholder,
  typeSelectPlaceholder,
  onToggle,
  onToggleColumn,
  onAddColumn,
  onRemoveColumn,
  onReorderColumn,
  onUpdateColumn,
}: DepartemenEditorKolomPanelProps) {
  const autoFillOptions: ColumnAutoFill[] = ["none", "sequence", "currentDate", "department"]

  function getAutoFillType(value: ColumnAutoFill): DepartemenColumnType {
    if (value === "sequence") return "number"
    if (value === "currentDate") return "date"
    return "text"
  }

  function getAutoFillDefaultValue(value: ColumnAutoFill) {
    if (value === "none") return ""
    return COLUMN_AUTO_FILL_TOKENS[value]
  }

  const columnGroups = [
    {
      label: "Data utama",
      description: "Kolom di sisi kiri form data surat.",
      columns: orderedColumns.filter((_, index) => index % 2 === 0),
      targetIndex: 0,
    },
    {
      label: "Data tambahan",
      description: "Kolom di sisi kanan dan bisa ditambah sebagai data berulang.",
      columns: orderedColumns.filter((_, index) => index % 2 === 1),
      targetIndex: Math.min(1, Math.max(customColumns.length - 1, 0)),
    },
  ]

  return (
    <div className={panelClass}>
      <DepartemenSectionToggle
        icon={<Columns3 size={21} />}
        title={title}
        description={description}
        open={open}
        onClick={onToggle}
      />

      {open && (
        <div className="space-y-4 px-4 pb-4 pt-3">
          {orderedColumns.length === 0 && (
            <div className={`${innerPanelClass} px-4 py-5 text-sm text-muted-foreground`}>
              {readOnly
                ? "Belum ada kolom tambahan."
                : "Belum ada kolom tambahan. Klik Tambah untuk membuat kolom baru."}
            </div>
          )}

          {orderedColumns.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {columnGroups.map((group) => (
                <div key={group.label} className="grid content-start gap-4">
                  <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{group.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{group.description}</p>
                  </div>
                  <ColumnDropZone
                    type="departemen-column"
                    targetIndex={group.targetIndex}
                    disabled
                    className="grid content-start gap-4"
                    onReorder={onReorderColumn}
                  >
                    {group.columns.map((column) => {
                const label = getColumnLabel(column)
                const customIndex = customColumns.findIndex((item) => item.id === column.id)
                const isColumnOpen = openColumnIds.has(column.id)
                const columnTitle = getColumnTitle(column, customIndex)
                const autoFill = getColumnAutoFill(column.defaultValue)

                const content = (
                  <div className={`${innerPanelClass} px-4 py-4`}>
                    <div
                      role="button"
                      tabIndex={0}
                      className="flex items-center justify-between gap-4 outline-none"
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
                        {!readOnly && (
                          <Menu
                            data-drag-surface="true"
                            aria-hidden="true"
                            className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                          />
                        )}
                        <span className="truncate text-sm font-medium">
                          {columnTitle}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div
                          data-no-drag="true"
                          className="flex shrink-0 items-center gap-3 text-sm font-medium"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {autoFill === "none" ? (
                            <>
                              <span className="text-muted-foreground">Wajib diisi</span>
                              <Checkbox
                                className="size-5 disabled:opacity-100"
                                checked={column.isRequired}
                                disabled={disabled || readOnly}
                                onCheckedChange={(value) => onUpdateColumn(column.id, (current) => ({
                                  ...current,
                                  isRequired: value === true,
                                }))}
                              />
                            </>
                          ) : null}
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
                      <div data-no-drag="true" className="mt-5 grid gap-5">
                        <DepartemenFormFieldRow label="Nama kolom">
                          <Input
                            value={label}
                            onChange={(event) => onUpdateColumn(column.id, (current) => ({
                              ...current,
                              label: event.target.value,
                            }))}
                            placeholder={columnNamePlaceholder}
                            className={fieldClass}
                            disabled={disabled || readOnly}
                          />
                        </DepartemenFormFieldRow>
                        {autoFill === "none" ? (
                          <DepartemenFormFieldRow label="Tipe data">
                            {readOnly ? (
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
                        ) : null}
                        <DepartemenFormFieldRow label="Pengisian otomatis">
                          {readOnly ? (
                            <div className={`flex items-center ${readonlyFieldClass}`}>
                              {COLUMN_AUTO_FILL_LABEL[autoFill]}
                            </div>
                          ) : (
                            <Select
                              value={autoFill}
                              onValueChange={(value) => onUpdateColumn(column.id, (current) => {
                                const nextAutoFill = value as ColumnAutoFill

                                return {
                                  ...current,
                                  type: nextAutoFill === "none" ? current.type : getAutoFillType(nextAutoFill),
                                  defaultValue: getAutoFillDefaultValue(nextAutoFill),
                                  isRequired: nextAutoFill === "none" ? current.isRequired : false,
                                }
                              })}
                              disabled={disabled}
                            >
                              <SelectTrigger className={`${fieldClass} w-full`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {autoFillOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {COLUMN_AUTO_FILL_LABEL[option]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </DepartemenFormFieldRow>
                        {autoFill === "none" ? (
                          <DepartemenFormFieldRow label="Isian awal" tip={<DepartemenFieldTip />}>
                            <Input
                              value={getDefaultValueLabel(column)}
                              onChange={(event) => onUpdateColumn(column.id, (current) => ({
                                ...current,
                                defaultValue: event.target.value,
                              }))}
                              placeholder="Masukkan nilai"
                              className={fieldClass}
                              disabled={disabled || readOnly || column.type === "date"}
                            />
                          </DepartemenFormFieldRow>
                        ) : null}
                      </div>
                    )}
                  </div>
                )

                if (readOnly) {
                  return <div key={column.id}>{content}</div>
                }

                return (
                  <PragmaticSortableItem
                    key={column.id}
                    id={column.id}
                    index={customIndex}
                    type="departemen-column"
                    disabled={disabled || customIndex < 0}
                    dragSurfaceOnly
                    className="rounded-xl"
                    onReorder={onReorderColumn}
                  >
                    <div
                      title="Tarik untuk atur tempat"
                    >
                      {content}
                    </div>
                  </PragmaticSortableItem>
                )
                    })}
                  </ColumnDropZone>
                </div>
              ))}
            </div>
          )}

          {!readOnly && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="fab-action"
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
