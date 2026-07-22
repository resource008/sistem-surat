import { Copy } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Departemen } from "@/types"
import { fieldClass } from "./styles/form"

type DepartemenTemplateKolomPanelProps = {
  departments: Departemen[]
  value: string
  disabled?: boolean
  onChange: (departmentId: string) => void
}

export function DepartemenTemplateKolomPanel({
  departments,
  value,
  disabled,
  onChange,
}: DepartemenTemplateKolomPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Copy className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <CardTitle>Pilih departemen sumber</CardTitle>
            <CardDescription className="mt-1">
              Ambil struktur kolom dari departemen lain sebagai acuan pengaturan departemen ini.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(320px,450px)] lg:items-center">
          <Label className="text-sm font-medium">Departemen sumber</Label>
          <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled || departments.length === 0}
          >
            <SelectTrigger className={`${fieldClass} h-11 w-full`}>
              <SelectValue
                placeholder={departments.length === 0
                  ? "Belum ada departemen"
                  : "Pilih departemen"}
              />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.shortName} - {department.tujuan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
