"use client"

import type { DetailSurat, RegisterSurat } from "@/types"
import { format, isValid } from "date-fns"
import { id }             from "date-fns/locale"
import {
  ASAL_DEFAULT_ID,
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
} from "@/constants/departemen-columns"
import { compareRegisterNomor } from "@/lib/surat-helpers"
import {
  formatCustomFieldValue,
  getCustomFieldValue,
  getSuratBuiltInFieldValue,
  isTujuanColumn,
} from "@/domain/surat/custom-fields"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

const CETAK_IDS_KEY = "cetak:ids"
const LIMIT = 20
const SEARCH_COLUMN_ALL = "all"

const STATIC_SEARCH_COLUMNS = [
  { id: "nomor_register", label: "Nomor Register" },
  { id: "asal_surat", label: "Asal Surat" },
]
const HIDDEN_SEARCH_COLUMN_OPTIONS = new Set([SEARCH_COLUMN_ALL, "tanggal_terima", "tujuan"])

function isClient() { return typeof window !== "undefined" }

function safeFormat(date: string | Date | null | undefined, fmt: string): string | null {
  if (!date) return null
  const d = new Date(date)
  return isValid(d) ? format(d, fmt, { locale: id }) : null
}

function hasVisibleDetails(register: RegisterSurat) {
  return (register.detailSurat ?? []).length > 0
}

function normalizeSearchText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function normalizeColumnLabel(label: string) {
  return normalizeSearchText(label).replace(/[^a-z0-9]+/g, " ").trim()
}

function dedupeSearchValues(values: unknown[]) {
  const seen = new Set<string>()

  return values.filter((value) => {
    const text = String(value ?? "").trim()
    if (!text) return false
    if (seen.has(text)) return false
    seen.add(text)
    return true
  })
}

function getBuiltInDetailSearchValues(columnLabel: string, detail: DetailSurat) {
  if (columnLabel === "perihal" || columnLabel === "perihal surat") return [detail.perihal]
  if (columnLabel === "nomor surat" || columnLabel === "no surat") return [detail.noSurat]
  if (columnLabel === "lampiran") return [detail.lampiran]

  if (columnLabel === "tanggal surat" || columnLabel === "tgl surat") {
    return [
      detail.tanggalSurat,
      safeFormat(detail.tanggalSurat, "dd MMMM yyyy"),
    ]
  }

  return []
}

function getCustomFieldSearchValues(detail: DetailSurat, selectedColumn?: string) {
  const entries = Object.entries(detail.customFields ?? {})
  if (!selectedColumn) return entries.map(([, value]) => value)

  return entries
    .filter(([key]) => {
      const normalizedKey = normalizeColumnLabel(key)
      return normalizedKey === selectedColumn || normalizedKey.endsWith(` ${selectedColumn}`)
    })
    .map(([, value]) => value)
}

function getColumnSearchId(column: { id: string; label: string }) {
  const columnId = String(column.id)
  if (columnId.includes(NOMOR_DEFAULT_ID)) return "nomor_register"
  if (columnId.includes(TANGGAL_DEFAULT_ID)) return "tanggal_terima"
  if (columnId.includes(ASAL_DEFAULT_ID)) return "asal_surat"
  if (isTujuanColumn(column)) return "tujuan"
  return `column:${normalizeColumnLabel(column.label)}`
}

function canShowSearchColumnOption(columnId: string) {
  if (HIDDEN_SEARCH_COLUMN_OPTIONS.has(columnId)) return false

  if (columnId.startsWith("column:")) {
    const columnLabel = columnId.replace(/^column:/, "")
    return !["tanggal", "tanggal surat", "tgl surat"].includes(columnLabel)
  }

  return true
}

function getColumnValue(column: any, reg: RegisterSurat, detail: DetailSurat) {
  if (String(column.id).includes(TANGGAL_DEFAULT_ID)) {
    return formatCustomFieldValue({ ...column, type: "date" }, reg.tanggalTerima)
  }
  if (String(column.id).includes(ASAL_DEFAULT_ID)) return reg.asalSurat || "-"
  if (isTujuanColumn(column)) return detail.tujuan || reg.dept.shortName || "-"

  const builtInValue = getSuratBuiltInFieldValue(column, detail as unknown as Record<string, unknown>)
  if (builtInValue !== null) return builtInValue

  return formatCustomFieldValue(column, getCustomFieldValue(column, detail.customFields))
}

function getStaticColumnValue(columnId: string, reg: RegisterSurat, detail: any) {
  if (columnId === "nomor_register") return reg.nomor
  if (columnId === "tanggal_terima") {
    return [
      reg.tanggalTerima,
      safeFormat(reg.tanggalTerima, "dd MMMM yyyy"),
    ].filter(Boolean).join(" ")
  }
  if (columnId === "asal_surat") return reg.asalSurat
  if (columnId === "tujuan") return detail.tujuan || reg.dept.shortName
  return ""
}

