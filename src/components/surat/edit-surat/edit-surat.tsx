"use client"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { AlertTriangle } from "lucide-react"
import { Role } from "../shared"

import { useEditSurat } from "@/hooks/use-edit-surat"
import { FloatingActionBar } from "./action-bar"
import { RegisterInfoPanel } from "./register-info-panel"
import { SuratListPanel } from "./surat-list-panel"

interface Props {
  role: Role
  basePath: string
}

export default function EditSuratPage({ role, basePath }: Props) {
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
      <div className="w-full flex flex-col lg:flex-row gap-6 
                lg:h-[calc(100vh-120px)] lg:overflow-hidden pb-28 lg:pb-0 pt-2">
        <RegisterInfoPanel state={state} actions={actions} />
        
        <div className="w-full lg:w-8/12 xl:w-8/12 flex flex-col gap-4 lg:overflow-y-auto pb-10 lg:pb-32 lg:pr-2 [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-3">
            <SuratListPanel state={state} actions={actions} />
          </div>
        </div>
      </div>
      
      <FloatingActionBar state={state} actions={actions} />
    </>
  )
}
