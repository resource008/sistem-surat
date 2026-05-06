"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { BookOpen } from "lucide-react"

const STEPS = [
  {
    title: "Pilih surat",
    desc: "Centang satu atau beberapa surat yang ingin dicetak di halaman Data Surat.",
    video: null, // ganti dengan <video src="..." /> atau embed URL
  },
  {
    title: "Klik tombol cetak",
    desc: "Setelah memilih, klik tombol Cetak pada floating bar yang muncul di bawah layar.",
    video: null,
  },
  {
    title: "Preview & cetak sekarang",
    desc: "Periksa data lalu klik Cetak Sekarang untuk membuka dialog print browser.",
    video: null,
  },
  {
    title: "Bersihkan",
    desc: "Setelah mencetak, klik Bersihkan untuk menghapus data dan kembali ke Data Surat.",
    video: null,
  },
]

export function TutorialCetak() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-lg
          text-slate-500 hover:text-blue-600
          dark:text-slate-400 dark:hover:text-blue-400
          hover:bg-blue-50 dark:hover:bg-blue-900/20
          border border-slate-200 dark:border-slate-700
          hover:border-blue-200 dark:hover:border-blue-800
          transition-colors text-[13px] font-medium shrink-0"
      >
        <BookOpen size={15} />
        <span className="hidden sm:inline">Cara Cetak</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden
        bg-white dark:bg-slate-950
        border border-slate-200 dark:border-slate-800">

        {/* Tambahkan ini — accessible tapi tidak terlihat */}
        <VisuallyHidden>
            <DialogTitle>Cara mencetak surat</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[15px] font-bold text-slate-800 dark:text-white">
            Cara mencetak surat
            </p>
        </div>

          {/* Steps — scrollable */}
          <div className="overflow-y-auto max-h-[70vh] px-5 py-5 flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <div key={i}>
                {i > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800 mb-6" />
                )}
                <p className="text-[14px] font-semibold text-slate-800 dark:text-white mb-1">
                  {step.title}
                </p>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {step.desc}
                </p>
                {/* Area video */}
                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg aspect-video
                  flex items-center justify-center
                  border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {step.video ?? (
                    <span className="text-[12px] text-slate-400 dark:text-slate-600">
                      Video langkah {i + 1}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>    

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700
                text-white text-[13px] font-medium transition-colors"
            >
              Mengerti
            </button>
          </div>

        </DialogContent>
      </Dialog>
    </>
  )
}