import { format }          from "date-fns"
import { id }              from "date-fns/locale"
import { BrushCleaning }   from "lucide-react"
import type { CetakGroup } from "@/types/surat.types"

interface Props {
  groups      : CetakGroup[]
  onBersihkan : () => void   // ✅ tambah prop
}

function Th({ children, className = "" }: {
  children  : React.ReactNode
  className ?: string
}) {
  return (
    <th className={`text-left px-4 py-3 text-[10px] font-bold
      tracking-widest uppercase
      text-slate-400 dark:text-slate-500
      border-b border-slate-100 dark:border-slate-800
      ${className}`}>
      {children}
    </th>
  )
}

export function CetakScreenView({ groups, onBersihkan }: Props) {
  return (
    <div className="screen-view space-y-4">

      {groups.map((group) => (
        <div
          key={group.key}
          className="rounded-xl border border-slate-200 dark:border-slate-800
            bg-white dark:bg-slate-950 overflow-hidden"
        >
          {/* ── Group header ── */}
          <div className="flex items-center gap-2 px-5 py-4
            border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-[14px] font-extrabold tracking-wide
              text-slate-800 dark:text-white uppercase">
              {format(new Date(group.date), "dd MMMM yyyy", { locale: id })}
            </span>
            <span className="text-[13px] text-slate-400 dark:text-slate-500">
              ({group.dept})
            </span>
          </div>

          {/* ── Table ── */}
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <Th className="w-32">No. Register</Th>
                <Th className="w-28">Tgl. Terima</Th>
                <Th>Perihal</Th>
                <Th className="w-24">Lampiran</Th>
                <Th className="w-28">Tgl. Surat</Th>
                <Th className="w-36">No. Surat</Th>
                <Th className="w-24">Tujuan</Th>
              </tr>
            </thead>
            <tbody>
              {group.registers.flatMap((reg) =>
                reg.detailSurat.map((detail, dIdx) => {
                  const isFirst   = dIdx === 0
                  const isLastRow =
                    reg === group.registers.at(-1) &&
                    dIdx === reg.detailSurat.length - 1

                  return (
                    <tr
                      key={detail.id}
                      className={[
                        "bg-white dark:bg-slate-950",
                        !isLastRow
                          ? "border-b border-slate-100 dark:border-slate-800/50"
                          : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3.5">
                        {isFirst && (
                          <span className="font-mono text-[13px] font-semibold
                            text-slate-800 dark:text-white">
                            {reg.nomor}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] whitespace-nowrap
                        text-slate-600 dark:text-slate-300">
                        {isFirst
                          ? format(new Date(reg.tanggalTerima), "dd MMM yyyy", { locale: id })
                          : ""}
                      </td>
                      <td className="px-4 py-3.5 text-[13px]
                        text-slate-700 dark:text-slate-300
                        font-medium leading-snug break-words">
                        {detail.perihal}
                      </td>
                      <td className="px-4 py-3.5 text-[13px]
                        text-slate-500 dark:text-slate-400">
                        {detail.lampiran ?? "-"}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] whitespace-nowrap
                        text-slate-600 dark:text-slate-300">
                        {detail.tanggalSurat
                          ? format(new Date(detail.tanggalSurat), "dd MMM yyyy", { locale: id })
                          : "-"}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[13px]
                        text-slate-500 dark:text-slate-400 break-all">
                        {detail.noSurat ?? "-"}
                      </td>
                      <td className="px-4 py-3.5 text-[13px]
                        text-slate-500 dark:text-slate-400">
                        {isFirst ? (reg.tujuan ?? "-") : ""}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}