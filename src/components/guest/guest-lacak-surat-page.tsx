"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { LogIn, Plus, Search, X } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { routes } from "@/constants/routes"
import type { TrackCategory, TrackField, TrackRecord, TrackRecordResponse, TrackSheet, TrackTableResponse } from "@/types"

type FieldGroup = {
  category?: TrackCategory
  name: string
  color: string
  fields: TrackField[]
}

const SEARCH_MAX_LENGTH = 50
const GUEST_EMPTY_STATE_COLORS = {
  iconClassName: "text-[#1f2f46] dark:text-[#1f2f46]",
  titleClassName: "text-[#1f2f46] dark:text-[#1f2f46]",
  descriptionClassName: "text-[#546783] dark:text-[#546783]",
}

function getCategoryTextColor(backgroundColor: string) {
  const hex = backgroundColor.replace("#", "")
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return "#1f2937"

  const red = parseInt(hex.slice(0, 2), 16)
  const green = parseInt(hex.slice(2, 4), 16)
  const blue = parseInt(hex.slice(4, 6), 16)
  const mix = 0.68

  return `rgb(${Math.round(red * mix)}, ${Math.round(green * mix)}, ${Math.round(blue * mix)})`
}

function getSoftCategoryStyle(backgroundColor: string) {
  const hex = backgroundColor.replace("#", "")
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return {
      backgroundColor: "#f5f5f5",
      color: "#374151",
    }
  }

  const red = parseInt(hex.slice(0, 2), 16)
  const green = parseInt(hex.slice(2, 4), 16)
  const blue = parseInt(hex.slice(4, 6), 16)
  const mix = 0.78
  const softRed = Math.round(red + (255 - red) * mix)
  const softGreen = Math.round(green + (255 - green) * mix)
  const softBlue = Math.round(blue + (255 - blue) * mix)
  const softColor = `rgb(${softRed}, ${softGreen}, ${softBlue})`

  return {
    backgroundColor: softColor,
    color: getCategoryTextColor(backgroundColor),
  }
}

const sheetsFetcher = async (url: string): Promise<TrackTableResponse> => {
  const res = await fetch(url)
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil sheet lacak")
  return json
}

const recordsFetcher = async (url: string): Promise<TrackRecordResponse> => {
  const res = await fetch(url)
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil data lacak surat")
  return json
}

function isDefaultIdField(field: TrackField) {
  return field.columnName.trim().toLowerCase() === "id"
}

function getRecordValue(record: TrackRecord, field: TrackField, index: number) {
  if (isDefaultIdField(field)) return String(index + 1)
  return record.values[field.id]?.trim() || "-"
}

function buildDisplayGroups(sheet: TrackSheet): FieldGroup[] {
  const visibleFields = sheet.fields.filter((field) => !isDefaultIdField(field))
  const groups: FieldGroup[] = []

  sheet.categories.forEach((category) => {
    const fields = visibleFields.filter((field) => field.categoryId === category.id)
    if (fields.length === 0) return
    groups.push({
      category,
      name: category.name,
      color: category.color,
      fields,
    })
  })

  const uncategorized = visibleFields.filter((field) => !field.categoryId)
  if (uncategorized.length > 0 || groups.length === 0) {
    groups.push({
      name: groups.length > 0 ? "Tanpa Kategori" : sheet.name,
      color: "#fff7a8",
      fields: uncategorized.length > 0 ? uncategorized : visibleFields,
    })
  }

  return groups
}

function getSearchHaystack(record: TrackRecord, fields: TrackField[]) {
  const priorityValues = fields
    .filter((field) => {
      const label = field.columnName.toLowerCase()
      return label.includes("supplier") || label.includes("invoice")
    })
    .map((field) => record.values[field.id] ?? "")

  const allValues = fields.map((field) => record.values[field.id] ?? "")
  return [...priorityValues, ...allValues].join(" ").toLowerCase()
}

function buildCategorySegment(categoryName: string) {
  return `category=${encodeURIComponent(categoryName)}`
}

type GuestLacakSuratPageProps = {
  initialSheetId?: string
}

