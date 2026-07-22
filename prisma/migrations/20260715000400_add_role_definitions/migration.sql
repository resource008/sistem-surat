CREATE TABLE IF NOT EXISTS "role_definitions" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "is_system" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "role_definitions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "role_definitions_value_key" ON "role_definitions"("value");

INSERT INTO "role_definitions" ("id", "name", "value", "is_system")
VALUES
  ('role_admin', 'Admin', 'ADMIN', true),
  ('role_staff', 'Staff', 'STAFF', false),
  ('role_pkl', 'PKL', 'PKL', false)
ON CONFLICT ("value") DO NOTHING;

UPDATE "role_definitions" SET "is_system" = true WHERE "value" = 'ADMIN';
UPDATE "role_definitions" SET "is_system" = false WHERE "value" <> 'ADMIN';

ALTER TABLE "users" ALTER COLUMN "role" TYPE TEXT USING "role"::TEXT;
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STAFF';

DROP TYPE IF EXISTS "Role";
