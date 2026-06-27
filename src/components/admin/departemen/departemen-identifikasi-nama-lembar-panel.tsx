import { useState } from "react"
import { Printer } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Departemen, DepartemenFormState } from "@/types"
import {
  fieldClass,
  innerPanelClass,
  panelClass,
  readonlyFieldClass,
} from "./departemen-form-config"
import { DepartemenFormFieldRow } from "./departemen-form-field-row"
import { DepartemenSectionToggle } from "./departemen-section-toggle"

type DepartemenIdentifikasiNamaLembarPanelProps = {
  value: string
  mode: DepartemenFormState["printSheetMode"]
  departments: Departemen[]
  disabled?: boolean
  readOnly?: boolean
  summary?: boolean
  showMode?: boolean
  placeholder: string
  onModeChange?: (value: DepartemenFormState["printSheetMode"]) => void
  onChange?: (value: string) => void
}

export function DepartemenIdentifikasiNamaLembarPanel({
  value,
  mode,
  departments,
  disabled,
  readOnly,
  summary,
  showMode = true,
  placeholder,
  onModeChange,
  onChange,
}: DepartemenIdentifikasiNamaLembarPanelProps) {
  const [openPrintIdentity, setOpenPrintIdentity] = useState(true)
  const existingIdentities = Array.from(
    new Set(departments.map((department) => department.printSheetName?.trim()).filter(Boolean))
  ) as string[]

  return (
    <div className={panelClass}>
      <DepartemenSectionToggle
        icon={<Printer size={21} />}
        title="Identifikasi nama lembar"
        description="Tentukan nama lembar untuk pengelompokan halaman cetak"
        open={openPrintIdentity}
        onClick={() => setOpenPrintIdentity((current) => !current)}
      />

      {openPrintIdentity && (
        <div className="px-4 pb-4 pt-3">
          <div className={`${innerPanelClass} grid gap-4 px-4 py-3`}>
            {summary ? (
              <>
                {showMode && (
                  <DepartemenFormFieldRow label="Pilih">
                    <div className={`flex items-center ${readonlyFieldClass}`}>
                      {mode === "existing" ? "Yang sudah ada" : "Buat baru"}
                    </div>
                  </DepartemenFormFieldRow>
                )}
                <DepartemenFormFieldRow label="Nama lembar">
                  <div className={`flex items-center ${readonlyFieldClass}`}>
                    {value || "Tidak ada data"}
                  </div>
                </DepartemenFormFieldRow>
              </>
            ) : readOnly ? (
              <DepartemenFormFieldRow label="Otomatis">
                <div className={`flex items-center ${readonlyFieldClass}`}>
                  {value || placeholder}
                </div>
              </DepartemenFormFieldRow>
            ) : !showMode ? (
              <DepartemenFormFieldRow label="Nama lembar">
                <Input
                  value={value}
                  onChange={(event) => onChange?.(event.target.value)}
                  placeholder={placeholder}
                  className={fieldClass}
                  disabled={disabled}
                />
              </DepartemenFormFieldRow>
            ) : (
              <>
                <DepartemenFormFieldRow label="Jenis nama lembar">
                  <Select
                    value={mode}
                    onValueChange={(value) => {
                      onModeChange?.(value as DepartemenFormState["printSheetMode"])
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger className={`${fieldClass} w-full`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Buat baru</SelectItem>
                      <SelectItem value="existing">Yang sudah ada</SelectItem>
                    </SelectContent>
                  </Select>
                </DepartemenFormFieldRow>

                <DepartemenFormFieldRow label="Nama lembar">
                  {mode === "existing" ? (
                    <Select
                      value={value}
                      onValueChange={(value) => onChange?.(value)}
                      disabled={disabled || existingIdentities.length === 0}
                    >
                      <SelectTrigger className={`${fieldClass} w-full`}>
                        <SelectValue placeholder="Pilih nama lembar" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingIdentities.map((identity) => (
                          <SelectItem key={identity} value={identity}>
                            {identity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={value}
                      onChange={(event) => onChange?.(event.target.value)}
                      placeholder={placeholder}
                      className={fieldClass}
                      disabled={disabled}
                    />
                  )}
                </DepartemenFormFieldRow>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
