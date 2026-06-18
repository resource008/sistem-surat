import { prisma }    from "@/infrastructure/databases/prisma-client"
import { Prisma }    from "@/generated/prisma"
import { AppError }  from "@/lib/errors"
import type { ISuratRepository, SuratResult, PaginatedResult } from "@/domain/surat/repositories"
import type { CreateSuratPayload, UpdateSuratPayload }         from "@/domain/surat/types"
import type { DepartemenColumn, DepartemenColumnType, RegisterSurat } from "@/types"
import { DEFAULT_DEPARTEMEN_COLUMNS } from "@/types"
import { getCustomFieldInputValue, getSuratBuiltInColumnKey } from "@/domain/surat/custom-fields"

const deptSelect = {
  id:              true,
  shortName:       true,
  printColumnName: true,
} as const

type CustomFieldsMap = Record<number, Record<string, string>>
type DepartmentColumnsMap = Record<string, DepartemenColumn[]>
const TUJUAN_DEFAULT_ID = "default_tujuan"

// ─── Serializer: Date → string agar cocok dengan type RegisterSurat/RegisterPI ─

function normalizeCustomFields(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, fieldValue]) => [key, fieldValue == null ? "" : String(fieldValue)])
  )
}

function getDynamicDetailValue(columns: DepartemenColumn[], customFields: Record<string, string>, key: ReturnType<typeof getSuratBuiltInColumnKey>) {
  if (!key) return ""
  const column = columns.find((item) => getSuratBuiltInColumnKey(item) === key)
  return column ? customFields[column.id] ?? "" : ""
}

function getFirstCustomFieldValue(customFields: Record<string, string>) {
  return Object.values(customFields).find((value) => value.trim().length > 0) ?? ""
}

function normalizeDetailDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : date
}

function buildDynamicSuratDetail(
  item: {
    customFields?: Record<string, string>
    tujuan?: string | null
    perihal?: unknown
    noSurat?: unknown
    lampiran?: unknown
    tanggalSurat?: unknown
  },
  columns: DepartemenColumn[],
  tujuan: string,
  fallbackDate: Date
) {
  const customFields = normalizeCustomFields(item.customFields ?? {})
  const getValue = (key: ReturnType<typeof getSuratBuiltInColumnKey>) => {
    const column = columns.find((column) => getSuratBuiltInColumnKey(column) === key)
    return column ? getCustomFieldInputValue(column, item) : getDynamicDetailValue(columns, customFields, key)
  }
  const perihal = getValue("perihal") || getFirstCustomFieldValue(customFields) || "-"
  const noSurat = getValue("noSurat") || null
  const lampiran = getValue("lampiran") || null
  const tanggalSurat = normalizeDetailDate(
    getValue("tanggalSurat"),
    fallbackDate
  )

  return {
    perihal,
    noSurat,
    lampiran,
    tujuan: item.tujuan ?? tujuan,
    tanggalSurat,
  }
}

function getDefaultColumnTemplate(column: DepartemenColumn) {
  if (!column.isDefault) return null
  return DEFAULT_DEPARTEMEN_COLUMNS.find((defaultColumn) => column.id.includes(defaultColumn.id)) ?? null
}

function normalizeDepartmentColumns(departmentId: string, columns: DepartemenColumn[]) {
  const normalized = columns.map((column) => {
    const defaultColumn = getDefaultColumnTemplate(column)
    return defaultColumn
      ? {
          ...defaultColumn,
          id: column.id,
        }
      : { ...column }
  })

  DEFAULT_DEPARTEMEN_COLUMNS.forEach((defaultColumn) => {
    const hasDefaultColumn = normalized.some((column) =>
      column.isDefault && column.id.includes(defaultColumn.id)
    )

    if (!hasDefaultColumn) {
      normalized.push({
        ...defaultColumn,
        id: `${departmentId}_${defaultColumn.id}`,
      })
    }
  })

  const defaults = DEFAULT_DEPARTEMEN_COLUMNS
    .map((defaultColumn) =>
      normalized.find((column) => column.isDefault && column.id.includes(defaultColumn.id))
    )
    .filter((column): column is DepartemenColumn => !!column)
  const defaultBeforeTujuan = defaults.filter((column) => !column.id.includes(TUJUAN_DEFAULT_ID))
  const tujuanColumn = defaults.find((column) => column.id.includes(TUJUAN_DEFAULT_ID))

  const custom = normalized
    .filter((column) => !column.isDefault)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((column, index) => {
      return {
        ...column,
        sortOrder: defaultBeforeTujuan.length + index,
      }
    })

  return [
    ...defaultBeforeTujuan.map((column, index) => ({ ...column, sortOrder: index })),
    ...custom,
    ...(tujuanColumn ? [{ ...tujuanColumn, sortOrder: defaultBeforeTujuan.length + custom.length }] : []),
  ]
}

