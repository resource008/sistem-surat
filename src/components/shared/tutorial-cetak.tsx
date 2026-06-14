"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react"

const STEPS = [
  {
    title: "Pilih surat",
    desc: "Centang satu atau beberapa surat yang ingin dicetak di halaman Data Surat.",
    video: null,
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
  const [currentStep, setCurrentStep] = useState(0)
  const step = STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === STEPS.length - 1

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) setCurrentStep(0)
  }

  return (
    <>
      <button
        onClick={() => handleOpenChange(true)}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[13px] font-medium text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-800 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
      >
        <BookOpen size={15} />
        <span className="hidden sm:inline">Cara Cetak</span>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[min(92vh,720px)] w-[calc(100vw-24px)] max-w-2xl flex-col gap-0 overflow-hidden border border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-slate-950 sm:w-full">
          <VisuallyHidden>
            <DialogTitle>Cara mencetak surat</DialogTitle>
          </VisuallyHidden>

          <div className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
            <p className="text-[15px] font-bold text-slate-800 dark:text-white">
              Cara mencetak surat
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[12px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                Langkah {currentStep + 1} dari {STEPS.length}
              </span>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {STEPS.map((_, index) => (
                  <span
                    key={index}
                    className={[
                      "h-1.5 rounded-full transition-all",
                      index === currentStep
                        ? "w-5 bg-blue-600 dark:bg-blue-400"
                        : "w-1.5 bg-slate-200 dark:bg-slate-700",
                    ].join(" ")}
                  />
                ))}
              </div>
            </div>

            <p className="mb-1 text-[14px] font-semibold text-slate-800 dark:text-white">
              {step.title}
            </p>
            <p className="mb-4 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
              {step.desc}
            </p>
            <div className="flex aspect-video max-h-[260px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 sm:max-h-none">
              {step.video ?? (
                <span className="text-[12px] text-slate-400 dark:text-slate-600">
                  Video langkah {currentStep + 1}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:px-5">
            <button
              onClick={() => setCurrentStep((value) => Math.max(0, value - 1))}
              disabled={isFirstStep}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 sm:h-8 sm:justify-start"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <button
              onClick={() => {
                if (isLastStep) {
                  setOpen(false)
                  return
                }
                setCurrentStep((value) => Math.min(STEPS.length - 1, value + 1))
              }}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-blue-700 sm:h-8"
            >
              {isLastStep ? "Mengerti" : "Next"}
              {!isLastStep && <ChevronRight size={14} />}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