function getSingleSelectedPrintSheetName(data: RegisterSurat[], selectedIds: Set<number>) {
  const selectedRows = data.filter((reg) => selectedIds.has(reg.id))
  if (selectedRows.length !== selectedIds.size) return ""

  const sheetNames = new Set(
    selectedRows
      .map((reg) => reg.dept.printSheetName?.trim() ?? "")
      .filter(Boolean)
  )

  return sheetNames.size === 1 ? Array.from(sheetNames)[0] : ""
}

function getDetailColumnTexts(reg: RegisterSurat, detail: DetailSurat, selectedColumn: string) {
  if (selectedColumn !== SEARCH_COLUMN_ALL && !selectedColumn.startsWith("column:")) {
    return [getStaticColumnValue(selectedColumn, reg, detail)]
  }

  const displayColumns = reg.dept.displayColumns ?? []
  const values: unknown[] = displayColumns
    .filter((column) => selectedColumn === SEARCH_COLUMN_ALL || getColumnSearchId(column) === selectedColumn)
    .map((column) => getColumnValue(column, reg, detail))

  if (selectedColumn.startsWith("column:")) {
    const columnLabel = selectedColumn.replace(/^column:/, "")
    values.push(
      ...getBuiltInDetailSearchValues(columnLabel, detail),
      ...getCustomFieldSearchValues(detail, columnLabel)
    )
  }

  if (selectedColumn === SEARCH_COLUMN_ALL) {
    values.push(
      detail.perihal,
      detail.noSurat,
      detail.lampiran,
      detail.tanggalSurat,
      safeFormat(detail.tanggalSurat, "dd MMMM yyyy"),
      detail.tujuan,
      ...getCustomFieldSearchValues(detail)
    )
  }

  return dedupeSearchValues(values)
}

function detailMatchesSearch(reg: RegisterSurat, detail: DetailSurat, selectedColumn: string, normalizedQuery: string) {
  return getDetailColumnTexts(reg, detail, selectedColumn)
    .some((value) => normalizeSearchText(value).includes(normalizedQuery))
}

function getRegisterSearchText(reg: RegisterSurat, selectedColumn: string) {
  if (selectedColumn === SEARCH_COLUMN_ALL) {
    return [
      reg.nomor,
      reg.dept.shortName,
      reg.asalSurat,
      reg.tanggalTerima,
      safeFormat(reg.tanggalTerima, "dd MMMM yyyy"),
    ].join(" ")
  }

  if (["nomor_register", "tanggal_terima", "asal_surat"].includes(selectedColumn)) {
    return getStaticColumnValue(selectedColumn, reg, reg.detailSurat?.[0] ?? {})
  }

  return ""
}

