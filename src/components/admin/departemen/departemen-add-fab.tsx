"use client"

import { Plus } from "lucide-react"

interface Props {
  onClick: () => void
}

export function DepartemenAddFab({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Tambah Departemen"
      aria-label="Tambah Departemen"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95 active:bg-blue-800"
    >
      <Plus size={24} strokeWidth={2.5} />
    </button>
  )
}
