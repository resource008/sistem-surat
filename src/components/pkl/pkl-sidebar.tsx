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

// --- DEFINISI INTERFACE PROPS ---
interface PklSidebarProps {
  collapsed: boolean
  isMobile: boolean
  mobileOpen: boolean
  onCollapse: (val: boolean) => void
  onMobileClose: () => void
}

const ICON_SIZE = 18

export function PklSidebar({
  collapsed,
  isMobile,
  mobileOpen,
  onCollapse,
  onMobileClose,
}: PklSidebarProps) {
  const pathname = usePathname()

  const [userData, setUserData] = useState({
    name: "Loading...", role: "PKL", initials: "??",
  })

  const base = "/pkl"

  const navItems = [
    { label: "Data Surat",   icon: FileText,   href: `${base}/data-surat` },
    { label: "Cetak",        icon: Printer,    href: `${base}/cetak`      }, // Sesuaikan base path cetak
    { label: "Track Surat",  icon: RefreshCcw, href: `${base}/track`      },
  ]

  useEffect(() => {
    async function fetchUser() {
      const { data } = await authClient.getSession()
      if (!data?.user) return
      const fullName = data.user.name || "User"
      const initials = fullName
        .split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
      const userRole = (data.user as any).role ?? "PKL"
      setUserData({ name: fullName, role: userRole, initials })
    }
    fetchUser()
  }, [])

  async function handleLogout() {
    const { data: session } = await authClient.getSession()
    if (session?.session?.token)
      await authClient.revokeSession({ token: session.session.token })
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = `${routes.login}?logout=true`  // ← tambah query param
        },
      },
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
            {/* Tombol untuk Collapse (Menyusut) */}
            {!collapsed ? (
              <button
                className={styles.collapseBtn}
                onClick={() => onCollapse(true)}
              >
                <ArrowLeftCircle size={14} />
              </button>
            ) : (
              /* Tombol untuk Expand (Melebar) */
              <button 
                className={styles.expandBtn} 
                style={{ display: 'flex' }} // Pastikan terlihat saat collapsed
                onClick={() => onCollapse(false)}
              >
                <ArrowRightCircle size={14} />
              </button>
            )}
          </>
        )}
      </div>

      <div className={styles.navSection}>
        <span className={styles.navSectionLabel}>Menu</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon     = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <div key={item.href} className={styles.navItemWrapper}>
              <Link 
                href={item.href} 
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={() => isMobile && onMobileClose()}
              >
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

      <div style={{ padding: "0 12px" }}>
        <ThemeToggle collapsed={!isMobile && collapsed} />
      </div>

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