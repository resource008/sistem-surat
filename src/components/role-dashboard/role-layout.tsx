"use client"

import styles from "@/app/layout.module.css"
import { PermissionDenied } from "@/components/shared/permission"
import { RoleSidebar } from "@/components/role-dashboard/role-sidebar"
import { RoleTopbar } from "@/components/role-dashboard/role-topbar"
import type { DashboardRole, RoleTopbarFilters } from "@/components/role-dashboard/types"
import { usePresenceHeartbeat } from "@/hooks/use-presence-heartbeat"
import { useRolePermissions } from "@/hooks/use-role-permissions"
import {
  getRequiredPermission,
  getRoleBasePath,
  getRolePageTitle,
  ROLE_FEATURE_LABEL,
} from "@/lib/role-dashboard"
import { Plus } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

interface Props {
  role: DashboardRole
  children: React.ReactNode
}

function RoleLayoutInner({ role, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  usePresenceHeartbeat()

  const base = getRoleBasePath(role)
  const { permissions, isLoading: permissionsPending } = useRolePermissions()
  const requiredPerm = getRequiredPermission(pathname, base)
  const isDenied =
    !permissionsPending &&
    requiredPerm !== null &&
    !(permissions?.[requiredPerm] ?? false)

  const [collapsed, setCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [subtitle, setSubtitle] = useState<string | null>(null)
  const [subsubtitle, setSubsubtitle] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    date: null,
    departments: [],
  })
  const [hasCetakData, setHasCetakData] = useState(false)
  const [selectedDataSuratCount, setSelectedDataSuratCount] = useState(0)

  const showPI = searchParams.get("mode") === "pi"
  const isDataSuratPage = pathname === `${base}/data-surat`
  const isCetakPage = pathname.startsWith(`${base}/cetak`)
  const hasActiveFilters = filters.date !== null || filters.departments.length > 0

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed")
    if (saved !== null && window.innerWidth >= 768) setCollapsed(JSON.parse(saved))
    try {
      const savedFilters = localStorage.getItem("topbar_filters")
      const parsed = savedFilters ? JSON.parse(savedFilters) : {}
      setFilters({
        date: parsed.date ?? null,
        departments: parsed.departments ?? [],
      })
    } catch {}
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isMobile) {
      localStorage.setItem("sidebar_collapsed", JSON.stringify(collapsed))
    }
  }, [collapsed, isMounted, isMobile])

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(false)
        setMobileOpen(false)
      }
    }

    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSubtitle(null)
    setSubsubtitle(null)
  }, [pathname])

  useEffect(() => {
    const handler = (event: Event) => setSubtitle((event as CustomEvent<string | null>).detail)
    window.addEventListener("breadcrumb:sub", handler)
    return () => window.removeEventListener("breadcrumb:sub", handler)
  }, [])

  useEffect(() => {
    const handler = (event: Event) => setSubsubtitle((event as CustomEvent<string | null>).detail)
    window.addEventListener("breadcrumb:subsub", handler)
    return () => window.removeEventListener("breadcrumb:subsub", handler)
  }, [])

  useEffect(() => {
    const handler = (event: Event) => {
      const count = (event as CustomEvent<{ count: number }>).detail.count
      setHasCetakData(count > 0)
    }
    window.addEventListener("cetak:ids-ready", handler)
    return () => window.removeEventListener("cetak:ids-ready", handler)
  }, [])

  useEffect(() => {
    const handler = (event: Event) => {
      const count = (event as CustomEvent<{ count: number }>).detail.count
      setSelectedDataSuratCount(count)
    }
    window.addEventListener("data-surat:selection", handler)
    return () => window.removeEventListener("data-surat:selection", handler)
  }, [])

  useEffect(() => {
    const handler = () => setHasCetakData(false)
    window.addEventListener("cetak:cleared", handler)
    return () => window.removeEventListener("cetak:cleared", handler)
  }, [])

  useEffect(() => {
    if (!pathname.includes("/cetak")) setHasCetakData(false)
  }, [pathname])

  useEffect(() => {
    if (!isDataSuratPage) setSelectedDataSuratCount(0)
  }, [isDataSuratPage])

  function handleClearFilters() {
    const next: Filters = { date: null, departments: [] }
    setFilters(next)
    localStorage.removeItem("topbar_filters")
    router.push(showPI ? `${base}/data-surat?mode=pi` : `${base}/data-surat`)
  }

  function handleTogglePI() {
    const dataSuratBase = `${base}/data-surat`
    const nextFilters: Filters = showPI
      ? filters
      : { date: filters.date, departments: [] }
    const params = new URLSearchParams()

    if (!showPI) params.set("mode", "pi")
    if (nextFilters.date) params.set("date", nextFilters.date)
    if (!showPI && filters.departments.length > 0) {
      localStorage.setItem("topbar_filters", JSON.stringify(nextFilters))
      setFilters(nextFilters)
    }

    const query = params.toString()
    router.push(query ? `${dataSuratBase}?${query}` : dataSuratBase)
  }

  function handleClearCetak() {
    window.dispatchEvent(new CustomEvent("cetak:clear"))
  }

  if (!isMounted) return <div className="min-h-screen bg-background" />

  const currentPage = getRolePageTitle(pathname, base)

  const topbarLeft = isMobile
    ? "0px"
    : collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)"

  return (
    <div className={styles.root}>
      {isMobile && mobileOpen && (
        <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />
      )}

      <RoleSidebar
        role={role}
        collapsed={collapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        permissions={permissions}
        permissionsLoading={permissionsPending}
        onCollapse={setCollapsed}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main
        id="main-content"
        className={`
          ${styles.main}
          ${!isMobile && collapsed ? styles.mainCollapsed : ""}
          ${isMobile ? styles.mainMobile : ""}
        `}
        style={{ "--topbar-left": topbarLeft } as React.CSSProperties}
      >
        <div id="topbar" className={styles.topbar}>
          <div className={styles.topbarLeft}>
            {isMobile && (
              <button
                className={styles.hamburger}
                onClick={() => setMobileOpen(true)}
                aria-label="Buka menu"
              >
                <Menu size={20} />
              </button>
            )}

            <nav className={styles.breadcrumb} aria-label="breadcrumb">
              {subtitle && subsubtitle ? (
                <>
                  <button
                    className={styles.breadcrumbParent}
                    onClick={() => router.push(`${base}/data-surat`)}
                  >
                    {currentPage}
                  </button>
                  <ChevronRight size={14} className={styles.breadcrumbSep} />
                  <button
                    className={styles.breadcrumbParent}
                    onClick={() => router.back()}
                  >
                    {subtitle}
                  </button>
                  <ChevronRight size={14} className={styles.breadcrumbSep} />
                  <span className={styles.breadcrumbSub}>{subsubtitle}</span>
                </>
              ) : subtitle ? (
                <>
                  <button
                    className={styles.breadcrumbParent}
                    onClick={() => router.push(`${base}/data-surat`)}
                  >
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
                onClick={handleTogglePI}
                title={showPI ? "Kembali ke semua surat" : "Tampilkan data PI"}
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

              <TopbarFilter
                initialFilters={filters}
                mode={showPI ? "pi" : "surat"}
                hideDepartments={showPI}
                onFilterChange={(nextFilters) => {
                  setFilters(nextFilters)
                  localStorage.setItem("topbar_filters", JSON.stringify(nextFilters))
                }}
              />

              {hasActiveFilters && (
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

          {isCetakPage && !isDenied && (
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

        <div className={styles.content}>
          {isDenied ? (
            <PermissionDenied feature={ROLE_FEATURE_LABEL[requiredPerm!] ?? "fitur ini"} />
          ) : (
            children
          )}
        </div>

        {isDataSuratPage && (permissions?.canCreate ?? false) && !(isMobile && selectedDataSuratCount > 0) && (
          <button
            onClick={() => {
              sessionStorage.setItem("add_return_mode", showPI ? "pi" : "surat")
              router.push(`${base}/add`)
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

export function RoleLayout({ role, children }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <RoleLayoutInner role={role}>{children}</RoleLayoutInner>
    </Suspense>
  )
}
