"use client"

import { authClient } from "@/infrastructure/auth/auth-client"
import { routes } from "@/lib/routes"
import {
  LogOut, Menu, X, Plus, ChevronRight,
  ArrowRightCircle, ArrowLeftCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import styles from "@/app/layout.module.css"
import TopbarFilter from "@/components/ui/topbar-filter"
import { ThemeToggle } from "@/components/ui/theme-toogle"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getMenuItems } from "@/app/_components/surat/menu-items"
import type { Role } from "@/app/_components/surat/shared"

const ICON_SIZE = 18

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  const [collapsed,   setCollapsed]   = useState(false)
  const [isMounted,   setIsMounted]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [isMobile,    setIsMobile]    = useState(false)
  const [subtitle,    setSubtitle]    = useState<string | null>(null)
  const [subsubtitle, setSubsubtitle] = useState<string | null>(null)
  const [role,        setRole]        = useState<Role>("STAFF")
  const [userData,    setUserData]    = useState({
    name: "Loading...", role: "Staff", initials: "??",
  })
  const [filters, setFilters] = useState<{
    date: string | null
    departments: string[]
  }>({ date: null, departments: [] })

  const menuItems = getMenuItems(role)

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar_collapsed")
    if (savedState !== null && window.innerWidth >= 768) {
      setCollapsed(JSON.parse(savedState))
    }
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isMobile) {
      localStorage.setItem("sidebar_collapsed", JSON.stringify(collapsed))
    }
  }, [collapsed, isMounted, isMobile])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("filter:change", { detail: filters }))
  }, [filters])

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) { setCollapsed(false); setMobileOpen(false) }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSubtitle(null)
    setSubsubtitle(null)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      const sidebar = document.getElementById("sidebar")
      if (sidebar && !sidebar.contains(e.target as Node)) setMobileOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [mobileOpen])

  useEffect(() => {
    const handler = (e: Event) => setSubtitle((e as CustomEvent<string | null>).detail)
    window.addEventListener("breadcrumb:sub", handler)
    return () => window.removeEventListener("breadcrumb:sub", handler)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => setSubsubtitle((e as CustomEvent<string | null>).detail)
    window.addEventListener("breadcrumb:subsub", handler)
    return () => window.removeEventListener("breadcrumb:subsub", handler)
  }, [])

  useEffect(() => {
    async function fetchUser() {
      const { data } = await authClient.getSession()
      if (data?.user) {
        const fullName = data.user.name || "User"
        const initials = fullName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
        const userRole = ((data.user as any).role as Role) ?? "STAFF"
        setRole(userRole)
        setUserData({
          name: fullName,
          role: userRole,
          initials,
        })
      }
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

  if (!isMounted) return <div className="min-h-screen bg-background" />

  const currentPage = (() => {
    const matched = menuItems.find((item) => item.href === pathname)
    if (matched) return matched.label
    if (pathname.includes("/staff/view/")) return "Data Surat"
    if (pathname.includes("/staff/edit/")) return "Data Surat"
    return "Data Surat"
  })()

  const topbarLeft = isMobile
    ? "0px"
    : collapsed
      ? "var(--sidebar-w-collapsed)"
      : "var(--sidebar-w)"

  const sidebarContent = (
    <>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoWrapper}>
          <Image
            src="/sipef_logo.svg"
            alt="Logo SIPEF"
            width={32}
            height={32}
            className={styles.logoImage}
            priority
          />
        </div>
        {isMobile ? (
          <button className={styles.collapseBtn} onClick={() => setMobileOpen(false)}>
            <X size={14} />
          </button>
        ) : (
          <>
            <button
              className={`${styles.collapseBtn} ${collapsed ? styles.collapseBtnCollapsed : ""}`}
              onClick={() => setCollapsed(true)}
            >
              <ArrowRightCircle size={14} />
            </button>
            <button className={styles.expandBtn} onClick={() => setCollapsed(false)}>
              <ArrowLeftCircle size={14} />
            </button>
          </>
        )}
      </div>

      <div className={styles.navSection}>
        <span className={styles.navSectionLabel}>Menu</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <div key={item.href} className={styles.navItemWrapper}>
              <Link
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                <span className={styles.navIcon}>
                  <Icon size={ICON_SIZE} strokeWidth={isActive ? 2.5 : 1.8} />
                </span>
                {(!collapsed || isMobile) && (
                  <>
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                  </>
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
        <div className={styles.navItemWrapper}>
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
                  Sesi Anda akan diakhiri dan Anda akan diarahkan ke halaman login.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Keluar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  )

  return (
    <div className={styles.root}>
      {isMobile && mobileOpen && (
        <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />
      )}

      <aside
        id="sidebar"
        className={[
          styles.sidebar,
          !isMobile && collapsed ? styles.collapsed : "",
          isMobile ? styles.mobileSidebar : "",
          isMobile && mobileOpen ? styles.mobileOpen : "",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>

      <main
        className={`
          ${styles.main}
          ${!isMobile && collapsed ? styles.mainCollapsed : ""}
          ${isMobile ? styles.mainMobile : ""}
        `}
        style={{ "--topbar-left": topbarLeft } as React.CSSProperties}
      >
        <div className={styles.topbar}>
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
              {subtitle && subsubtitle ? (
                <>
                  <button
                    className={styles.breadcrumbParent}
                    onClick={() => router.push(routes.dataSurat.staff)}
                  >
                    {currentPage}
                  </button>
                  <ChevronRight size={14} className={styles.breadcrumbSep} />
                  <button
                    className={styles.breadcrumbParent}
                    onClick={() => router.back()}
                  >
                    {subtitle}
                  </button>
                  <ChevronRight size={14} className={styles.breadcrumbSep} />
                  <span className={styles.breadcrumbSub}>{subsubtitle}</span>
                </>
              ) : subtitle ? (
                <>
                  <button
                    className={styles.breadcrumbParent}
                    onClick={() => router.push(routes.dataSurat.staff)}
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

          {pathname === routes.dataSurat.staff && (
          <>
              <button
                onClick={() => router.push(`/staff/add`)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 px-3 h-8.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0"
              >
                <Plus size={15} />
                {!isMobile && "Tambah"}
              </button>

              <TopbarFilter onFilterChange={setFilters} />
            </>
          )}

        </div>

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}