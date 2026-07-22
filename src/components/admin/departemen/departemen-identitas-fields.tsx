import type { Dispatch, ElementType, SetStateAction } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DepartemenFormState } from "@/types"
import { fieldClass, readonlyFieldClass } from "./styles/form"

type DepartemenIdentitasFieldsProps = {
  form: DepartemenFormState
  disabled?: boolean
  readOnly?: boolean
  onChange: Dispatch<SetStateAction<DepartemenFormState>>
  useLabelComponent?: boolean
  withPlaceholder?: boolean
}

export function DepartemenIdentitasFields({
  form,
  disabled,
  readOnly = false,
  onChange,
  useLabelComponent = true,
  withPlaceholder = false,
}: DepartemenIdentitasFieldsProps) {
  const LabelTag: ElementType = useLabelComponent ? Label : "label"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identitas departemen</CardTitle>
        <CardDescription>
          Nama dan singkatan departemen yang dipakai saat registrasi, pencarian, dan penomoran surat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          <LabelTag className="grid gap-2 text-sm font-medium">
            <span>Nama Departemen</span>
            {readOnly ? (
              <div className={`flex items-center ${readonlyFieldClass}`}>
                {form.tujuan || "Tidak ada data"}
              </div>
            ) : (
              <Input
                value={form.tujuan}
                onChange={(event) => onChange((current) => ({ ...current, tujuan: event.target.value }))}
                placeholder={withPlaceholder ? "Masukkan nama departemen" : undefined}
                className={fieldClass}
                disabled={disabled}
              />
            )}
          </LabelTag>
          <LabelTag className="grid gap-2 text-sm font-medium">
            <span>Singkatan</span>
            {readOnly ? (
              <div className={`flex items-center ${readonlyFieldClass}`}>
                {form.shortName || "Tidak ada data"}
              </div>
            ) : (
              <Input
                value={form.shortName}
                onChange={(event) => onChange((current) => ({ ...current, shortName: event.target.value }))}
                placeholder={withPlaceholder ? "Masukkan singkatan" : undefined}
                className={fieldClass}
                disabled={disabled}
              />
            )}
          </LabelTag>
        </div>
      </CardContent>
    </Card>
  )
}
