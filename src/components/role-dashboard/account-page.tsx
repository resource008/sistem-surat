"use client"

import { Loader2 } from "lucide-react"
import { AccountActions } from "@/components/role-dashboard/account/account-actions"
import { AccountDataCard } from "@/components/role-dashboard/account/account-data-card"
import { PermissionsPanel } from "@/components/role-dashboard/account/permissions-panel"
import { useAccountPage } from "@/components/role-dashboard/account/use-account-page"

export function AccountPage() {
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
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
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
        editing={editing}
        created={created}
        updated={updated}
        onFormChange={updateForm}
      />

      <PermissionsPanel user={user} />

      <AccountActions
        editing={editing}
        saving={saving}
        onEdit={() => setEditing(true)}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </section>
  )
}
