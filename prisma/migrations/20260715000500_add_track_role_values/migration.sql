ALTER TABLE "track_categories"
  ADD COLUMN IF NOT EXISTS "add_role_values" TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "edit_role_values" TEXT NOT NULL DEFAULT '[]';

ALTER TABLE "track_fields"
  ADD COLUMN IF NOT EXISTS "add_role_values" TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "edit_role_values" TEXT NOT NULL DEFAULT '[]';
