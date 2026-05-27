"use client"

import styles from "@/app/layout.module.css"
import { StaffSidebar } from "./staff-sidebar" // Import dari folder yang sama
import TopbarFilter from "@/components/filters/index"
import { TutorialCetak } from "@/components/shared/tutorial-cetak"
import { usePresenceHeartbeat } from "@/hooks/use-presence-heartbeat"
import {
  ArrowLeftRight, ChevronRight,
  Menu, Plus, Printer, X
} from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

interface Props {
  children: React.ReactNode
}

function StaffLayoutInner({ children }: Props) {
  const pathname     = usePathname()
  const router       = useRouter()
  const searchParams = useSearchParams()
  usePresenceHeartbeat()

  const [collapsed,   setCollapsed]   = useState(false)
  const [isMounted,   setIsMounted]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [isMobile,    setIsMobile]    = useState(false)
  const [subtitle,    setSubtitle]    = useState<string | null>(null)
  const [subsubtitle, setSubsubtitle] = useState<string | null>(null)

  const showPI       = searchParams.get("mode") === "pi"
  const roleLower    = "staff" // Hardcode role

  const [filters, setFilters] = useState<{
    date: string | null
    departments: string[]
  }>({ date: null, departments: [] })

  const [hasCetakData, setHasCetakData] = useState(false)

  const isDataSuratPage  = pathname === `/${roleLower}/data-surat`
  const isCetakPage      = pathname.startsWith(`/${roleLower}/cetak`)
  const hasActiveFilters = filters.date !== null || filters.departments.length > 0

  // Init: baca localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed")
    if (saved !== null && window.innerWidth >= 768) setCollapsed(JSON.parse(saved))
    try {
      const savedFilters = localStorage.getItem("topbar_filters")
      const parsed = savedFilters ? JSON.parse(savedFilters) : {}
      setFilters({ date: parsed.date ?? null, departments: parsed.departments ?? [] })
    } catch {}
    setIsMounted(true)
  }, [])

  // Simpan collapsed ke localStorage
  useEffect(() => {
    if (isMounted && !isMobile)
      localStorage.setItem("sidebar_collapsed", JSON.stringify(collapsed))
  }, [collapsed, isMounted, isMobile])

  // Responsive
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) { setCollapsed(false); setMobileOpen(false) }
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Reset mobile & breadcrumb saat navigasi
  useEffect(() => {
    setMobileOpen(false)
    setSubtitle(null)
    setSubsubtitle(null)
  }, [pathname])

  // Breadcrumb listeners
  useEffect(() => {
    const h = (e: Event) => setSubtitle((e as CustomEvent<string | null>).detail)
    window.addEventListener("breadcrumb:sub", h)
    return () => window.removeEventListener("breadcrumb:sub", h)
  }, [])

  useEffect(() => {
    const h = (e: Event) => setSubsubtitle((e as CustomEvent<string | null>).detail)
    window.addEventListener("breadcrumb:subsub", h)
    return () => window.removeEventListener("breadcrumb:subsub", h)
  }, [])

  // Cetak listeners
  useEffect(() => {
    const handler = (e: Event) => {
      const count = (e as CustomEvent<{ count: number }>).detail.count
      setHasCetakData(count > 0)
    }
    window.addEventListener("cetak:ids-ready", handler)
    return () => window.removeEventListener("cetak:ids-ready", handler)
  }, [])

  useEffect(() => {
    const handler = () => setHasCetakData(false)
    window.addEventListener("cetak:cleared", handler)
    return () => window.removeEventListener("cetak:cleared", handler)
  }, [])

  useEffect(() => {
    if (!pathname.includes("/cetak")) setHasCetakData(false)
  }, [pathname])

  function handleClearFilters() {
    const next = { date: null, departments: [] }
    setFilters(next)
    localStorage.removeItem("topbar_filters")
    router.push(showPI ? `/${roleLower}/data-surat?mode=pi` : `/${roleLower}/data-surat`)
  }

  function handleClearCetak() {
    window.dispatchEvent(new CustomEvent("cetak:clear"))
  }

  if (!isMounted) return <div className="min-h-screen bg-background" />

  const currentPage = (() => {
    if (pathname.includes("/cetak"))      return "Cetak"
    if (pathname.includes("/data-surat")) return "Data Surat"
    if (pathname.includes("/track"))      return "Track Surat"
    if (pathname.includes("/view/") || pathname.includes("/edit/")) return "Data Surat"
    return "Data Surat"
  })()

  const topbarLeft = isMobile ? "0px"
    : collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)"

  return (
    <div className={styles.root}>
      {isMobile && mobileOpen && (
        <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />
      )}

      {/* Panggil komponen khusus StaffSidebar */}
      <StaffSidebar
        collapsed={collapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onCollapse={setCollapsed}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main
        id="main-content"
        className={`
          ${styles.main}
          ${!isMobile && collapsed ? styles.mainCollapsed : ""}
          ${isMobile              ? styles.mainMobile    : ""}
        `}
        style={{ "--topbar-left": topbarLeft } as React.CSSProperties}
      >
        <div id="topbar" className={styles.topbar}>
          <div className={styles.topbarLeft}>
            {isMobile && (
              <button className={styles.hamburger} onClick={() => setMobileOpen(true)} aria-label="Buka menu">
                <Menu size={20} />
              </button>
            )}

            <nav className={styles.breadcrumb} aria-label="breadcrumb">
              {subtitle && subsubtitle ? (
                <>
                  <button className={styles.breadcrumbParent} onClick={() => router.push(`/${roleLower}/data-surat`)}>
                    {currentPage}
                  </button>
                  <ChevronRight size={14} className={styles.breadcrumbSep} />
                  <button className={styles.breadcrumbParent} onClick={() => router.back()}>
                    {subtitle}
                  </button>
                  <ChevronRight size={14} className={styles.breadcrumbSep} />
                  <span className={styles.breadcrumbSub}>{subsubtitle}</span>
                </>
              ) : subtitle ? (
                <>
                  <button className={styles.breadcrumbParent} onClick={() => router.push(`/${roleLower}/data-surat`)}>
                    {currentPage}
                  </button>
                  <ChevronRight size={14} className={styles.breadcrumbSep} />
                  <span className={styles.breadcrumbSub}>{subtitle}</span>
                </>
              ) : (
                <span className={styles.topbarTitle}>{currentPage}</span>
              )}
            </nav>
          </div>

          {/* Actions kanan: Data Surat */}
          {isDataSuratPage && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const base = `/${roleLower}/data-surat`
                  router.push(showPI ? base : `${base}?mode=pi`)
                }}
                title={showPI ? "Kembali ke semua surat" : "Tampilkan hanya data PI"}
                style={{
                  display     : "flex",
                  alignItems  : "center",
                  gap         : "6px",
                  padding     : "0 12px",
                  height      : "34px",
                  borderRadius: "8px",
                  border      : showPI ? "1px solid #2563eb" : "1px solid var(--border)",
                  background  : showPI ? "#2563eb" : "transparent",
                  color       : showPI ? "#ffffff" : "var(--muted-foreground)",
                  fontSize    : "13px",
                  fontWeight  : 500,
                  fontFamily  : "inherit",
                  cursor      : "pointer",
                  whiteSpace  : "nowrap",
                  flexShrink  : 0,
                  transition  : "all 0.2s ease",
                }}
              >
                <ArrowLeftRight size={14} />
                {!isMobile && (
                  <span>{showPI ? "Alihkan ke Surat" : "Alihkan ke PI"}</span>
                )}
              </button>

              {!showPI && (
                <TopbarFilter
                  initialFilters={filters}
                  onFilterChange={(f) => {
                    setFilters(f)
                    localStorage.setItem("topbar_filters", JSON.stringify(f))
                  }}
                />
              )}

              {!showPI && hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  title="Bersihkan filter"
                  className="flex items-center justify-center w-9 h-9 rounded-lg
                    border border-red-200 dark:border-red-800
                    bg-red-50 dark:bg-red-900/20
                    text-red-500 dark:text-red-400
                    hover:bg-red-100 dark:hover:bg-red-900/40
                    transition-colors shrink-0"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          )}

          {/* Actions kanan: Cetak */}
          {isCetakPage && (
            <div className="flex items-center gap-2">
              <TutorialCetak />
              <button
                onClick={hasCetakData ? handleClearCetak : undefined}
                disabled={!hasCetakData}
                title={hasCetakData ? "Bersihkan & kembali" : "Tidak ada data"}
                className={[
                  "flex items-center gap-1.5 px-4 h-9 rounded-lg",
                  "border text-[13px] font-medium transition-colors shrink-0",
                  hasCetakData
                    ? `border-slate-200 dark:border-slate-700
                       text-slate-500 dark:text-slate-400
                       hover:text-red-500 dark:hover:text-red-400
                       hover:border-red-200 dark:hover:border-red-800
                       hover:bg-red-50 dark:hover:bg-red-900/20`
                    : `border-slate-100 dark:border-slate-800
                       text-slate-300 dark:text-slate-600
                       cursor-not-allowed`,
                ].join(" ")}
              >
                <X size={14} />
                {!isMobile && "Bersihkan"}
              </button>
              <button
                onClick={hasCetakData ? () => window.print() : undefined}
                disabled={!hasCetakData}
                title={hasCetakData ? "Cetak sekarang" : "Tidak ada data untuk dicetak"}
                className={[
                  "flex items-center gap-2 px-4 h-9 rounded-lg",
                  "text-[13px] font-semibold transition-colors shrink-0",
                  hasCetakData
                    ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
                    : "bg-blue-200 dark:bg-blue-950 text-blue-300 dark:text-blue-800 cursor-not-allowed",
                ].join(" ")}
              >
                <Printer size={15} />
                {!isMobile && "Cetak Sekarang"}
              </button>
            </div>
          )}
        </div>

        <div className={styles.content}>{children}</div>

        {isDataSuratPage && (
          <button
            onClick={() => {
              sessionStorage.setItem("add_return_mode", showPI ? "pi" : "surat")
              router.push(`/${roleLower}/add`)
            }}
            title="Tambah Surat"
            className="fixed bottom-6 right-6 z-50
              flex items-center justify-center
              w-14 h-14 rounded-full
              bg-blue-600 hover:bg-blue-700 active:bg-blue-800
              text-white shadow-lg hover:shadow-xl
              transition-all active:scale-95"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        )}
      </main>
    </div>
  )
}

export function StaffLayout({ children }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StaffLayoutInner>{children}</StaffLayoutInner>
    </Suspense>
  )
}
