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
  const [filters, setFilters] = useState<RoleTopbarFilters>({ date: null, departments: [] })
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
      setFilters({ date: parsed.date ?? null, departments: parsed.departments ?? [] })
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
    const next = { date: null, departments: [] }
    setFilters(next)
    localStorage.removeItem("topbar_filters")
    router.push(showPI ? `${base}/data-surat?mode=pi` : `${base}/data-surat`)
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
        <RoleTopbar
          currentPage={currentPage}
          subtitle={subtitle}
          subsubtitle={subsubtitle}
          isMobile={isMobile}
          isDataSuratPage={isDataSuratPage}
          isCetakPage={isCetakPage}
          isDenied={isDenied}
          showPI={showPI}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          hasCetakData={hasCetakData}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onNavigateToDataSurat={() => router.push(`${base}/data-surat`)}
          onNavigateBack={() => router.back()}
          onToggleMode={() => {
            const dataSuratBase = `${base}/data-surat`
            router.push(showPI ? dataSuratBase : `${dataSuratBase}?mode=pi`)
          }}
          onFilterChange={(nextFilters) => {
            setFilters(nextFilters)
            localStorage.setItem("topbar_filters", JSON.stringify(nextFilters))
          }}
          onClearFilters={handleClearFilters}
          onClearCetak={handleClearCetak}
        />

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
