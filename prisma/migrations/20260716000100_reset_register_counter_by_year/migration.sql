ALTER TABLE "nomor_counter"
ADD COLUMN IF NOT EXISTS "year" INTEGER;

UPDATE "nomor_counter" counter
SET "year" = COALESCE(
  (
    SELECT EXTRACT(YEAR FROM MAX(register."tanggal_terima"))::INTEGER
    FROM "register_surat" register
    WHERE register."dept_id" = counter."dept_id"
  ),
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
)
WHERE counter."year" IS NULL;

ALTER TABLE "nomor_counter"
ALTER COLUMN "year" SET NOT NULL;

ALTER TABLE "nomor_counter"
DROP CONSTRAINT IF EXISTS "nomor_counter_pkey";

ALTER TABLE "nomor_counter"
ADD CONSTRAINT "nomor_counter_pkey" PRIMARY KEY ("dept_id", "year");
