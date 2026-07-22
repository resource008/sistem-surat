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
import { SESSION_BROWSER_ACTIVE_KEY } from "@/constants/session"
import { authClient }     from "@/infrastructure/auth/auth-client"
import { redirectToLoggedOutLogin } from "@/lib/logout-redirect"
import type { Role }      from "@/types"
import {
  ArrowLeftCircle, ArrowRightCircle,
  Building2, ChevronDown, House, LogOut, ShieldCheck, TableProperties, UserRound, UserRoundCog, X,
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
  {
    label: "Kelola Pengguna",
    href: "/admin/users",
    icon: UserRoundCog,
    children: [
      { label: "Kelola Akun", href: "/admin/users", icon: UserRound },
      { label: "Kelola Role", href: "/admin/roles", icon: ShieldCheck },
    ],
  },
  { label: "Kelola Departemen", href: "/admin/departemen", icon: Building2 },
  { label: "Kelola Sheet Lacak", href: "/admin/lacak-surat", icon: TableProperties },
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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const isAccountActive = pathname.startsWith("/admin/akun")

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

  useEffect(() => {
    setOpenGroups((current) => {
      let changed = false
      const next = { ...current }

      navItems.forEach((item) => {
        const hasActiveChild = item.children?.some((child) =>
          pathname === child.href || pathname.startsWith(`${child.href}/`)
        )

        if (hasActiveChild && !next[item.href]) {
          next[item.href] = true
          changed = true
        }
      })

      return changed ? next : current
    })
  }, [pathname])

  async function handleLogout() {
    let redirected = false
    const redirectToLogin = () => {
      if (redirected) return
      redirected = true
      redirectToLoggedOutLogin()
    }

    try {
      window.sessionStorage.removeItem(SESSION_BROWSER_ACTIVE_KEY)
      const { data: session } = await authClient.getSession()
      await fetch("/api/admin/logout-activity", { method: "POST", keepalive: true }).catch(() => {})

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
          const hasChildren = Boolean(item.children?.length)
          const hasActiveChild = Boolean(item.children?.some((child) =>
            pathname === child.href || pathname.startsWith(`${child.href}/`)
          ))
          const isGroupOpen = hasChildren && (openGroups[item.href] ?? hasActiveChild)
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) || hasActiveChild
          return (
            <div key={item.href} className={styles.navItemWrapper}>
              {hasChildren ? (
                <button
                  type="button"
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  aria-expanded={isGroupOpen}
                  onClick={() => {
                    if (!isMobile && collapsed) onCollapse(false)
                    setOpenGroups((current) => ({
                      ...current,
                      [item.href]: !(current[item.href] ?? hasActiveChild),
                    }))
                  }}
                >
                  <span className={styles.navIcon}>
                    <Icon size={ICON_SIZE} strokeWidth={isActive ? 2.5 : 1.8} />
                  </span>
                  {(!collapsed || isMobile) && (
                    <>
                      <span className={styles.navLabel}>{item.label}</span>
                      <ChevronDown
                        size={14}
                        className={`ml-auto transition-transform ${isGroupOpen ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>
              ) : (
                <Link href={item.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
                  <span className={styles.navIcon}>
                    <Icon size={ICON_SIZE} strokeWidth={isActive ? 2.5 : 1.8} />
                  </span>
                  {(!collapsed || isMobile) && (
                    <span className={styles.navLabel}>{item.label}</span>
                  )}
                </Link>
              )}
              {item.children && (!collapsed || isMobile) && isGroupOpen ? (
                <div className="mt-1 grid gap-1 pl-6">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`)
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`${styles.navItem} ${childActive ? styles.navItemActive : ""}`}
                        onClick={() => isMobile && onMobileClose()}
                      >
                        <span className={styles.navIcon}>
                          <ChildIcon size={16} strokeWidth={childActive ? 2.4 : 1.8} />
                        </span>
                        <span className={styles.navLabel}>{child.label}</span>
                      </Link>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>

      <div style={{ padding: "0 12px" }}>
        <ThemeToggle collapsed={!isMobile && collapsed} />
      </div>

      <div className={styles.userSection}>
        <Link
          href="/admin/akun"
          className={`${styles.userCard} ${styles.userCardLink} ${isAccountActive ? styles.userCardActive : ""}`}
          onClick={() => isMobile && onMobileClose()}
          title="Info akun admin"
        >
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
