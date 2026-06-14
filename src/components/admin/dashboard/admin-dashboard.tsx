"use client"

import { useEffect, useState } from "react"
import { useAdminStats } from "@/hooks/use-admin-stats"
import type { StatistikFilter, TipeWaktuStatistik } from "@/domain/admin-dashboard/types"
import { DEFAULT_STATS_DEPT_ID } from "@/constants/admin-dashboard"

import { ActivitySummary }         from "./components/activity-summary"
import { DashboardLoading }        from "./components/dashboard-loading"
import { StatistikSuratCard }      from "./components/statistik-surat-card"
import { SuratPerDepartemenTable } from "./components/surat-per-departemen-table"
import { UserActivityTable }       from "./components/user-activity-table"

export default function AdminDashboard() {
  const now = new Date()
  const [deptId, setDeptId]       = useState("")
  const [tipeWaktu, setTipeWaktu] = useState<TipeWaktuStatistik | "">("")

  const params: StatistikFilter = {
    deptId:    deptId || DEFAULT_STATS_DEPT_ID,
    tipeWaktu: tipeWaktu || "mingguan",
    bulan: now.getMonth() + 1,
    tahun: now.getFullYear(),
  }

  const { data, error, isLoading } = useAdminStats(params)

  useEffect(() => {
    const selectedDeptId = data?.statistikSurat.departemenId
    if (deptId && selectedDeptId && selectedDeptId !== deptId) {
      setDeptId(selectedDeptId)
    }
  }, [data?.statistikSurat.departemenId, deptId])

  return (
    <div className="flex w-full max-w-none flex-col gap-5 pb-6">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          Terjadi kesalahan: {error.message}
        </div>
      ) : isLoading || !data ? (
        <DashboardLoading />
      ) : (
        <>
          {/* Baris 1: stack di layar sedang, berdampingan saat ruang benar-benar cukup */}
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1fr_1.1fr] 2xl:items-stretch">

            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold tracking-normal">Aktivitas</h2>
              <div className="flex-1">
                <ActivitySummary aktivitas={data.aktivitas} />
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold tracking-normal">Surat Per Departemen</h2>
              <SuratPerDepartemenTable data={data.suratPerDepartemen} />
            </section>

          </div>

          {/* Baris 2: Statistik Surat */}
          <StatistikSuratCard
            departments={data.suratPerDepartemen}
            statistik={data.statistikSurat}
            selectedDeptId={deptId}
            selectedTipeWaktu={tipeWaktu}
            onDeptChange={setDeptId}
            onTipeWaktuChange={setTipeWaktu}
          />

          {/* Baris 3: Riwayat Aktivitas */}
          <UserActivityTable users={data.riwayatAktivitasPengguna} />
        </>
      )}
    </div>
  )
}
