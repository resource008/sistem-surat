import type { FormattedDateTime } from "./types"

type TimestampBlockProps = {
  title: string
  value: FormattedDateTime
}

export function TimestampBlock({ title, value }: TimestampBlockProps) {
  return (
    <div className="flex min-w-[118px] flex-col items-end gap-1.5 text-right max-md:min-w-0 max-sm:items-start max-sm:text-left">
      <span className="text-[14px] font-medium text-muted-foreground max-sm:text-[13px]">
        {title}
      </span>
      <span className="text-[15px] font-bold text-foreground max-sm:text-[14px]">
        {value.date}
      </span>
      {value.time && (
        <span className="text-[13px] text-muted-foreground max-sm:text-[12px]">
          {value.time}
        </span>
      )}
    </div>
  )
}
