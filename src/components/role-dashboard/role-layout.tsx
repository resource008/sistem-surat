"use client"

import styles from "@/app/layout.module.css"
import TopbarFilter from "@/components/filters/index"
import type { Filters } from "@/hooks/use-filter"
import { PermissionDenied } from "@/components/shared/permission"
import { RoleSidebar } from "@/components/role-dashboard/role-sidebar"
import { usePresenceHeartbeat } from "@/hooks/use-presence-heartbeat"
import { useSession } from "@/infrastructure/auth/auth-client"
import type { Role } from "@/types"
import type { UserPermissions } from "@/domain/user/types"
import {
  ChevronRight, Menu, Plus, Printer, X,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import useSWR from "swr"

type DashboardRole = Extract<Role, "STAFF" | "PKL">

interface Props {
  role: DashboardRole
  children: React.ReactNode
}

interface PermissionResponse {
  role: Role
  permissions: UserPermissions
}

type PermissionKey = keyof UserPermissions

const fetchPermissions = async (url: string): Promise<PermissionResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Gagal mengambil hak akses")
  return res.json()
}

const FEATURE_LABEL: Record<string, string> = {
  canPrint: "Cetak Surat",
  canCreate: "Tambah Data Surat",
  canEdit: "Edit Data Surat",
  canDelete: "Hapus Data Surat",
  canTrack: "Lacak Surat",
}

function getRequiredPermission(
  pathname: string,
  base: string
): PermissionKey | null {
  if (pathname.startsWith(`${base}/cetak`)) return "canPrint"
  if (pathname.startsWith(`${base}/add`)) return "canCreate"
  if (pathname.includes(`${base}/`) && pathname.includes("/edit/")) return "canEdit"
  if (pathname.startsWith(`${base}/track`)) return "canTrack"
  return null
}

function RoleLayoutInner({ role, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  usePresenceHeartbeat()

  const roleLower = role.toLowerCase()
  const base = `/${roleLower}`

  const { isPending } = useSession()
  const { data: access, isLoading: permissionsLoading } = useSWR<PermissionResponse>(
    "/api/me/permissions",
    fetchPermissions,
    {
      refreshInterval: 5_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )
  const permissions = access?.permissions
  const requiredPerm = getRequiredPermission(pathname, base)
  const permissionsPending = isPending || permissionsLoading
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
    router.push(`${base}/data-surat`)
  }

  function handleClearCetak() {
    window.dispatchEvent(new CustomEvent("cetak:clear"))
  }

  function handleBreadcrumbParentClick() {
    router.push(isCetakPage ? `${base}/cetak` : `${base}/data-surat`)
  }

  if (!isMounted) return <div className="min-h-screen bg-background" />

  const currentPage = (() => {
    if (pathname.startsWith(`${base}/akun`)) return "Akun Anda"
    if (pathname.includes("/cetak")) return "Cetak"
    if (pathname.includes("/akun")) return "Akun Anda"
    if (pathname.includes("/data-surat")) return "Data Surat"
    if (pathname.includes("/track")) return "Track Surat"
    if (pathname.includes("/view/") || pathname.includes("/edit/")) return "Data Surat"
    return "Data Surat"
  })()

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
                    onClick={handleBreadcrumbParentClick}
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
                    onClick={handleBreadcrumbParentClick}
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
              <TopbarFilter
                initialFilters={filters}
                mode="surat"
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
            <PermissionDenied feature={FEATURE_LABEL[requiredPerm!] ?? "fitur ini"} />
          ) : (
            children
          )}
        </div>

        {isDataSuratPage && (permissions?.canCreate ?? false) && !(isMobile && selectedDataSuratCount > 0) && (
          <button
            onClick={() => {
              sessionStorage.setItem("add_return_mode", "surat")
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
