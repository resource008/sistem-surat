import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User } from "@/domain/user/types"
import { Eye, EyeOff, FileText, Shuffle } from "lucide-react"
import { useState } from "react"
import { generatePassword } from "./user-form-utils"
import type { UserEditFormState } from "./user-edit-types"

type UserEditAccountSectionProps = {
  user: User
  form: UserEditFormState
  disabled: boolean
  onFieldChange: <K extends keyof UserEditFormState>(
    key: K,
    value: UserEditFormState[K],
  ) => void
}

export function UserEditAccountSection({
  user,
  form,
  disabled,
  onFieldChange,
}: UserEditAccountSectionProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-background">
      <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
        <FileText size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold">Data Akun</span>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={form.name || user.name}
            className="size-10 text-sm transition-colors"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">
              {form.name || user.name}
            </span>
            <span className="text-xs text-muted-foreground">{form.role}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Lengkap">
            <Input
              value={form.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
              disabled={disabled}
              className="h-10 rounded-xl text-sm"
            />
          </Field>

          <Field label="Nama Pengguna">
            <Input
              value={form.username}
              onChange={(event) => onFieldChange("username", event.target.value)}
              disabled={disabled}
              className="h-10 rounded-xl text-sm"
              autoComplete="new-password"
            />
          </Field>

          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
              disabled={disabled}
              className="h-10 rounded-xl text-sm"
              autoComplete="off"
            />
          </Field>

          <Field label="Role">
            <Select
              value={form.role}
              onValueChange={(value) => {
                onFieldChange("role", value as UserEditFormState["role"])
              }}
              disabled={disabled}
            >
              <SelectTrigger className="h-10 rounded-xl text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="PKL">PKL</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Password Baru">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => onFieldChange("password", event.target.value)}
                  disabled={disabled}
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                  className="h-10 rounded-xl pr-11 text-sm"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={disabled}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onFieldChange("password", generatePassword())
                  setShowPassword(true)
                }}
                disabled={disabled}
                className="h-10 gap-2 rounded-xl text-sm"
              >
                <Shuffle size={14} /> Generate
              </Button>
            </div>
          </Field>

          <div className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}
