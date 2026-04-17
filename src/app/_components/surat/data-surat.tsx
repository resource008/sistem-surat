"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Loader2, Plus } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { RegisterSurat, Role } from "./shared"
import { getPermission } from "@/lib/permission"

interface Props {
  role:     Role
  basePath: string
}

export default function DataSuratPage({ role, basePath }: Props) {
  const [data,    setData]    = useState<RegisterSurat[]>([])
  const [loading, setLoading] = useState(true)

  const router       = useRouter()
  const searchParams = useSearchParams()
  const perm         = getPermission(role)
  const canAdd       = perm.canCreate

  const loadData = useCallback(() => {
    setLoading(true)
    fetch("/api/surat")
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(json => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadData()
    window.dispatchEvent(new CustomEvent("breadcrumb:sub",    { detail: null }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [loadData])

  const filterDate  = searchParams.get("date")
  const filterDepts = searchParams.get("dept")?.split(",") ?? []

  const filteredData = data.filter(reg => {
    const matchDate = filterDate
      ? format(new Date(reg.tanggalTerima), "yyyy-MM-dd") === filterDate
      : true
    const matchDept = filterDepts.length > 0
      ? filterDepts.includes(reg.deptId)
      : true
    return matchDate && matchDept
  })

  const groupedData = filteredData.reduce((acc: Record<string, RegisterSurat[]>, reg) => {
    const dateKey  = reg.tanggalTerima
      ? format(new Date(reg.tanggalTerima), "dd MMMM yyyy", { locale: id }).toUpperCase()
      : "TANPA TANGGAL"
    const groupKey = `${dateKey}|||${reg.deptId}`
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(reg)
    return acc
  }, {})

  if (loading) return (
    <div className="flex h-100 w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-[15px] font-normal text-slate-500 dark:text-slate-400">Memuat Arsip...</p>
    </div>
  )

  if (filteredData.length === 0) return (
    <EmptyState
      description={
        <span className="leading-none">
          {filterDate || filterDepts.length > 0
            ? "Tidak ada data yang sesuai filter."
            : <>
                Silakan tambahkan data baru dengan mengklik tombol
                <span className="inline-flex align-middle ml-1 text-blue-600 dark:text-blue-400 -translate-y-px">
                  <Plus size={18} strokeWidth={3} />
                </span>
              </>
          }
        </span>
      }
    />
  )

  return (
    <div className="w-full animate-in fade-in duration-500 flex flex-col gap-3">
      {Object.keys(groupedData).map((groupKey) => {
        const [date, dept] = groupKey.split("|||")
        const registers    = groupedData[groupKey]
        const totalSurat   = registers.reduce((sum, r) => sum + r.detailSurat.length, 0)

        return (
          <div key={groupKey}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">

            {/* ── Group header ───────────────────────────────────────── */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">{date}</span>
              <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-2.5 py-0.5">
                {dept}
              </span>
            </div>

            {/* ══════════════════════════════════════════════════════════
                MOBILE: card list
            ══════════════════════════════════════════════════════════ */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {registers.map((reg) => (
                <div key={reg.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[12px] font-bold text-blue-600 dark:text-blue-400">
                      {reg.nomor}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                      {reg.dept.shortName}
                    </span>
                  </div>

                  <div className={reg.detailSurat.length > 1
                    ? "rounded-lg border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden"
                    : ""}>
                    {reg.detailSurat.map((detail, idx) => (
                      <div key={detail.id}
                        onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
                        className="flex items-start gap-3 px-3 py-2.5 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer active:bg-blue-100/50 transition-colors">

                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug mb-1">
                            {detail.perihal}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              <span className="text-slate-500 dark:text-slate-400">No: </span>
                              {detail.noSurat ?? "—"}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              <span className="text-slate-500 dark:text-slate-400">Lamp: </span>
                              {detail.lampiran ?? "—"}
                            </span>
                          </div>
                        </div>

                        <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ══════════════════════════════════════════════════════════
                DESKTOP: tabel rowSpan
            ══════════════════════════════════════════════════════════ */}
            <div className="hidden md:block overflow-x-auto">
              <Table className="border-collapse table-fixed min-w-2 w-full">
                <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-12 border-r border-slate-200 dark:border-slate-800 p-0" />
                    <TableHead className="w-44 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">
                      Nomor Reg
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">
                      Perihal
                    </TableHead>
                    <TableHead className="w-32 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800 text-center">
                      Lampiran
                    </TableHead>
                    <TableHead className="w-40 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">
                      Tujuan
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {registers.map((reg, regIdx) => {
                    const isLastReg = regIdx === registers.length - 1
                    const details   = reg.detailSurat

                    // ── 1 detail → baris biasa ────────────────────────
                    if (details.length === 1) {
                      const detail = details[0]
                      return (
                        <TableRow key={reg.id}
                          onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
                          className={`group transition-all cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20
                            ${!isLastReg ? "border-b border-slate-200 dark:border-slate-800" : ""}`}>

                          <TableCell className="w-12 p-0 border-r border-slate-200 dark:border-slate-800"
                            onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center h-12 w-full">
                              <Checkbox className="border-slate-300 dark:border-slate-600 rounded-sm" />
                            </div>
                          </TableCell>

                          <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800 font-mono text-[12px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {reg.nomor}
                          </TableCell>

                          <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800 text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            {detail.perihal}
                          </TableCell>

                          <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {detail.lampiran ?? "—"}
                          </TableCell>

                          <TableCell className="py-4 px-4 text-[13px] text-slate-500 dark:text-slate-400">
                            {reg.dept.shortName}
                          </TableCell>
                        </TableRow>
                      )
                    }

                    // ── Banyak detail → rowSpan ───────────────────────
                    return details.map((detail, idx) => {
                      const isFirst        = idx === 0
                      const isLast         = idx === details.length - 1
                      const isAbsoluteLast = isLastReg && isLast

                      const innerBorder = isAbsoluteLast
                        ? ""
                        : isLast
                          ? "border-b border-b-slate-200 dark:border-b-slate-800"
                          : "border-b border-b-slate-100 dark:border-b-slate-800/50"

                      const spanBorder = !isLastReg
                        ? "border-b border-b-slate-200 dark:border-b-slate-800"
                        : ""

                      return (
                        <TableRow key={detail.id}
                          onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
                          className="cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all">

                          {/* Checkbox — rowSpan */}
                          {isFirst && (
                            <TableCell
                              rowSpan={details.length}
                              onClick={e => e.stopPropagation()}
                              className={`w-12 p-0 border-r border-r-slate-200 dark:border-r-slate-800 align-middle ${spanBorder}`}>
                              <div className="flex items-center justify-center w-full">
                                <Checkbox className="border-slate-300 dark:border-slate-600 rounded-sm" />
                              </div>
                            </TableCell>
                          )}

                          {/* Nomor Reg — rowSpan, tanpa badge */}
                          {isFirst && (
                            <TableCell
                              rowSpan={details.length}
                              onClick={e => e.stopPropagation()}
                              className={`py-4 px-4 border-r border-r-slate-200 dark:border-r-slate-800 align-middle ${spanBorder}`}>
                              <span className="font-mono text-[12px] font-bold text-slate-800 dark:text-slate-200">
                                {reg.nomor}
                              </span>
                            </TableCell>
                          )}

                          {/* Perihal — per detail */}
                          <TableCell className={`py-3 px-4 border-r border-r-slate-200 dark:border-r-slate-800 text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed ${innerBorder}`}>
                            {detail.perihal}
                          </TableCell>

                          {/* Lampiran — per detail */}
                          <TableCell className={`py-3 px-4 border-r border-r-slate-200 dark:border-r-slate-800 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 ${innerBorder}`}>
                            {detail.lampiran ?? "—"}
                          </TableCell>

                          {/* Tujuan — rowSpan */}
                          {isFirst && (
                            <TableCell
                              rowSpan={details.length}
                              onClick={e => e.stopPropagation()}
                              className={`py-4 px-4 align-middle text-[13px] text-slate-500 dark:text-slate-400 ${spanBorder}`}>
                              {reg.dept.shortName}
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    })
                  })}
                </TableBody>
              </Table>
            </div>

          </div>
        )
      })}
    </div>
  )
}