CREATE TABLE IF NOT EXISTS "department_columns" (
  "id" TEXT PRIMARY KEY,
  "department_id" TEXT NOT NULL REFERENCES "departments"("id") ON DELETE CASCADE,
  "label" TEXT NOT NULL,
  "data_type" TEXT NOT NULL CHECK ("data_type" IN ('text', 'date', 'number')),
  "default_value" TEXT NOT NULL DEFAULT '',
  "is_default" BOOLEAN NOT NULL DEFAULT false,
  "is_required" BOOLEAN NOT NULL DEFAULT false,
  "show_in_data_surat" BOOLEAN NOT NULL DEFAULT false,
  "show_in_print" BOOLEAN NOT NULL DEFAULT true,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "department_columns_department_id_idx"
  ON "department_columns"("department_id");

ALTER TABLE "department_columns"
  ADD COLUMN IF NOT EXISTS "show_in_print" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "department_columns"
  ADD COLUMN IF NOT EXISTS "default_value" TEXT NOT NULL DEFAULT '';

ALTER TABLE "departments"
  ADD COLUMN IF NOT EXISTS "print_column_name" TEXT NOT NULL DEFAULT '';

ALTER TABLE "detail_surat"
  ADD COLUMN IF NOT EXISTS "custom_fields" JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE "detail_pi"
  ADD COLUMN IF NOT EXISTS "custom_fields" JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE "register_pi"
  ADD COLUMN IF NOT EXISTS "custom_details" JSONB NOT NULL DEFAULT '[]'::jsonb;
