import type { Dispatch, SetStateAction } from "react"
import { useMemo, useState } from "react"
import type { DepartemenColumn, DepartemenFormState } from "@/types"
import {
  createColumn,
  ensureDraftColumnLabels,
  getNextDraftColumnIndex,
  isDisplayColumnHelperLabel,
  orderColumnsWithTujuanLast,
  renumberColumns,
} from "../utils/kolom"

export function useDepartemenKolomForm(
  columns: DepartemenColumn[],
  onChange: Dispatch<SetStateAction<DepartemenFormState>>,
) {
  const [openColumnIds, setOpenColumnIds] = useState<Set<string>>(() => new Set())
  const allColumns = useMemo(
    () => orderColumnsWithTujuanLast(ensureDraftColumnLabels(columns)),
    [columns]
  )
  const customColumns = useMemo(
    () => allColumns.filter((column) => !column.isDefault),
    [allColumns]
  )
  const orderedColumns = customColumns

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
    onChange((current) => {
      const columnsWithDraftLabels = ensureDraftColumnLabels(current.columns)

      return {
        ...current,
        columns: renumberColumns([
          ...columnsWithDraftLabels,
          createColumn(
            columnsWithDraftLabels.length,
            getNextDraftColumnIndex(columnsWithDraftLabels)
          ),
        ]),
      }
    })
  }

  const syncDisplayOrderWithCustomOrder = (columns: DepartemenColumn[]) => {
    const displayOrderById = new Map(
      columns
        .filter((column) => !column.isDefault && column.showInDataSurat)
        .map((column, index) => [column.id, index])
    )

    return columns.map((column) => ({
      ...column,
      displayOrder: displayOrderById.get(column.id) ?? column.displayOrder ?? column.sortOrder,
    }))
  }

  const removeColumn = (columnId: string) => {
    onChange((current) => ({
      ...current,
      columns: orderColumnsWithTujuanLast(
        current.columns.filter((column) => column.id !== columnId)
      ),
    }))
  }

  const moveCustomColumn = (columnId: string, direction: -1 | 1) => {
    onChange((current) => {
      const ordered = orderColumnsWithTujuanLast(ensureDraftColumnLabels(current.columns))
      const systemColumns = ordered.filter((column) => column.isDefault)
      const custom = ordered.filter((column) => !column.isDefault)
      const fromIndex = custom.findIndex((column) => column.id === columnId)
      const toIndex = fromIndex + direction

      if (fromIndex < 0 || toIndex < 0 || toIndex >= custom.length) return current

      const reordered = [...custom]
      const [movedColumn] = reordered.splice(fromIndex, 1)
      reordered.splice(toIndex, 0, movedColumn)
      const nextColumns = renumberColumns([...systemColumns, ...reordered])

      return {
        ...current,
        columns: syncDisplayOrderWithCustomOrder(nextColumns),
      }
    })
  }

  const swapCustomColumns = (startIndex: number, finishIndex: number) => {
    onChange((current) => {
      const ordered = orderColumnsWithTujuanLast(ensureDraftColumnLabels(current.columns))
      const systemColumns = ordered.filter((column) => column.isDefault)
      const custom = ordered.filter((column) => !column.isDefault)

      if (
        startIndex < 0 ||
        finishIndex < 0 ||
        startIndex >= custom.length ||
        finishIndex >= custom.length
      ) {
        return current
      }

      const reordered = [...custom]
      const sourceColumn = reordered[startIndex]
      reordered[startIndex] = reordered[finishIndex]
      reordered[finishIndex] = sourceColumn
      const nextColumns = renumberColumns([...systemColumns, ...reordered])

      return {
        ...current,
        columns: syncDisplayOrderWithCustomOrder(nextColumns),
      }
    })
  }

  const setDisplaySlot = (slotIndex: number, columnId: string) => {
    onChange((current) => {
      const mutable = orderColumnsWithTujuanLast(current.columns).map((column) => ({ ...column }))
      const displayColumns = mutable.filter((column) => !column.isDefault)
      const selected = displayColumns
        .filter((column) => column.showInDataSurat)
        .sort((a, b) => (a.displayOrder ?? a.sortOrder) - (b.displayOrder ?? b.sortOrder))
        .map((column) => column.id)

      selected[slotIndex] = columnId === "none" ? "" : columnId
      const selectedIds = new Set(selected.filter(Boolean))
      const displayOrderById = new Map(selected.filter(Boolean).map((id, index) => [id, index]))

      return {
        ...current,
        columns: mutable.map((column) => ({
          ...column,
          showInDataSurat: selectedIds.has(column.id),
          displayOrder: displayOrderById.get(column.id) ?? column.displayOrder ?? column.sortOrder,
        })),
      }
    })
  }

  const addDisplaySlot = () => {
    onChange((current) => {
      const mutable = orderColumnsWithTujuanLast(current.columns).map((column) => ({ ...column }))
      const displayColumns = mutable.filter((column) => !column.isDefault)
      const selectedIds = new Set(
        displayColumns
          .filter((column) => column.showInDataSurat)
          .map((column) => column.id)
      )
      const nextColumn = displayColumns.find((column) => !selectedIds.has(column.id))

      if (!nextColumn) return current
      selectedIds.add(nextColumn.id)
      const selected = [
        ...displayColumns
          .filter((column) => column.showInDataSurat)
          .sort((a, b) => (a.displayOrder ?? a.sortOrder) - (b.displayOrder ?? b.sortOrder))
          .map((column) => column.id),
        nextColumn.id,
      ]
      const displayOrderById = new Map(selected.map((id, index) => [id, index]))

      return {
        ...current,
        columns: mutable.map((column) => ({
          ...column,
          showInDataSurat: selectedIds.has(column.id),
          displayOrder: displayOrderById.get(column.id) ?? column.displayOrder ?? column.sortOrder,
        })),
      }
    })
  }

  const removeDisplaySlot = (slotIndex: number) => {
    onChange((current) => {
      const mutable = orderColumnsWithTujuanLast(current.columns).map((column) => ({ ...column }))
      const displayColumns = mutable.filter((column) => !column.isDefault)
      const selected = displayColumns
        .filter((column) => column.showInDataSurat)
        .sort((a, b) => (a.displayOrder ?? a.sortOrder) - (b.displayOrder ?? b.sortOrder))
        .map((column) => column.id)

      selected.splice(slotIndex, 1)
      const selectedIds = new Set(selected)
      const displayOrderById = new Map(selected.map((id, index) => [id, index]))

      return {
        ...current,
        columns: mutable.map((column) => ({
          ...column,
          showInDataSurat: selectedIds.has(column.id),
          displayOrder: displayOrderById.get(column.id) ?? column.displayOrder ?? column.sortOrder,
        })),
      }
    })
  }

  const reorderDisplayColumns = (startIndex: number, finishIndex: number) => {
    onChange((current) => {
      const mutable = orderColumnsWithTujuanLast(current.columns).map((column) => ({ ...column }))
      const selected = mutable
        .filter((column) => !column.isDefault && column.showInDataSurat)
        .sort((a, b) => (a.displayOrder ?? a.sortOrder) - (b.displayOrder ?? b.sortOrder))

      if (
        startIndex < 0 ||
        finishIndex < 0 ||
        startIndex >= selected.length ||
        finishIndex >= selected.length
      ) {
        return current
      }

      const reordered = [...selected]
      const sourceColumn = reordered[startIndex]
      reordered[startIndex] = reordered[finishIndex]
      reordered[finishIndex] = sourceColumn
      const displayOrderById = new Map(reordered.map((column, index) => [column.id, index]))

      return {
        ...current,
        columns: mutable.map((column) => ({
          ...column,
          displayOrder: displayOrderById.get(column.id) ?? column.displayOrder ?? column.sortOrder,
        })),
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

  const selectableDisplayColumns = customColumns.filter((column) => !isDisplayColumnHelperLabel(column))
  const selectedMiddleColumns = selectableDisplayColumns
    .filter((column) => column.showInDataSurat)
    .sort((a, b) => (a.displayOrder ?? a.sortOrder) - (b.displayOrder ?? b.sortOrder))

  return {
    orderedColumns,
    customColumns,
    openColumnIds,
    selectableDisplayColumns,
    selectedMiddleColumns,
    updateColumn,
    addColumn,
    removeColumn,
    moveCustomColumn,
    reorderCustomColumns: swapCustomColumns,
    setDisplaySlot,
    addDisplaySlot,
    removeDisplaySlot,
    reorderDisplayColumns,
    toggleColumn,
  }
}
