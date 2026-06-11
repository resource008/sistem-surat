// src/app/(dashboard)/admin/layout.tsx
"use client"

import styles                   from "@/app/layout.module.css"
import { AdminSidebar }         from "@/components/admin/dashboard/admin-sidebar"
import { usePresenceHeartbeat } from "@/hooks/use-presence-heartbeat"
import { useTopbarSearch }      from "@/hooks/use-topbar-search"
import { ChevronRight, Menu, Search, X } from "lucide-react"
import { Input }                from "@/components/ui/input"
import { usePathname, useRouter } from "next/navigation"
import {
  createContext, useContext,
  useEffect, useRef, useState,
} from "react"

// ── Search Context ────────────────────────────────────────────

interface SearchCtx {
  search:         string  
  debouncedSearch: string  
  setSearch:      (v: string) => void
}
export const SearchContext = createContext<SearchCtx>({
  search: "", debouncedSearch: "", setSearch: () => {},
})
export const useSearch = () => useContext(SearchContext)

// ── Topbar Search ─────────────────────────────────────────────

function TopbarSearch({
  isMobile,
  onExpand,
}: {
  isMobile:  boolean
  onExpand?: (v: boolean) => void
}) {
  const { search, setSearch } = useSearch()
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (expanded) setTimeout(() => inputRef.current?.focus(), 50)
  }, [expanded])

  function handleExpand() {
    setExpanded(true)
    onExpand?.(true)
  }

  function handleCancel() {
    setExpanded(false)
    setSearch("")
    onExpand?.(false)
  }

  // Desktop — input selalu tampil
  if (!isMobile) {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Cari Nama Pengguna"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 w-56 bg-muted/40 border-border/60 rounded-xl text-sm"
        />
      </div>
    )
  }

  // Mobile collapsed — hanya ikon
  if (!expanded) {
    return (
      <button
        onClick={handleExpand}
        className="flex items-center justify-center size-9 rounded-xl border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted transition-colors"
        aria-label="Cari pengguna"
      >
        <Search className="size-4" />
      </button>
    )
  }

  // Mobile expanded — input + tombol X
  return (
    <div className="flex items-center gap-2 flex-1 animate-in fade-in slide-in-from-right-2 duration-200">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder="Cari Nama Pengguna"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && handleCancel()}
          className="pl-9 h-9 w-full bg-muted/40 border-border/60 rounded-xl text-sm"
        />
      </div>
      <button
        onClick={handleCancel}
        className="flex items-center justify-center size-9 rounded-xl border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted transition-colors shrink-0"
        aria-label="Batal"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

// ── Layout ────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  usePresenceHeartbeat()

  const { search, debouncedSearch, setSearch } = useTopbarSearch()

  const [collapsed,         setCollapsed]         = useState(false)
  const [isMounted,         setIsMounted]         = useState(false)
  const [mobileOpen,        setMobileOpen]        = useState(false)
  const [isMobile,          setIsMobile]          = useState(false)
  const [subtitle,          setSubtitle]          = useState<string | null>(null)
  const [searchExpanded,    setSearchExpanded]    = useState(false)
  const [hideSidebarToggle, setHideSidebarToggle] = useState(false)

 const isUsersPage = /^\/admin\/users\/?$/.test(pathname)

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
      if (mobile)  { setCollapsed(false); setMobileOpen(false) }
      if (!mobile) { setHideSidebarToggle(false); setSearchExpanded(false) }
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Reset saat navigasi
  useEffect(() => {
    setMobileOpen(false)
    setSubtitle(null)
    setSearchExpanded(false)
    setHideSidebarToggle(false)
    if (!pathname.includes("/users")) setSearch("")
  }, [pathname, setSearch])

  // Breadcrumb listener
  useEffect(() => {
    const h = (e: Event) => setSubtitle((e as CustomEvent<string | null>).detail)
    window.addEventListener("breadcrumb:sub", h)
    return () => window.removeEventListener("breadcrumb:sub", h)
  }, [])

  // Hide sidebar toggle — hanya mobile
  useEffect(() => {
    const h = (e: Event) => {
      if (isMobile) setHideSidebarToggle((e as CustomEvent<boolean>).detail)
    }
    window.addEventListener("sidebar:hide-toggle", h as EventListener)
    return () => window.removeEventListener("sidebar:hide-toggle", h as EventListener)
  }, [isMobile])

  if (!isMounted) return <div className="min-h-screen bg-background" />

  const currentPage = (() => {
    if (pathname.includes("/dashboard"))  return "Dashboard"
    if (pathname.includes("/users"))      return "Kelola Pengguna"
    if (pathname.includes("/departemen")) return "Departemen"
    return "Dashboard"
  })()

  const parentHref = (() => {
    if (pathname.includes("/dashboard"))  return "/admin/dashboard"
    if (pathname.includes("/users"))      return "/admin/users"
    if (pathname.includes("/departemen")) return "/admin/departemen"
    return "/admin/dashboard"
  })()

  const topbarLeft = isMobile ? "0px"
    : collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)"

  return (
    <SearchContext.Provider value={{ search, debouncedSearch, setSearch }}>
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
          hideToggle={hideSidebarToggle}
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
            {/* Mobile + users + search expanded: sembunyikan hamburger & judul */}
            {!(isMobile && isUsersPage && searchExpanded) && (
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
                        onClick={() => router.push(parentHref)}
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
            )}

            {/* Search — hanya di halaman users */}
            {isUsersPage && (
              <div className={`${searchExpanded && isMobile ? "flex-1" : ""} ${styles.topbarRight}`}>
                <TopbarSearch
                  isMobile={isMobile}
                  onExpand={setSearchExpanded}
                />
              </div>
            )}
          </div>

          <div className={styles.content}>{children}</div>
        </main>
      </div>
    </SearchContext.Provider>
  )
}
