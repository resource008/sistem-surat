"use client"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { AlertTriangle } from "lucide-react"
import type { Role } from "../shared"

import { useEditSurat } from "@/hooks/use-edit-surat"
import { FloatingActionBar } from "./action-bar"
import { RegisterDepartmentBody, RegisterDepartmentHeader } from "./register-info-panel"

interface Props {
  role: Role
  basePath: string
}

export default function PindahDepartemenSuratPage({ basePath }: Props) {
  const { state, actions } = useEditSurat(basePath, "Edit - Pindah Departemen")

  if (state.loading) return <div className="w-full"><LoadingSkeleton type="form" /></div>

  if (state.error || !state.original) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-neutral-900">
          <AlertTriangle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{state.error ?? "Data tidak ditemukan"}</p>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-5 pb-28 pt-4 lg:h-[calc(100vh-120px)] lg:overflow-hidden lg:pb-0 xl:px-6">
        <div className="shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
          <RegisterDepartmentHeader state={state} actions={actions} />
        </div>
        <div className="min-h-0 flex-1 pb-10 lg:overflow-hidden lg:pb-32">
          <RegisterDepartmentBody state={state} actions={actions} />
        </div>
      </div>

      <FloatingActionBar state={state} actions={actions} />
    </>
  )
}
