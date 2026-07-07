CREATE SCHEMA IF NOT EXISTS "public";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'PKL');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "username" TEXT,
  "image" TEXT,
  "role" "Role" NOT NULL DEFAULT 'STAFF',
  "last_login_at" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "token" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "sessions_token_key" ON "sessions"("token");

CREATE TABLE IF NOT EXISTS "accounts" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP(3),
  "refreshTokenExpiresAt" TIMESTAMP(3),
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_permissions" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "can_create" BOOLEAN NOT NULL DEFAULT false,
  "can_edit" BOOLEAN NOT NULL DEFAULT false,
  "can_delete" BOOLEAN NOT NULL DEFAULT false,
  "can_print" BOOLEAN NOT NULL DEFAULT false,
  "can_track" BOOLEAN NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_permissions_userId_key" ON "user_permissions"("userId");

CREATE TABLE IF NOT EXISTS "departments" (
  "id" TEXT PRIMARY KEY,
  "short_name" TEXT NOT NULL,
  "tujuan" TEXT NOT NULL DEFAULT '',
  "print_column_name" TEXT NOT NULL DEFAULT '',
  "is_active" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS "department_columns" (
  "id" TEXT PRIMARY KEY,
  "department_id" TEXT NOT NULL REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "label" TEXT NOT NULL,
  "data_type" TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS "register_surat" (
  "id" SERIAL PRIMARY KEY,
  "nomor" TEXT NOT NULL,
  "dept_id" TEXT NOT NULL REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "tanggal_terima" TIMESTAMP(3) NOT NULL,
  "asal_surat" TEXT NOT NULL,
  "tujuan" TEXT NOT NULL DEFAULT '',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "detail_surat" (
  "id" SERIAL PRIMARY KEY,
  "register_id" INTEGER NOT NULL REFERENCES "register_surat"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "perihal" TEXT NOT NULL,
  "no_surat" TEXT,
  "lampiran" TEXT,
  "tanggal_surat" TIMESTAMP(3) NOT NULL,
  "tujuan" TEXT,
  "custom_fields" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "nomor_counter" (
  "dept_id" TEXT PRIMARY KEY REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "counter" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "track_sheets" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "hidden_at" TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS "track_categories" (
  "id" TEXT PRIMARY KEY,
  "sheet_id" TEXT NOT NULL REFERENCES "track_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "name" TEXT NOT NULL,
  "color" TEXT NOT NULL DEFAULT '#2563eb',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "track_categories_sheet_id_idx"
  ON "track_categories"("sheet_id");

CREATE TABLE IF NOT EXISTS "track_fields" (
  "id" TEXT PRIMARY KEY,
  "sheet_id" TEXT NOT NULL REFERENCES "track_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "category_id" TEXT,
  "category" TEXT NOT NULL,
  "category_color" TEXT NOT NULL DEFAULT '#2563eb',
  "region" TEXT NOT NULL,
  "column_name" TEXT NOT NULL,
  "data_type" TEXT NOT NULL,
  "default_value" TEXT NOT NULL DEFAULT '',
  "category_options" TEXT NOT NULL DEFAULT '[]',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "track_fields_sheet_id_idx"
  ON "track_fields"("sheet_id");

-- Legacy PI tables are kept only so older follow-up migrations can run on a fresh database.
-- They are dropped by 20260618000100_remove_register_pi.
CREATE TABLE IF NOT EXISTS "register_pi" (
  "id" SERIAL PRIMARY KEY,
  "custom_details" JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS "detail_pi" (
  "id" SERIAL PRIMARY KEY,
  "custom_fields" JSONB NOT NULL DEFAULT '{}'::jsonb
);
