"use client"

import { ReactNode, useState } from "react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export const inputClass = cn(
  "w-full rounded-lg px-3 py-2 text-[14px] font-medium transition-all duration-200",
  "border border-slate-200 dark:border-slate-800",
  "bg-white dark:bg-slate-950",
  "text-slate-800 dark:text-slate-200",
  "placeholder:text-slate-400 dark:placeholder:text-slate-500",
  "hover:border-blue-400 dark:hover:border-blue-700",
  "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-500"
)

export const readonlyClass = cn(
  "w-full rounded-lg px-3 py-2 text-[14px] font-medium",
  "border border-slate-100 dark:border-slate-800/60",
  "bg-slate-50 dark:bg-slate-900/50",
  "text-slate-400 dark:text-slate-500",
  "cursor-not-allowed select-none"
)

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hasError?: boolean
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  hasError = false,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? new Date(`${value}T00:00:00`) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-start rounded-xl px-3 text-left text-[14px] font-normal",
            "text-slate-800 dark:text-slate-200",
            !value && "text-slate-400 dark:text-slate-500",
            hasError &&
              "border-red-500 focus-visible:ring-red-500 dark:border-red-500"
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          {value
            ? format(selected!, "dd MMMM yyyy", { locale: localeID })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (!date) return

            onChange(format(date, "yyyy-MM-dd"))
            setOpen(false)
          }}
          locale={localeID}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

interface FormFieldProps {
  children: ReactNode
  error?: string
  hint?: string
  label: string
  optional?: boolean
}

export function FormField({
  children,
  error,
  hint,
  label,
  optional = false,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Label
          className={cn(
            "cursor-default text-[12px] font-medium",
            error
              ? "text-red-500 dark:text-red-400"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          {label}
        </Label>
        {optional ? (
          <span className="text-[12px] font-normal text-slate-400">
            (opsional)
          </span>
        ) : null}
        {hint ? (
          <span className="text-[12px] font-normal text-blue-500">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p className="text-[12px] font-medium leading-none text-red-500 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
