"use client"

import styles from "@/app/layout.module.css"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UserAvatar }    from "@/components/shared/user-avatar"
import { ThemeToggle }    from "@/components/ui/theme-toogle"
import { routes }         from "@/constants/routes"
import { authClient }     from "@/infrastructure/auth/auth-client"
import type { Role }      from "@/types"
import {
  ArrowLeftCircle, ArrowRightCircle,
  Building2, House, LogOut, UserRoundCog, X,
} from "lucide-react"
import Image           from "next/image"
import Link            from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const ICON_SIZE   = 18
const LOGO_WIDTH  = 1523
const LOGO_HEIGHT = 1246

const navItems = [
  { label: "Dashboard",       href: "/admin/dashboard",  icon: House },
  { label: "Kelola Pengguna", href: "/admin/users",      icon: UserRoundCog },
  { label: "Departemen",      href: "/admin/departemen", icon: Building2 },
]

interface Props {
  collapsed:     boolean
  isMobile:      boolean
  mobileOpen:    boolean
  onCollapse:    (val: boolean) => void
  onMobileClose: () => void
  hideToggle?:   boolean
}

export function AdminSidebar({
  collapsed, isMobile, mobileOpen, onCollapse, onMobileClose,
}: Props) {
  const pathname = usePathname()

  const [userData, setUserData]       = useState({ name: "", role: "ADMIN" })
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await authClient.getSession()
        if (!data?.user) return
        const fullName = data.user.name || "Admin"
        const userRole = ((data.user as any).role as Role) ?? "ADMIN"
        setUserData({ name: fullName, role: userRole })
      } finally {
        setUserLoading(false)
      }
    }
    fetchUser()
  }, [])

  async function handleLogout() {
    const { data: session } = await authClient.getSession()
    if (session?.session?.token)
      await authClient.revokeSession({ token: session.session.token })
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => { window.location.href = `${routes.login}?logout=true` },
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
          <Image src="/sipef_logo.svg" alt="Logo" width={LOGO_WIDTH} height={LOGO_HEIGHT} className={styles.logoImage} priority />
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

      <div className={styles.navSection}>
        <span className={styles.navSectionLabel}>Menu</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon     = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
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

      <div style={{ padding: "0 12px" }}>
        <ThemeToggle collapsed={!isMobile && collapsed} />
      </div>

      <div className={styles.userSection}>
        <div className={styles.userCard}>
          {userLoading ? (
            <>
              <div
                className="shrink-0 rounded-[10px] animate-pulse"
                style={{ width: 36, height: 36, background: "var(--sk-base, rgba(255,255,255,0.1))" }}
              />
              {(!collapsed || isMobile) && (
                <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
                  <div className="h-3 w-24 rounded-md animate-pulse"
                    style={{ background: "var(--sk-base, rgba(255,255,255,0.1))" }} />
                  <div className="h-2.5 w-12 rounded-md animate-pulse"
                    style={{ background: "var(--sk-subtle, rgba(255,255,255,0.06))" }} />
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
