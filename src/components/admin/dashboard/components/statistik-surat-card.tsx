"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATISTIC_TIME_OPTIONS } from "@/constants/admin-dashboard"
import type {
  StatistikSurat,
  SuratPerDepartemen,
  TipeWaktuStatistik,
} from "@/domain/admin-dashboard/types"
import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface StatistikSuratCardProps {
  departments: SuratPerDepartemen[]
  statistik: StatistikSurat
  selectedDeptId: string
  selectedTipeWaktu: TipeWaktuStatistik
  onDeptChange: (deptId: string) => void
  onTipeWaktuChange: (tipeWaktu: TipeWaktuStatistik) => void
}

export function StatistikSuratCard({
  departments,
  statistik,
  selectedDeptId,
  selectedTipeWaktu,
  onDeptChange,
  onTipeWaktuChange,
}: StatistikSuratCardProps) {
  const hasDepartments = departments.length > 0
  const selectedDepartment = departments.find((item) => item.departemenId === selectedDeptId)
  const chartData = useMemo(
    () =>
      statistik.labels.map((label: string, index: number) => ({
        label,
        jumlah: statistik.data[index] ?? 0,
      })),
    [statistik]
  )

  return (
    <section className="space-y-3">
      {/* Header: judul kiri, dropdown kanan — selalu horizontal */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="whitespace-nowrap text-base font-semibold tracking-normal">
          Statistik Surat
        </h2>
        <div className="flex shrink-0 gap-1.5">
          <Select
            value={selectedDepartment?.departemenId ?? ""}
            onValueChange={onDeptChange}
          >
            <SelectTrigger className="h-8 w-36 text-xs sm:w-40">
              <SelectValue placeholder="Pilih Departemen" />
            </SelectTrigger>
            <SelectContent>
              {hasDepartments ? departments.map((item) => (
                <SelectItem key={item.departemenId} value={item.departemenId}>
                  {item.departemen}
                </SelectItem>
              )) : (
                <SelectItem value="__empty_departemen__" disabled>
                  Belum ada departemen
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Select
            value={selectedTipeWaktu}
            onValueChange={(value) => onTipeWaktuChange(value as TipeWaktuStatistik)}
          >
            <SelectTrigger className="h-8 w-36 text-xs sm:w-40">
              <SelectValue placeholder="Pilih Tipe Waktu" />
            </SelectTrigger>
            <SelectContent>
              {STATISTIC_TIME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!hasDepartments && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-300">
          Departemen tidak ada. Silahkan tambah data departemen terlebih dahulu untuk melihat statistik surat.
        </div>
      )}

      <Card className="overflow-hidden rounded-xl">
        <CardContent className="p-4 sm:p-5">
          <ChartContainer
            config={{
              jumlah: {
                label: "Jumlah surat",
                color: "hsl(246, 100%, 70%)",
              },
            }}
            className="h-64 w-full sm:h-80"
          >
            <AreaChart
              data={chartData}
              margin={{ top: 16, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillJumlah" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--color-jumlah)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-jumlah)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#888888"
                strokeDasharray="3 3"
                strokeOpacity={0.25}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#666666" }}
                tickMargin={10}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#666666" }}
              />
              <ChartTooltip
                cursor={{ stroke: "#888888", strokeDasharray: "3 3", strokeOpacity: 0.5 }}
                content={<ChartTooltipContent />}
              />
              <Area
                type="monotone"
                dataKey="jumlah"
                stroke="var(--color-jumlah)"
                strokeWidth={2.5}
                fill="url(#fillJumlah)"
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
}