function serializeSurat(
  row: Record<string, unknown>,
  customFields: CustomFieldsMap = {},
  departmentColumns: DepartmentColumnsMap = {}
): RegisterSurat {
  const dept = row.dept as Record<string, unknown> | undefined
  const deptShortName = String(dept?.shortName ?? row.deptId)

  return {
    id:            Number(row.id),
    nomor:         String(row.nomor),
    deptId:        String(row.deptId),
    dept: {
      id:              String(dept?.id ?? row.deptId),
      shortName:       deptShortName,
      printColumnName: String(dept?.printColumnName ?? ""),
      columns: departmentColumns[String(dept?.id ?? row.deptId)] ?? [],
      displayColumns: (departmentColumns[String(dept?.id ?? row.deptId)] ?? [])
        .filter((column) => column.showInDataSurat),
    },
    asalSurat:     String(row.asalSurat ?? ""),
    tujuan:        deptShortName,
    tanggalTerima: row.tanggalTerima instanceof Date
      ? row.tanggalTerima.toISOString()
      : String(row.tanggalTerima),
    detailSurat: (row.detailSurat as Record<string, unknown>[])?.map((d) => ({
      id:       Number(d.id),
      perihal:  String(d.perihal ?? ""),
      noSurat:  d.noSurat  === null || d.noSurat  === undefined ? null : String(d.noSurat),
      lampiran: d.lampiran === null || d.lampiran === undefined ? null : String(d.lampiran),
      tujuan:   deptShortName,
      tanggalSurat: d.tanggalSurat instanceof Date
        ? d.tanggalSurat.toISOString()
        : String(d.tanggalSurat),
      customFields: customFields[Number(d.id)] ?? normalizeCustomFields(d.customFields),
    })),
  } as RegisterSurat
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class SuratRepository implements ISuratRepository {
  private async ensureCustomFieldColumns(tx: Prisma.TransactionClient | typeof prisma = prisma) {
    await tx.$executeRawUnsafe(`
      ALTER TABLE detail_surat
      ADD COLUMN IF NOT EXISTS custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb
    `)
  }

  private async loadSuratCustomFields(ids: number[], tx: Prisma.TransactionClient | typeof prisma = prisma): Promise<CustomFieldsMap> {
    if (ids.length === 0) return {}
    await this.ensureCustomFieldColumns(tx)
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

  private async loadDepartmentColumns(departmentIds: string[]): Promise<DepartmentColumnsMap> {
    const ids = [...new Set(departmentIds)].filter(Boolean)
    if (ids.length === 0) return {}
    const fallback = Object.fromEntries(
      ids.map((departmentId) => [departmentId, normalizeDepartmentColumns(departmentId, [])])
    ) as DepartmentColumnsMap

    const table = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT to_regclass('public.department_columns') IS NOT NULL AS "exists"
    `
    if (!table[0]?.exists) return fallback
    await prisma.$executeRawUnsafe(`
      ALTER TABLE department_columns
      ADD COLUMN IF NOT EXISTS show_in_print BOOLEAN NOT NULL DEFAULT true
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE department_columns
      ADD COLUMN IF NOT EXISTS default_value TEXT NOT NULL DEFAULT ''
    `)

    const rows = await prisma.$queryRawUnsafe<Array<{
      departmentId: string
      id: string
      label: string
      type: DepartemenColumnType
      defaultValue: string
      isDefault: boolean
      isRequired: boolean
      showInDataSurat: boolean
      showInPrint: boolean
      sortOrder: number
    }>>(
      `
        SELECT
          department_id AS "departmentId",
          id,
          label,
          data_type AS "type",
          default_value AS "defaultValue",
          is_default AS "isDefault",
          is_required AS "isRequired",
          show_in_data_surat AS "showInDataSurat",
          show_in_print AS "showInPrint",
          sort_order AS "sortOrder"
        FROM department_columns
        WHERE department_id = ANY($1)
        ORDER BY sort_order ASC, label ASC
      `,
      ids
    )

    const grouped = rows.reduce<DepartmentColumnsMap>((acc, row) => {
      acc[row.departmentId] ??= []
      acc[row.departmentId].push({
        id: row.id,
        label: row.label,
        type: row.type,
        defaultValue: row.defaultValue,
        isDefault: row.isDefault,
        isRequired: row.isRequired,
        showInDataSurat: row.showInDataSurat,
        showInPrint: row.showInPrint,
        sortOrder: row.sortOrder,
      })
      return acc
    }, {})

    ids.forEach((departmentId) => {
      grouped[departmentId] = normalizeDepartmentColumns(departmentId, grouped[departmentId] ?? [])
    })

    return grouped
  }

  private async saveSuratCustomFields(details: Array<{ id: number; customFields?: Record<string, string> }>, tx: Prisma.TransactionClient) {
    await this.ensureCustomFieldColumns(tx)
    for (const detail of details) {
      await tx.$executeRaw`
        UPDATE detail_surat
        SET custom_fields = ${JSON.stringify(detail.customFields ?? {})}::jsonb
        WHERE id = ${detail.id}
      `
    }
  }

  async findAll(
    type:        string | null,
    ids:         number[] | null,
    pagination?: { page: number; limit: number },
    date?:       string | null,
    depts?:      string[] | null,
  ): Promise<SuratResult[] | PaginatedResult<SuratResult>> {
    await this.ensureCustomFieldColumns()
    const skip = pagination ? (pagination.page - 1) * pagination.limit : undefined
    const take = pagination?.limit

    const buildWhere = () => {
      const where: Record<string, unknown> = {
        dept: { is: { isActive: true } },
        detailSurat: { some: {} },
      }
      if (ids?.length)   where.id     = { in: ids }
      if (depts?.length) {
        where.OR = [
          { deptId: { in: depts } },
          { dept: { is: { shortName: { in: depts } } } },
        ]
      }
      if (date) {
        const start = new Date(date); start.setHours(0,  0,  0,   0)
        const end   = new Date(date); end.setHours(23, 59, 59, 999)
        where.tanggalTerima = { gte: start, lte: end }
      }
      return where
    }

    const suratWhere = buildWhere()

    const [rows, total] = await Promise.all([
      prisma.registerSurat.findMany({
        where:   suratWhere as Prisma.RegisterSuratWhereInput,
        include: { dept: { select: deptSelect }, detailSurat: true },
        orderBy: { tanggalTerima: "desc" },
        skip,
        take,
      }),
      pagination
        ? prisma.registerSurat.count({ where: suratWhere as Prisma.RegisterSuratWhereInput })
        : Promise.resolve(0),
    ])
    const detailIds = rows.flatMap((row) => row.detailSurat.map((detail) => detail.id))
    const customFields = await this.loadSuratCustomFields(detailIds)
    const departmentColumns = await this.loadDepartmentColumns(rows.map((row) => row.deptId))
    const data = rows.map((r) => serializeSurat(r as unknown as Record<string, unknown>, customFields, departmentColumns))
    if (!pagination) return data
    return {
      data,
      hasMore: (pagination.page - 1) * pagination.limit + data.length < total,
    }
  }

  async findByIdAndDept(id: number, dept: string): Promise<SuratResult | null> {
    await this.ensureCustomFieldColumns()
    const department = await prisma.department.findUnique({
      where: { id: dept },
      select: { shortName: true, isActive: true },
    })
    if (!department?.isActive) return null

    const row = await prisma.registerSurat.findFirst({
      where:   { id, deptId: dept, dept: { is: { isActive: true } } },
      include: { dept: { select: deptSelect }, detailSurat: true },
    })
    if (!row) return null
    const customFields = await this.loadSuratCustomFields(row.detailSurat.map((detail) => detail.id))
    const departmentColumns = await this.loadDepartmentColumns([row.deptId])
    return serializeSurat(row as unknown as Record<string, unknown>, customFields, departmentColumns)
  }

  async create(payload: CreateSuratPayload): Promise<SuratResult> {
    await this.ensureCustomFieldColumns()
    const { deptId, asalSurat, tanggalTerima, suratList } = payload

    const dept = await prisma.department.findUnique({
      where:  { id: deptId },
      select: { shortName: true, isActive: true },
    })
    if (!dept?.isActive) throw new AppError(404, "Departemen tidak ditemukan. Hubungi administrator untuk menambahkannya.")
    const tujuan = dept.shortName
    const departmentColumns = await this.loadDepartmentColumns([deptId])
    const currentDepartmentColumns = departmentColumns[deptId] ?? []

    const parsedTanggal = new Date(tanggalTerima)
    if (isNaN(parsedTanggal.getTime())) throw new AppError(400, "Format tanggal tidak valid")

    if (!suratList?.length) throw new AppError(400, "suratList kosong")
    return prisma.$transaction(async (tx) => {
      const nomor = await this._generateNomor(tx, deptId)
      const row = await tx.registerSurat.create({
        data: {
          nomor,
          dept:          { connect: { id: deptId } },
          asalSurat,
          tujuan:        tujuan ?? "",
          tanggalTerima: parsedTanggal,
          detailSurat: {
            create: suratList.map((s) => ({
              ...buildDynamicSuratDetail(s, currentDepartmentColumns, tujuan, parsedTanggal),
            })),
          },
        },
        include: { dept: { select: deptSelect }, detailSurat: true },
      })
      await this.saveSuratCustomFields(
        row.detailSurat.map((detail, index) => ({
          id: detail.id,
          customFields: suratList[index]?.customFields,
        })),
        tx
      )
      const customFields = await this.loadSuratCustomFields(row.detailSurat.map((detail) => detail.id), tx)
      return serializeSurat(row as unknown as Record<string, unknown>, customFields, departmentColumns)
    })
  }

  async update(id: number, dept: string, payload: UpdateSuratPayload): Promise<SuratResult> {
  await this.ensureCustomFieldColumns()
  const { deptId, asalSurat, tanggalTerima, suratList } = payload
  const nextDeptId = deptId ?? dept
  const currentDepartment = await prisma.department.findUnique({
    where: { id: dept },
    select: { shortName: true, isActive: true },
  })
  const department = await prisma.department.findUnique({
    where:  { id: nextDeptId },
    select: { shortName: true, isActive: true },
  })
  if (!currentDepartment?.isActive) throw new AppError(404, "Departemen tidak ditemukan. Hubungi administrator untuk menambahkannya.")
  if (!department?.isActive) throw new AppError(404, "Departemen tidak ditemukan. Hubungi administrator untuk menambahkannya.")
  const tujuan = department.shortName
  const departmentColumns = await this.loadDepartmentColumns([nextDeptId])
  const currentDepartmentColumns = departmentColumns[nextDeptId] ?? []

  return prisma.$transaction(async (tx) => {
    const currentRegister = await tx.registerSurat.findFirst({
      where: { id, deptId: dept, dept: { is: { isActive: true } } },
      select: { id: true },
    })

    if (!currentRegister) {
      throw new AppError(404, "Data tidak ditemukan")
    }

    // Generate nomor baru jika dept berubah
    const nomor = deptId && deptId !== dept
      ? await this._generateNomor(tx, deptId)
      : undefined

    const row = await tx.registerSurat.update({
      where: { id },
      data: {
        ...(deptId && { dept: { connect: { id: deptId } } }),
        ...(nomor  && { nomor }),
        asalSurat,
        tujuan,
        tanggalTerima: tanggalTerima ? new Date(tanggalTerima) : undefined,
        detailSurat: suratList ? {
          deleteMany: {},
          create: suratList.map((s) => ({
            ...buildDynamicSuratDetail(
              s,
              currentDepartmentColumns,
              tujuan,
              tanggalTerima ? new Date(tanggalTerima) : new Date()
            ),
          })),
        } : undefined,
      },
      include: { dept: { select: deptSelect }, detailSurat: true },
    })
    if (suratList) {
      await this.saveSuratCustomFields(
        row.detailSurat.map((detail, index) => ({
          id: detail.id,
          customFields: suratList[index]?.customFields,
        })),
        tx
      )
    }
    const customFields = await this.loadSuratCustomFields(row.detailSurat.map((detail) => detail.id), tx)
    return serializeSurat(row as unknown as Record<string, unknown>, customFields, departmentColumns)
  })
}

  async delete(id: number, dept: string): Promise<void> {
    const result = await prisma.registerSurat.deleteMany({
      where: { id, deptId: dept, dept: { is: { isActive: true } } },
    })

    if (result.count === 0) {
      throw new AppError(404, "Data tidak ditemukan")
    }
  }

  async getPreviewNomor(deptId: string): Promise<string> {
    const dept = await prisma.department.findUnique({
      where:  { id: deptId },
      select: { shortName: true, isActive: true },
    })
    if (!dept?.isActive) throw new Error(`NOT_FOUND: Departemen '${deptId}' tidak ditemukan`)

    const [last, counter] = await Promise.all([
      prisma.registerSurat.findFirst({
        where:   { deptId },
        orderBy: { nomor: "desc" },
        select:  { nomor: true },
      }),
      prisma.nomorCounter.findUnique({
        where: { deptId },
        select: { counter: true },
      }),
    ])

    const lastNumber = Math.max(
      last ? parseInt(last.nomor, 10) : 0,
      counter?.counter ?? 0
    )
    return String(lastNumber + 1).padStart(4, "0")
  }

  private async _generateNomor(
    tx:     Prisma.TransactionClient,
    deptId: string,
  ): Promise<string> {
    const registers = await tx.registerSurat.findMany({ where: { deptId }, select: { nomor: true } })

    const last = registers.reduce((max, r) => {
      const n = parseInt(r.nomor, 10)
      return isNaN(n) ? max : Math.max(max, n)
    }, 0)

    const rows = await tx.$queryRawUnsafe<Array<{ counter: number }>>(
      `
        INSERT INTO nomor_counter (dept_id, counter)
        VALUES ($1, $2)
        ON CONFLICT (dept_id) DO UPDATE
        SET counter = GREATEST(nomor_counter.counter + 1, EXCLUDED.counter)
        RETURNING counter
      `,
      deptId,
      last + 1
    )

    const next = rows[0]?.counter ?? last + 1
    return String(next).padStart(4, "0")
  }
}
