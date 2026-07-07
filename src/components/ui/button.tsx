import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none [font-family:var(--font-figtree),sans-serif] [-webkit-tap-highlight-color:transparent] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 hover:text-white active:bg-red-800 focus-visible:border-red-500 focus-visible:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
        link: "text-primary underline-offset-4 hover:underline",
        "action-primary":
          "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
        "action-edit":
          "bg-slate-700 text-white hover:bg-slate-800 active:bg-slate-900 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:active:bg-slate-600",
        "action-neutral":
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 active:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:active:bg-slate-700 dark:active:text-white",
        "action-secondary":
          "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 active:text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:active:bg-slate-600 dark:active:text-white",
        "action-clear":
          "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-red-500 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-red-400",
        "action-danger":
          "bg-red-600 text-white hover:bg-red-700 hover:text-white active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
        "action-danger-soft":
          "text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300",
        "action-dashed":
          "border-blue-300 border-dashed text-blue-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-700 dark:text-blue-400 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-300",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        action: "h-10 gap-2 rounded-xl px-4 text-[13px] font-medium",
        "fab-action":
          "h-9 min-w-0 gap-1.5 rounded-xl px-3 text-xs font-medium sm:h-[34px] sm:gap-2 sm:px-3.5 sm:text-[13px]",
        "action-sm": "h-7 gap-1 rounded-lg px-2.5 text-[12px]",
        "action-selection":
          "h-9 min-w-0 gap-1.5 rounded-full px-3 text-xs font-semibold sm:min-w-28 sm:gap-2 sm:px-4 sm:text-[13px] md:h-10 md:min-w-32 md:text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
