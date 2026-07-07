# Sistem Surat

Sistem Surat adalah aplikasi web untuk mengelola surat masuk, data departemen, akun pengguna, hak akses, pencetakan data surat, dan tabel lacak. Aplikasi ini dibuat untuk membantu proses administrasi surat agar data lebih rapi, mudah dicari, dan bisa dikelola berdasarkan role pengguna.

## Fitur Utama

- Login berbasis username dan password menggunakan Better Auth.
- Dashboard admin untuk melihat ringkasan aktivitas dan statistik surat.
- Manajemen akun pengguna dengan role `ADMIN`, `STAFF`, dan `PKL`.
- Pengaturan hak akses pengguna untuk tambah, ubah, hapus, cetak, dan lacak data.
- Manajemen departemen beserta konfigurasi kolom surat.
- Input, edit, hapus, dan pencarian data surat.
- Preview nomor registrasi surat otomatis per departemen.
- Halaman cetak data surat berdasarkan lembar atau kebutuhan departemen.
- Manajemen tabel lacak untuk membuat sheet, kategori, dan kolom pelacakan.
- Siap dijalankan dengan Docker Compose bersama database PostgreSQL.

## Role Pengguna

| Role | Keterangan |
| --- | --- |
| `ADMIN` | Mengelola seluruh data, akun, departemen, tabel lacak, dan dashboard. |
| `STAFF` | Mengelola data surat sesuai permission yang diberikan admin. |
| `PKL` | Mengakses fitur operasional surat sesuai permission yang diberikan admin. |

Permission tambahan untuk `STAFF` dan `PKL`:

| Permission | Fungsi |
| --- | --- |
| `canCreate` | Mengizinkan tambah data surat. |
| `canEdit` | Mengizinkan edit data surat. |
| `canDelete` | Mengizinkan hapus data surat. |
| `canPrint` | Mengizinkan akses halaman cetak. |
| `canTrack` | Mengizinkan akses fitur lacak. |

## Teknologi

- Next.js 16
- React 19
- TypeScript
- Prisma 7
- PostgreSQL
- Better Auth
- Tailwind CSS
- Docker Compose

## Kebutuhan Sistem

Untuk menjalankan tanpa Docker:

- Node.js 22 atau lebih baru
- PostgreSQL
- npm

Untuk menjalankan dengan container:

- Docker
- Docker Compose

## Environment

Salin file contoh environment:

```bash
cp .env.example .env
```

Contoh konfigurasi lokal:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=sistem_surat
DB_HOST_PORT=5432

APP_PORT=3001
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

DATABASE_URL=postgresql://postgres:password@localhost:5432/sistem_surat

BETTER_AUTH_SECRET=secret-yang-panjang-dan-acak
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_TRUSTED_ORIGINS=
```

Catatan:

- Jika command Prisma dijalankan dari komputer host, gunakan host database `localhost`.
- Jika aplikasi berjalan di dalam Docker Compose, service aplikasi otomatis memakai host database internal `db`.
- Untuk VPS, isi `BETTER_AUTH_URL` dengan IP atau domain server.

## Menjalankan Secara Lokal

Install dependency:

```bash
npm install
```

Generate Prisma Client:

```bash
npm run build
```

Jalankan aplikasi mode development:

```bash
npm run dev
```

Aplikasi berjalan di:

```txt
http://localhost:3001
```

## Menjalankan dengan Docker

Build dan jalankan aplikasi beserta database:

```bash
docker compose up -d --build
```

Saat container `app` start, migration Prisma otomatis dijalankan dengan:

```bash
prisma migrate deploy
```

Jalankan seed untuk membuat data awal:

```bash
docker compose run --rm seed
```

Akun awal dari seed:

```txt
username: admin
password: admin123
```

Lihat log aplikasi:

```bash
docker compose logs -f app
```

Restart aplikasi:

```bash
docker compose restart app
```

Matikan container:

```bash
docker compose down
```

Hapus database container dan mulai ulang dari kosong:

```bash
docker compose down -v
docker compose up -d --build
docker compose run --rm seed
```

## Deploy ke VPS

Langkah umum deploy:

1. Upload atau clone project ke VPS.
2. Buat file `.env` dari `.env.example`.
3. Isi password database, secret auth, dan URL aplikasi.
4. Jalankan `docker compose up -d --build`.
5. Jalankan `docker compose run --rm seed` untuk data awal.
6. Buka aplikasi dari browser menggunakan IP atau domain VPS.

Contoh `.env` untuk VPS:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password-yang-kuat
POSTGRES_DB=sistem_surat
DB_HOST_PORT=5432

APP_PORT=3001
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

DATABASE_URL=postgresql://postgres:password-yang-kuat@localhost:5432/sistem_surat

BETTER_AUTH_SECRET=secret-yang-panjang-dan-acak
BETTER_AUTH_URL=http://IP-ATAU-DOMAIN:3001
BETTER_AUTH_TRUSTED_ORIGINS=http://IP-ATAU-DOMAIN:3001
```

Jika memakai reverse proxy seperti Nginx dan domain HTTPS, sesuaikan:

```env
BETTER_AUTH_URL=https://domain-anda.com
BETTER_AUTH_TRUSTED_ORIGINS=https://domain-anda.com
```

## Script NPM

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan aplikasi mode development di port 3001. |
| `npm run build` | Generate Prisma Client dan build aplikasi production. |
| `npm run start` | Menjalankan hasil build production. |
| `npm run seed` | Mengisi database dengan data awal. |
| `npm run db:push` | Sinkronisasi schema Prisma ke database untuk development. |
| `npm run db:migrate:deploy` | Menjalankan migration Prisma untuk production. |
| `npm run lint` | Menjalankan ESLint. |

## Struktur Folder

```txt
prisma/
  schema.prisma      Schema database
  seed.ts            Data awal aplikasi
  migrations/        Migration Prisma

src/app/             Route, layout, page, dan API handler Next.js
src/components/      Komponen UI dan halaman fitur
src/domain/          Tipe dan use case domain
src/infrastructure/  Database, auth, dan repository
src/services/        Service aplikasi
src/lib/             Helper dan utilitas
src/generated/       Prisma Client hasil generate
```

## Endpoint Penting

| Endpoint | Fungsi |
| --- | --- |
| `/login` | Halaman login. |
| `/admin/dashboard` | Dashboard admin. |
| `/admin/users` | Manajemen akun. |
| `/admin/departemen` | Manajemen departemen. |
| `/admin/kelola-tabel-lacak` | Manajemen tabel lacak. |
| `/staff/data-surat` | Data surat untuk staff. |
| `/pkl/data-surat` | Data surat untuk PKL. |
| `/guest/lacak-surat` | Halaman lacak surat untuk guest. |

## Catatan Pengembangan

- Jangan commit file `.env` karena berisi credential.
- Jalankan seed setelah database pertama kali dibuat.
- Untuk production, gunakan password database dan `BETTER_AUTH_SECRET` yang kuat.
- Jika mengubah `prisma/schema.prisma`, jalankan generate atau migration sesuai kebutuhan.
