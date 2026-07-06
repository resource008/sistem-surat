// src/components/admin/users/users-empty.tsx
import { User, Search } from "lucide-react"

interface UsersEmptyProps {
  searchQuery?: string
}

export default function UsersEmpty({ searchQuery }: UsersEmptyProps) {
  return (
    <div className="empty-state-viewport flex w-full h-full items-center justify-center p-4 md:p-8">
      <div className="flex flex-col items-center justify-center gap-5 px-4 text-center">
        
        {/* ── Icon Container (Glass Effect) ── */}
        <div className="relative flex items-center justify-center h-24 w-24 rounded-3xl bg-slate-100 dark:bg-slate-800/60 ring-1 ring-slate-200 dark:ring-slate-700">
          <User 
            strokeWidth={1.25} 
            className="h-11 w-11 text-slate-400 dark:text-slate-500" 
          />
          
          {/* Badge pencarian (Hanya muncul jika ada query) */}
          {searchQuery && (
            <span className="absolute -bottom-2.5 -right-2.5 flex items-center justify-center h-8 w-8 rounded-full bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </span>
          )}
        </div>

        {/* ── Text Content ── */}
        <div className="space-y-1.5 max-w-xs">
          <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200">
            {searchQuery ? "Pengguna tidak ditemukan" : "Tidak ada data pengguna"}
          </p>
          <p className="text-[12.5px] leading-relaxed text-slate-400 dark:text-slate-500">
            {searchQuery
              ? `Tidak ada hasil pencarian untuk "${searchQuery}".`
              : "Silakan tambahkan data pengguna baru untuk memulai."}
          </p>
        </div>

      </div>
    </div>
  )
}
