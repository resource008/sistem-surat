-- Drop legacy PI tables. Applying this migration removes old PI data.
DROP TABLE IF EXISTS "detail_pi";
DROP TABLE IF EXISTS "register_pi";
