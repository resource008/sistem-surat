import type { FormattedDateTime } from "./types"

type TimestampBlockProps = {
  title: string
  value: FormattedDateTime
}

export function TimestampBlock({ title, value }: TimestampBlockProps) {
  return (
    <div className="flex min-w-[108px] flex-col items-end gap-1 text-right max-md:min-w-0 max-sm:items-start max-sm:text-left">
      <span className="text-[13px] font-medium text-muted-foreground">
        {title}
      </span>
      <span className="text-[13px] font-bold text-foreground">
        {value.date}
      </span>
    </div>
  )
}
