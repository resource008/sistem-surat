"use client"

import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import type {
  Departemen,
  DepartemenFormState,
} from "@/types"
import { DepartemenEditorKolomPanel } from "./departemen-editor-kolom-panel"
import { DepartemenIdentifikasiNamaLembarPanel } from "./departemen-identifikasi-nama-lembar-panel"
import { DepartemenIdentitasFields } from "./departemen-identitas-fields"
import { DepartemenTampilanKolomPanel } from "./departemen-tampilan-kolom-panel"
import { useDepartemenKolomForm } from "./use-departemen-kolom-form"

interface Props {
  form: DepartemenFormState
  departments?: Departemen[]
  disabled?: boolean
  readOnly?: boolean
  onChange: Dispatch<SetStateAction<DepartemenFormState>>
}

export function DepartemenEditFormFields({
  form,
  disabled,
  readOnly = false,
  onChange,
}: Props) {
  const [openData, setOpenData] = useState(true)
  const [openDisplay, setOpenDisplay] = useState(true)
  const {
    orderedColumns,
    customColumns,
    openColumnIds,
    fixedNomor,
    fixedTujuan,
    selectableDisplayColumns,
    selectedMiddleColumns,
    updateColumn,
    addColumn,
    removeColumn,
    moveCustomColumn,
    setDisplaySlot,
    toggleColumn,
  } = useDepartemenKolomForm(form.columns, onChange)

  return (
    <div className="flex flex-col gap-4">
      <DepartemenIdentitasFields
        form={form}
        disabled={disabled || readOnly}
        onChange={onChange}
      />

      <DepartemenEditorKolomPanel
        orderedColumns={orderedColumns}
        customColumns={customColumns}
        open={openData}
        openColumnIds={openColumnIds}
        disabled={disabled}
        readOnly={readOnly}
        onToggle={() => setOpenData((current) => !current)}
        onToggleColumn={toggleColumn}
        onAddColumn={addColumn}
        onRemoveColumn={removeColumn}
        onMoveColumn={moveCustomColumn}
        onUpdateColumn={updateColumn}
      />

      <DepartemenTampilanKolomPanel
        open={openDisplay}
        fixedNomor={fixedNomor}
        fixedTujuan={fixedTujuan}
        selectableDisplayColumns={selectableDisplayColumns}
        selectedMiddleColumns={selectedMiddleColumns}
        disabled={disabled}
        readOnly={readOnly}
        onToggle={() => setOpenDisplay((current) => !current)}
        onDisplaySlotChange={setDisplaySlot}
      />

      <DepartemenIdentifikasiNamaLembarPanel
        value={form.printSheetName}
        mode={form.printSheetMode}
        departments={[]}
        summary={readOnly}
        showMode={false}
        disabled={disabled}
        placeholder="Tidak ada data"
        onChange={(value) => onChange((current) => ({ ...current, printSheetName: value }))}
      />
    </div>
  )
}
