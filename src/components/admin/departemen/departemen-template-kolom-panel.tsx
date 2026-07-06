import { List } from "lucide-react"
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
        <div className="flex items-center gap-2">
          <List className="size-4 text-muted-foreground" />
          <CardTitle>Pilih departemen</CardTitle>
        </div>
        <CardDescription>
          Gunakan susunan kolom dari departemen yang sudah ada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:items-center">
          <Label className="text-sm font-medium">Departemen sumber</Label>
          <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled || departments.length === 0}
          >
            <SelectTrigger className={`${fieldClass} w-full`}>
              <SelectValue placeholder="Pilih departemen" />
            </SelectTrigger>
            <SelectContent>
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
