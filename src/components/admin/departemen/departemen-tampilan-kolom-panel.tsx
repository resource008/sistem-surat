import { Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DepartemenColumn } from "@/types"
import {
  DISPLAY_SLOT_COUNT,
  fieldClass,
  innerPanelClass,
  panelClass,
} from "./departemen-form-config"
import { getColumnLabel } from "./departemen-kolom-utils"
import { DepartemenSectionToggle } from "./departemen-section-toggle"

type DepartemenTampilanKolomPanelProps = {
  open: boolean
  fixedNomor?: DepartemenColumn
  fixedTujuan?: DepartemenColumn
  selectableDisplayColumns: DepartemenColumn[]
  selectedMiddleColumns: DepartemenColumn[]
  disabled?: boolean
  readOnly?: boolean
  onToggle: () => void
  onDisplaySlotChange: (slotIndex: number, columnId: string) => void
}

export function DepartemenTampilanKolomPanel({
  open,
  fixedNomor,
  fixedTujuan,
  selectableDisplayColumns,
  selectedMiddleColumns,
  disabled,
  readOnly = false,
  onToggle,
  onDisplaySlotChange,
}: DepartemenTampilanKolomPanelProps) {
  return (
    <div className={panelClass}>
      <DepartemenSectionToggle
        icon={<Eye size={21} />}
        title="Atur tampilan kolom"
        description="Pilih data kolom yang ingin ditampilkan"
        open={open}
        onClick={onToggle}
      />

      {open && (
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
                      onValueChange={(value) => onDisplaySlotChange(slotIndex, value)}
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
  )
}
