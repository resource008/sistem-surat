"use client"

// ✅ Import komponen yang digunakan
import { AppSidebar } from "@/components/layouts/app-sidebar"
import { AppNavbar }  from "@/components/layouts/app-navbar"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950
      print:block print:min-h-0 print:bg-white">

      {/* Sidebar — hilang saat print */}
      <AppSidebar />

      <div className="flex flex-1 flex-col min-w-0
        print:block print:w-full">

        {/* Navbar — hilang saat print */}
        <AppNavbar />

        {/* Main content */}
        <main
          className="flex-1 overflow-auto p-4 md:p-6
            print:p-0 print:m-0 print:overflow-visible
            print:block print:w-full"
        >
          {children}
        </main>
      </div>
    </div>
  )
}