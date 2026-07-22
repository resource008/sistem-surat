ALTER TABLE "user_permissions"
  ADD COLUMN IF NOT EXISTS "can_view_data_surat" BOOLEAN NOT NULL DEFAULT false;

UPDATE "user_permissions"
SET "can_view_data_surat" = true
WHERE "can_create" = true
   OR "can_edit" = true
   OR "can_delete" = true
   OR "can_print" = true;
