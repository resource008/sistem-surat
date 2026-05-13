import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  className?: string
  /**
   * default: Skeleton baris standar
   * table: Skeleton list surat
   * card: Skeleton kotak-kotak (Dashboard)
   * form: Skeleton khusus form (Add/Edit/View) dengan desain Split-Pane
   */
  type?: "default" | "table" | "card" | "form"
}

export function LoadingSkeleton({ 
  className, 
  type = "default" 
}: LoadingSkeletonProps) {
  
  // ─── OPSI 1: SKELETON FORM (Untuk View/Edit/Add - Split-Pane Layout) ───
  if (type === "form") {
    return (
      <div className={cn(
        "max-w-7xl mx-auto px-4 xl:px-0 flex flex-col lg:flex-row gap-6",
        "lg:h-[calc(100vh-120px)] lg:overflow-hidden pb-28 lg:pb-0 pt-2",
        "animate-in fade-in duration-300 w-full",
        className
      )}>
        
        {/* SISI KIRI: Skeleton Register */}
        <div className="w-full lg:w-4/12 xl:w-4/12 flex flex-col gap-4 lg:h-full lg:pb-6">
          <div className="rounded-2xl border border-border/50 bg-background overflow-hidden shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-border/50 flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/50">
               <div>
                  <Skeleton className="h-3 w-24 mb-3" />
                  <Skeleton className="h-6 w-32 rounded-lg" />
               </div>
               <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="px-6 py-5 flex flex-col gap-5">
               <div className="flex flex-col gap-2.5">
                 <Skeleton className="h-3 w-20" />
                 <Skeleton className="h-10 w-full rounded-xl" />
               </div>
               <div className="flex flex-col gap-2.5">
                 <Skeleton className="h-3 w-28" />
                 <Skeleton className="h-10 w-full rounded-xl" />
               </div>
               <div className="flex flex-col gap-2.5">
                 <Skeleton className="h-3 w-16" />
                 <Skeleton className="h-10 w-full rounded-xl" />
               </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Skeleton Daftar Surat/PI */}
        <div className="w-full lg:w-8/12 xl:w-8/12 flex flex-col gap-4 lg:overflow-y-auto pb-10 lg:pb-32 lg:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
           {[1, 2].map((i) => (
             <div key={i} className="rounded-2xl border border-border/50 bg-background overflow-hidden shadow-sm shrink-0">
                <div className="px-5 py-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2.5 items-center">
                  <Skeleton className="w-6 h-6 rounded-lg" />
                  <Skeleton className="h-3 w-20 rounded-full" />
                </div>
                <div className="px-5 py-4 flex flex-col gap-5">
                  <div className="flex flex-col gap-2.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                  </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    )
  }

  // ─── OPSI 2: SKELETON TABEL (Sesuai gambar Data Surat) ───
  if (type === "table") {
    return (
      <div className={cn("w-full space-y-4", className)}>
        <div className="rounded-xl border border-border/50 bg-background overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 p-4 border-b border-border/50">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <div className="grid grid-cols-[40px_100px_1fr_120px_80px] gap-4 px-4 py-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
            <Skeleton className="h-3 w-4" /> <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" /> <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="flex flex-col">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[40px_100px_1fr_120px_80px] gap-4 px-4 py-4 items-center border-b border-border/50 last:border-0">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-12" />
                <div className="space-y-2"><Skeleton className="h-4 w-[60%]" /><Skeleton className="h-4 w-[40%]" /></div>
                <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-12" /></div>
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ─── OPSI 3: SKELETON CARD (Untuk Dashboard) ───
  if (type === "card") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex justify-between items-start">
               <Skeleton className="h-10 w-10 rounded-2xl" />
               <Skeleton className="h-7 w-7 rounded-full" />
            </div>
            <div className="space-y-2 mt-2 flex flex-col">
               <div className="flex items-center gap-3">
                 <Skeleton className="h-8 w-16" />
                 <Skeleton className="h-5 w-12 rounded-full" />
               </div>
               <Skeleton className="h-3 w-24 mt-1" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ─── OPSI 4: SKELETON DEFAULT ───
  return (
    <div className={cn("flex flex-col space-y-4 w-full", className)}>
      <Skeleton className="h-30 w-full rounded-xl" />
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
      </div>
    </div>
  )
}