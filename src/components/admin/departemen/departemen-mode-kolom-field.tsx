import { Columns3 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DepartemenFormState } from "@/types"
import { fieldClass } from "./departemen-form-config"

type DepartemenModeKolomFieldProps = {
  value: DepartemenFormState["columnMode"]
  disabled?: boolean
  onChange: (value: DepartemenFormState["columnMode"]) => void
}

export function DepartemenModeKolomField({
  value,
  disabled,
  onChange,
}: DepartemenModeKolomFieldProps) {
  return (
    <Card className="gap-3 py-3">
      <CardHeader className="px-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
            <Columns3 className="size-4" />
          </span>
          <div className="min-w-0">
            <CardTitle>Tipe kolom</CardTitle>
            <CardDescription className="mt-1">
              Buat susunan kolom baru atau gunakan konfigurasi dari departemen lain.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:items-center">
          <span className="text-sm font-medium">Pilihan konfigurasi</span>
          <Select
            value={value}
            onValueChange={(value) => onChange(value as DepartemenFormState["columnMode"])}
            disabled={disabled}
          >
            <SelectTrigger className={`${fieldClass} w-full`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Buat baru</SelectItem>
              <SelectItem value="existing">Gunakan yang sudah ada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