export function useDataSurat(printPath: string) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const filterDate     = searchParams.get("date")
  const filterDeptsRaw = searchParams.get("dept") ?? ""
  const filterDepts    = useMemo(
    () => filterDeptsRaw.split(",").filter(Boolean),
    [filterDeptsRaw]
  )
  const searchQuery = searchParams.get("search") ?? ""
  const requestedSearchColumn = searchParams.get("column") ?? SEARCH_COLUMN_ALL

  const [data,        setData]        = useState<RegisterSurat[]>([])
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore,     setHasMore]     = useState(true)
  const [page,        setPage]        = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  // ✅ Gunakan ref untuk track filter aktif — hindari stale closure di fetchPage
  const filterRef = useRef({ filterDate, filterDeptsRaw })
  useEffect(() => {
    filterRef.current = { filterDate, filterDeptsRaw }
  }, [filterDate, filterDeptsRaw])

  // ✅ fetchPage sekarang kirim filter ke API — bukan filter di client
  const fetchPage = useCallback(async (pageNum: number, replace = false) => {
    try {
      const { filterDate, filterDeptsRaw } = filterRef.current

      const params = new URLSearchParams()
      if (filterDate)    params.set("date",  filterDate)           // ✅ kirim ke API
      if (filterDeptsRaw) params.set("dept", filterDeptsRaw)      // ✅ kirim ke API
      params.set("page",  String(pageNum))
      params.set("limit", String(LIMIT))

      const res = await fetch(`/api/surat?${params.toString()}`)
      if (!res.ok) throw new Error("Gagal mengambil data")
      const result = await res.json()

      if (
        typeof result === "object" &&
        result !== null &&
        "data" in result &&
        Array.isArray(result.data)
      ) {
        const rows = result.data as RegisterSurat[]
        setData(prev => replace ? rows : [...prev, ...rows])
        setHasMore("hasMore" in result ? Boolean(result.hasMore) : false)
      } else {
        setData([])
        setHasMore(false)
      }
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, []) // ✅ tidak ada dependency — pakai ref agar tidak re-create

  // ✅ Reset + fetch ulang dari page 1 setiap kali filter berubah
  // Digabung dalam satu effect agar tidak ada race condition
  useEffect(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    setLoading(true)
    fetchPage(1, true)

    window.dispatchEvent(new CustomEvent("breadcrumb:sub",    { detail: null }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [filterDate, filterDeptsRaw, fetchPage])

  // Load more saat page bertambah (bukan page 1 — sudah ditangani effect atas)
  useEffect(() => {
    if (page === 1) return
    setLoadingMore(true)
    fetchPage(page)
  }, [page, fetchPage])

  // ✅ groupedData & sortedGroupKeys langsung dari data (tidak perlu filteredData lagi
  //    karena filter sudah dilakukan di server/API)
  const searchColumns = useMemo(() => {
    const options = new Map<string, string>()
    STATIC_SEARCH_COLUMNS.forEach((column) => options.set(column.id, column.label))

    data.forEach((reg) => {
      ;(reg.dept.displayColumns ?? []).forEach((column) => {
        const columnId = getColumnSearchId(column)
        if (canShowSearchColumnOption(columnId) && !options.has(columnId)) {
          options.set(columnId, column.label)
        }
      })
    })

    return Array.from(options, ([id, label]) => ({ id, label }))
  }, [data])

  const searchColumn = useMemo(
    () => searchColumns.some((column) => column.id === requestedSearchColumn)
      ? requestedSearchColumn
      : SEARCH_COLUMN_ALL,
    [requestedSearchColumn, searchColumns]
  )

  const visibleBeforeSearch = useMemo(
    () => data.filter(hasVisibleDetails),
    [data]
  )

  const visibleData = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery)
    if (!normalizedQuery) return visibleBeforeSearch

    return visibleBeforeSearch
      .map((reg) => {
        const registerText = normalizeSearchText(getRegisterSearchText(reg, searchColumn))
        if (registerText.includes(normalizedQuery)) return reg

        const matchingDetails = (reg.detailSurat ?? [])
          .filter((detail) => detailMatchesSearch(reg, detail, searchColumn, normalizedQuery))

        return matchingDetails.length > 0
          ? { ...reg, detailSurat: matchingDetails }
          : null
      })
      .filter((reg): reg is RegisterSurat => reg !== null)
  }, [searchColumn, searchQuery, visibleBeforeSearch])

  const groupedData = useMemo(() => {
    const grouped = visibleData.reduce((acc: Record<string, RegisterSurat[]>, reg) => {
      const formatted = safeFormat(reg.tanggalTerima, "dd MMMM yyyy")
      const dateKey   = formatted ? formatted.toUpperCase() : "TANPA TANGGAL"
      const groupKey  = `${dateKey}|||${reg.deptId}|||${reg.dept.shortName}`
      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(reg)
      return acc
    }, {})

    Object.values(grouped).forEach((registers) => registers.sort(compareRegisterNomor))
    return grouped
  }, [visibleData])

  const sortedGroupKeys = useMemo(() =>
    Object.keys(groupedData).sort((a, b) => {
      const dateA = new Date(groupedData[a][0].tanggalTerima)
      const dateB = new Date(groupedData[b][0].tanggalTerima)
      return dateB.getTime() - dateA.getTime()
    }),
  [groupedData])

  const actions = {
    toggleSelect: (itemId: number) => {
      setSelectedIds(prev => {
        const next = new Set(prev)
        next.has(itemId) ? next.delete(itemId) : next.add(itemId)
        return next
      })
    },
    clearSelection: () => {
      setSelectedIds(new Set())
    },
    handlePrint: () => {
      const idsString = Array.from(selectedIds).join(",")
      if (!isClient()) return
      try { sessionStorage.setItem(CETAK_IDS_KEY, idsString) } catch {}
      const printSheetName = getSingleSelectedPrintSheetName(data, selectedIds)
      if (!printSheetName) {
        toast.error("Pilih data dari satu nama lembar cetak yang sama")
        return
      }

      router.push(`${printPath}/${encodeURIComponent(printSheetName)}`)
    },
    loadMore: () => {
      if (!loadingMore && hasMore) setPage(p => p + 1)
    },
  }

  return {
    state: {
      loading, loadingMore, hasMore,
      filterDate, filterDepts,
      searchColumns,
      hasLoadedData: visibleBeforeSearch.length > 0,
      filteredData: visibleData,   // ✅ tidak perlu filteredData terpisah lagi
      groupedData, sortedGroupKeys, selectedIds,
    },
    actions,
  }
}
