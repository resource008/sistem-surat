"use client"

import { Inbox, Plus } from "lucide-react"
import React from "react"

interface EmptyStateProps {
  title?: string;
  description?: React.ReactNode; // Menggunakan ReactNode agar bisa memasukkan ikon
}

export function EmptyState({ 
  title = "Tidak ada data surat", 
  description 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-125 w-full space-y-4 animate-in fade-in duration-700">
      {/* Ikon Inbox Statis */}
      <div className="text-slate-200 dark:text-slate-800">
        <Inbox size={120} strokeWidth={1} />
      </div>

      {/* Deskripsi Teks */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-extrabold text-[#2d4b73] dark:text-slate-200 tracking-tight">
          {title}
        </h3>
        {/* Hilangkan flex di sini agar teks mengalir normal */}
        <div className="text-sm text-slate-400 dark:text-slate-500 max-w-70 mx-auto leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  )
}