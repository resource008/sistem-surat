import type { CreateSuratPayload, UpdateSuratPayload, DeptOption } from "./types"
import type { RegisterSurat }                                      from "@/types"
import { hydrateDepartemenForClient } from "@/lib/departemen-columns"

// ─── Return type helper ───────────────────────────────────────────────────────

export type SuratResult = RegisterSurat
export type PaginatedResult<T> = { data: T[]; hasMore: boolean }
type SaveSuratResponse = { message: string }

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ISuratRepository {
  findAll(
    type:        string | null,
    ids:         number[] | null,
    pagination?: { page: number; limit: number },
    date?:       string | null,
    depts?:      string[] | null,
    search?:     string | null,
    column?:     string | null,
  ): Promise<SuratResult[] | PaginatedResult<SuratResult>>

  findByIdAndDept(id: number, dept: string): Promise<SuratResult | null>
  create(payload: CreateSuratPayload): Promise<SuratResult>
  update(id: number, dept: string, payload: UpdateSuratPayload): Promise<SuratResult>
  delete(id: number, dept: string): Promise<void>
  getPreviewNomor(deptId: string, tanggalTerima?: Date): Promise<string>
}

// ─── Client-side fetch helpers ────────────────────────────────────────────────

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? body?.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function fetchAllSurat(
  type?:       string,
  pagination?: { page: number; limit: number },
  date?:       string | null,
  depts?:      string[] | null,
): Promise<PaginatedResult<SuratResult>> {
  const params = new URLSearchParams()
  if (type)          params.set("type",  type)
  if (date)          params.set("date",  date)
  if (depts?.length) params.set("dept",  depts.join(","))
  if (pagination) {
    params.set("page",  String(pagination.page))
    params.set("limit", String(pagination.limit))
  }
  return apiFetch<PaginatedResult<SuratResult>>(`/api/surat?${params}`)
}

export async function fetchSuratById(dept: string, id: string): Promise<SuratResult> {
  return apiFetch<SuratResult>(
    `/api/surat/${encodeURIComponent(dept)}/${encodeURIComponent(id)}`
  )
}

export async function saveSurat(payload: CreateSuratPayload): Promise<SaveSuratResponse> {
  return apiFetch<SaveSuratResponse>("/api/surat", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  })
}

export async function updateSurat(
  dept:    string,
  id:      string,
  payload: UpdateSuratPayload,
): Promise<SuratResult> {
  return apiFetch<SuratResult>(
    `/api/surat/${encodeURIComponent(dept)}/${encodeURIComponent(id)}`,
    {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    }
  )
}

export async function fetchDeptList(): Promise<DeptOption[]> {
  const departments = await apiFetch<DeptOption[]>("/api/admin/dept")

  return Promise.all(
    departments.map(async (department) => {
      const detail = await apiFetch<DeptOption>(`/api/admin/dept/${encodeURIComponent(department.id)}`)
      return hydrateDepartemenForClient(detail)
    })
  ) as Promise<DeptOption[]>
}

export async function fetchPreviewNomor(deptId: string, tanggalTerima?: string): Promise<string> {
  const params = new URLSearchParams({ deptId })
  if (tanggalTerima) params.set("tanggalTerima", tanggalTerima)

  const data = await apiFetch<{ nomor: string }>(
    `/api/surat/preview-nomor?${params.toString()}`,
  )
  return data.nomor
}
