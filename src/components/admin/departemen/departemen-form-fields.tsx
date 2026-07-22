"use client"

import type { Dispatch, SetStateAction } from "react"
import { useEffect, useState } from "react"
import type {
  Departemen,
  DepartemenFormState,
} from "@/types"
import { DEFAULT_DEPARTEMEN_COLUMNS } from "@/types"
import { DepartemenEditorKolomPanel } from "./departemen-editor-kolom-panel"
import { DepartemenIdentifikasiNamaLembarPanel } from "./departemen-identifikasi-nama-lembar-panel"
import { DepartemenIdentitasFields } from "./departemen-identitas-fields"
import { DepartemenModeKolomField } from "./departemen-mode-kolom-field"
import { DepartemenPreviewKolomPanel } from "./departemen-preview-kolom-panel"
import { DepartemenTampilanKolomPanel } from "./departemen-tampilan-kolom-panel"
import { DepartemenTemplateKolomPanel } from "./departemen-template-kolom-panel"
import { useDepartemenKolomForm } from "./hooks/use-departemen-kolom-form"

function getDefaultColumns() {
  return DEFAULT_DEPARTEMEN_COLUMNS.map((column) => ({ ...column }))
}

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
    selectableDisplayColumns,
    selectedMiddleColumns,
    updateColumn,
    addColumn,
    removeColumn,
    moveCustomColumn,
    reorderCustomColumns,
    setDisplaySlot,
    addDisplaySlot,
    removeDisplaySlot,
    reorderDisplayColumns,
    toggleColumn,
  } = useDepartemenKolomForm(form.columns, onChange)
  const hasSourceDepartments = departments.length > 0

  const toggleAddColumns = () => {
    setOpenAddColumns((current) => !current)
  }

  useEffect(() => {
    if (hasSourceDepartments || form.columnMode === "new") return

    onChange((current) => ({
      ...current,
      columnMode: "new",
      sourceDepartmentId: "",
      columns: getDefaultColumns(),
    }))
  }, [form.columnMode, hasSourceDepartments, onChange])

  const setColumnMode = (value: DepartemenFormState["columnMode"]) => {
    onChange((current) => ({
      ...current,
      columnMode: value,
      sourceDepartmentId: value === "new" ? "" : current.sourceDepartmentId,
      printSheetName: value === "new" ? current.printSheetName : "",
      columns: value === "new" ? getDefaultColumns() : [],
    }))
  }

  const selectSourceDepartment = (
    departmentId: string,
    mode: Extract<DepartemenFormState["columnMode"], "existing" | "modified">,
  ) => {
    const source = departments.find((department) => department.id === departmentId)
    onChange((current) => ({
      ...current,
      columnMode: mode,
      sourceDepartmentId: departmentId,
      printSheetName: source?.printSheetName || current.printSheetName,
      columns: source?.columns?.map((column, index) => ({
        ...column,
        id: `draft_copy_${index}_${column.id}`,
        sortOrder: index,
        displayOrder: column.displayOrder ?? index,
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
          hasSourceDepartments={hasSourceDepartments}
          onChange={setColumnMode}
        />
      )}

      {form.columnMode === "existing" && (
        <>
          <DepartemenTemplateKolomPanel
            departments={departments}
            value={form.sourceDepartmentId}
            disabled={disabled}
            onChange={(departmentId) => selectSourceDepartment(departmentId, "existing")}
          />

          {form.sourceDepartmentId && (
            <DepartemenPreviewKolomPanel
              printSheetName={form.printSheetName}
              columns={orderedColumns}
            />
          )}
        </>
      )}

      {form.columnMode === "modified" && (
        <>
          <DepartemenTemplateKolomPanel
            departments={departments}
            value={form.sourceDepartmentId}
            disabled={disabled}
            onChange={(departmentId) => selectSourceDepartment(departmentId, "modified")}
          />

          {form.sourceDepartmentId && (
            <>
              <DepartemenEditorKolomPanel
                orderedColumns={orderedColumns}
                customColumns={customColumns}
                open={openAddColumns}
                openColumnIds={openColumnIds}
                disabled={disabled}
                addButtonIcon
                title="Sesuaikan struktur sumber"
                description="Ubah kolom hasil salinan sebelum dipakai sebagai struktur surat departemen ini"
                columnNamePlaceholder="Masukkan nama departemen"
                typeSelectPlaceholder="Pilih tipe data"
                onToggle={toggleAddColumns}
                onToggleColumn={toggleColumn}
                onAddColumn={addColumn}
                onRemoveColumn={removeColumn}
                onMoveColumn={moveCustomColumn}
                onReorderColumn={reorderCustomColumns}
                onUpdateColumn={updateColumn}
              />

              <DepartemenTampilanKolomPanel
                open={openDisplayColumns}
                selectableDisplayColumns={selectableDisplayColumns}
                selectedMiddleColumns={selectedMiddleColumns}
                disabled={disabled}
                onToggle={() => setOpenDisplayColumns((current) => !current)}
                onDisplaySlotChange={setDisplaySlot}
                onDisplaySlotAdd={addDisplaySlot}
                onDisplaySlotRemove={removeDisplaySlot}
                onDisplaySlotReorder={reorderDisplayColumns}
              />

              <DepartemenIdentifikasiNamaLembarPanel
                value={form.printSheetName}
                mode={form.printSheetMode}
                departments={departments}
                disabled={disabled}
                showMode={false}
                placeholder="Masukkan nama"
                onModeChange={setPrintSheetMode}
                onChange={(value) => onChange((current) => ({ ...current, printSheetName: value }))}
              />
            </>
          )}
        </>
      )}

      {form.columnMode === "new" && (
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
            onReorderColumn={reorderCustomColumns}
            onUpdateColumn={updateColumn}
          />

          <DepartemenTampilanKolomPanel
            open={openDisplayColumns}
            selectableDisplayColumns={selectableDisplayColumns}
            selectedMiddleColumns={selectedMiddleColumns}
            disabled={disabled}
            onToggle={() => setOpenDisplayColumns((current) => !current)}
            onDisplaySlotChange={setDisplaySlot}
            onDisplaySlotAdd={addDisplaySlot}
            onDisplaySlotRemove={removeDisplaySlot}
            onDisplaySlotReorder={reorderDisplayColumns}
          />

          <DepartemenIdentifikasiNamaLembarPanel
            value={form.printSheetName}
            mode={form.printSheetMode}
            departments={departments}
            disabled={disabled}
            showMode={false}
            placeholder="Masukkan nama"
            onModeChange={setPrintSheetMode}
            onChange={(value) => onChange((current) => ({ ...current, printSheetName: value }))}
          />
        </>
      )}
    </div>
  )
}
