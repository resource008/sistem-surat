"use client"

import useSWR from "swr"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type RoleItem = {
  name: string
  value: string
}

type RoleResponse = {
  roles: RoleItem[]
}

const fetcher = async (url: string): Promise<RoleResponse> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil role")
  return json
}

type UserRoleSelectProps = {
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}

export function UserRoleSelect({ value, disabled, onChange }: UserRoleSelectProps) {
  const { data } = useSWR<RoleResponse>("/api/admin/user-roles", fetcher)
  const roles = data?.roles ?? [
    { name: "Admin", value: "ADMIN" },
    { name: "Staff", value: "STAFF" },
    { name: "PKL", value: "PKL" },
  ]

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="h-10 rounded-xl text-sm">
        <SelectValue placeholder="Pilih role" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
