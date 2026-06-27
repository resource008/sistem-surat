"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { isCetakRowSpanColumn } from "@/domain/surat/custom-fields"
import { formatTanggalShort, getCetakColumnValue } from "@/lib/surat-helpers"
import type { CetakGroup } from "@/types/surat-types"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Props {
  groups: CetakGroup[]
  activeFilter: string
  tabs: string[]
  onTabChange: (value: string) => void
  onBersihkan: () => void
}

function useSidebarSafe() {
  try { return useSidebar() }
  catch { return { state: "collapsed" as const, isMobile: false } }
}

function getGroupTitle(group: CetakGroup) {
  const date = format(new Date(group.date), "dd MMMM yyyy", { locale: id }).toUpperCase()
  return `${date} (${group.dept || group.label})`
}

export function CetakScreenView({ groups, activeFilter, tabs, onTabChange, onBersihkan }: Props) {
  const { state, isMobile } = useSidebarSafe()

  return (
    <>
      <div className="screen-view space-y-4 pb-24">
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
      <FloatingFilterTab
        activeFilter={activeFilter}
        tabs={tabs}
        onTabChange={onTabChange}
        sidebarState={state}
        isMobile={isMobile}
      />
    </>
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
              <p className="break-words text-[13px] font-medium leading-snug text-slate-700 dark:text-slate-300">
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
            return details.map((detail: any, dIdx: number) => {
              const isLastRow = reg === group.registers.at(-1) && dIdx === details.length - 1

              return (
                <tr key={detail.id} className={`bg-white dark:bg-slate-950 ${!isLastRow ? "border-b border-slate-100 dark:border-slate-800/50" : ""}`}>
                  {columns.map((column) => {
                    if (isCetakRowSpanColumn(column)) {
                      if (dIdx > 0) return null

                      return (
                        <td
                          key={column.id}
                          rowSpan={details.length}
                          className="break-words px-4 py-3.5 align-middle text-[13px] leading-snug text-slate-600 dark:text-slate-300"
                        >
                          {getCetakColumnValue(column, reg, detail)}
                        </td>
                      )
                    }

                    return (
                      <td key={column.id} className="break-words px-4 py-3.5 text-[13px] leading-snug text-slate-600 dark:text-slate-300">
                        {getCetakColumnValue(column, reg, detail)}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          })}
        </tbody>
      </table>
    </div>
  )
}

function FloatingFilterTab({ activeFilter, tabs, onTabChange, sidebarState, isMobile }: any) {
  if (!tabs.length) return null

  const sidebarOffset = isMobile
    ? "0px"
    : sidebarState === "expanded"
      ? "var(--sidebar-w)"
      : "var(--sidebar-w-collapsed)"

  return (
    <div
      className="fixed bottom-6 z-10 -translate-x-1/2 transition-[left,opacity] duration-300 ease-in-out"
      style={{
        left: `calc(${sidebarOffset} + ((100vw - ${sidebarOffset}) / 2))`,
      }}
    >
      <div className="flex max-w-[calc(100vw-2rem)] items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-black/20 dark:border-slate-700 dark:bg-slate-900">
        {tabs.map((val: string) => (
          <button
            key={val}
            onClick={() => onTabChange(val)}
            className={`min-w-16 shrink-0 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${activeFilter === val ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  )
}
