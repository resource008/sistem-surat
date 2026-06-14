"use client"

import { FileText } from "lucide-react"
import { UserAvatar } from "@/components/shared/user-avatar"
import { AccountField } from "./account-field"
import { TimestampBlock } from "./timestamp-block"
import type { AccountForm, FormattedDateTime } from "./types"

type AccountDataCardProps = {
  form: AccountForm
  roleLabel: string
  editing: boolean
  created: FormattedDateTime
  updated: FormattedDateTime
  onFormChange: (next: Partial<AccountForm>) => void
}

export function AccountDataCard({
  form,
  roleLabel,
  editing,
  created,
  updated,
  onFormChange,
}: AccountDataCardProps) {
  const displayName = form.name || "-"

  return (
    <div className="w-full overflow-hidden rounded-[20px] border border-border bg-transparent">
      <div className="flex h-16 items-center gap-3 border-b border-border px-8 max-sm:h-14 max-sm:px-5">
        <FileText size={18} className="text-muted-foreground" />
        <span className="text-[15px] font-semibold text-foreground">Data Akun</span>
      </div>

      <div className="px-8 py-8 max-lg:px-6 max-lg:py-7 max-sm:px-5 max-sm:py-5">
        <div className="flex items-start justify-between gap-8 max-md:flex-col">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={form.name || "User"}
              className="size-[52px] text-[17px] font-bold max-sm:size-12 max-sm:text-base"
            />
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold text-foreground">
                {displayName}
              </div>
              <div className="mt-0.5 text-[14px] text-muted-foreground">
                {roleLabel}
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-2 gap-10 sm:grid">
            <TimestampBlock title="Diperbarui" value={updated} />
            <TimestampBlock title="Ditambahkan" value={created} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 max-sm:mt-7 max-sm:gap-4">
          <AccountField
            label="Nama Lengkap"
            value={form.name}
            editable={editing}
            onChange={(name) => onFormChange({ name })}
          />
          <AccountField
            label="Nama Pengguna"
            value={form.username}
            editable={editing}
            onChange={(username) => onFormChange({ username })}
          />
          <AccountField
            label="Email"
            value={form.email}
            type="email"
            editable={editing}
            onChange={(email) => onFormChange({ email })}
          />
          <AccountField label="Role" value={roleLabel} />
        </div>
      </div>
    </div>
  )
}
