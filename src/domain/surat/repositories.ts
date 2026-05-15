import { DeptOption, CreateSuratPayload } from "./types"

const API_URL = "/api"

export async function fetchDeptList(): Promise<DeptOption[]> {
  const res = await fetch(`${API_URL}/dept`)
  if (!res.ok) throw new Error("Gagal memuat departemen")
  return await res.json() as DeptOption[]
}

export async function fetchPreviewNomor(deptId: string): Promise<string> {
  const res = await fetch(`${API_URL}/surat/preview-nomor?deptId=${deptId}`)
  if (!res.ok) throw new Error("Gagal memuat preview nomor")
  const data = await res.json()
  return data.nomor
}

export async function saveSurat(payload: CreateSuratPayload): Promise<void> {
  const res = await fetch(`${API_URL}/surat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Gagal menyimpan data ke server")
  }
}