import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSuratBuiltInColumnKey, isAutoFilledSuratColumn } from "@/domain/surat/custom-fields"
import { cn } from "@/lib/utils"
import { CustomFieldsForm, CustomFieldsView, getCustomSuratColumns } from "../custom-fields"

function EmptyPanel({ title }: { title: string }) {
  return (
    <div className="min-h-24 rounded-2xl border border-dashed border-border/60 bg-background p-3">
      <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">Belum ada kolom di sisi ini.</p>
      </div>
    </div>
  )
}

function getDetailFieldValues(columns: any[], detail: any) {
  const customFields = detail.customFields ?? {}
  const customColumns = getCustomSuratColumns(columns, true)
  const baseCustomValues = Object.entries(customFields)
    .filter(([key, value]) => !/_group_\d+$/.test(key) && String(value ?? "").trim())
    .map(([, value]) => String(value))
  const groupedCustomValues = Object.entries(customFields).reduce<Record<string, string[]>>((acc, [key, value]) => {
    const match = key.match(/_group_(\d+)$/)
    if (!match || !String(value ?? "").trim()) return acc

    acc[match[1]] ??= []
    acc[match[1]].push(String(value))
    return acc
  }, {})
  const values: Record<string, string> = {
    ...customFields,
  }

  customColumns.forEach((column) => {
    if (values[column.id]?.trim()) return

    const labelValue = values[column.label]
    if (labelValue?.trim()) values[column.id] = labelValue
  })

  customColumns.filter((column) => !isAutoFilledSuratColumn(column)).forEach((column, index) => {
    if (values[column.id]?.trim()) return
    const fallbackValue = baseCustomValues[index]
    if (fallbackValue?.trim()) values[column.id] = fallbackValue
  })

  customColumns
    .filter((_, index) => index % 2 === 1)
    .filter((column) => !isAutoFilledSuratColumn(column))
    .forEach((column, index) => {
      Object.entries(groupedCustomValues).forEach(([groupIndex, groupValues]) => {
        const fieldKey = `${column.id}_group_${groupIndex}`
        if (values[fieldKey]?.trim()) return

        const fallbackValue = groupValues[index]
        if (fallbackValue?.trim()) values[fieldKey] = fallbackValue
      })
    })

  customColumns.forEach((column) => {
    const builtInKey = getSuratBuiltInColumnKey(column)
    if (!builtInKey) return
    if (values[column.id]?.trim()) return

    const value = detail[builtInKey]
    values[column.id] = value == null ? "" : String(value)
  })

  return values
}

export function RegisterInfoPanel({ state, actions }: any) {
  return (
    <div className="grid w-full grid-cols-1 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
      <RegisterDepartmentHeader state={state} actions={actions} />
      <RegisterDepartmentBody state={state} actions={actions} />
    </div>
  )
}

export function RegisterDepartmentHeader({ state, actions }: any) {
  const oldDepartment = state.original.dept
  const isDepartmentChanged = state.form.deptId && state.form.deptId !== oldDepartment?.id
  const newDepartmentSelectValue = isDepartmentChanged ? state.form.deptId : ""

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border/70 bg-background px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold leading-tight text-foreground">Departemen Lama</p>
          <span className="shrink-0 rounded-full border border-border bg-muted/30 px-3 py-1 text-sm font-semibold text-foreground">
            {oldDepartment?.shortName ?? "-"}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <p className="text-base font-semibold leading-tight text-foreground">Departemen Baru</p>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <span className="shrink-0 text-sm font-medium text-muted-foreground">Pilih dept</span>
            <Select
              value={newDepartmentSelectValue}
              onValueChange={(value) => actions.setField("deptId", value)}
            >
              <SelectTrigger
                className={cn(
                  "h-10 min-w-44 rounded-xl text-[14px] shadow-none",
                  state.formErrors.deptId && "border-red-500"
                )}
              >
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-neutral-800 dark:bg-neutral-950">
                {state.deptList
                  .filter((department: any) => department.id !== oldDepartment?.id)
                  .map((department: any) => (
                    <SelectItem
                      key={department.id}
                      value={department.id}
                      className="cursor-pointer text-[14px]"
                    >
                      {department.shortName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RegisterDepartmentBody({ state, actions }: any) {
  const oldDepartment = state.original.dept
  const oldDetail = state.original.detailSurat?.[0]
  const editableSurat = state.suratList?.[0]
  const oldColumns = oldDepartment?.columns ?? []
  const newColumns = state.selectedCustomColumns ?? []
  const isDepartmentChanged = state.form.deptId && state.form.deptId !== oldDepartment?.id
  const errors = Object.fromEntries(
    newColumns.map((column: any) => [
      column.id,
      state.formErrors[`surat_0_custom_${column.id}`],
    ])
  )
  const splitPanelScrollClass = "h-full min-h-0 overflow-y-auto overscroll-contain pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"

  return (
      <div className="grid h-full min-h-0 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
        <div className="flex min-h-0 flex-col rounded-2xl border border-border/70 bg-background p-3 lg:h-full lg:max-h-full lg:overflow-hidden">
          <div className="mb-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Data Departemen Lama</p>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-4 md:grid-cols-2">
            {oldColumns.length > 0 && oldDetail ? (
              <CustomFieldsView
                columns={oldColumns}
                values={getDetailFieldValues(oldColumns, oldDetail)}
                includeBuiltIn
                splitLayout
                splitSide="left"
                splitPanelClassName={splitPanelScrollClass}
              />
            ) : (
              <EmptyPanel title="Data utama" />
            )}

            {oldColumns.length > 0 && oldDetail ? (
              <CustomFieldsView
                columns={oldColumns}
                values={getDetailFieldValues(oldColumns, oldDetail)}
                includeBuiltIn
                splitLayout
                splitSide="right"
                splitPanelClassName={splitPanelScrollClass}
              />
            ) : (
              <EmptyPanel title="Data tambahan" />
            )}
          </div>
        </div>

        {isDepartmentChanged ? (
          <div className="flex min-h-0 flex-col rounded-2xl border border-border/70 bg-background p-3 lg:h-full lg:max-h-full lg:overflow-hidden">
            <div className="mb-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Data Departemen Baru</p>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-4 md:grid-cols-2">
              {newColumns.length > 0 && editableSurat ? (
                <CustomFieldsForm
                  columns={newColumns}
                  values={editableSurat.customFields}
                  includeBuiltIn
                  splitLayout
                  splitSide="left"
                  strictValueKey
                  disableSplitScroll
                  splitPanelClassName={splitPanelScrollClass}
                  errors={errors}
                  onChange={(columnId, value) => actions.setSuratCustomField(0, columnId, value)}
                />
              ) : (
                <EmptyPanel title="Data utama" />
              )}

              {newColumns.length > 0 && editableSurat ? (
                <CustomFieldsForm
                  columns={newColumns}
                  values={editableSurat.customFields}
                  includeBuiltIn
                  splitLayout
                  splitSide="right"
                  strictValueKey
                  disableSplitScroll
                  splitPanelClassName={splitPanelScrollClass}
                  errors={errors}
                  onChange={(columnId, value) => actions.setSuratCustomField(0, columnId, value)}
                />
              ) : (
                <EmptyPanel title="Data tambahan" />
              )}
            </div>
          </div>
        ) : null}
      </div>
  )
}
