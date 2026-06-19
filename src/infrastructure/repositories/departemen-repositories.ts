// src/infrastructure/repositories/departemen-repository.ts

import { prisma } from "@/infrastructure/databases/prisma-client"
import type { Prisma } from "@/generated/prisma"
import { AppError } from "@/lib/errors"
import { createRandomId } from "@/lib/random-id"
import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"
import type { Departemen, DepartemenColumn, DepartemenColumnType } from "@/types"

type DepartmentRow = {
  id: string
  shortName: string
  fullName: string
  tujuan: string
  printColumnName: string
}

type DepartmentColumnRow = {
  id: string
  departmentId: string
  label: string
  type: DepartemenColumnType
  defaultValue: string
  isDefault: boolean
  isRequired: boolean
  showInDataSurat: boolean
  showInPrint: boolean
  sortOrder: number
}

type DbClient = Prisma.TransactionClient | typeof prisma

const DEFAULT_COLUMNS: DepartemenColumn[] = [
  { id: "default_nomor_register", label: "Nomor Register", type: "text", defaultValue: "N/A", isDefault: true, isRequired: true, showInDataSurat: true, showInPrint: true, sortOrder: 0 },
  { id: "default_tanggal_terima", label: "Tanggal Terima", type: "date", defaultValue: "N/A", isDefault: true, isRequired: true, showInDataSurat: false, showInPrint: true, sortOrder: 1 },
  { id: "default_asal_surat", label: "Asal Surat", type: "text", defaultValue: "N/A", isDefault: true, isRequired: true, showInDataSurat: true, showInPrint: true, sortOrder: 2 },
  { id: "default_tujuan", label: "Tujuan", type: "text", defaultValue: "N/A", isDefault: true, isRequired: true, showInDataSurat: true, showInPrint: true, sortOrder: 3 },
]

const DATA_TYPES = new Set<DepartemenColumnType>(["text", "date", "number"])
const TUJUAN_DEFAULT_ID = "default_tujuan"

export class DepartemenRepository {
  private getSimpleDepartmentNumber(id: string) {
    const match = id.match(/^(?:dept_)?(\d+)$/)
    if (!match) return null

    const value = Number(match[1])
    return Number.isSafeInteger(value) ? value : null
  }

  private formatDepartmentId(value: number) {
    return value.toString()
  }

  private async createDepartmentId(db: DbClient = prisma) {
    const rows = await db.$queryRawUnsafe<Array<{ id: string }>>(`
      SELECT id
      FROM departments
    `)
    const usedIds = new Set(rows.map((row) => row.id))
    const maxNumericId = rows.reduce((max, row) => {
      const value = this.getSimpleDepartmentNumber(row.id)
      return value === null ? max : Math.max(max, value)
    }, 0)

    for (let offset = 1; offset <= 10000; offset += 1) {
      const id = this.formatDepartmentId(maxNumericId + offset)
      if (!usedIds.has(id) && !usedIds.has(`dept_${id}`)) return id
    }

    throw new AppError(500, "Gagal membuat ID departemen")
  }

  private createColumnId() {
    return `dept_col_${createRandomId().replace(/-/g, "").slice(0, 24)}`
  }

  private isUniqueConflict(error: unknown) {
    const knownError = error as { code?: string; meta?: { code?: string }; message?: string }
    return knownError.code === "P2002" ||
      knownError.meta?.code === "23505" ||
      knownError.message?.toLowerCase().includes("duplicate key")
  }

  private async insertDepartment(
    db: DbClient,
    departmentId: string,
    nameColumn: string,
    input: CreateDepartemenInput,
    printColumnName: string
  ) {
    await db.$executeRawUnsafe(
      `
        INSERT INTO departments (id, short_name, ${nameColumn}, print_column_name, is_active)
        VALUES ($1, $2, $3, $4, true)
      `,
      departmentId,
      input.shortName,
      input.tujuan,
      printColumnName
    )

    return departmentId
  }

