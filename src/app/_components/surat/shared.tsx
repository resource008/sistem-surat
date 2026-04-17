"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

// ✅ Import shadcn dengan path benar
import { Label }    from "@/components/ui/label"
import { Button }   from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DetailSurat {
  id:           number
  registerId:   number
  perihal:      string
  noSurat:      string | null
  lampiran:     string | null
  tanggalSurat: string
}

export interface RegisterSurat {
  id:            number
  nomor:         string
  deptId:        string
  dept:          { id: string; shortName: string }
  asalSurat:     string
  tujuan:        string
  tanggalTerima: string
  detailSurat:   DetailSurat[]
}

export interface FormState {
  deptId:        string
  asalSurat:     string
  tujuan:        string
  tanggalTerima: string
}

export const EMPTY_FORM: FormState = {
  deptId:        "",
  asalSurat:     "",
  tujuan:        "",
  tanggalTerima: new Date().toISOString().slice(0, 10),
}

export interface SuratItem {
  id:           string
  perihal:      string
  noSurat:      string
  lampiran:     string
  tanggalSurat: string
}

export const EMPTY_SURAT_ITEM = (): SuratItem => ({
  id:           crypto.randomUUID(),
  perihal:      "",
  noSurat:      "",
  lampiran:     "",
  tanggalSurat: "",
})

export type Role = "ADMIN" | "STAFF" | "PKL"

// ─── Helpers ───────────────────────────────────────────────────────────────

export function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

// ─── Styles (dipertahankan agar tambah-surat.tsx tidak error) ──────────────

export const inputClass = cn(
  "w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
  "border border-slate-200 dark:border-slate-800",
  "bg-white dark:bg-slate-950",
  "text-slate-800 dark:text-slate-200",
  "placeholder:text-slate-400 dark:placeholder:text-slate-500",
  "hover:border-blue-400 dark:hover:border-blue-700",
  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500"
)

export const readonlyClass = cn(
  "w-full px-3 py-2 rounded-lg text-[13px] font-medium",
  "border border-slate-100 dark:border-slate-800/60",
  "bg-slate-50 dark:bg-slate-900/50",
  "text-slate-400 dark:text-slate-500",
  "cursor-not-allowed select-none"
)

// ─── DatePicker ────────────────────────────────────────────────────────────

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  hasError    = false,
  disabled    = false,
}: {
  value:        string
  onChange:     (val: string) => void
  placeholder?: string
  hasError?:    boolean
  disabled?:    boolean
}) {
  const [open, setOpen] = useState(false)

  // Hindari timezone shift: parse manual yyyy-MM-dd
  const selected = value
    ? new Date(value + "T00:00:00")
    : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal text-[13px] h-9 px-3",
            "text-slate-800 dark:text-slate-200",
            !value    && "text-slate-400 dark:text-slate-500",
            hasError  && "border-red-500 dark:border-red-500 focus-visible:ring-red-500"
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          {value
            ? format(selected!, "dd MMMM yyyy", { locale: localeID })
            : placeholder
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"))
              setOpen(false)
            }
          }}
          locale={localeID}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── FormField ─────────────────────────────────────────────────────────────

export function FormField({
  label,
  optional = false,
  hint,
  error,
  children,
}: {
  label:     string
  optional?: boolean
  hint?:     string
  error?:    string
  children:  React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        {/* ✅ Label dengan huruf kapital (komponen), bukan elemen HTML */}
        <Label className={cn(
          "text-[10px] font-medium uppercase tracking-wider cursor-default",
          error
            ? "text-red-500 dark:text-red-400"
            : "text-slate-500 dark:text-slate-400"
        )}>
          {label}
        </Label>

        {optional && (
          <span className="text-[10px] normal-case font-normal text-slate-400 dark:text-slate-500">
            (opsional)
          </span>
        )}
        {hint && (
          <span className="text-[10px] normal-case font-normal text-blue-500 dark:text-blue-400">
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <p className="text-[11px] text-red-500 dark:text-red-400 font-medium leading-none">
          {error}
        </p>
      )}
    </div>
  )
}