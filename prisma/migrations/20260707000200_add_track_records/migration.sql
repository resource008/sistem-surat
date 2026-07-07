CREATE TABLE IF NOT EXISTS "track_records" (
  "id" TEXT PRIMARY KEY,
  "sheet_id" TEXT NOT NULL REFERENCES "track_sheets"("id") ON DELETE CASCADE,
  "values" JSONB NOT NULL DEFAULT '{}',
  "created_by_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "track_records_sheet_id_idx"
ON "track_records"("sheet_id");
