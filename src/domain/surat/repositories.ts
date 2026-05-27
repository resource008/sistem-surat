import type { CreateSuratPayload, UpdateSuratPayload, DeptOption } from "./types"

export interface ISuratRepository {
  findAll(
    type: string | null,
    ids: number[] | null,
    pagination?: { page: number; limit: number }
  ): Promise<unknown[] | { data: unknown[]; hasMore: boolean }>
  findByIdAndDept(id: number, dept: string): Promise<unknown | null>
  create(payload: CreateSuratPayload): Promise<unknown>
  update(id: number, dept: string, payload: UpdateSuratPayload): Promise<unknown>
  delete(id: number, dept: string): Promise<void>
  getPreviewNomor(deptId: string): Promise<string>
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function fetchAllSurat(
  type?: string,
  pagination?: { page: number; limit: number }
): Promise<{ data: unknown[]; hasMore: boolean }> {
  const params = new URLSearchParams()
  if (type) params.set("type", type)
  if (pagination) {
    params.set("page",  String(pagination.page))
    params.set("limit", String(pagination.limit))
  }
  return apiFetch<{ data: unknown[]; hasMore: boolean }>(`/api/surat?${params}`)
}

export async function fetchSuratById(dept: string, id: string): Promise<unknown> {
  return apiFetch<unknown>(`/api/surat/${encodeURIComponent(dept)}/${encodeURIComponent(id)}`)
}

export async function saveSurat(payload: CreateSuratPayload): Promise<unknown> {
  return apiFetch<unknown>("/api/surat", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  })
}

export async function updateSurat(
  dept:    string,
  id:      string,
  payload: UpdateSuratPayload,
): Promise<any> {
  return apiFetch<any>(`/api/surat/${encodeURIComponent(dept)}/${encodeURIComponent(id)}`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  })
}

export async function fetchDeptList(): Promise<DeptOption[]> {
  return apiFetch<DeptOption[]>("/api/dept")
}

export async function fetchPreviewNomor(deptId: string): Promise<string> {
  const data = await apiFetch<{ nomor: string }>(
    `/api/surat/preview-nomor?deptId=${encodeURIComponent(deptId)}`,
  )
  return data.nomor
}