import { prisma } from "@/infrastructure/databases/prisma-client"

export async function ensureTrackTableSchema() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS track_sheets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      hidden_at TIMESTAMP(3),
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `

  await prisma.$executeRaw`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'track_sheets'
          AND column_name = 'deleted_at'
      ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'track_sheets'
          AND column_name = 'hidden_at'
      ) THEN
        ALTER TABLE track_sheets RENAME COLUMN deleted_at TO hidden_at;
      END IF;
    END $$;
  `

  await prisma.$executeRaw`
    ALTER TABLE track_sheets
    ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMP(3)
  `

  await prisma.$executeRaw`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = current_schema()
          AND indexname = 'track_sheets_name_key'
          AND indexdef NOT ILIKE '%hidden_at IS NULL%'
      ) THEN
        DROP INDEX track_sheets_name_key;
      END IF;
    END $$;
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX IF NOT EXISTS track_sheets_name_key
    ON track_sheets(LOWER(name))
    WHERE hidden_at IS NULL
  `

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS track_categories (
      id TEXT PRIMARY KEY,
      sheet_id TEXT NOT NULL REFERENCES track_sheets(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#2563eb',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS track_categories_sheet_id_idx
    ON track_categories(sheet_id)
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX IF NOT EXISTS track_categories_sheet_name_key
    ON track_categories(sheet_id, LOWER(name))
  `

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS track_fields (
      id TEXT PRIMARY KEY,
      sheet_id TEXT NOT NULL REFERENCES track_sheets(id) ON DELETE CASCADE,
      category_id TEXT,
      category TEXT NOT NULL,
      category_color TEXT NOT NULL DEFAULT '#2563eb',
      region TEXT NOT NULL,
      column_name TEXT NOT NULL,
      data_type TEXT NOT NULL CHECK (data_type IN ('text', 'date', 'number', 'category')),
      default_value TEXT NOT NULL DEFAULT '',
      category_options TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `

  await prisma.$executeRaw`
    ALTER TABLE track_fields
    ADD COLUMN IF NOT EXISTS category_color TEXT NOT NULL DEFAULT '#2563eb'
  `

  await prisma.$executeRaw`
    ALTER TABLE track_fields
    ADD COLUMN IF NOT EXISTS category_id TEXT
  `

  await prisma.$executeRaw`
    ALTER TABLE track_fields
    ADD COLUMN IF NOT EXISTS default_value TEXT NOT NULL DEFAULT ''
  `

  await prisma.$executeRaw`
    ALTER TABLE track_fields
    ADD COLUMN IF NOT EXISTS category_options TEXT NOT NULL DEFAULT '[]'
  `

  await prisma.$executeRaw`
    UPDATE track_fields
    SET data_type = 'text'
    WHERE data_type = 'boolean'
  `

  await prisma.$executeRaw`
    ALTER TABLE track_fields
    DROP CONSTRAINT IF EXISTS track_fields_data_type_check
  `

  await prisma.$executeRaw`
    ALTER TABLE track_fields
    ADD CONSTRAINT track_fields_data_type_check
    CHECK (data_type IN ('text', 'date', 'number', 'category'))
  `

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS track_fields_sheet_id_idx
    ON track_fields(sheet_id)
  `

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX IF NOT EXISTS track_fields_sheet_column_key
    ON track_fields(sheet_id, LOWER(column_name))
  `
}
