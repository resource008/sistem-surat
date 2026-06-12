"use client"

import useSWR from "swr"
import type { UserPermissions } from "@/domain/user/types"
import { useSession } from "@/infrastructure/auth/auth-client"
import type { Role } from "@/types"

interface PermissionResponse {
  role: Role
  permissions: UserPermissions
}

const fetchPermissions = async (url: string): Promise<PermissionResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Gagal mengambil hak akses")
  return res.json()
}

export function useRolePermissions() {
  const { isPending } = useSession()
  const { data, isLoading, error } = useSWR<PermissionResponse>(
    "/api/me/permissions",
    fetchPermissions,
    {
      refreshInterval: 5_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  return {
    error,
    permissions: data?.permissions,
    role: data?.role,
    isLoading: isPending || isLoading,
  }
}
