// src/domain/surat/repositories.ts
//
// Dua lapisan tanggung jawab:
//   1. ISuratRepository interface  — kontrak untuk infrastructure layer (Prisma)
//   2. Client-side fetch helpers   — dipanggil oleh hooks dari browser

import type { CreateSuratPayload, UpdateSuratPayload, DeptOption } from "./types"

// ─────────────────────────────────────────────────────────────────────────────
// § 1  Repository interface  (implemented by infrastructure/prisma layer)
// ─────────────────────────────────────────────────────────────────────────────

export interface ISuratRepository {
  findAll(type: string | null, ids: number[] | null): Promise<unknown[]>
  findByIdAndDept(id: number, dept: string): Promise<unknown | null>
  create(payload: CreateSuratPayload): Promise<unknown>
  update(id: number, dept: string, payload: UpdateSuratPayload): Promise<unknown>
  delete(id: number, dept: string): Promise<void>
  getPreviewNomor(deptId: string): Promise<string>
}

// ─────────────────────────────────────────────────────────────────────────────
// § 2  Client-side fetch helpers  (thin HTTP wrappers, called from hooks)
// ─────────────────────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

/** Fetch all surat, optionally filtered by type ("pi" | undefined). */
export async function fetchAllSurat(type?: string): Promise<unknown[]> {
  const url = type ? `/api/surat?type=${encodeURIComponent(type)}` : "/api/surat"
  return apiFetch<unknown[]>(url)
}

/** Fetch a single surat by dept shortName and numeric id. */
export async function fetchSuratById(dept: string, id: string): Promise<unknown> {
  return apiFetch<unknown>(`/api/surat/${encodeURIComponent(dept)}/${encodeURIComponent(id)}`)
}

/** Save (create) a new surat. */
export async function saveSurat(payload: CreateSuratPayload): Promise<unknown> {
  return apiFetch<unknown>("/api/surat", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  })
}

/** Update an existing surat. */
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

/** Fetch the list of departments available for selection. */
export async function fetchDeptList(): Promise<DeptOption[]> {
  return apiFetch<DeptOption[]>("/api/dept")
}

/** Fetch the preview nomor surat for a given dept. */
export async function fetchPreviewNomor(deptId: string): Promise<string> {
  const data = await apiFetch<{ nomor: string }>(
    `/api/surat/preview-nomor?deptId=${encodeURIComponent(deptId)}`,
  )
  return data.nomor
}