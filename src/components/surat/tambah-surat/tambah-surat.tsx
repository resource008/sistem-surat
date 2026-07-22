"use client"

import { FileText } from "lucide-react"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Role } from "../shared"

// Hooks & Sub-Components
import { useTambahSurat } from "@/hooks/use-tambah-surat"
import { FloatingActionBar } from "./action-bar"
import { RegisterInfoPanel } from "./register-info-panel"
import { SuratListPanel } from "./surat-list-panel"

interface Props {
  role: Role
  basePath: string
}

export default function TambahForm({ role, basePath }: Props) {
  const { state, actions } = useTambahSurat(basePath)
  const formId = "tambah-surat-form"

  if (state.loading) {
    return <div className="w-full mt-2"><LoadingSkeleton type="form" /></div>
  }

  return (
    <>
      <form
        id={formId}
        onSubmit={actions.handleSubmit}
        className="mx-auto flex w-full max-w-[1500px] animate-in flex-col gap-6 px-5 pb-28 pt-4 duration-300 fade-in lg:h-[calc(100vh-120px)] lg:overflow-hidden lg:pb-0 xl:px-6"
      >
        <RegisterInfoPanel state={state} actions={actions} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 pb-10 lg:overflow-y-auto lg:pb-32 lg:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {!state.deptId ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center dark:border-neutral-800 lg:h-full">
              <FileText className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
              <p className="text-[13px] text-slate-400 dark:text-slate-500">
                Silakan pilih <strong>Departemen</strong> terlebih dahulu untuk menambahkan data.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <SuratListPanel state={state} actions={actions} />
            </div>
          )}
        </div>
      </form>

      {/* ACTION BAR BAWAH */}
      <FloatingActionBar state={state} actions={actions} formId={formId} />
    </>
  )
}
