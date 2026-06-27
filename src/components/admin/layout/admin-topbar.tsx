"use client"

import styles from "@/app/layout.module.css"
import { AdminTopbarSearch } from "@/components/admin/layout/admin-topbar-search"
import { ChevronRight, Menu } from "lucide-react"

interface AdminTopbarProps {
  currentPage: string
  subtitle: string | null
  isMobile: boolean
  isUsersPage: boolean
  searchExpanded: boolean
  onOpenMobileMenu: () => void
  onBack: () => void
  onSearchExpand: (expanded: boolean) => void
}

export function AdminTopbar({
  currentPage,
  subtitle,
  isMobile,
  isUsersPage,
  searchExpanded,
  onOpenMobileMenu,
  onBack,
  onSearchExpand,
}: AdminTopbarProps) {
  const hideTitleOnMobileSearch = isMobile && isUsersPage && searchExpanded
  const leftClassName = [
    styles.topbarLeft,
    styles.topbarLeftAdmin,
    isUsersPage ? styles.topbarLeftSearchPage : "",
  ].filter(Boolean).join(" ")
  const rightClassName = [
    styles.topbarRight,
    searchExpanded && isMobile ? styles.topbarRightSearchExpanded : "",
  ].filter(Boolean).join(" ")

  return (
    <div id="topbar" className={styles.topbar}>
      {!hideTitleOnMobileSearch && (
        <div className={leftClassName}>
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
            {subtitle ? (
              <>
                <button className={styles.breadcrumbParent} onClick={onBack}>
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
      )}

      {isUsersPage && (
        <div className={rightClassName}>
          <AdminTopbarSearch
            isMobile={isMobile}
            onExpand={onSearchExpand}
          />
        </div>
      )}
    </div>
  )
}
