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
    <div className="w-full overflow-hidden rounded-xl border border-border bg-transparent">
      <div className="flex h-12 items-center gap-2.5 border-b border-border px-5 max-sm:px-4">
        <FileText size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">Data Akun</span>
      </div>

      <div className="px-5 py-5 max-sm:px-4">
        <div className="flex items-start justify-between gap-6 max-md:flex-col">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={form.name || "User"}
              className="size-11 text-[15px] font-bold"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-foreground">
                {displayName}
              </div>
              <div className="mt-0.5 text-[13px] text-muted-foreground">
                {roleLabel}
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-2 gap-8 sm:grid">
            <TimestampBlock title="Diperbarui" value={updated} />
            <TimestampBlock title="Ditambahkan" value={created} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
