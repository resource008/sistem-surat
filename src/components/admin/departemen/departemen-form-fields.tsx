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
import { DepartemenModeKolomField } from "./departemen-mode-kolom-field"
import { DepartemenTampilanKolomPanel } from "./departemen-tampilan-kolom-panel"
import { DepartemenTemplateKolomPanel } from "./departemen-template-kolom-panel"
import { useDepartemenKolomForm } from "./hooks/use-departemen-kolom-form"

interface Props {
  form: DepartemenFormState
  departments?: Departemen[]
  disabled?: boolean
  onChange: Dispatch<SetStateAction<DepartemenFormState>>
  showColumnMode?: boolean
  useLabelComponent?: boolean
}

export function DepartemenFormFields({
  form,
  departments = [],
  disabled,
  onChange,
  showColumnMode = false,
  useLabelComponent = true,
}: Props) {
  const [openAddColumns, setOpenAddColumns] = useState(true)
  const [openDisplayColumns, setOpenDisplayColumns] = useState(true)
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

  const toggleAddColumns = () => {
    const shouldCreateFirstColumn = !openAddColumns && customColumns.length === 0
    setOpenAddColumns((current) => !current)
    if (shouldCreateFirstColumn) addColumn()
  }

  const setColumnMode = (value: DepartemenFormState["columnMode"]) => {
    onChange((current) => ({
      ...current,
      columnMode: value,
      sourceDepartmentId: value === "existing" ? "" : current.sourceDepartmentId,
      printSheetName: value === "existing" ? "" : current.printSheetName,
    }))
  }

  const useExistingColumns = (departmentId: string) => {
    const source = departments.find((department) => department.id === departmentId)
    onChange((current) => ({
      ...current,
      columnMode: "existing",
      sourceDepartmentId: departmentId,
      printSheetName: source?.printSheetName || current.printSheetName,
      columns: source?.columns?.map((column, index) => ({
        ...column,
        id: column.isDefault ? column.id : `draft_copy_${index}_${column.id}`,
        sortOrder: index,
      })).sort((a, b) => a.sortOrder - b.sortOrder) ?? current.columns,
    }))
  }

  const setPrintSheetMode = (value: DepartemenFormState["printSheetMode"]) => {
    onChange((current) => ({
      ...current,
      printSheetMode: value,
      printSheetName: value === "existing" ? "" : current.printSheetName,
    }))
  }

  return (
    <div className="flex flex-col gap-7">
      <DepartemenIdentitasFields
        form={form}
        disabled={disabled}
        onChange={onChange}
        useLabelComponent={useLabelComponent}
        withPlaceholder
      />

      {showColumnMode && (
        <DepartemenModeKolomField
          value={form.columnMode}
          disabled={disabled}
          onChange={setColumnMode}
        />
      )}

      {form.columnMode === "existing" && (
        <>
          <DepartemenTemplateKolomPanel
            departments={departments}
            value={form.sourceDepartmentId}
            disabled={disabled}
            onChange={useExistingColumns}
          />

          <DepartemenIdentifikasiNamaLembarPanel
            value={form.printSheetName}
            mode={form.printSheetMode}
            departments={departments}
            disabled={disabled}
            readOnly
            placeholder="Pilih departemen dahulu"
            onModeChange={setPrintSheetMode}
            onChange={(value) => onChange((current) => ({ ...current, printSheetName: value }))}
          />
        </>
      )}

      {form.columnMode !== "existing" && (
        <>
          <DepartemenEditorKolomPanel
            orderedColumns={orderedColumns}
            customColumns={customColumns}
            open={openAddColumns}
            openColumnIds={openColumnIds}
            disabled={disabled}
            addButtonIcon
            columnNamePlaceholder="Masukkan nama departemen"
            typeSelectPlaceholder="Pilih tipe data"
            onToggle={toggleAddColumns}
            onToggleColumn={toggleColumn}
            onAddColumn={addColumn}
            onRemoveColumn={removeColumn}
            onMoveColumn={moveCustomColumn}
            onUpdateColumn={updateColumn}
          />

          <DepartemenTampilanKolomPanel
            open={openDisplayColumns}
            fixedNomor={fixedNomor}
            fixedTujuan={fixedTujuan}
            selectableDisplayColumns={selectableDisplayColumns}
            selectedMiddleColumns={selectedMiddleColumns}
            disabled={disabled}
            onToggle={() => setOpenDisplayColumns((current) => !current)}
            onDisplaySlotChange={setDisplaySlot}
          />

          <DepartemenIdentifikasiNamaLembarPanel
            value={form.printSheetName}
            mode={form.printSheetMode}
            departments={departments}
            disabled={disabled}
            placeholder="Masukkan nama"
            onModeChange={setPrintSheetMode}
            onChange={(value) => onChange((current) => ({ ...current, printSheetName: value }))}
          />
        </>
      )}
    </div>
  )
}
