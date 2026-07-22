"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isCetakRowSpanColumn } from "@/domain/surat/custom-fields"
import {
  getSuratColumnGroupValue,
  getSuratDetailGroupCount,
  isSuratGroupedColumn,
} from "@/lib/surat-display"
import { formatTanggalShort, getCetakColumnValue } from "@/lib/surat-helpers"
import type { CetakGroup } from "@/types/surat"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Props {
  groups: CetakGroup[]
  activeFilter: string
  tabs: string[]
  onTabChange: (value: string) => void
  onBersihkan: () => void
}

function getGroupTitle(group: CetakGroup) {
  const date = format(new Date(group.date), "dd MMMM yyyy", { locale: id }).toUpperCase()
  return `${date} (${group.dept || group.label})`
}

export function CetakScreenView({ groups, activeFilter, tabs, onTabChange }: Props) {
  return (
    <div className="screen-view space-y-4 pb-24">
      {tabs.length > 0 && (
        <Tabs value={activeFilter} onValueChange={onTabChange} className="min-w-0">
          <div className="overflow-x-auto pb-1">
            <TabsList className="min-w-max">
              {tabs.map((value) => (
                <TabsTrigger key={value} value={value}>
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      )}

        {groups.map((group) => (
          <div key={group.key} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800/60">
              <span className="text-[13px] font-extrabold uppercase tracking-wide text-slate-800 dark:text-white md:text-[14px]">
                {getGroupTitle(group)}
              </span>
            </div>
            <MobileList group={group} />
            <DesktopTable group={group} />
          </div>
        ))}
    </div>
  )
}

function MobileList({ group }: { group: CetakGroup }) {
  const columns = group.columns ?? group.registers[0]?.dept?.columns ?? []
  const [primaryColumn, ...secondaryColumns] = columns

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
      {group.registers.flatMap((reg) => {
        const details = reg.detailSurat ?? []
        return details.map((detail: any, dIdx: number) => {
          const isFirst = dIdx === 0
          return (
            <div key={detail.id} className="space-y-1.5 px-4 py-3">
              {isFirst && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] font-bold text-slate-800 dark:text-white">{reg.nomor}</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">{formatTanggalShort(reg.tanggalTerima)}</span>
                </div>
              )}
              <p className="whitespace-pre-line break-words text-[13px] font-medium leading-snug text-slate-700 dark:text-slate-300">
                {primaryColumn ? getCetakColumnValue(primaryColumn, reg, detail) : reg.nomor}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                {secondaryColumns.slice(0, 5).map((column) => (
                  <span key={column.id}>
                    <span className="text-slate-500">{column.label}: </span>
                    {getCetakColumnValue(column, reg, detail)}
                  </span>
                ))}
              </div>
            </div>
          )
        })
      })}
    </div>
  )
}

function DesktopTable({ group }: { group: CetakGroup }) {
  const columns = group.columns ?? group.registers[0]?.dept?.columns ?? []
  const Th = ({ children, className = "" }: any) => (
    <th className={`border-b border-slate-100 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0px] text-slate-400 dark:border-slate-800 dark:text-slate-500 ${className}`}>
      {children}
    </th>
  )

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <Th key={column.id}>{column.label}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.registers.flatMap((reg) => {
            const details = reg.detailSurat ?? []
            return details.flatMap((detail: any, dIdx: number) => {
              const groupedColumns = columns.filter((column) => isSuratGroupedColumn(column, reg, detail))
              const hasGroupedColumns = groupedColumns.length > 0
              const staticColumns = hasGroupedColumns
                ? columns.filter((column) => !isSuratGroupedColumn(column, reg, detail))
                : []
              const rowColumns = hasGroupedColumns ? groupedColumns : columns
              const groupRows = Array.from({ length: hasGroupedColumns ? getSuratDetailGroupCount(detail) : 1 })

              return groupRows.map((_, groupIndex) => {
              const isFirstGroup = groupIndex === 0
              const isLastGroup = groupIndex === groupRows.length - 1
              const isLastRow = reg === group.registers.at(-1) && dIdx === details.length - 1 && isLastGroup
              return (
                <tr key={`${detail.id}-${groupIndex}`} className={`bg-white dark:bg-slate-950 ${!isLastRow ? "border-b border-slate-100 dark:border-slate-800/50" : ""}`}>
                  {isFirstGroup && staticColumns.map((column) => {
                    if (isCetakRowSpanColumn(column)) {
                      return (
                        <td
                          key={column.id}
                          rowSpan={groupRows.length}
                          className="whitespace-pre-line break-words px-4 py-3.5 align-middle text-[13px] leading-snug text-slate-600 dark:text-slate-300"
                        >
                          {getCetakColumnValue(column, reg, detail)}
                        </td>
                      )
                    }

                    return (
                      <td key={column.id} rowSpan={groupRows.length} className="whitespace-pre-line break-words px-4 py-3.5 align-middle text-[13px] leading-snug text-slate-600 dark:text-slate-300">
                        {getCetakColumnValue(column, reg, detail)}
                      </td>
                    )
                  })}
                  {rowColumns.map((column) => (
                    <td key={column.id} className="whitespace-pre-line break-words px-4 py-3.5 text-[13px] leading-snug text-slate-600 dark:text-slate-300">
                      {hasGroupedColumns
                        ? getSuratColumnGroupValue(column, reg, detail, groupIndex)
                        : getCetakColumnValue(column, reg, detail)}
                    </td>
                  ))}
                </tr>
              )
            })
            })
          })}
        </tbody>
      </table>
    </div>
  )
}
