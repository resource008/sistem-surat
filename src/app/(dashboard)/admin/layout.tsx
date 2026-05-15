"use client"

import styles from "@/app/layout.module.css"
import { AdminSidebar } from "@/components/admin/dashboard/admin-sidebar"
import { ChevronRight, Menu } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  const [collapsed,  setCollapsed]  = useState(false)
  const [isMounted,  setIsMounted]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile,   setIsMobile]   = useState(false)
  const [subtitle,   setSubtitle]   = useState<string | null>(null)

  // Init: baca localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed")
    if (saved !== null && window.innerWidth >= 768) setCollapsed(JSON.parse(saved))
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

  // Reset breadcrumb saat navigasi
  useEffect(() => {
    setMobileOpen(false)
    setSubtitle(null)
  }, [pathname])

  // Breadcrumb listener
  useEffect(() => {
    const h = (e: Event) => setSubtitle((e as CustomEvent<string | null>).detail)
    window.addEventListener("breadcrumb:sub", h)
    return () => window.removeEventListener("breadcrumb:sub", h)
  }, [])

  if (!isMounted) return <div className="min-h-screen bg-background" />

  const currentPage = (() => {
    if (pathname.includes("/dashboard"))  return "Dashboard"
    if (pathname.includes("/users"))      return "Kelola Pengguna"
    if (pathname.includes("/departemen")) return "Departemen"
    return "Dashboard"
  })()

  const topbarLeft = isMobile ? "0px"
    : collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)"

  return (
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
              <button
                className={styles.hamburger}
                onClick={() => setMobileOpen(true)}
                aria-label="Buka menu"
              >
                <Menu size={20} />
              </button>
            )}

            <nav className={styles.breadcrumb} aria-label="breadcrumb">
              {subtitle ? (
                <>
                  <button
                    className={styles.breadcrumbParent}
                    onClick={() => router.back()}
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
        </div>

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}