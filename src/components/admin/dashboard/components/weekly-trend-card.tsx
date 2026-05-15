"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { StatsData, Period } from "../types"

const CHART_META: Record<Period, { title: string; desc: string }> = {
  hari_ini:   { title: "Tren Surat Per Jam", desc: "Surat masuk per jam kerja" },
  minggu_ini: { title: "Tren Surat Harian", desc: "Surat masuk per hari kerja minggu ini" },
  bulan_ini:  { title: "Tren Surat Mingguan", desc: "Surat masuk per minggu dalam bulan ini" },
  tahun_ini:  { title: "Tren Surat Bulanan", desc: "Surat masuk per bulan sepanjang tahun" },
}

interface WeeklyTrendCardProps {
  weeklyTrend: StatsData["weeklyTrend"]
  deptKeys: string[]
  chartConfig: ChartConfig
  period: Period
}

export function WeeklyTrendCard({ weeklyTrend, deptKeys, chartConfig, period }: WeeklyTrendCardProps) {
  const { title, desc } = CHART_META[period]
  const [hiddenDepts, setHiddenDepts] = useState<string[]>([])

  const toggleDept = (dept: string) => {
    setHiddenDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{desc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {weeklyTrend.length === 0 ? (
          <div className="flex items-center justify-center h-75 text-sm text-muted-foreground">
            Belum ada data tren
          </div>
        ) : (
          <div className="flex flex-col">
            <ChartContainer config={chartConfig} className="h-75 w-full">
              <AreaChart data={weeklyTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  {deptKeys.map((dept) => (
                    <linearGradient key={`fill-${dept}`} id={`fill-${dept}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={`var(--color-${dept})`} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={`var(--color-${dept})`} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                
                {/* PERBAIKAN WARNA DI SINI: Menggunakan #888888 agar aman di Dark Mode */}
                <CartesianGrid strokeDasharray="3 3" stroke="#888888" strokeOpacity={0.25} vertical={false} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 11, fill: "#888888" }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickMargin={10} 
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "#888888" }} 
                  axisLine={false} 
                  tickLine={false} 
                  allowDecimals={false} 
                />
                
                {/* TOOLTIP CUSTOM: Garis kursor juga disesuaikan ke #888888 */}
                <ChartTooltip
                  cursor={{ stroke: "#888888", strokeWidth: 1, strokeDasharray: "3 3", strokeOpacity: 0.5 }}
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload) return null
                    const filtered = payload.filter((p: any) => p.value > 0)
                    if (filtered.length === 0) return null

                    return (
                      <div className="rounded-lg border bg-background/95 backdrop-blur shadow-md p-3 text-xs w-max max-w-100">
                        <div className="font-semibold text-muted-foreground mb-2 pb-1 border-b border-border/50">
                          {label}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-2">
                          {filtered.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="font-medium truncate max-w-15">{item.name}</span>
                              </div>
                              <span className="text-muted-foreground">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }}
                />
                
                {deptKeys.map((dept) => {
                  if (hiddenDepts.includes(dept)) return null;
                  return (
                    <Area
                      key={dept}
                      type="monotone"
                      dataKey={dept}
                      stroke={`var(--color-${dept})`}
                      fill={`url(#fill-${dept})`}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  )
                })}
              </AreaChart>
            </ChartContainer>

            {/* LEGENDA CUSTOM */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-6 pt-4 border-t border-border/50">
              {deptKeys.map((dept) => {
                const isHidden = hiddenDepts.includes(dept)
                const deptColor = chartConfig[dept]?.color || "hsl(var(--primary))"

                return (
                  <button
                    key={dept}
                    onClick={() => toggleDept(dept)}
                    className={`flex items-center gap-1.5 text-[11px] font-medium transition-all duration-200 hover:opacity-70 ${
                      isHidden ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <div 
                      className={`w-3 h-3 rounded-full shadow-sm border border-border/50 transition-transform ${isHidden ? "scale-75" : "scale-100"}`} 
                      style={{ backgroundColor: deptColor }} 
                    />
                    {dept}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}