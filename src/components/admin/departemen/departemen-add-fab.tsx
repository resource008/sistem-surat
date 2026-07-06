"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  onClick: () => void
}

export function DepartemenAddFab({ onClick }: Props) {
  return (
    <Button
      type="button"
      variant="action-primary"
      size="icon-lg"
      onClick={onClick}
      title="Tambah Departemen"
      aria-label="Tambah Departemen"
      className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg"
    >
      <Plus size={24} strokeWidth={2.5} />
    </Button>
  )
}