  private async getNameColumn() {
    const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'departments'
        AND column_name IN ('fullName', 'full_name', 'tujuan')
    `

    if (columns.some((column) => column.column_name === "fullName")) return `"fullName"`
    if (columns.some((column) => column.column_name === "full_name")) return "full_name"
    return "tujuan"
  }

  private async ensureDepartmentMetaColumns() {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE departments
      ADD COLUMN IF NOT EXISTS print_column_name TEXT NOT NULL DEFAULT ''
    `)
  }

  private async ensureColumnTable() {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS department_columns (
        id TEXT PRIMARY KEY,
        department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
        label TEXT NOT NULL,
        data_type TEXT NOT NULL CHECK (data_type IN ('text', 'date', 'number')),
        default_value TEXT NOT NULL DEFAULT '',
        is_default BOOLEAN NOT NULL DEFAULT false,
        is_required BOOLEAN NOT NULL DEFAULT false,
        show_in_data_surat BOOLEAN NOT NULL DEFAULT false,
        show_in_print BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE department_columns
      ADD COLUMN IF NOT EXISTS is_required BOOLEAN NOT NULL DEFAULT false
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE department_columns
      ADD COLUMN IF NOT EXISTS show_in_print BOOLEAN NOT NULL DEFAULT true
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE department_columns
      ADD COLUMN IF NOT EXISTS default_value TEXT NOT NULL DEFAULT ''
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS department_columns_department_id_idx
      ON department_columns(department_id)
    `)
  }

  private normalizeType(type?: string): DepartemenColumnType {
    return DATA_TYPES.has(type as DepartemenColumnType)
      ? type as DepartemenColumnType
      : "text"
  }

  private normalizeInputColumns(input: CreateDepartemenInput | UpdateDepartemenInput): DepartemenColumn[] {
    const custom = (input.columns ?? [])
      .filter((column) => !column.isDefault)
      .map((column, index) => ({
        id: column.id || this.createColumnId(),
        label: column.label.trim(),
        type: this.normalizeType(column.type),
        defaultValue: (column.defaultValue ?? "").trim(),
        isDefault: false,
        isRequired: !!column.isRequired && column.label.trim().length > 0,
        showInDataSurat: !!column.showInDataSurat,
        showInPrint: column.showInPrint !== false,
        sortOrder: index + DEFAULT_COLUMNS.length,
      }))
      .filter((column) => column.label.length > 0)

    const defaultBeforeTujuan = DEFAULT_COLUMNS.filter((column) => column.id !== TUJUAN_DEFAULT_ID)
    const tujuanColumn = DEFAULT_COLUMNS.find((column) => column.id === TUJUAN_DEFAULT_ID)

    return [
      ...defaultBeforeTujuan.map((column, index) => ({ ...column, sortOrder: index })),
      ...custom.map((column, index) => ({ ...column, sortOrder: defaultBeforeTujuan.length + index })),
      ...(tujuanColumn ? [{ ...tujuanColumn, sortOrder: defaultBeforeTujuan.length + custom.length }] : []),
    ]
  }

  private normalizePrintColumns(columns: DepartemenColumn[]) {
    return columns
      .filter((column) => column.showInPrint !== false)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  private getColumnSignaturePart(column: DepartemenColumn) {
    const defaultColumn = this.getDefaultColumnTemplate(column)
    if (defaultColumn) return `default:${defaultColumn.id}`

    return [
      "custom",
      column.label.trim().toLowerCase(),
      column.type,
      column.isRequired ? "required" : "optional",
    ].join(":")
  }

  private getPrintStructureSignature(columns: DepartemenColumn[]) {
    return this.normalizePrintColumns(columns).map((column) => this.getColumnSignaturePart(column)).join("|")
  }

  private mapColumn(row: DepartmentColumnRow): DepartemenColumn {
    return {
      id: row.id,
      label: row.label,
      type: row.type,
      defaultValue: row.defaultValue,
      isDefault: row.isDefault,
      isRequired: row.isRequired,
      showInDataSurat: row.showInDataSurat,
      showInPrint: row.showInPrint,
      sortOrder: row.sortOrder,
    }
  }

  private getDefaultColumnTemplate(column: DepartemenColumn) {
    if (!column.isDefault) return null
    return DEFAULT_COLUMNS.find((defaultColumn) => column.id.includes(defaultColumn.id)) ?? null
  }

  private normalizeStoredColumns(departmentId: string, columns: DepartemenColumn[]) {
    const normalized = columns.map((column) => {
      const defaultColumn = this.getDefaultColumnTemplate(column)
      return defaultColumn
        ? {
            ...defaultColumn,
            id: column.id,
          }
        : { ...column }
    })

    DEFAULT_COLUMNS.forEach((defaultColumn) => {
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

    const defaults = DEFAULT_COLUMNS
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

  private async getColumnsForDepartments(departmentIds: string[]) {
    await this.ensureColumnTable()
    const result = new Map<string, DepartemenColumn[]>()
    departmentIds.forEach((id) => result.set(id, DEFAULT_COLUMNS.map((column) => ({ ...column }))))

    if (departmentIds.length === 0) return result

    const rows = await prisma.$queryRawUnsafe<DepartmentColumnRow[]>(
      `
        SELECT
          id,
          department_id AS "departmentId",
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
      departmentIds
    )

    const grouped = new Map<string, DepartemenColumn[]>()
    rows.forEach((row) => {
      const columns = grouped.get(row.departmentId) ?? []
      columns.push(this.mapColumn(row))
      grouped.set(row.departmentId, columns)
    })

    grouped.forEach((columns, departmentId) => {
      result.set(departmentId, this.normalizeStoredColumns(departmentId, columns))
    })

    return result
  }

  private async attachColumns(rows: DepartmentRow[]): Promise<Departemen[]> {
    const columnMap = await this.getColumnsForDepartments(rows.map((row) => row.id))
    return rows.map((row) => {
      const columns = columnMap.get(row.id) ?? DEFAULT_COLUMNS.map((column) => ({ ...column }))
      const normalizedColumns = this.normalizeStoredColumns(row.id, columns)
      return {
        ...row,
        columns: normalizedColumns,
        displayColumns: normalizedColumns.filter((column) => column.showInDataSurat),
      }
    })
  }

  private async copyColumnsFromDepartment(sourceDepartmentId: string): Promise<DepartemenColumn[]> {
    const columnMap = await this.getColumnsForDepartments([sourceDepartmentId])
    const sourceColumns = columnMap.get(sourceDepartmentId) ?? DEFAULT_COLUMNS
    return sourceColumns.map((column, index) => ({
      ...column,
      id: column.isDefault ? column.id : this.createColumnId(),
      sortOrder: index,
    }))
  }

  private async resolveInputColumns(input: CreateDepartemenInput | UpdateDepartemenInput) {
    return input.columnMode === "existing" && input.sourceDepartmentId
      ? await this.copyColumnsFromDepartment(input.sourceDepartmentId)
      : this.normalizeInputColumns(input)
  }

  private async ensureUniquePrintStructure(
    printColumnName: string,
    columns: DepartemenColumn[],
    currentDepartmentId?: string
  ) {
    const normalizedPrintName = printColumnName.trim().toLowerCase()
    if (!normalizedPrintName) return

    await this.ensureDepartmentMetaColumns()
    const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `
        SELECT id
        FROM departments
        WHERE is_active = true
          AND lower(trim(print_column_name)) = $1
          ${currentDepartmentId ? "AND id <> $2" : ""}
      `,
      ...(currentDepartmentId ? [normalizedPrintName, currentDepartmentId] : [normalizedPrintName])
    )

    if (rows.length === 0) return

    const columnMap = await this.getColumnsForDepartments(rows.map((row) => row.id))
    const nextSignature = this.getPrintStructureSignature(columns)
    const conflict = rows.find((row) => {
      const existingColumns = columnMap.get(row.id) ?? DEFAULT_COLUMNS
      return this.getPrintStructureSignature(existingColumns) !== nextSignature
    })

    if (conflict) {
      throw new AppError(
        409,
        "Identifikasi cetak sudah digunakan oleh struktur kolom yang berbeda. Buat identifikasi cetak baru untuk struktur kolom ini."
      )
    }
  }

  private async saveColumns(
    db: DbClient,
    departmentId: string,
    input: CreateDepartemenInput | UpdateDepartemenInput,
    resolvedColumns?: DepartemenColumn[]
  ) {
    const columns = resolvedColumns ?? await this.resolveInputColumns(input)

    await db.$executeRaw`
      DELETE FROM department_columns
      WHERE department_id = ${departmentId}
    `

    for (const [index, column] of columns.entries()) {
      const defaultColumn = this.getDefaultColumnTemplate(column)

      await db.$executeRaw`
        INSERT INTO department_columns (
          id,
          department_id,
          label,
          data_type,
          default_value,
          is_default,
          is_required,
          show_in_data_surat,
          show_in_print,
          sort_order
        )
        VALUES (
          ${defaultColumn ? `${departmentId}_${defaultColumn.id}` : this.createColumnId()},
          ${departmentId},
          ${column.label},
          ${column.type},
          ${column.defaultValue},
          ${column.isDefault},
          ${column.isRequired},
          ${column.showInDataSurat},
          ${column.showInPrint},
          ${index}
        )
      `
    }
  }

  private resolvePrintColumnName(input: CreateDepartemenInput | UpdateDepartemenInput) {
    const printColumnName = input.printColumnName.trim()
    if (!printColumnName) throw new AppError(400, "Identifikasi cetak wajib diisi")
    return printColumnName
  }

  async findAllActive() {
    await this.ensureDepartmentMetaColumns()
    const nameColumn = await this.getNameColumn()

    const rows = await prisma.$queryRawUnsafe<DepartmentRow[]>(`
      SELECT
        id,
        short_name AS "shortName",
        ${nameColumn} AS "fullName",
        ${nameColumn} AS tujuan,
        print_column_name AS "printColumnName"
      FROM departments
      WHERE is_active = true
      ORDER BY short_name ASC
    `)

    return this.attachColumns(rows)
  }

  async findById(id: string) {
    await this.ensureDepartmentMetaColumns()
    const nameColumn = await this.getNameColumn()
    const rows = await prisma.$queryRawUnsafe<DepartmentRow[]>(
      `
        SELECT
          id,
          short_name AS "shortName",
          ${nameColumn} AS "fullName",
          ${nameColumn} AS tujuan,
          print_column_name AS "printColumnName"
        FROM departments
        WHERE id = $1
          AND is_active = true
        LIMIT 1
      `,
      id
    )

    const departemen = rows[0]
    if (!departemen) throw new AppError(404, "Departemen tidak ditemukan")
    return (await this.attachColumns([departemen]))[0]
  }

  async create(input: CreateDepartemenInput) {
    await this.ensureDepartmentMetaColumns()
    await this.ensureColumnTable()
    const nameColumn = await this.getNameColumn()
    const printColumnName = this.resolvePrintColumnName(input)
    const columns = await this.resolveInputColumns(input)
    const existingRows = await prisma.$queryRawUnsafe<Array<{ id: string; isActive: boolean }>>(
      `
        SELECT id, is_active AS "isActive"
        FROM departments
        WHERE short_name = $1
        ORDER BY is_active DESC, id ASC
      `,
      input.shortName
    )
    const activeExisting = existingRows.find((row) => row.isActive)
    const reusableExisting = existingRows.find((row) =>
      !row.isActive && this.getSimpleDepartmentNumber(row.id) !== null
    )
    const staleRandomExisting = existingRows.filter((row) =>
      !row.isActive && this.getSimpleDepartmentNumber(row.id) === null
    )

    if (activeExisting) {
      throw new AppError(409, "Singkatan departemen sudah digunakan")
    }

    await this.ensureUniquePrintStructure(printColumnName, columns, reusableExisting?.id)

    if (reusableExisting) {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(
          `
            UPDATE departments
            SET
              short_name = $2,
              ${nameColumn} = $3,
              print_column_name = $4,
              is_active = true
            WHERE id = $1
          `,
          reusableExisting.id,
          input.shortName,
          input.tujuan,
          printColumnName
        )
        await this.saveColumns(tx, reusableExisting.id, input, columns)
      })
      return this.findById(reusableExisting.id)
    }

    let departmentId = ""
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        departmentId = await prisma.$transaction(async (tx) => {
          for (const stale of staleRandomExisting) {
            await tx.$executeRawUnsafe(
              `
                UPDATE departments
                SET short_name = $2
                WHERE id = $1
                  AND is_active = false
              `,
              stale.id,
              `${input.shortName}_INACTIVE_${createRandomId().replace(/-/g, "").slice(0, 8)}`
            )
          }

          const nextDepartmentId = await this.createDepartmentId(tx)
          await this.insertDepartment(tx, nextDepartmentId, nameColumn, input, printColumnName)
          await this.saveColumns(tx, nextDepartmentId, input, columns)
          return nextDepartmentId
        })
        break
      } catch (error) {
        if (this.isUniqueConflict(error)) continue
        throw error
      }
    }

    if (!departmentId) throw new AppError(500, "Gagal membuat ID departemen")
    return this.findById(departmentId)
  }

  async update(id: string, input: UpdateDepartemenInput) {
    await this.ensureDepartmentMetaColumns()
    await this.ensureColumnTable()
    const nameColumn = await this.getNameColumn()
    const printColumnName = this.resolvePrintColumnName(input)
    const columns = await this.resolveInputColumns(input)
    const currentRows = await prisma.$queryRawUnsafe<Array<{ id: string; shortName: string }>>(
      `
        SELECT id, short_name AS "shortName"
        FROM departments
        WHERE id = $1
          AND is_active = true
        LIMIT 1
      `,
      id
    )
    const current = currentRows[0]

    if (!current) throw new AppError(404, "Departemen tidak ditemukan")

    if (input.shortName !== current.shortName) {
      const duplicateRows = await prisma.$queryRawUnsafe<Array<{ id: string; isActive: boolean }>>(
        `
          SELECT id, is_active AS "isActive"
          FROM departments
          WHERE short_name = $1
            AND id <> $2
          LIMIT 1
        `,
        input.shortName,
        id
      )
      const duplicate = duplicateRows[0]
      if (duplicate?.isActive) {
        throw new AppError(409, "Singkatan departemen sudah digunakan")
      }
      if (duplicate && !duplicate.isActive) {
        throw new AppError(409, "Singkatan departemen pernah digunakan oleh data yang sudah dihapus")
      }
    }

    await this.ensureUniquePrintStructure(printColumnName, columns, id)

    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `
          UPDATE departments
          SET
            short_name = $2,
            ${nameColumn} = $3,
            print_column_name = $4
          WHERE id = $1
        `,
        id,
        input.shortName,
        input.tujuan,
        printColumnName
      )
      await this.saveColumns(tx, id, input, columns)
    })
    return this.findById(id)
  }

  async delete(id: string) {
    const currentRows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `
        SELECT id
        FROM departments
        WHERE id = $1
          AND is_active = true
        LIMIT 1
      `,
      id
    )
    const current = currentRows[0]

    if (!current) throw new AppError(404, "Departemen tidak ditemukan")

    await prisma.$executeRaw`
      UPDATE departments
      SET is_active = false
      WHERE id = ${id}
    `
  }
}
