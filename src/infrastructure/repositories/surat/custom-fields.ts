import { prisma } from "@/infrastructure/databases/prisma-client"
import type { DbClient, CustomFieldsMap } from "./types"

export function normalizeCustomFields(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, fieldValue]) => [key, fieldValue == null ? "" : String(fieldValue)])
  )
}

export async function ensureCustomFieldColumns(tx: DbClient = prisma) {
  await tx.$executeRawUnsafe(`
    ALTER TABLE detail_surat
    ADD COLUMN IF NOT EXISTS custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb
  `)
}

export async function loadSuratCustomFields(
  ids: number[],
  tx: DbClient = prisma
): Promise<CustomFieldsMap> {
  if (ids.length === 0) return {}
  await ensureCustomFieldColumns(tx)
  const rows = await tx.$queryRawUnsafe<Array<{ id: number; customFields: unknown }>>(
    `
      SELECT id, custom_fields AS "customFields"
      FROM detail_surat
      WHERE id = ANY($1)
    `,
    ids
  )
  return Object.fromEntries(rows.map((row) => [row.id, normalizeCustomFields(row.customFields)]))
}

export async function saveSuratCustomFields(
  details: Array<{ id: number; customFields?: Record<string, string> }>,
  tx: DbClient
) {
  await ensureCustomFieldColumns(tx)
  for (const detail of details) {
    await tx.$executeRaw`
      UPDATE detail_surat
      SET custom_fields = ${JSON.stringify(detail.customFields ?? {})}::jsonb
      WHERE id = ${detail.id}
    `
  }
}
