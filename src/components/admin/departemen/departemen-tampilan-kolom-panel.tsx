import { Menu, Table2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PragmaticSortableItem } from "@/components/shared/pragmatic-sortable-item"
import { DISPLAY_SLOT_COUNT } from "@/constants/departemen-columns"
import type { DepartemenColumn } from "@/types"
import {
  fieldClass,
  innerPanelClass,
  panelClass,
  readonlyFieldClass,
} from "./styles/form"
import { getColumnLabel } from "./utils/kolom"
import { DepartemenSectionToggle } from "./departemen-section-toggle"

type DepartemenTampilanKolomPanelProps = {
  open: boolean
  selectableDisplayColumns: DepartemenColumn[]
  selectedMiddleColumns: DepartemenColumn[]
  disabled?: boolean
  readOnly?: boolean
  onToggle: () => void
  onDisplaySlotChange: (slotIndex: number, columnId: string) => void
  onDisplaySlotAdd: () => void
  onDisplaySlotRemove: (slotIndex: number) => void
  onDisplaySlotReorder: (startIndex: number, finishIndex: number) => void
}

export function DepartemenTampilanKolomPanel({
  open,
  selectableDisplayColumns,
  selectedMiddleColumns,
  disabled,
  readOnly = false,
  onToggle,
  onDisplaySlotChange,
  onDisplaySlotAdd,
  onDisplaySlotRemove,
  onDisplaySlotReorder,
}: DepartemenTampilanKolomPanelProps) {
  const hasDisplayColumnOptions = selectableDisplayColumns.length > 0
  const canAddDisplayColumn =
    !readOnly
    && selectedMiddleColumns.length < DISPLAY_SLOT_COUNT
    && selectedMiddleColumns.length < selectableDisplayColumns.length

  return (
    <div className={panelClass}>
      <DepartemenSectionToggle
        icon={<Table2 size={21} />}
        title="Kolom tabel data surat"
        description="Pilih kolom tambahan yang ditampilkan sebagai kolom pada tabel data surat"
        open={open}
        onClick={onToggle}
      />

      {open && (
        <div className="space-y-3 px-4 pb-4 pt-3">
          <div className={`${innerPanelClass} space-y-3 px-4 py-3`}>
            {selectedMiddleColumns.length === 0 && (
              <div className="rounded-xl border border-dashed border-border/70 px-4 py-5 text-sm text-muted-foreground">
                {hasDisplayColumnOptions
                  ? "Belum ada kolom tampilan. Klik Tambah untuk memilih kolom."
                  : "Belum ada kolom tambahan. Tambahkan kolom terlebih dahulu."}
              </div>
            )}

            {selectedMiddleColumns.map((selectedColumn, index) => {
              const selectedElsewhere = selectedMiddleColumns
                .filter((_, selectedIndex) => selectedIndex !== index)
                .map((column) => column.id)

              return (
                <PragmaticSortableItem
                  key={selectedColumn.id}
                  id={selectedColumn.id}
                  index={index}
                  type="department-display-column"
                  disabled={disabled || readOnly}
                  dragSurfaceOnly
                  onReorder={onDisplaySlotReorder}
                >
                <div
                  className="grid min-h-12 gap-2 rounded-lg lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:items-center lg:gap-3"
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium">
                    {!readOnly && (
                      <Menu
                        data-drag-surface="true"
                        aria-hidden="true"
                        className="size-4 cursor-grab text-muted-foreground active:cursor-grabbing"
                      />
                    )}
                    Kolom {index + 1}
                  </span>
                  {readOnly ? (
                    <div className={`flex !h-9 items-center ${readonlyFieldClass}`}>
                      {getColumnLabel(selectedColumn) || "Tidak ada data"}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedColumn.id}
                        onValueChange={(value) => onDisplaySlotChange(index, value)}
                        disabled={disabled || selectableDisplayColumns.length === 0}
                      >
                        <SelectTrigger data-no-drag="true" className={`${fieldClass} !h-9 w-full`}>
                          <SelectValue placeholder="Pilih kolom" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectableDisplayColumns
                            .filter((column) => column.id === selectedColumn.id || !selectedElsewhere.includes(column.id))
                            .map((column) => (
                              <SelectItem key={column.id} value={column.id}>
                                {getColumnLabel(column) || "Kolom belum dinamai"}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="action-danger-soft"
                        size="icon-sm"
                        className="size-9 shrink-0"
                        aria-label={`Hapus tampilan kolom ${index + 1}`}
                        disabled={disabled}
                        data-no-drag="true"
                        onClick={() => onDisplaySlotRemove(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
                </PragmaticSortableItem>
              )
            })}
          </div>

          {!readOnly && hasDisplayColumnOptions && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="fab-action"
                disabled={disabled || !canAddDisplayColumn}
                onClick={onDisplaySlotAdd}
              >
                <Plus size={15} /> Tambah
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
