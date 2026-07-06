"use client"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { AccountActions } from "@/components/role-dashboard/account/account-actions"
import { AccountDataCard } from "@/components/role-dashboard/account/account-data-card"
import { PermissionsPanel } from "@/components/role-dashboard/account/permissions-panel"
import { TimestampBlock } from "@/components/role-dashboard/account/timestamp-block"
import { useAccountPage } from "@/components/role-dashboard/account/use-account-page"
import type { FormattedDateTime } from "@/components/role-dashboard/account/types"

type AccountPageProps = {
  readOnly?: boolean
}

function MobileTimestampCard({
  created,
  updated,
}: {
  created: FormattedDateTime
  updated: FormattedDateTime
}) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-4 rounded-[20px] border border-border bg-transparent px-5 py-5 sm:hidden">
      <TimestampBlock title="Diperbarui" value={updated} />
      <TimestampBlock title="Ditambahkan" value={created} />
    </div>
  )
}

export function AccountPage({ readOnly = false }: AccountPageProps) {
  const {
    user,
    form,
    loading,
    saving,
    editing,
    roleLabel,
    created,
    updated,
    setEditing,
    updateForm,
    handleCancel,
    handleSave,
  } = useAccountPage()

  if (loading) {
    return (
      <LoadingSkeleton type="profile" />
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground">
        Data akun tidak ditemukan.
      </div>
    )
  }

  return (
    <section className="min-h-[calc(100vh-112px)] w-full pb-24">
      <AccountDataCard
        form={form}
        roleLabel={roleLabel}
        editing={!readOnly && editing}
        created={created}
        updated={updated}
        onFormChange={updateForm}
      />

      <PermissionsPanel user={user} />

      <MobileTimestampCard created={created} updated={updated} />

      {!readOnly && (
        <AccountActions
          editing={editing}
          saving={saving}
          onEdit={() => setEditing(true)}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </section>
  )
}
