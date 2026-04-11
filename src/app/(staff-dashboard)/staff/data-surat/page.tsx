"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Loader2, Plus } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

// ─── Types ───────────────────────────────────────────────────────────────────

interface DataSurat {
  id:            number
  nomor:         string
  deptId:        string
  dept:          { shortName: string }
  tanggalTerima: string
  tanggalSurat:  string
  asalSurat:     string
  perihal:       string
  tujuan:        string
  noSurat:       string | null
  lampiran:      string | null
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DataSuratPage() {
  const [data,    setData]    = useState<DataSurat[]>([])
  const [loading, setLoading] = useState(true)
  const router       = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetch("/api/surat")
      .then(r => {
        if (!r.ok) throw new Error("Gagal mengambil data")
        return r.json()
      })
      .then(json => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))

    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
  }, [])

  // ── Filter dari URL params ─────────────────────────────────────────────────
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

  // ── Group by tanggal + dept ────────────────────────────────────────────────
  const groupedData = filteredData.reduce((acc: Record<string, DataSurat[]>, item) => {
    const dateKey  = item.tanggalTerima
      ? format(new Date(item.tanggalTerima), "dd MMMM yyyy", { locale: id }).toUpperCase()
      : "TANPA TANGGAL"
    const groupKey = `${dateKey}|||${item.deptId}`
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(item)
    return acc
  }, {})

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex h-100 w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em]">Memuat Arsip...</p>
    </div>
  )

  // ── Empty ──────────────────────────────────────────────────────────────────
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

  // ── Tabel ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-none">
        <Table className="border-collapse table-fixed w-full">

          <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-12 border-r border-slate-200 dark:border-slate-800 p-0" />
              <TableHead className="w-52 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">
                Nomor Reg
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">
                Perihal
              </TableHead>
              <TableHead className="w-32 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800 text-center">
                Lampiran
              </TableHead>
              <TableHead className="w-44 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">
                Tujuan
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.keys(groupedData).map((groupKey) => {
              const [date, dept] = groupKey.split("|||")
              const items        = groupedData[groupKey]

              return (
                <React.Fragment key={groupKey}>

                  {/* Group header: tanggal · dept */}
                  <TableRow className="bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
                    <TableCell className="border-r border-slate-200 dark:border-slate-800 p-0" />
                    <TableCell colSpan={4} className="py-2 px-4 font-black text-[11px] text-slate-500 dark:text-slate-400">
                      {date} · {dept}
                    </TableCell>
                  </TableRow>

                  {/* Baris data */}
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      onClick={() => router.push(`/staff/view/${item.deptId}/${item.id}`)}
                      className="group border-b border-slate-200 dark:border-slate-800 last:border-0 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all cursor-pointer"
                    >
                      {/* Checkbox */}
                      <TableCell
                        className="w-12 p-0 border-r border-slate-200 dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center h-12 w-full">
                          <Checkbox className="border-slate-300 dark:border-slate-600 rounded-sm" />
                        </div>
                      </TableCell>

                      {/* Nomor Reg */}
                      <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800 font-mono text-[12px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.nomor}
                      </TableCell>

                      {/* Perihal */}
                      <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800 text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {item.perihal}
                      </TableCell>

                      {/* Lampiran */}
                      <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {item.lampiran ?? "—"}
                      </TableCell>

                      {/* Tujuan */}
                      <TableCell className="py-4 px-4 text-[13px] text-slate-500 dark:text-slate-400">
                        {item.deptId}
                      </TableCell>
                    </TableRow>
                  ))}

                </React.Fragment>
              )
            })}
          </TableBody>

        </Table>
      </div>
    </div>
  )
}