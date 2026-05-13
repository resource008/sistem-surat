"use client"

import styles from "@/app/layout.module.css"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ThemeToggle } from "@/components/ui/theme-toogle"
import { routes } from "@/constants/routes"
import { authClient } from "@/infrastructure/auth/auth-client"
import {
  ArrowLeftCircle, ArrowRightCircle,
  FileText, LogOut, Printer, RefreshCcw, X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const ICON_SIZE = 18

interface Props {
  collapsed:     boolean
  isMobile:      boolean
  mobileOpen:    boolean
  onCollapse:    (val: boolean) => void
  onMobileClose: () => void
}

export function StaffSidebar({
  collapsed, isMobile, mobileOpen, onCollapse, onMobileClose,
}: Props) {
  const pathname = usePathname()
  const [userData, setUserData] = useState({
    name: "Loading...", role: "STAFF", initials: "??",
  })

  // Hardcode base path khusus Staff
  const base = "/staff"

  const navItems = [
    { label: "Data Surat",  icon: FileText,   href: `${base}/data-surat` },
    { label: "Cetak",       icon: Printer,    href: `${base}/cetak/all`  },
    { label: "Track Surat", icon: RefreshCcw, href: `${base}/track`      },
  ]

  useEffect(() => {
    async function fetchUser() {
      const { data } = await authClient.getSession()
      if (!data?.user) return
      const fullName = data.user.name || "User"
      const initials = fullName
        .split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
      const userRole = (data.user as any).role ?? "STAFF"
      setUserData({ name: fullName, role: userRole, initials })
    }
    fetchUser()
  }, [])

  async function handleLogout() {
    const { data: session } = await authClient.getSession()
    if (session?.session?.token)
      await authClient.revokeSession({ token: session.session.token })
    localStorage.setItem("logout_notif", "true")
    await authClient.signOut({
      fetchOptions: { onSuccess: () => { window.location.href = routes.login } },
    })
  }

  return (
    <aside
      id="sidebar"
      className={[
        styles.sidebar,
        !isMobile && collapsed ? styles.collapsed     : "",
        isMobile               ? styles.mobileSidebar : "",
        isMobile && mobileOpen ? styles.mobileOpen    : "",
      ].join(" ")}
    >
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logoWrapper}>
          <Image src="/sipef_logo.svg" alt="Logo" width={32} height={32} className={styles.logoImage} priority />
        </div>
        {isMobile ? (
          <button className={styles.collapseBtn} onClick={onMobileClose}>
            <X size={14} />
          </button>
        ) : (
          <>
            <button
              className={`${styles.collapseBtn} ${collapsed ? styles.collapseBtnCollapsed : ""}`}
              onClick={() => onCollapse(true)}
            >
              <ArrowLeftCircle size={14} />
            </button>
            <button className={styles.expandBtn} onClick={() => onCollapse(false)}>
              <ArrowRightCircle size={14} />
            </button>
          </>
        )}
      </div>

      {/* Nav label */}
      <div className={styles.navSection}>
        <span className={styles.navSectionLabel}>Menu Staff</span>
      </div>

      {/* Nav items */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon     = item.icon
          const isActive = pathname === item.href || (item.href.includes("/cetak") && pathname.includes("/cetak"))
          return (
            <div key={item.href} className={styles.navItemWrapper}>
              <Link href={item.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
                <span className={styles.navIcon}>
                  <Icon size={ICON_SIZE} strokeWidth={isActive ? 2.5 : 1.8} />
                </span>
                {(!collapsed || isMobile) && (
                  <span className={styles.navLabel}>{item.label}</span>
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Theme toggle */}
      <div style={{ padding: "0 12px" }}>
        <ThemeToggle collapsed={!isMobile && collapsed} />
      </div>

      {/* User info */}
      <div className={styles.userSection}>
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>{userData.initials}</div>
          {(!collapsed || isMobile) && (
            <div className={styles.userInfo}>
              <div className={styles.userName}>{userData.name}</div>
              <div className={styles.userRole}>{userData.role}</div>
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className={styles.sidebarFooter}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className={`${styles.navItem} ${styles.navItemLogout}`}>
              <span className={styles.navIcon}><LogOut size={ICON_SIZE} /></span>
              {(!collapsed || isMobile) && <span className={styles.navLabel}>Keluar</span>}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Keluar dari aplikasi?</AlertDialogTitle>
              <AlertDialogDescription>
                Sesi Anda akan diakhiri dan diarahkan ke halaman login.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
                Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  )
}