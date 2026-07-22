import { ClipboardList } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { DepartemenColumn } from "@/types"
import { TYPE_LABEL, COLUMN_AUTO_FILL_LABEL, getColumnAutoFill } from "@/constants/departemen-columns"
import {
  innerPanelClass,
  panelClass,
} from "./styles/form"
import { getColumnLabel, getColumnTitle } from "./utils/kolom"

type DepartemenPreviewKolomPanelProps = {
  printSheetName: string
  columns: DepartemenColumn[]
}

function DetailBadge({ label, value }: { label: string; value: string }) {
  return (
    <Badge variant="outline" className="max-w-full gap-2 whitespace-normal text-left font-normal">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </Badge>
  )
}

export function DepartemenPreviewKolomPanel({
  printSheetName,
  columns,
}: DepartemenPreviewKolomPanelProps) {
  return (
    <div className={panelClass}>
      <div className="flex min-h-[84px] items-center gap-3 border-b bg-card px-5 py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
          <ClipboardList size={18} />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-medium leading-tight">
            Ringkasan struktur sumber
          </span>
          <span className="mt-1 block text-sm leading-snug text-muted-foreground">
            Rangkuman tipe data dan nilai awal dari kolom departemen sumber yang dipilih.
          </span>
        </span>
      </div>

      <div className="px-4 pb-4 pt-3">
        <div className={`${innerPanelClass} divide-y`}>
          {columns.length === 0 ? (
            <div className="px-4 py-5 text-sm text-muted-foreground">
              Belum ada kolom tambahan.
            </div>
          ) : (
            columns.map((column, index) => {
              const autoFill = getColumnAutoFill(column.defaultValue)
              const defaultValue = column.defaultValue?.trim()
              const inputValue = autoFill !== "none"
                ? COLUMN_AUTO_FILL_LABEL[autoFill]
                : defaultValue || "Tidak ada"

              return (
                <div key={column.id} className="flex items-start justify-between gap-4 px-4 py-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {getColumnLabel(column) || getColumnTitle(column, index)}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <DetailBadge label="Tipe Data" value={TYPE_LABEL[column.type]} />
                      <DetailBadge
                        label={autoFill !== "none" ? "Pengisian Otomatis" : "Isian Awal"}
                        value={inputValue}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        {columns.length > 0 ? (
          <div className="mt-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Nama Cetak</span>
            <span className="ml-3 font-medium">{printSheetName || "Tidak ada"}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
