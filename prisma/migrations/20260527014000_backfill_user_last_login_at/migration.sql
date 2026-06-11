UPDATE "users" AS u
SET "last_login_at" = latest_session."last_seen_at"
FROM (
  SELECT
    "userId",
    MAX(COALESCE("updatedAt", "createdAt")) AS "last_seen_at"
  FROM "sessions"
  GROUP BY "userId"
) AS latest_session
WHERE u."id" = latest_session."userId"
  AND u."last_login_at" IS NULL;