export function GuestLacakSuratPage({ initialSheetId = "" }: GuestLacakSuratPageProps) {
  const router = useRouter()
  const [selectedSheetId, setSelectedSheetId] = useState(initialSheetId)
  const [query, setQuery] = useState("")
  const [searchExpanded, setSearchExpanded] = useState(false)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  const { data: sheetData, error: sheetsError, isLoading: sheetsLoading } = useSWR<TrackTableResponse>(
    "/api/guest/track-sheets",
    sheetsFetcher,
    {
      refreshInterval: 5_000,
      revalidateOnFocus: true,
    }
  )
  const sheets = sheetData?.sheets ?? []
  const selectedSheet = sheets.find((sheet) => sheet.id === selectedSheetId) ?? sheets[0]
  const recordsKey = selectedSheet ? `/api/guest/track-records?sheetId=${encodeURIComponent(selectedSheet.id)}` : null
  const { data: recordData, error: recordsError, isLoading: recordsLoading } = useSWR<TrackRecordResponse>(
    recordsKey,
    recordsFetcher
  )
  const records = recordData?.records ?? []
  const initialLoading = (sheetsLoading && sheets.length === 0) || (recordsLoading && records.length === 0)
  const blockingError = (sheetsError && sheets.length === 0)
    ? sheetsError
    : recordsError && records.length === 0
      ? recordsError
      : null
  const groups = useMemo(() => selectedSheet ? buildDisplayGroups(selectedSheet) : [], [selectedSheet])
  const visibleGroups = useMemo(() => {
    if (!selectedSheet) return []
    if (selectedSheet.categories.length === 0) return groups
    const firstCategoryGroup = groups.find((group) => group.category)
    return firstCategoryGroup ? [firstCategoryGroup] : groups.slice(0, 1)
  }, [groups, selectedSheet])
  const allFields = useMemo(
    () => selectedSheet?.fields.filter((field) => !isDefaultIdField(field)) ?? [],
    [selectedSheet]
  )
  const filteredRecords = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return records
    return records.filter((record) => getSearchHaystack(record, allFields).includes(trimmed))
  }, [allFields, query, records])

  useEffect(() => {
    setSelectedSheetId(initialSheetId)
  }, [initialSheetId])

  useEffect(() => {
    if (sheets.length === 0) return

    const nextSheetId = sheets.some((sheet) => sheet.id === selectedSheetId)
      ? selectedSheetId
      : sheets[0].id

    if (selectedSheetId !== nextSheetId) {
      setSelectedSheetId(nextSheetId)
    }

    if (initialSheetId !== nextSheetId) {
      router.replace(`${routes.guest.lacakSurat}/${encodeURIComponent(nextSheetId)}`, { scroll: false })
    }
  }, [initialSheetId, router, selectedSheetId, sheets])

  useEffect(() => {
    if (!searchExpanded) return
    window.setTimeout(() => mobileSearchRef.current?.focus(), 50)
  }, [searchExpanded])

  function selectSheet(sheetId: string) {
    setSelectedSheetId(sheetId)
    setQuery("")
    setSearchExpanded(false)
    router.push(`${routes.guest.lacakSurat}/${encodeURIComponent(sheetId)}`, { scroll: false })
  }

  function clearSearch() {
    setQuery("")
    setSearchExpanded(false)
  }

  return (
    <main className="min-h-svh bg-[#fbfbfb] text-black">
      <header className="sticky top-0 z-40 grid min-h-16 grid-cols-[minmax(120px,1fr)_minmax(220px,520px)_minmax(120px,1fr)] items-center gap-4 border-b border-neutral-200 bg-white px-6 py-3 max-md:grid-cols-[1fr_auto_auto] max-md:gap-2 max-sm:px-4">
        <h1 className={`text-sm font-semibold ${(searchExpanded || query.trim().length > 0) ? "max-md:hidden" : ""}`}>
          Lacak Surat
        </h1>
        <div className="relative max-md:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value.slice(0, SEARCH_MAX_LENGTH))}
            placeholder="Ketik disini untuk mencari"
            maxLength={SEARCH_MAX_LENGTH}
            className="h-9 rounded-lg border-neutral-300 bg-white pl-10 text-left text-[13px] shadow-none placeholder:text-neutral-500 focus-visible:ring-blue-200 sm:text-right"
          />
        </div>
        <button
          type="button"
          onClick={() => setSearchExpanded(true)}
          aria-label="Cari"
          className={`hidden size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-100 max-md:flex ${(searchExpanded || query.trim().length > 0) ? "max-md:hidden" : ""}`}
        >
          <Search className="size-4" />
        </button>
        <div className={`flex justify-end ${(searchExpanded || query.trim().length > 0) ? "max-md:hidden" : ""}`}>
          <Link
            href={routes.login}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-100 px-4 text-[13px] font-medium text-blue-700 transition-colors hover:bg-blue-200 max-lg:size-9 max-lg:justify-center max-lg:px-0"
          >
            <LogIn className="size-4" />
            <span className="max-lg:sr-only">Login</span>
          </Link>
        </div>
        {(searchExpanded || query.trim().length > 0) ? (
          <div className="hidden min-w-0 items-center gap-2 max-md:col-span-3 max-md:flex">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
              <Input
                ref={mobileSearchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value.slice(0, SEARCH_MAX_LENGTH))}
                placeholder="Ketik disini untuk mencari"
                maxLength={SEARCH_MAX_LENGTH}
                className="h-9 rounded-lg border-neutral-300 bg-white pl-10 text-left text-[13px] shadow-none placeholder:text-neutral-500 focus-visible:ring-blue-200"
              />
            </div>
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Tutup pencarian"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}
      </header>

      <section className="px-6 py-6 pb-[calc(7rem+env(safe-area-inset-bottom))] max-md:px-4 max-md:py-4">
        {initialLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-9 w-full rounded-lg bg-neutral-200" />
            <Skeleton className="h-24 w-full rounded-xl bg-neutral-200" />
          </div>
        ) : blockingError ? (
          <EmptyState
            title="Gagal memuat data"
            description={blockingError.message}
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : !selectedSheet ? (
          <EmptyState
            title="Belum ada sheet lacak"
            description="Sheet lacak belum tersedia untuk ditampilkan."
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            title={query.trim() ? "Tidak ada data yang dicari" : "Tidak ada data terbaru"}
            description={query.trim() ? "Data yang dicari tidak ditemukan." : "Tidak ada data terbaru untuk saat ini."}
            className="min-h-[min(360px,calc(100svh-180px))]"
            {...GUEST_EMPTY_STATE_COLORS}
          />
        ) : (
          <div className="grid gap-4">
            {visibleGroups.map((group) => (
              <section key={group.category?.id ?? "uncategorized"} className="grid gap-3">
                {group.category ? (
                  <div
                    className="rounded-lg px-4 py-2 text-center text-xs font-bold tracking-[0px]"
                    style={getSoftCategoryStyle(group.color)}
                  >
                    {group.name}
                  </div>
                ) : null}

                <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                  <div
                    className="min-w-full overflow-hidden rounded-xl border border-neutral-200 bg-white"
                  >
                    <div
                      className="grid bg-neutral-50"
                      style={{ gridTemplateColumns: `44px repeat(${group.fields.length}, minmax(clamp(88px, 26vw, 150px), 1fr))` }}
                    >
                      <div className="border-r border-neutral-200 px-2 py-3 text-center text-[11px] font-bold tracking-[0px] text-neutral-600 sm:px-4 sm:text-[12px]">
                        No.
                      </div>
                      {group.fields.map((field) => (
                        <div
                          key={field.id}
                          className="break-words border-r border-neutral-200 px-2 py-3 text-center text-[11px] font-bold leading-tight tracking-[0px] text-neutral-600 last:border-r-0 sm:px-4 sm:text-[12px]"
                        >
                          {field.columnName}
                        </div>
                      ))}
                    </div>
                    {filteredRecords.map((record, index) => (
                      <Link
                        key={`${group.name}-${record.id}`}
                        href={`${routes.guest.lacakSurat}/view-detail/${buildCategorySegment(group.name)}/${encodeURIComponent(record.id)}`}
                        className="grid w-full cursor-pointer text-left outline-none transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-blue-200"
                        style={{ gridTemplateColumns: `44px repeat(${group.fields.length}, minmax(clamp(88px, 26vw, 150px), 1fr))` }}
                      >
                        <div className="border-r border-t border-neutral-200 px-2 py-3 text-center text-xs sm:px-4 sm:text-sm">
                          {index + 1}
                        </div>
                        {group.fields.map((field) => (
                          <div
                            key={`${record.id}-${field.id}`}
                            className="break-words border-r border-t border-neutral-200 px-2 py-3 text-xs tracking-[0px] last:border-r-0 sm:px-4 sm:text-sm"
                          >
                            {getRecordValue(record, field, index)}
                          </div>
                        ))}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      {sheets.length > 0 ? (
        <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-40 max-w-[calc(100vw-6.5rem)] -translate-x-1/2 overflow-x-auto rounded-full border border-neutral-200 bg-white/95 p-1 shadow-sm backdrop-blur max-sm:left-4 max-sm:right-auto max-sm:translate-x-0">
          <div className="flex min-w-max items-center gap-1">
            {sheets.map((sheet) => {
              const active = selectedSheet?.id === sheet.id
              return (
                <button
                  key={sheet.id}
                  type="button"
                  onClick={() => selectSheet(sheet.id)}
                  className={`h-9 rounded-full px-4 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  {sheet.name}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {selectedSheet ? (
        <Link
          href={`${routes.guest.lacakSurat}/add?sheet=${encodeURIComponent(selectedSheet.id)}`}
          aria-label="Tambah data"
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-40 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 max-sm:right-4"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          aria-label="Tambah data"
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-40 flex size-14 cursor-not-allowed items-center justify-center rounded-full bg-blue-200 text-white shadow-lg max-sm:right-4"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>
      )}

    </main>
  )
}
