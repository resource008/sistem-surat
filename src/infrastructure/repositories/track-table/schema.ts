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
    DROP INDEX IF EXISTS track_sheets_name_key
  `

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS track_categories (
      id TEXT PRIMARY KEY,
      sheet_id TEXT NOT NULL REFERENCES track_sheets(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#2563eb',
      fill_by_hrd BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `

  await prisma.$executeRaw`
    ALTER TABLE track_categories
    ADD COLUMN IF NOT EXISTS fill_by_hrd BOOLEAN NOT NULL DEFAULT false
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
      fill_by_hrd BOOLEAN NOT NULL DEFAULT false,
      hidden_at TIMESTAMP(3),
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
    ALTER TABLE track_fields
    ADD COLUMN IF NOT EXISTS fill_by_hrd BOOLEAN NOT NULL DEFAULT false
  `

  await prisma.$executeRaw`
    ALTER TABLE track_fields
    ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMP(3)
  `

  await prisma.$executeRaw`
    UPDATE track_fields
    SET data_type = 'text'
    WHERE data_type = 'boolean'
  `

  await prisma.$executeRaw`
    DO $$
    DECLARE
      current_definition TEXT;
    BEGIN
      PERFORM pg_advisory_xact_lock(hashtext('track_fields_data_type_check'));

      SELECT pg_get_constraintdef(c.oid)
      INTO current_definition
      FROM pg_constraint c
      WHERE c.conrelid = 'track_fields'::regclass
        AND c.conname = 'track_fields_data_type_check';

      IF current_definition IS NOT NULL
        AND current_definition NOT LIKE '%category%'
      THEN
        ALTER TABLE track_fields DROP CONSTRAINT track_fields_data_type_check;
        current_definition := NULL;
      END IF;

      IF current_definition IS NULL THEN
        ALTER TABLE track_fields
        ADD CONSTRAINT track_fields_data_type_check
        CHECK (data_type IN ('text', 'date', 'number', 'category'));
      END IF;
    END $$;
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
