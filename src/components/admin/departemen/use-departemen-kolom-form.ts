import type { Dispatch, SetStateAction } from "react"
import { useMemo, useState } from "react"
import type { DepartemenColumn, DepartemenFormState } from "@/types"
import {
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
  TUJUAN_DEFAULT_ID,
} from "./departemen-form-config"
import {
  createColumn,
  orderColumnsWithTujuanLast,
} from "./departemen-kolom-utils"

export function useDepartemenKolomForm(
  columns: DepartemenColumn[],
  onChange: Dispatch<SetStateAction<DepartemenFormState>>,
) {
  const [openColumnIds, setOpenColumnIds] = useState<Set<string>>(() => new Set())
  const orderedColumns = useMemo(() => orderColumnsWithTujuanLast(columns), [columns])
  const customColumns = orderedColumns.filter((column) => !column.isDefault)

  const updateColumn = (
    columnId: string,
    updater: (column: DepartemenColumn) => DepartemenColumn,
  ) => {
    onChange((current) => ({
      ...current,
      columns: current.columns.map((column) => column.id === columnId ? updater(column) : column),
    }))
  }

  const addColumn = () => {
    onChange((current) => ({
      ...current,
      columns: orderColumnsWithTujuanLast([
        ...current.columns,
        createColumn(current.columns.length),
      ]),
    }))
  }

  const removeColumn = (columnId: string) => {
    onChange((current) => ({
      ...current,
      columns: orderColumnsWithTujuanLast(
        current.columns.filter((column) => column.id !== columnId || column.isDefault)
      ),
    }))
  }

  const moveCustomColumn = (columnId: string, direction: -1 | 1) => {
    onChange((current) => {
      const custom = current.columns.filter((column) => !column.isDefault)
      const fromIndex = custom.findIndex((column) => column.id === columnId)
      const toIndex = fromIndex + direction

      if (fromIndex < 0 || toIndex < 0 || toIndex >= custom.length) return current

      const reordered = [...custom]
      const [movedColumn] = reordered.splice(fromIndex, 1)
      reordered.splice(toIndex, 0, movedColumn)

      return {
        ...current,
        columns: orderColumnsWithTujuanLast([
          ...current.columns.filter((column) => column.isDefault),
          ...reordered,
        ]),
      }
    })
  }

  const setDisplaySlot = (slotIndex: number, columnId: string) => {
    onChange((current) => {
      const mutable = orderColumnsWithTujuanLast(current.columns).map((column) => ({ ...column }))
      const fixedIds = new Set([NOMOR_DEFAULT_ID, TANGGAL_DEFAULT_ID, TUJUAN_DEFAULT_ID])
      const selected = mutable
        .filter((column) => column.showInDataSurat && !Array.from(fixedIds).some((id) => column.id.includes(id)))
        .map((column) => column.id)

      selected[slotIndex] = columnId === "none" ? "" : columnId
      const selectedIds = new Set(selected.filter(Boolean))

      return {
        ...current,
        columns: mutable.map((column) => {
          if (column.id.includes(TANGGAL_DEFAULT_ID)) {
            return { ...column, showInDataSurat: false }
          }

          if (column.id.includes(NOMOR_DEFAULT_ID) || column.id.includes(TUJUAN_DEFAULT_ID)) {
            return { ...column, showInDataSurat: true }
          }

          return { ...column, showInDataSurat: selectedIds.has(column.id) }
        }),
      }
    })
  }

  const toggleColumn = (columnId: string) => {
    setOpenColumnIds((current) => {
      const next = new Set(current)
      next.has(columnId) ? next.delete(columnId) : next.add(columnId)
      return next
    })
  }

  const fixedNomor = orderedColumns.find((column) => column.id.includes(NOMOR_DEFAULT_ID))
  const fixedTujuan = orderedColumns.find((column) => column.id.includes(TUJUAN_DEFAULT_ID))
  const selectableDisplayColumns = orderedColumns.filter((column) =>
    !column.id.includes(NOMOR_DEFAULT_ID) &&
    !column.id.includes(TANGGAL_DEFAULT_ID) &&
    !column.id.includes(TUJUAN_DEFAULT_ID)
  )
  const selectedMiddleColumns = selectableDisplayColumns.filter((column) => column.showInDataSurat)

  return {
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
  }
}
