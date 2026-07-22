import { useEffect, useState } from "react"
import { Printer } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Departemen, DepartemenFormState } from "@/types"
import {
  fieldClass,
  innerPanelClass,
  panelClass,
  readonlyFieldClass,
} from "./styles/form"
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
  const hasExistingIdentities = existingIdentities.length > 0

  useEffect(() => {
    if (mode !== "existing" || hasExistingIdentities) return
    onModeChange?.("new")
    onChange?.("")
  }, [hasExistingIdentities, mode, onChange, onModeChange])

  return (
    <div className={panelClass}>
      <DepartemenSectionToggle
        icon={<Printer size={21} />}
        title="Nama cetak"
        description="Tentukan nama lembar pengelompokan saat data surat dicetak atau diekspor"
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
                  <fieldset
                    className="grid gap-2 sm:grid-cols-2"
                    disabled={disabled}
                  >
                    <legend className="sr-only">Jenis nama lembar</legend>
                    {[
                      { value: "existing", label: "Yang sudah ada", disabled: !hasExistingIdentities },
                      { value: "new", label: "Buat baru", disabled: false },
                    ].map((option) => {
                      const checked = mode === option.value
                      const optionDisabled = disabled || option.disabled

                      return (
                        <label
                          key={option.value}
                          className={[
                            "flex h-10 cursor-pointer items-center gap-3 rounded-lg border px-3 text-sm font-medium transition-colors",
                            checked
                              ? "border-primary bg-muted/60 text-foreground"
                              : "border-border/70 bg-background text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                            optionDisabled ? "cursor-not-allowed opacity-60 hover:bg-background hover:text-muted-foreground" : "",
                          ].join(" ")}
                          title={option.disabled ? "Belum ada nama lembar yang bisa dipilih" : undefined}
                        >
                          <input
                            type="radio"
                            name="print-sheet-mode"
                            value={option.value}
                            checked={checked}
                            disabled={optionDisabled}
                            onChange={() => {
                              if (option.disabled) return
                              onModeChange?.(option.value as DepartemenFormState["printSheetMode"])
                              onChange?.("")
                            }}
                            className="size-4 accent-primary"
                          />
                          <span>{option.label}</span>
                        </label>
                      )
                    })}
                  </fieldset>
                </DepartemenFormFieldRow>

                <DepartemenFormFieldRow label="Nama lembar">
                  {mode === "existing" ? (
                    <Select
                      value={value}
                      onValueChange={(value) => onChange?.(value)}
                      disabled={disabled || !hasExistingIdentities}
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
