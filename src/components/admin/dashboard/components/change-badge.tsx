import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function ChangeBadge({ changePercent }: { changePercent: number | null }) {
  // Diperbesar: text-xs, padding px-3 py-1, gap-1.5, dan font-semibold
  const baseClasses = "text-xs font-semibold gap-1.5 border-0 shadow-none rounded-full px-3 py-1 w-fit flex-none inline-flex items-center"

  if (changePercent === null)
    return (
      <Badge variant="secondary" className={`${baseClasses} bg-muted/50 text-muted-foreground`}>
        <Minus className="h-3.5 w-3.5 stroke-[2.5]" /> Tidak ada
      </Badge>
    )
  
  if (changePercent > 0)
    return (
      <Badge className={`${baseClasses} bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20`}>
        <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" /> +{changePercent}%
      </Badge>
    )
  
  if (changePercent < 0)
    return (
      <Badge className={`${baseClasses} bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/20`}>
        <TrendingDown className="h-3.5 w-3.5 stroke-[2.5]" /> {changePercent}%
      </Badge>
    )
    
  return (
    <Badge variant="secondary" className={`${baseClasses} bg-muted/50 text-muted-foreground`}>
      <Minus className="h-3.5 w-3.5 stroke-[2.5]" /> Sama
    </Badge>
  )
}