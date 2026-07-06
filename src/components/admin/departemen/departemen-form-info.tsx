"use client"

import { Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartemenFormInfo({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 pr-8">
            <Info className="size-4 shrink-0 text-primary" />
            <DialogTitle>Informasi Pengisian Departemen</DialogTitle>
          </div>
          <DialogDescription>
            Pastikan data departemen dan konfigurasi kolom sesuai kebutuhan registrasi surat.
          </DialogDescription>
        </DialogHeader>

        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          <li>Masukkan nama departemen dengan lengkap dan detail.</li>
          <li>Masukkan singkatan departemen untuk registrasi surat.</li>
          <li>Nomor register, tanggal terima, asal surat, dan tujuan selalu tampil sebagai kolom default.</li>
          <li>Kolom yang tampil di data surat dibatasi maksimal 5 kolom.</li>
        </ul>
      </DialogContent>
    </Dialog>
  )
} 
