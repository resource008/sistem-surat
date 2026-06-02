"use client"

import { useState } from "react"
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
  const [deptId, setDeptId]       = useState(DEFAULT_STATS_DEPT_ID)
  const [tipeWaktu, setTipeWaktu] = useState<TipeWaktuStatistik>("mingguan")

  const params: StatistikFilter = {
    deptId,
    tipeWaktu,
    bulan: now.getMonth() + 1,
    tahun: now.getFullYear(),
  }

  const { data, error, isLoading } = useAdminStats(params)

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-4 py-6 sm:px-6">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          Terjadi kesalahan: {error.message}
        </div>
      ) : isLoading || !data ? (
        <DashboardLoading />
      ) : (
        <>
          {/* Baris 1: stack di mobile, berdampingan di xl */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.1fr] xl:items-stretch">

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