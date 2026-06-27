"use client"

import styles from "@/app/layout.module.css"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UserAvatar } from "@/components/shared/user-avatar"
import { ThemeToggle } from "@/components/ui/theme-toogle"
import { routes } from "@/constants/routes"
import { authClient } from "@/infrastructure/auth/auth-client"
import type { DashboardRole } from "@/components/role-dashboard/types"
import { getRoleBasePath } from "@/lib/role-dashboard"
import {
  ArrowLeftCircle, ArrowRightCircle,
  FileText, LogOut, Printer, RefreshCcw, X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type { UserPermissions } from "@/domain/user/types"

const ICON_SIZE = 18
const LOGO_WIDTH = 1523
const LOGO_HEIGHT = 1246

interface Props {
  role: DashboardRole
  collapsed: boolean
  isMobile: boolean
  mobileOpen: boolean
  permissions?: UserPermissions
  permissionsLoading: boolean
  onCollapse: (val: boolean) => void
  onMobileClose: () => void
}

export function RoleSidebar({
  role, collapsed, isMobile, mobileOpen, permissions, permissionsLoading, onCollapse, onMobileClose,
}: Props) {
  const pathname = usePathname()
  const base = getRoleBasePath(role)

  const [userData, setUserData] = useState<{ name: string; role: string }>({
    name: "",
    role,
  })
  const [userLoading, setUserLoading] = useState(true)
  const isAccountActive = pathname.startsWith(`${base}/akun`)

  const navItems = [
    { label: "Data Surat", icon: FileText, href: `${base}/data-surat`, permission: null },
    { label: "Cetak", icon: Printer, href: `${base}/cetak`, permission: "canPrint" },
    { label: "Track Surat", icon: RefreshCcw, href: `${base}/track`, permission: "canTrack" },
  ]

  useEffect(() => {
    let alive = true

    async function fetchUser() {
      try {
        const response = await fetch("/api/me/account")
        if (response.ok) {
          const data = await response.json()
          if (!alive) return

          const fullName = data.name || "User"
          setUserData({ name: fullName, role: data.role ?? role })
          return
        }

        const { data } = await authClient.getSession()
        if (!alive || !data?.user) return

        const fullName = data.user.name || "User"
        const userRole = ((data.user as any).role ?? role) as string
        setUserData({ name: fullName, role: userRole })
      } finally {
        if (alive) setUserLoading(false)
      }
    }

    fetchUser()
    window.addEventListener("account:updated", fetchUser)
    return () => {
      alive = false
      window.removeEventListener("account:updated", fetchUser)
    }
  }, [role])

  useEffect(() => {
    const handler = (event: Event) => {
      const user = (event as CustomEvent<{ name?: string; role?: string }>).detail
      if (!user?.name) return

      setUserData((current) => ({
        name: user.name ?? current.name,
        role: user.role ?? current.role,
      }))
    }

    window.addEventListener("profile:updated", handler)
    return () => window.removeEventListener("profile:updated", handler)
  }, [])

  async function handleLogout() {
    let redirected = false
    const redirectToLogin = () => {
      if (redirected) return
      redirected = true
      window.location.href = `${routes.login}?logout=true`
    }

    try {
      const { data: session } = await authClient.getSession()
      await fetch("/api/logout-activity", { method: "POST", keepalive: true }).catch(() => {})

      if (session?.session?.token) {
        await authClient.revokeSession({ token: session.session.token }).catch(() => {})
      }

      await authClient.signOut({
        fetchOptions: {
          onSuccess: redirectToLogin,
        },
      })
    } finally {
      redirectToLogin()
    }
  }

  return (
    <aside
      id="sidebar"
      className={[
        styles.sidebar,
        !isMobile && collapsed ? styles.collapsed : "",
        isMobile ? styles.mobileSidebar : "",
        isMobile && mobileOpen ? styles.mobileOpen : "",
      ].join(" ")}
    >
      <div className={styles.sidebarHeader}>
        <div className={styles.logoWrapper}>
          <Image
            src="/sipef_logo.svg"
            alt="Logo"
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            className={styles.logoImage}
            priority
          />
        </div>

        {isMobile ? (
          <button className={styles.collapseBtn} onClick={onMobileClose}>
            <X size={14} />
          </button>
        ) : (
          <>
            {!collapsed ? (
              <button className={styles.collapseBtn} onClick={() => onCollapse(true)}>
                <ArrowLeftCircle size={14} />
              </button>
            ) : (
              <button className={styles.expandBtn} style={{ display: "flex" }} onClick={() => onCollapse(false)}>
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
          if (
            item.permission &&
            !permissionsLoading &&
            !(permissions?.[item.permission as keyof UserPermissions] ?? false)
          ) {
            return null
          }

          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href.includes("/cetak") && pathname.includes("/cetak")) ||
            (item.href.includes("/data-surat") && pathname.includes("/data-surat"))

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
        <Link
          href={`${base}/akun`}
          className={`${styles.userCard} ${styles.userCardLink} ${isAccountActive ? styles.userCardActive : ""}`}
          onClick={() => isMobile && onMobileClose()}
          title="Akun Anda"
        >
          {userLoading ? (
            <>
              <div
                className="shrink-0 rounded-[10px] animate-pulse"
                style={{ width: 36, height: 36, background: "var(--sk-base, rgba(255,255,255,0.1))" }}
              />
              {(!collapsed || isMobile) && (
                <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
                  <div
                    className="h-3 w-24 rounded-md animate-pulse"
                    style={{ background: "var(--sk-base, rgba(255,255,255,0.1))" }}
                  />
                  <div
                    className="h-2.5 w-12 rounded-md animate-pulse"
                    style={{ background: "var(--sk-subtle, rgba(255,255,255,0.06))" }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <UserAvatar name={userData.name} className={styles.userAvatar} />
              {(!collapsed || isMobile) && (
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{userData.name}</div>
                  <div className={styles.userRole}>{userData.role}</div>
                </div>
              )}
            </>
          )}
        </Link>
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
              <AlertDialogAction onClick={handleLogout} variant="destructive">
                Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  )
}
