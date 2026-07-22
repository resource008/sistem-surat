"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import styles from "@/app/layout.module.css"
import { IdleSessionGuard } from "@/components/auth/idle-session-guard"
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar"
import { AdminSearchContext } from "@/components/admin/layout/admin-search-context"
import { AdminTopbar } from "@/components/admin/layout/admin-topbar"
import { usePresenceHeartbeat } from "@/hooks/use-presence-heartbeat"
import { useTopbarSearch } from "@/hooks/use-topbar-search"
import { getAdminPageSubtitle, getAdminPageTitle, isAdminUsersPage } from "@/lib/admin-layout"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  usePresenceHeartbeat()

  const { search, debouncedSearch, setSearch } = useTopbarSearch()

  const [collapsed, setCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [subtitle, setSubtitle] = useState<string | null>(null)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [hideSidebarToggle, setHideSidebarToggle] = useState(false)

  const usersPage = isAdminUsersPage(pathname)

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed")
    if (saved !== null && window.innerWidth >= 768) {
      setCollapsed(JSON.parse(saved))
    }
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
      } else {
        setHideSidebarToggle(false)
        setSearchExpanded(false)
      }
    }

    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSubtitle(null)
    setSearchExpanded(false)
    setHideSidebarToggle(false)

    if (!pathname.includes("/users")) {
      setSearch("")
    }
  }, [pathname, setSearch])

  useEffect(() => {
    const handler = (event: Event) => {
      setSubtitle((event as CustomEvent<string | null>).detail)
    }

    window.addEventListener("breadcrumb:sub", handler)
    return () => window.removeEventListener("breadcrumb:sub", handler)
  }, [])

  useEffect(() => {
    const handler = (event: Event) => {
      if (isMobile) {
        setHideSidebarToggle((event as CustomEvent<boolean>).detail)
      }
    }

    window.addEventListener("sidebar:hide-toggle", handler as EventListener)
    return () => window.removeEventListener("sidebar:hide-toggle", handler as EventListener)
  }, [isMobile])

  if (!isMounted) return <div className="min-h-screen bg-background" />

  const currentPage = getAdminPageTitle(pathname)
  const routeSubtitle = getAdminPageSubtitle(pathname)
  const effectiveSubtitle = routeSubtitle ?? subtitle
  const topbarLeft = isMobile
    ? "0px"
    : collapsed
      ? "var(--sidebar-w-collapsed)"
      : "var(--sidebar-w)"

  function handleBreadcrumbBack() {
    if (pathname.includes("/roles")) {
      router.push("/admin/users")
      return
    }

    if (pathname.includes("/users")) {
      router.push("/admin/users")
      return
    }

    if (pathname.includes("/departemen")) {
      router.push("/admin/departemen")
      return
    }

    if (pathname.includes("/lacak-surat")) {
      router.push("/admin/lacak-surat")
      return
    }

    router.back()
  }

  return (
    <AdminSearchContext.Provider value={{ search, debouncedSearch, setSearch }}>
      <IdleSessionGuard />
      <div className={styles.root}>
        {isMobile && mobileOpen && (
          <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />
        )}

        <AdminSidebar
          collapsed={collapsed}
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          onCollapse={setCollapsed}
          onMobileClose={() => setMobileOpen(false)}
          hideToggle={hideSidebarToggle}
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
          <AdminTopbar
            currentPage={currentPage}
            subtitle={effectiveSubtitle}
            isMobile={isMobile}
            isUsersPage={usersPage}
            searchExpanded={searchExpanded}
            onOpenMobileMenu={() => setMobileOpen(true)}
            onBack={handleBreadcrumbBack}
            onSearchExpand={setSearchExpanded}
          />

          <div className={styles.content}>{children}</div>
        </main>
      </div>
    </AdminSearchContext.Provider>
  )
}
