"use client"

import styles from "@/app/layout.module.css"
import { ChevronRight, Menu } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const pageTitles: Record<string, string> = {
  "/admin/dashboard":  "Dashboard",
  "/admin/users":      "Manajemen User",
  "/admin/departemen": "Departemen",
}

interface Props {
  isMobile: boolean
  onMobileOpen: () => void
  topbarLeft: string
}

export function AdminTopbar({ isMobile, onMobileOpen, topbarLeft }: Props) {
  const pathname = usePathname()
  const router   = useRouter()

  const [subtitle,    setSubtitle]    = useState<string | null>(null)
  const [subsubtitle, setSubsubtitle] = useState<string | null>(null)

  // Reset breadcrumb saat navigasi
  useEffect(() => {
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

  const currentPage = pageTitles[pathname] ?? "Admin"

  return (
    <div
      id="topbar"
      className={styles.topbar}
      style={{ "--topbar-left": topbarLeft } as React.CSSProperties}
    >
      <div className={styles.topbarLeft}>
        {isMobile && (
          <button
            className={styles.hamburger}
            onClick={onMobileOpen}
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
                onClick={() => router.push(pathname.split("/").slice(0, -2).join("/"))}
              >
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
              <button
                className={styles.breadcrumbParent}
                onClick={() => router.push(pathname)}
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
  )
}