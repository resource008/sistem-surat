import { prisma } from "@/infrastructure/databases/prisma-client"

export async function getDepartmentNameColumn() {
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

export async function ensureDepartmentMetaColumns() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE departments
    ADD COLUMN IF NOT EXISTS print_column_name TEXT NOT NULL DEFAULT ''
  `)
}

export async function ensureDepartmentColumnTable() {
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
      display_order INTEGER NOT NULL DEFAULT 0,
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
    ALTER TABLE department_columns
    ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0
  `)
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS department_columns_department_id_idx
    ON department_columns(department_id)
  `)
}
