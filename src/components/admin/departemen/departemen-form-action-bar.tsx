"use client"

import type { ReactNode } from "react"
import { Loader2, Plus, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type ActionBarVariant = "action-primary" | "action-secondary" | "action-neutral" | "action-danger"

type ActionBarItem = {
  icon?: ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: ActionBarVariant
}

interface Props {
  saving: boolean
  onCancel: () => void
  showSubmit?: boolean
  secondaryAction?: ActionBarItem
  extraActions?: ActionBarItem[]
  dangerAction?: ActionBarItem
}

export function DepartemenFormActionBar({
  saving,
  onCancel,
  showSubmit = true,
  secondaryAction,
  extraActions = [],
  dangerAction,
}: Props) {
  return (
    <div
      className="pointer-events-none fixed bottom-4 z-30 flex -translate-x-1/2 justify-center px-2 pb-1 transition-[left,width] duration-300 ease-in-out"
      style={{
        left: "calc(var(--topbar-left, 0px) + ((100vw - var(--topbar-left, 0px)) / 2))",
        width: "calc(100vw - var(--topbar-left, 0px) - 1rem)",
      }}
    >
      <div className="pointer-events-auto flex w-max max-w-full flex-nowrap justify-start gap-1 overflow-x-auto rounded-xl border bg-background/95 p-1.5 shadow-lg backdrop-blur sm:justify-center">
        <Button
          type="button"
          variant="action-neutral"
          size="fab-action"
          onClick={onCancel}
          className="shrink-0"
        >
          <X size={14} /> Batal
        </Button>
        {secondaryAction && (
          <Button
            type="button"
            variant="action-secondary"
            size="fab-action"
            onClick={secondaryAction.onClick}
            disabled={saving || secondaryAction.disabled}
            className="shrink-0"
          >
            {secondaryAction.icon ?? <Plus size={14} />}
            {secondaryAction.label}
          </Button>
        )}
        {extraActions.map((action) => (
          <Button
            key={action.label}
            type="button"
            variant={action.variant ?? "action-secondary"}
            size="fab-action"
            onClick={action.onClick}
            disabled={saving || action.disabled}
            className="shrink-0"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
        {dangerAction && (
          <Button
            type="button"
            variant="action-danger"
            size="fab-action"
            onClick={dangerAction.onClick}
            disabled={saving || dangerAction.disabled}
            className="shrink-0"
          >
            {dangerAction.icon}
            {dangerAction.label}
          </Button>
        )}
        {showSubmit && (
          <Button
            type="submit"
            variant="action-primary"
            size="fab-action"
            disabled={saving}
            className="shrink-0"
          >
            {saving
              ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
              : <><Save size={14} /> Simpan</>}
          </Button>
        )}
      </div>
    </div>
  )
}
