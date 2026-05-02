"use client"

import { Checkbox }    from "@/components/ui/checkbox"
import { EmptyState }  from "@/components/ui/empty-state"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { getPermission }                          from "@/lib/permission"
import { format }                                 from "date-fns"
import { id }                                     from "date-fns/locale"
import { BrushCleaning, Plus, Printer }           from "lucide-react"
import { useRouter, useSearchParams }             from "next/navigation"
import { useCallback, useEffect, useState }       from "react"
import { RegisterSurat, Role }                    from "./shared"
import { LoadingSpinner }                         from "../shared/loading-skeleton"

interface Props {
  role:      Role
  basePath:  string
  printPath: string
}

const SESSION_KEY = "datasurat:selectedIds"

function readSession(): Set<number> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function writeSession(ids: Set<number>) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(ids)))
  } catch {}
}

export default function DataSuratPage({ role, basePath, printPath }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const perm         = getPermission(role)

  const showPI = searchParams.get("mode") === "pi"

  const [data,        setData]        = useState<RegisterSurat[]>([])
  const [loading,     setLoading]     = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    setSelectedIds(readSession())
  }, [])

  useEffect(() => {
    writeSession(selectedIds)
  }, [selectedIds])

  const toggleSelect = (id: number) =>
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const clearSelection = () => {
    setSelectedIds(new Set())
    try { sessionStorage.removeItem(SESSION_KEY) } catch {}
  }

  const loadData = useCallback(() => {
    setLoading(true)
    const url = showPI ? "/api/surat?type=pi" : "/api/surat"
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(json => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [showPI])

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
    const matchDept = filterDepts.length > 0 ? filterDepts.includes(reg.deptId) : true
    const matchPI   = showPI ? reg.deptId === "PI" : reg.deptId !== "PI"
    return matchDate && matchDept && matchPI
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

  // ✅ Sort group keys: tanggal terbaru di paling atas
  const sortedGroupKeys = Object.keys(groupedData).sort((a, b) => {
    const dateA = new Date(groupedData[a][0].tanggalTerima)
    const dateB = new Date(groupedData[b][0].tanggalTerima)
    return dateB.getTime() - dateA.getTime()
  })

  if (loading) return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <LoadingSpinner message="Memuat data surat…" />
    </div>
  )

  if (filteredData.length === 0) return (
    <EmptyState
      description={
        <span className="leading-none">
          {filterDate || filterDepts.length > 0 || showPI
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
      {/* ✅ Pakai sortedGroupKeys — bukan Object.keys(groupedData) */}
      {sortedGroupKeys.map((groupKey) => {
        const [date, dept] = groupKey.split("|||")
        const registers    = groupedData[groupKey]

        return (
          <div
            key={groupKey}
            className="rounded-xl border border-slate-200 dark:border-slate-800
              bg-white dark:bg-slate-950 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5
              bg-slate-50 dark:bg-slate-900
              border-b border-slate-200 dark:border-slate-800">
              <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">
                {date}
              </span>
              <span className="text-[11px] font-medium
                text-blue-700 dark:text-blue-300
                bg-blue-50 dark:bg-blue-900/30
                border border-blue-200 dark:border-blue-800
                rounded-full px-2.5 py-0.5">
                {dept}
              </span>
            </div>

            {/* ── Mobile ── */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {registers.map((reg) => (
                <div key={reg.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(reg.id)}
                        onCheckedChange={() => toggleSelect(reg.id)}
                        className="border-slate-300 dark:border-slate-600 rounded-sm"
                      />
                      <span className="font-mono text-[12px] font-bold text-blue-600 dark:text-blue-400">
                        {reg.nomor}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                      {reg.dept.shortName}
                    </span>
            </div>

            {showPI ? (
              <div className={((reg as any).detailPI ?? []).length > 1
                ? "rounded-lg border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden"
                : ""}>
                {((reg as any).detailPI ?? []).map((pi: any) => (
                  <div
                    key={pi.id}
                    onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
                    className="flex items-start gap-3 px-3 py-2.5
                      hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                      cursor-pointer active:bg-blue-100/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-slate-700 dark:text-slate-300
                        leading-snug mb-1 break-all whitespace-normal">
                        {pi.namaSupplier ?? "-"}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          <span className="text-slate-500 dark:text-slate-400">Invoice: </span>
                          {pi.noInvoice ?? "-"}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          <span className="text-slate-500 dark:text-slate-400">No. Surat: </span>
                          {pi.nomorSurat ?? "-"}
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
      ) : (
        <div className={reg.detailSurat.length > 1
          ? "rounded-lg border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden"
          : ""}>
          {reg.detailSurat.map((detail) => (
            <div
              key={detail.id}
              onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
              className="flex items-start gap-3 px-3 py-2.5
                hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                cursor-pointer active:bg-blue-100/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-slate-700 dark:text-slate-300
                  leading-snug mb-1 break-all whitespace-normal">
                  {detail.perihal}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="text-slate-500 dark:text-slate-400">No: </span>
                    {detail.noSurat ?? "-"}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="text-slate-500 dark:text-slate-400">Lamp: </span>
                    {detail.lampiran ?? "-"}
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
      )}
    </div>
  ))}
            </div>

            {/* ── Desktop ── */}
            <div className="hidden md:block overflow-x-auto">
              <Table className="border-collapse w-full min-w-[600px]">
                <TableHeader className="bg-slate-50 dark:bg-slate-900
                  border-b border-slate-200 dark:border-slate-800">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-12 border-r border-slate-200 dark:border-slate-800 p-0" />
                    <TableHead className="w-36 text-[10px] font-bold
                      text-slate-500 dark:text-slate-400 uppercase tracking-widest
                      px-4 border-r border-slate-200 dark:border-slate-800">
                      Nomor Reg
                    </TableHead>

                    {showPI ? (
                      <>
                        <TableHead className="text-[10px] font-bold
                          text-slate-500 dark:text-slate-400 uppercase tracking-widest
                          px-4 border-r border-slate-200 dark:border-slate-800">
                          Nama Supplier
                        </TableHead>
                        <TableHead className="w-36 text-[10px] font-bold
                          text-slate-500 dark:text-slate-400 uppercase tracking-widest
                          px-4 border-r border-slate-200 dark:border-slate-800">
                          No. Invoice
                        </TableHead>
                        <TableHead className="w-40 text-[10px] font-bold
                          text-slate-500 dark:text-slate-400 uppercase tracking-widest
                          px-4 border-r border-slate-200 dark:border-slate-800">
                          No. Surat
                        </TableHead>
                        <TableHead className="w-28 text-[10px] font-bold
                          text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">
                          Tujuan
                        </TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="text-[10px] font-bold
                          text-slate-500 dark:text-slate-400 uppercase tracking-widest
                          px-4 border-r border-slate-200 dark:border-slate-800">
                          Perihal
                        </TableHead>
                        <TableHead className="w-28 text-[10px] font-bold
                          text-slate-500 dark:text-slate-400 uppercase tracking-widest
                          px-4 border-r border-slate-200 dark:border-slate-800 text-center">
                          Lampiran
                        </TableHead>
                        <TableHead className="w-28 text-[10px] font-bold
                          text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">
                          Tujuan
                        </TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {registers.map((reg, regIdx) => {
                    const isLastReg = regIdx === registers.length - 1

                    // ── Mode PI ───────────────────────────────────────
                    if (showPI) {
                      const piDetails = (reg as any).detailPI ?? []
                      if (piDetails.length === 0) return null

                      return piDetails.map((pi: any, idx: number) => {
                        const isFirst        = idx === 0
                        const isLast         = idx === piDetails.length - 1
                        const isAbsoluteLast = isLastReg && isLast
                        const innerBorder    = isAbsoluteLast ? "" : isLast
                          ? "border-b border-b-slate-200 dark:border-b-slate-800"
                          : "border-b border-b-slate-100 dark:border-b-slate-800/50"
                        const spanBorder     = !isLastReg
                          ? "border-b border-b-slate-200 dark:border-b-slate-800" : ""

                        return (
                          <TableRow
                            key={pi.id}
                            onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
                            className="cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all"
                          >
                            {isFirst && (
                              <TableCell
                                rowSpan={piDetails.length}
                                onClick={e => e.stopPropagation()}
                                className={`w-12 p-0 border-r border-r-slate-200
                                  dark:border-r-slate-800 align-middle ${spanBorder}`}
                              >
                                <div className="flex items-center justify-center w-full">
                                  <Checkbox
                                    checked={selectedIds.has(reg.id)}
                                    onCheckedChange={() => toggleSelect(reg.id)}
                                    className="border-slate-300 dark:border-slate-600 rounded-sm"
                                  />
                                </div>
                              </TableCell>
                            )}
                            {isFirst && (
                              <TableCell
                                rowSpan={piDetails.length}
                                className={`py-4 px-4 border-r border-r-slate-200
                                  dark:border-r-slate-800 align-middle ${spanBorder}`}
                              >
                                <span className="font-mono text-[12px] font-bold
                                  text-slate-800 dark:text-slate-200">
                                  {reg.nomor}
                                </span>
                              </TableCell>
                            )}
                            <TableCell className={`max-w-0 py-3 px-4
                              border-r border-r-slate-200 dark:border-r-slate-800
                              text-[13px] text-slate-600 dark:text-slate-300
                              font-medium leading-relaxed whitespace-normal break-all ${innerBorder}`}>
                              {pi.namaSupplier ?? "-"}
                            </TableCell>
                            <TableCell className={`py-3 px-4
                              border-r border-r-slate-200 dark:border-r-slate-800
                              text-[13px] text-slate-500 dark:text-slate-400 ${innerBorder}`}>
                              {pi.noInvoice ?? "-"}
                            </TableCell>
                            <TableCell className={`py-3 px-4
                              border-r border-r-slate-200 dark:border-r-slate-800
                              text-[13px] text-slate-500 dark:text-slate-400 ${innerBorder}`}>
                              {pi.nomorSurat ?? "-"}
                            </TableCell>
                            {isFirst && (
                              <TableCell
                                rowSpan={piDetails.length}
                                className={`py-4 px-4 align-middle
                                  text-[13px] text-slate-500 dark:text-slate-400 ${spanBorder}`}
                              >
                                {pi.tujuan ?? reg.dept.shortName}
                              </TableCell>
                            )}
                          </TableRow>
                        )
                      })
                    }

                    // ── Mode Surat (default) ──────────────────────────
                    const details = reg.detailSurat

                    if (details.length === 1) {
                      const detail = details[0]
                      return (
                        <TableRow
                          key={reg.id}
                          onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
                          className={`group transition-all cursor-pointer
                            hover:bg-blue-50/50 dark:hover:bg-blue-900/20
                            ${!isLastReg ? "border-b border-slate-200 dark:border-slate-800" : ""}`}
                        >
                          <TableCell
                            className="w-12 p-0 border-r border-slate-200 dark:border-slate-800"
                            onClick={e => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center h-12 w-full">
                              <Checkbox
                                checked={selectedIds.has(reg.id)}
                                onCheckedChange={() => toggleSelect(reg.id)}
                                className="border-slate-300 dark:border-slate-600 rounded-sm"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-4 border-r border-slate-200 dark:border-slate-800
                            font-mono text-[12px] font-bold
                            text-slate-800 dark:text-slate-200
                            group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {reg.nomor}
                          </TableCell>
                          <TableCell className="max-w-0 py-4 px-4
                            border-r border-slate-200 dark:border-slate-800
                            text-[13px] text-slate-600 dark:text-slate-300
                            font-medium leading-relaxed whitespace-normal break-all">
                            {detail.perihal}
                          </TableCell>
                          <TableCell className="py-4 px-4
                            border-r border-slate-200 dark:border-slate-800
                            text-center text-[11px] font-medium
                            text-slate-400 dark:text-slate-500">
                            {detail.lampiran ?? "-"}
                          </TableCell>
                          <TableCell className="py-4 px-4 text-[13px] text-slate-500 dark:text-slate-400">
                            {reg.dept.shortName}
                          </TableCell>
                        </TableRow>
                      )
                    }

                    return details.map((detail, idx) => {
                      const isFirst        = idx === 0
                      const isLast         = idx === details.length - 1
                      const isAbsoluteLast = isLastReg && isLast
                      const innerBorder    = isAbsoluteLast ? "" : isLast
                        ? "border-b border-b-slate-200 dark:border-b-slate-800"
                        : "border-b border-b-slate-100 dark:border-b-slate-800/50"
                      const spanBorder     = !isLastReg
                        ? "border-b border-b-slate-200 dark:border-b-slate-800" : ""

                      return (
                        <TableRow
                          key={detail.id}
                          onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
                          className="cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all"
                        >
                          {isFirst && (
                            <TableCell
                              rowSpan={details.length}
                              onClick={e => e.stopPropagation()}
                              className={`w-12 p-0 border-r border-r-slate-200
                                dark:border-r-slate-800 align-middle ${spanBorder}`}
                            >
                              <div className="flex items-center justify-center w-full">
                                <Checkbox
                                  checked={selectedIds.has(reg.id)}
                                  onCheckedChange={() => toggleSelect(reg.id)}
                                  className="border-slate-300 dark:border-slate-600 rounded-sm"
                                />
                              </div>
                            </TableCell>
                          )}
                          {isFirst && (
                            <TableCell
                              rowSpan={details.length}
                              onClick={e => e.stopPropagation()}
                              className={`py-4 px-4 border-r border-r-slate-200
                                dark:border-r-slate-800 align-middle ${spanBorder}`}
                            >
                              <span className="font-mono text-[12px] font-bold
                                text-slate-800 dark:text-slate-200">
                                {reg.nomor}
                              </span>
                            </TableCell>
                          )}
                          <TableCell className={`max-w-0 py-3 px-4
                            border-r border-r-slate-200 dark:border-r-slate-800
                            text-[13px] text-slate-600 dark:text-slate-300
                            font-medium leading-relaxed whitespace-normal break-all ${innerBorder}`}>
                            {detail.perihal}
                          </TableCell>
                          <TableCell className={`py-3 px-4
                            border-r border-r-slate-200 dark:border-r-slate-800
                            text-center text-[11px] font-medium
                            text-slate-400 dark:text-slate-500 ${innerBorder}`}>
                            {detail.lampiran ?? "-"}
                          </TableCell>
                          {isFirst && (
                            <TableCell
                              rowSpan={details.length}
                              onClick={e => e.stopPropagation()}
                              className={`py-4 px-4 align-middle
                                text-[13px] text-slate-500 dark:text-slate-400 ${spanBorder}`}
                            >
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

      {/* ── Floating action bar ── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-1.5 p-1.5
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-700
          rounded-full shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60
          animate-in fade-in slide-in-from-bottom-2 duration-200">

          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300 px-3">
            {selectedIds.size} item dipilih
          </span>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

          <button
            onClick={() => {
              const ids = Array.from(selectedIds).join(",")
              if (showPI) {
                try { sessionStorage.setItem("cetak:ids:pi",  ids) } catch {}
              } else {
                try { sessionStorage.setItem("cetak:ids:all", ids) } catch {}
              }
              // ✅ Tidak perlu ?ids= di URL — sudah tersimpan di sessionStorage
              const cetakPath = showPI
                ? `${printPath}/pi`
                : `${printPath}/all`
              router.push(cetakPath)
            }}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-full
              bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium
              transition-colors shrink-0"
          >
            <Printer size={14} />
            Cetak
          </button>

          <button
            onClick={clearSelection}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-full
              bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/20
              text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400
              text-[13px] font-medium border border-slate-200 dark:border-slate-700
              hover:border-red-200 dark:hover:border-red-800
              transition-colors shrink-0"
          >
            <BrushCleaning size={13} />
            Bersihkan
          </button>
        </div>
      )}
    </div>
  )
}