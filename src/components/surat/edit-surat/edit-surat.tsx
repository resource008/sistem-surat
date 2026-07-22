"use client"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { AlertTriangle } from "lucide-react"
import type { Role } from "../shared"

import { useEditSurat } from "@/hooks/use-edit-surat"
import { FloatingActionBar } from "./action-bar"
import { SuratListPanel } from "./surat-list-panel"

interface Props {
  role: Role
  basePath: string
}

export default function EditSuratPage({ basePath }: Props) {
  const { state, actions } = useEditSurat(basePath)

  if (state.loading) return <div className="w-full">
    <LoadingSkeleton type="form" /></div>
  
  if (state.error || !state.original) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-neutral-900 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">{state.error ?? "Data tidak ditemukan"}</p>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1500px] px-5 pb-28 pt-4 lg:h-[calc(100vh-120px)] lg:overflow-hidden lg:pb-0 xl:px-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4 pb-10 lg:overflow-y-auto lg:pb-32 lg:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SuratListPanel state={state} actions={actions} />
        </div>
      </div>
      
      <FloatingActionBar state={state} actions={actions} />
    </>
  )
}
