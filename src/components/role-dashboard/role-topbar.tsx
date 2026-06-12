"use client"

import styles from "@/app/layout.module.css"
import TopbarFilter from "@/components/filters/index"
import { TutorialCetak } from "@/components/shared/tutorial-cetak"
import type { RoleTopbarFilters } from "@/components/role-dashboard/types"
import { ArrowLeftRight, ChevronRight, Menu, Printer, X } from "lucide-react"

interface RoleTopbarProps {
  currentPage: string
  subtitle: string | null
  subsubtitle: string | null
  isMobile: boolean
  isDataSuratPage: boolean
  isCetakPage: boolean
  isDenied: boolean
  showPI: boolean
  filters: RoleTopbarFilters
  hasActiveFilters: boolean
  hasCetakData: boolean
  onOpenMobileMenu: () => void
  onNavigateToDataSurat: () => void
  onNavigateBack: () => void
  onToggleMode: () => void
  onFilterChange: (nextFilters: RoleTopbarFilters) => void
  onClearFilters: () => void
  onClearCetak: () => void
}

export function RoleTopbar({
  currentPage,
  subtitle,
  subsubtitle,
  isMobile,
  isDataSuratPage,
  isCetakPage,
  isDenied,
  showPI,
  filters,
  hasActiveFilters,
  hasCetakData,
  onOpenMobileMenu,
  onNavigateToDataSurat,
  onNavigateBack,
  onToggleMode,
  onFilterChange,
  onClearFilters,
  onClearCetak,
}: RoleTopbarProps) {
  return (
    <div id="topbar" className={styles.topbar}>
      <div className={styles.topbarLeft}>
        {isMobile && (
          <button
            className={styles.hamburger}
            onClick={onOpenMobileMenu}
            aria-label="Buka menu"
          >
            <Menu size={20} />
          </button>
        )}

        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          {subtitle && subsubtitle ? (
            <>
              <button className={styles.breadcrumbParent} onClick={onNavigateToDataSurat}>
                {currentPage}
              </button>
              <ChevronRight size={14} className={styles.breadcrumbSep} />
              <button className={styles.breadcrumbParent} onClick={onNavigateBack}>
                {subtitle}
              </button>
              <ChevronRight size={14} className={styles.breadcrumbSep} />
              <span className={styles.breadcrumbSub}>{subsubtitle}</span>
            </>
          ) : subtitle ? (
            <>
              <button className={styles.breadcrumbParent} onClick={onNavigateToDataSurat}>
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

      {isDataSuratPage && (
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleMode}
            title={showPI ? "Kembali ke semua surat" : "Tampilkan hanya data PI"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0 12px",
              height: "34px",
              borderRadius: "8px",
              border: showPI ? "1px solid #2563eb" : "1px solid var(--border)",
              background: showPI ? "#2563eb" : "transparent",
              color: showPI ? "#ffffff" : "var(--muted-foreground)",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.2s ease",
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
              onFilterChange={onFilterChange}
            />
          )}

          {!showPI && hasActiveFilters && (
            <button
              onClick={onClearFilters}
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

      {isCetakPage && !isDenied && (
        <div className="flex items-center gap-2">
          <TutorialCetak />
          <button
            onClick={hasCetakData ? onClearCetak : undefined}
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
  )
}
