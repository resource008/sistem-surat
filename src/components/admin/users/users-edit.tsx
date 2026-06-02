"use client"

import { useState, useEffect }        from "react"
import { useParams, useRouter }       from "next/navigation"
import { toast }                      from "sonner"
import {
  ArrowLeft, FileText, Loader2, Save, X, KeyRound, Check, Eye, EyeOff, Shuffle,
} from "lucide-react"
import { Button }  from "@/components/ui/button"
import { Input }   from "@/components/ui/input"
import { Label }   from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { User }                    from "@/domain/user/types"
import { getAvatarColor, getInitials }  from "@/lib/avatar"

// ── Helpers ───────────────────────────────────────────────────

const PERMISSIONS = [
  { key: "canCreate", label: "Tambah Data Surat" },
  { key: "canPrint",  label: "Cetak Surat"       },
  { key: "canEdit",   label: "Edit Data Surat"   },
  { key: "canTrack",  label: "Lacak Surat"       },
  { key: "canDelete", label: "Hapus Data Surat"  },
] as const

function generatePassword(length = 12) {
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const number = "0123456789"
  const symbol = "!@#$%^&*"
  const all = lower + upper + number + symbol
  const required = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    number[Math.floor(Math.random() * number.length)],
    symbol[Math.floor(Math.random() * symbol.length)],
  ]

  for (let i = required.length; i < length; i++) {
    required.push(all[Math.floor(Math.random() * all.length)])
  }

  return required
    .sort(() => Math.random() - 0.5)
    .join("")
}

// ── Toggle Button ─────────────────────────────────────────────

function PermissionToggle({
  value, onChange,
}: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border
          ${!value
            ? "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
            : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-400"}`}
      >
        <X size={14} />
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border
          ${value
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-400"}`}
      >
        <Check size={14} strokeWidth={3} />
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────

export default function UserEditPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()

  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    username: "",
    role:     "STAFF",
    password: "",
  })

  const [permissions, setPermissions] = useState({
    canCreate: false,
    canEdit:   false,
    canDelete: false,
    canPrint:  false,
    canTrack:  false,
  })

  // ── Fetch ─────────────────────────────────────────────────

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(r => r.json())
      .then((data: User) => {
        setUser(data)
        setForm({
          name:     data.name,
          email:    data.email,
          username: data.username,
          role:     data.role,
          password: "",
        })
        setPermissions({
          canCreate: data.permissions?.canCreate ?? false,
          canEdit:   data.permissions?.canEdit   ?? false,
          canDelete: data.permissions?.canDelete ?? false,
          canPrint:  data.permissions?.canPrint  ?? false,
          canTrack:  data.permissions?.canTrack  ?? false,
        })
        window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Edit Akun" }))
      })
      .catch(() => toast.error("Gagal memuat data user"))
      .finally(() => setLoading(false))
  }, [id])

  // ── Save ──────────────────────────────────────────────────

  async function handleSave() {
    // ── Validasi client-side ──────────────────────────────
    if (!form.name.trim()) { toast.error("Nama lengkap wajib diisi"); setSaving(false); return }
    if (!form.username.trim()) { toast.error("Nama pengguna wajib diisi"); setSaving(false); return }
    if (!form.email.trim()) { toast.error("Email wajib diisi"); setSaving(false); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Format email tidak valid"); setSaving(false); return }
    if (form.password && form.password.length < 8) { toast.error("Password minimal 8 karakter"); setSaving(false); return }
    if (form.password && form.password.length > 72) { toast.error("Password maksimal 72 karakter"); setSaving(false); return }
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        name:        form.name,
        email:       form.email,
        username:    form.username,
        role:        form.role,
        permissions,
      }
      if (form.password) body.password = form.password

      const res  = await fetch(`/api/users/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Gagal menyimpan")
      toast.success("Berhasil disimpan")
      router.push(`/admin/users/${id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan")
    } finally {
      setSaving(false)
    }
  }

  // ── Loading ───────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-muted-foreground" size={24} />
    </div>
  )

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <p className="text-sm text-muted-foreground">User tidak ditemukan</p>
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft size={14} className="mr-1.5" /> Kembali
      </Button>
    </div>
  )

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 pb-32">

      {/* Data Akun */}
      <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
          <FileText size={16} className="text-muted-foreground" />
          <span className="text-sm font-semibold">Data Akun</span>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">

          {/* Avatar + nama (preview real-time dari form.name) */}
          <div className="flex items-center gap-4">
            <div
              style={{ backgroundColor: getAvatarColor(form.name || user.name) }}
              className="size-10 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold text-white transition-colors"
            >
              {getInitials(form.name || user.name)}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">
                {form.name || user.name}
              </span>
              <span className="text-xs text-muted-foreground">{form.role}</span>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Nama Lengkap</Label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="rounded-xl h-10 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Nama Pengguna</Label>
              <Input
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                className="rounded-xl h-10 text-sm"
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="rounded-xl h-10 text-sm"
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger className="rounded-xl h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="PKL">PKL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Password Baru</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                    className="h-10 rounded-xl pr-11 text-sm"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
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
                    const nextPassword = generatePassword()
                    setForm(f => ({ ...f, password: nextPassword }))
                    setShowPassword(true)
                  }}
                  className="h-10 gap-2 rounded-xl text-sm"
                >
                  <Shuffle size={14} /> Generate
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Hak Akses — hanya untuk STAFF dan PKL */}
      {form.role !== "ADMIN" && (
        <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
            <KeyRound size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Hak Akses</span>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PERMISSIONS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-2
                  border-b border-border/30 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <PermissionToggle
                    value={permissions[key]}
                    onChange={v => setPermissions(p => ({ ...p, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl
                        border border-slate-200/80 dark:border-slate-700/60
                        bg-white/90 dark:bg-slate-950/90
                        backdrop-blur-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/50">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/users/${id}`)}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
                       text-slate-600 dark:text-slate-300
                       hover:text-slate-900 dark:hover:text-white
                       hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={14} /> Batal
          </Button>
          <Button
            disabled={saving}
            onClick={handleSave}
            className="gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold
                       bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving
              ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
              : <><Save size={14} /> Simpan</>}
          </Button>
        </div>
      </div>

    </div>
  )
}
