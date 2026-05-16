"use client"

import { FileText } from "lucide-react"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Role } from "../shared"

// Hooks & Sub-Components
import { useTambahSurat } from "@/hooks/use-tambah-surat"
import { FloatingActionBar } from "./action-bar"
import { PIListPanel } from "./pi-list-panel"
import { RegisterInfoPanel } from "./register-info-panel"
import { SuratListPanel } from "./surat-list-panel"

interface Props {
  role: Role
  basePath: string
}

export default function TambahForm({ role, basePath }: Props) {
  const { state, actions } = useTambahSurat(basePath)

  if (state.loading) {
    return <div className="w-full mt-2"><LoadingSkeleton type="form" /></div>
  }

  return (
    <form onSubmit={actions.handleSubmit}
          className="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-120px)] lg:overflow-hidden pb-28 lg:pb-0 pt-2 animate-in fade-in duration-300">
      
      {/* SISI KIRI: Register Info */}
      <RegisterInfoPanel state={state} actions={actions} />

      {/* SISI KANAN: Daftar Form */}
      <div className="w-full lg:w-8/12 xl:w-8/12 flex flex-col gap-4 lg:overflow-y-auto pb-10 lg:pb-32 lg:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {!state.deptId ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 px-6 py-12 text-center lg:h-full flex flex-col items-center justify-center min-h-[200px]">
            <FileText className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
            <p className="text-[13px] text-slate-400 dark:text-slate-500">
              Silakan pilih <strong>Departemen</strong> terlebih dahulu di sebelah kiri untuk menambahkan data.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {state.isPI 
              ? <PIListPanel state={state} actions={actions} /> 
              : <SuratListPanel state={state} actions={actions} />}
          </div>
        )}
      </div>

      {/* ACTION BAR BAWAH */}
      <FloatingActionBar state={state} actions={actions} />
    </form>
  )
}