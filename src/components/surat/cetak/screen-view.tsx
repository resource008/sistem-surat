"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { formatTanggalCetak, formatTanggalShort, getDetailLabel } from "@/lib/surat-helpers"
import type { CetakGroup } from "@/types/surat-types"
import { usePathname, useRouter } from "next/navigation"

interface Props {
  groups: CetakGroup[]
  activeFilter: "ALL" | "PI"
  onBersihkan: () => void
  basePath?: string
}

function useSidebarSafe() {
  try { return useSidebar() } 
  catch { return { state: "collapsed" as const, isMobile: false } }
}

export function CetakScreenView({ groups, activeFilter, onBersihkan, basePath }: Props) {
  const pathname = usePathname()
  const { state, isMobile } = useSidebarSafe()
  const resolvedBase = basePath ?? (pathname.includes("/pkl/") ? "/pkl/cetak" : "/staff/cetak")

  return (
    <>
      <div className="screen-view space-y-4 pb-24">
        {groups.map((group) => (
          <div key={group.key} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-[13px] md:text-[14px] font-extrabold tracking-wide text-slate-800 dark:text-white uppercase">
                {formatTanggalCetak(group.date)}
              </span>
              <span className="text-[12px] text-slate-400 dark:text-slate-500">
                ({group.dept})
              </span>
            </div>
            <MobileList group={group} />
            <DesktopTable group={group} activeFilter={activeFilter} />
          </div>
        ))}
      </div>
      <FloatingFilterTab activeFilter={activeFilter} resolvedBase={resolvedBase} sidebarState={state} isMobile={isMobile} />
    </>
  )
}

function MobileList({ group }: { group: CetakGroup }) {
  return (
    <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
      {group.registers.flatMap((reg) => {
        const details = reg.detailSurat ?? (reg as any).detailPI ?? []
        return details.map((detail: any, dIdx: number) => {
          const isFirst = dIdx === 0
          return (
            <div key={detail.id} className="px-4 py-3 space-y-1.5">
              {isFirst && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] font-bold text-slate-800 dark:text-white">{reg.nomor}</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">{formatTanggalShort(reg.tanggalTerima)}</span>
                </div>
              )}
              <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-snug break-words">
                {getDetailLabel(detail, "perihal")}
              </p>
              <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-400 dark:text-slate-500">
                <span><span className="text-slate-500">No: </span><span className="font-mono">{getDetailLabel(detail, "noSurat")}</span></span>
                <span className="text-slate-200 dark:text-slate-700">·</span>
                <span><span className="text-slate-500">Lamp: </span>{getDetailLabel(detail, "lampiran")}</span>
                <span className="text-slate-200 dark:text-slate-700">·</span>
                <span className="whitespace-nowrap"><span className="text-slate-500">Tgl: </span>{formatTanggalShort(detail.tanggalSurat)}</span>
                {isFirst && (
                  <><span className="text-slate-200 dark:text-slate-700">·</span><span><span className="text-slate-500">Tujuan: </span>{detail.tujuan ?? reg.tujuan ?? "-"}</span></>
                )}
              </div>
            </div>
          )
        })
      })}
    </div>
  )
}

function DesktopTable({ group, activeFilter }: { group: CetakGroup, activeFilter: string }) {
  const Th = ({ children, className = "" }: any) => (
    <th className={`text-left px-4 py-3 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 ${className}`}>
      {children}
    </th>
  )

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr>
            <Th className="w-32">No. Register</Th>
            <Th className="w-28">Tgl. Terima</Th>
            <Th>{activeFilter === "PI" ? "Nama Supplier" : "Perihal"}</Th>
            <Th className="w-24">{activeFilter === "PI" ? "No. Invoice" : "Lampiran"}</Th>
            <Th className="w-28">Tgl. Surat</Th>
            <Th className="w-36">No. Surat</Th>
            <Th className="w-24">Tujuan</Th>
          </tr>
        </thead>
        <tbody>
          {group.registers.flatMap((reg) => {
            const details = reg.detailSurat ?? (reg as any).detailPI ?? []
            return details.map((detail: any, dIdx: number) => {
              const isFirst = dIdx === 0
              const isLastRow = reg === group.registers.at(-1) && dIdx === details.length - 1

              return (
                <tr key={detail.id} className={`bg-white dark:bg-slate-950 ${!isLastRow ? "border-b border-slate-100 dark:border-slate-800/50" : ""}`}>
                  <td className="px-4 py-3.5">
                    {isFirst && <span className="font-mono text-[13px] font-semibold text-slate-800 dark:text-white">{reg.nomor}</span>}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {isFirst ? formatTanggalShort(reg.tanggalTerima) : ""}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-700 dark:text-slate-300 font-medium leading-snug wrap-break-word">
                    {getDetailLabel(detail, "perihal")}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-500 dark:text-slate-400">
                    {getDetailLabel(detail, "lampiran")}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {formatTanggalShort(detail.tanggalSurat)}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[13px] text-slate-500 dark:text-slate-400 break-all">
                    {getDetailLabel(detail, "noSurat")}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-500 dark:text-slate-400">
                    {isFirst ? (detail.tujuan ?? reg.tujuan ?? "-") : ""}
                  </td>
                </tr>
              )
            })
          })}
        </tbody>
      </table>
    </div>
  )
}

function FloatingFilterTab({ activeFilter, resolvedBase, sidebarState, isMobile }: any) {
  const router = useRouter()
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-10 transition-all duration-200 ${sidebarState === "expanded" && !isMobile ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className="flex items-center gap-1 p-1.5 rounded-2xl shadow-lg shadow-black/20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        {(["ALL", "PI"] as const).map((val) => (
          <button
            key={val}
            onClick={() => router.push(`${resolvedBase}/${val.toLowerCase()}`)}
            className={`min-w-16 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${activeFilter === val ? "bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  )
}