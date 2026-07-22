import { Columns3 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DepartemenFormState } from "@/types"

type DepartemenModeKolomFieldProps = {
  value: DepartemenFormState["columnMode"]
  disabled?: boolean
  hasSourceDepartments?: boolean
  onChange: (value: DepartemenFormState["columnMode"]) => void
}

export function DepartemenModeKolomField({
  value,
  disabled,
  hasSourceDepartments = true,
  onChange,
}: DepartemenModeKolomFieldProps) {
  const options: Array<{
    value: DepartemenFormState["columnMode"]
    label: string
    description: string
    disabled?: boolean
  }> = [
    {
      value: "new",
      label: "Buat baru",
      description: "Buat struktur kolom dari awal khusus untuk departemen ini.",
    },
    {
      value: "existing",
      label: "Gunakan yang sudah ada",
      description: "Gunakan struktur kolom departemen sumber tanpa perubahan.",
      disabled: !hasSourceDepartments,
    },
    {
      value: "modified",
      label: "Modifikasi yang sudah ada",
      description: "Salin struktur kolom departemen sumber lalu ubah sesuai kebutuhan.",
      disabled: !hasSourceDepartments,
    },
  ]

  return (
    <Card className="gap-3 py-3">
      <CardHeader className="px-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
            <Columns3 className="size-4" />
          </span>
          <div className="min-w-0">
            <CardTitle>Cara membuat struktur kolom</CardTitle>
            <CardDescription className="mt-1">
              Pilih apakah departemen memakai struktur kolom baru, menyalin dari sumber, atau menyesuaikan salinan.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <fieldset className="grid gap-3" disabled={disabled}>
          <legend className="sr-only">Pilihan konfigurasi kolom</legend>
          {options.map((option) => {
            const checked = value === option.value
            const optionDisabled = disabled || option.disabled

            return (
              <label
                key={option.value}
                className={[
                  "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
                  checked
                    ? "border-primary bg-muted/60"
                    : "border-border/60 bg-background hover:bg-muted/30",
                  optionDisabled ? "cursor-not-allowed opacity-60 hover:bg-background" : "",
                ].join(" ")}
                title={option.disabled ? "Belum ada departemen sumber yang bisa digunakan" : undefined}
              >
                <input
                  type="radio"
                  name="department-column-mode"
                  value={option.value}
                  checked={checked}
                  disabled={optionDisabled}
                  onChange={() => {
                    if (option.disabled) return
                    onChange(option.value)
                  }}
                  className="mt-1 size-4 accent-primary"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{option.label}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </label>
            )
          })}
        </fieldset>
      </CardContent>
    </Card>
  )
}
