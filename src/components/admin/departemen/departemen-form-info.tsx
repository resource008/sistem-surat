import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function DepartemenFormInfo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-blue-100/80 px-5 py-5 text-sm text-slate-950 dark:bg-blue-950/30 dark:text-slate-100",
        className
      )}
    >
      <div className="mb-5 flex items-center gap-4 text-blue-600 dark:text-blue-300">
        <Info className="size-5" />
        <h3 className="text-[17px] font-bold">
          Informasi Pengisian Departemen
        </h3>
      </div>

      <ul className="list-disc space-y-1 pl-9 text-[15px] leading-snug">
        <li>Masukkan nama departemen dengan lengkap dan detail</li>
        <li>Masukkan singkatan departemen yang dibuat karena akan digunakan saat registrasi surat</li>
        <li>Nomor register, tanggal terima, asal surat, dan tujuan selalu tampil sebagai kolom default</li>
        <li>Kolom yang tampil di data surat dibatasi maksimal 5 kolom</li>
      </ul>
    </div>
  )
} 
