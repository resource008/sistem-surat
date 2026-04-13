"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Loader2, Plus } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { DataSurat, Role } from "./shared"

interface Props {
  role: Role
  basePath: string  // "/staff" | "/admin" | "/pkl"
}

export default function DataSuratPage({ role, basePath }: Props) {
  const [data,    setData]    = useState<DataSurat[]>([])
  const [loading, setLoading] = useState(true)
  const router       = useRouter()
  const searchParams = useSearchParams()

  const canAdd = true

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
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [loadData])

  const filterDate  = searchParams.get("date")
  const filterDepts = searchParams.get("dept")?.split(",") ?? []

  const filteredData = data.filter(item => {
    const matchDate = filterDate
      ? format(new Date(item.tanggalTerima), "yyyy-MM-dd") === filterDate
      : true
    const matchDept = filterDepts.length > 0
      ? filterDepts.includes(item.deptId)
      : true
    return matchDate && matchDept
  })

  const groupedData = filteredData.reduce((acc: Record<string, DataSurat[]>, item) => {
    const dateKey  = item.tanggalTerima
      ? format(new Date(item.tanggalTerima), "dd MMMM yyyy", { locale: id }).toUpperCase()
      : "TANPA TANGGAL"
    const groupKey = `${dateKey}|||${item.deptId}`
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(item)
    return acc
  }, {})

  if (loading) return (
    <div className="flex h-100 w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-15px font-normal text-slate-500 dark:text-slate-400">Memuat Arsip...</p>
    </div>
  )

  if (filteredData.length === 0) return (
    <>
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
    </>
  )

  return (
  <div className="w-full animate-in fade-in duration-500 flex flex-col gap-3">
    {Object.keys(groupedData).map((groupKey) => {
      const [date, dept] = groupKey.split("|||")
      const items = groupedData[groupKey]
      return (
        <div key={groupKey}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">

          {/* Group header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">{date}</span>
            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-2.5 py-0.5">
              {dept}
            </span>
          </div>

          {/* ── MOBILE: card list (hidden md ke atas) ── */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <div key={item.id}
                onClick={() => router.push(`${basePath}/view/${item.deptId}/${item.id}`)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer active:bg-blue-100/50 transition-colors">
                <div onClick={(e) => e.stopPropagation()} className="pt-0.5">
                  <Checkbox className="border-slate-300 dark:border-slate-600 rounded-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[12px] font-bold text-blue-600 dark:text-blue-400">
                      {item.nomor}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug mb-2">
                    {item.perihal}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="text-slate-500 dark:text-slate-400">Dari: </span>
                      {item.asalSurat ?? "—"}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="text-slate-500 dark:text-slate-400">Lamp: </span>
                      {item.lampiran ?? "—"}
                    </span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>

          {/* ── TABLET & DESKTOP: tabel (hidden di bawah md) ── */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="border-collapse table-fixed min-w-140 w-full">
              <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-12 border-r border-slate-200 dark:border-slate-800 p-0" />
                  <TableHead className="w-44 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">Nomor Reg</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">Perihal</TableHead>
                  <TableHead className="w-32 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800 text-center">Lampiran</TableHead>
                  <TableHead className="w-40 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Tujuan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}
                    onClick={() => router.push(`${basePath}/view/${item.deptId}/${item.id}`)}
                    className="group border-b border-slate-200 dark:border-slate-800 last:border-0 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all cursor-pointer">
                    <TableCell className="w-12 p-0 border-r border-slate-200 dark:border-slate-800"
                      onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center h-12 w-full">
                        <Checkbox className="border-slate-300 dark:border-slate-600 rounded-sm" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800 font-mono text-[12px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.nomor}
                    </TableCell>
                    <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800 text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {item.perihal}
                    </TableCell>
                    <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {item.lampiran ?? "—"}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-[13px] text-slate-500 dark:text-slate-400">
                      {item.deptId}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        </div>
      )
    })}
  </div>
)
}