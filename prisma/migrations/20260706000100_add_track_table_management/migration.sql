CREATE TABLE IF NOT EXISTS "track_sheets" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "hidden_at" TIMESTAMP(3)
);

CREATE UNIQUE INDEX IF NOT EXISTS "track_sheets_name_key"
  ON "track_sheets"(LOWER("name"))
  WHERE "hidden_at" IS NULL;

CREATE TABLE IF NOT EXISTS "track_categories" (
  "id" TEXT PRIMARY KEY,
  "sheet_id" TEXT NOT NULL REFERENCES "track_sheets"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "color" TEXT NOT NULL DEFAULT '#2563eb',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "track_categories_sheet_id_idx"
  ON "track_categories"("sheet_id");

CREATE UNIQUE INDEX IF NOT EXISTS "track_categories_sheet_name_key"
  ON "track_categories"("sheet_id", LOWER("name"));

CREATE TABLE IF NOT EXISTS "track_fields" (
  "id" TEXT PRIMARY KEY,
  "sheet_id" TEXT NOT NULL REFERENCES "track_sheets"("id") ON DELETE CASCADE,
  "category_id" TEXT,
  "category" TEXT NOT NULL,
  "category_color" TEXT NOT NULL DEFAULT '#2563eb',
  "region" TEXT NOT NULL,
  "column_name" TEXT NOT NULL,
  "data_type" TEXT NOT NULL CHECK ("data_type" IN ('text', 'date', 'number', 'category')),
  "default_value" TEXT NOT NULL DEFAULT '',
  "category_options" TEXT NOT NULL DEFAULT '[]',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "track_fields_sheet_id_idx"
  ON "track_fields"("sheet_id");

CREATE UNIQUE INDEX IF NOT EXISTS "track_fields_sheet_column_key"
  ON "track_fields"("sheet_id", LOWER("column_name"));
