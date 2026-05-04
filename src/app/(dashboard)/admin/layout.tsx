"use client"

import styles from "@/app/layout.module.css"
import { AdminSidebar } from "@/components/surat/dashboard/sidebar"
import { AdminTopbar }  from "@/components/surat/dashboard/topbar"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed,  setCollapsed]  = useState(false)
  const [isMounted,  setIsMounted]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile,   setIsMobile]   = useState(false)

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

  if (!isMounted) return <div className="min-h-screen bg-background" />

  const topbarLeft = isMobile
    ? "0px"
    : collapsed
      ? "var(--sidebar-w-collapsed)"
      : "var(--sidebar-w)"

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
      >
        <AdminTopbar
          isMobile={isMobile}
          onMobileOpen={() => setMobileOpen(true)}
          topbarLeft={topbarLeft}
        />

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}