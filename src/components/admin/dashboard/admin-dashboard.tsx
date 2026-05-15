"use client"

import { useState } from "react"
import useSWR from "swr"
import { CircleUserRound, Building, FileText, Inbox } from "lucide-react"

import { getGreeting } from "./helpers"
import { Period, StatsData } from "./types"

import { PeriodFilter } from "./components/period-filter"
import { StatCard } from "./components/stat-card"
import { DeptSuratCards } from "./components/dept-surat-card"
import { WeeklyTrendCard } from "./components/weekly-trend-card"
import { ChangeBadge } from "./components/change-badge"
import { CardSkeleton } from "./components/card-skeleton"
import { ChartConfig } from "@/components/ui/chart"

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Gagal mengambil data")
  return res.json()
})

export default function AdminDashboard() {
  const [period, setPeriod] = useState<Period>("hari_ini")
  
  const { data, error, isLoading } = useSWR<StatsData>(
    `/api/admin/stats?period=${period}`, fetcher
  )

  const chartConfig = data?.deptKeys.reduce((acc, dept, index) => {
    const hue = Math.round((index * 137.5) % 360)
    acc[dept] = { 
      label: dept, 
      color: `hsl(${hue}, 65%, 50%)` 
    }
    return acc
  }, {} as ChartConfig) || {}

  return (
    // Tambahkan pb-24 agar area bawah tidak tertutup tombol floating
    <div className="w-full flex flex-col pb-24 relative">
      
      {/* HEADER NORMAL - Tidak lagi sticky */}
      <div className="px-6 pt-6 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getGreeting()}, Admin!</h1>
          <p className="text-muted-foreground text-sm">Berikut adalah ringkasan sistem Anda saat ini.</p>
        </div>
        {/* PeriodFilter Dihapus dari sini */}
      </div>

      {/* KONTEN UTAMA */}
      <div className="p-6 flex flex-col gap-6">
        {error ? (
          <div className="p-4 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
            Terjadi kesalahan: {error.message}
          </div>
        ) : isLoading || !data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Akun" value={data.totalUsers} icon={CircleUserRound} accentBg="bg-blue-500/10" accentColor="text-blue-500" />
              <StatCard title="Total Departemen" value={data.totalDept} icon={Building} accentBg="bg-purple-500/10" accentColor="text-purple-500" />
              <StatCard title="Total Surat Masuk" value={data.totalSurat} icon={Inbox} badge={<ChangeBadge changePercent={data.daily.changePercent} />} />
              <StatCard title="Total PI" value={data.totalPI} icon={FileText} badge={<ChangeBadge changePercent={data.daily.piChangePercent} />} accentBg="bg-orange-500/10" accentColor="text-orange-500" />
            </div>

            <WeeklyTrendCard 
              weeklyTrend={data.weeklyTrend} 
              deptKeys={data.deptKeys} 
              chartConfig={chartConfig} 
              period={period} 
            />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Surat per Departemen</h2>
              <DeptSuratCards data={data.suratPerDept} period={period} />
            </div>
          </>
        )}
      </div>
      
      {/* FLOATING PERIOD FILTER (TENGAH BAWAH) */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="shadow-2xl rounded-xl bg-background/80 backdrop-blur-xl border border-border/50 p-1.5 transition-all duration-300 hover:shadow-blue-500/10">
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>
      </div>

    </div>
  )
}