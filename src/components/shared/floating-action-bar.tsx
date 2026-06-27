"use client"

import { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface FloatingActionBarShellProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  hidden?: boolean
  variant?: "default" | "selection"
}

const wrapperClass = {
  default: "fixed bottom-6 right-0 z-40 flex justify-center px-3 transition-[left] duration-300 ease-in-out",
  selection:
    "fixed bottom-5 left-3 right-3 z-50 flex justify-center sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2",
}

const contentClass = {
  default:
    "inline-flex max-w-[calc(100vw-1rem)] items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/90 dark:shadow-black/50",
  selection:
    "flex w-full flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-2.5 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/95 dark:shadow-black/40 sm:w-fit sm:flex-row sm:gap-3 sm:px-4",
}

export function FloatingActionBarShell({
  children,
  className,
  contentClassName,
  hidden = false,
  variant = "default",
}: FloatingActionBarShellProps) {
  if (hidden) return null

  const sidebarOffset = "var(--topbar-left, 0px)"
  const wrapperStyle = variant === "default"
    ? { left: sidebarOffset }
    : undefined

  return (
    <div className={cn(wrapperClass[variant], className)} style={wrapperStyle}>
      <div className={cn(contentClass[variant], contentClassName)}>
        {children}
      </div>
    </div>
  )
}
