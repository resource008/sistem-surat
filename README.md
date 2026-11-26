# Sistem Surat — Aplikasi Administrasi & Pelacakan Surat Masuk

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-20232A?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

**Sistem Surat** adalah aplikasi web *full-stack* yang dibangun untuk mendigitalisasi pengelolaan surat masuk, perutean dokumen antar-departemen, pengaturan akun dan hak akses (*role*) dinamis, pencetakan rekap surat, serta pelacakan status dokumen secara *real-time*.

---

## Tangkapan Layar Aplikasi

| Halaman Login | Dashboard Admin |
| :---: | :---: |
| ![Halaman Login](docs/screenshots/login_page.png) | ![Dashboard Admin](docs/screenshots/admin_page.png) |

| Halaman Data Surat (Staff) | Preview & Cetak Surat |
| :---: | :---: |
| ![Halaman Staff](docs/screenshots/staff_page.png) | ![Cetak Surat](docs/screenshots/print_browser.png) |

### Informasi Akun & Hak Akses
![Informasi Akun](docs/screenshots/account_info.png)

## Fitur Utama

### 1. Autentikasi & Hak Akses Dinamis (Dynamic RBAC)
- **Keamanan Sesi:** Login berbasis *username* dan *password* menggunakan **Better Auth**, dilengkapi *idle session guard* untuk otomatis mengunci sesi yang tidak aktif.
- **Manajemen Role Dinamis:** Admin dapat menambahkan, mengubah, dan mengelola *custom role* secara dinamis langsung dari dashboard tanpa perlu mengubah kode program.
- **Granular Permissions:** Pengaturan izin akses detail per pengguna (`canViewDataSurat`, `canCreate`, `canEdit`, `canDelete`, `canPrint`, `canTrack`) serta pembatasan akses per kategori dan kolom pada tabel lacak.

### 2. Pengelolaan Surat & Departemen
- **Kustomisasi Kolom Departemen:** Admin dapat mengatur daftar departemen beserta struktur kolom input dan tampilan cetak yang menyesuaikan kebutuhan masing-masing departemen.
- **Penomoran Otomatis:** Preview dan pembuatan nomor registrasi surat otomatis per departemen yang ter-reset setiap pergantian tahun.
- **Operasional Surat Lengkap:** Input, ubah, hapus, filter dinamis, pencarian cepat, perpindahan surat antar-departemen, serta halaman *print preview* khusus cetak.

### 3. Pelacakan Dokumen (Track Sheet)
- **Tabel Lacak Fleksibel:** Pembuatan *sheet*, kategori warna, dan kolom pelacakan dinamis untuk memantau progres dokumen.
- **Tampilan Multi-Role:** Antarmuka pelacakan khusus untuk pengguna internal (`Admin`, `Staff`, `PKL`) serta halaman lacak publik/terbatas untuk `Guest`.

### 4. Containerization & CI/CD
- **Docker Ready:** Siap dijalankan menggunakan **Docker Compose** bersama database **PostgreSQL**, dengan eksekusi migrasi schema Prisma otomatis saat container berjalan.
- **GitHub Actions Pipeline:** Otomasi pengecekan kualitas kode (`ESLint`, `TypeScript type-check`, `Next.js build`) serta build & push Docker image untuk deployment ke VPS.

---

## Role & Hak Akses Pengguna

Secara default, sistem menyediakan beberapa role utama serta mendukung pembuatan **role kustom secara dinamis** oleh Admin:

| Role | Keterangan |
| --- | --- |
| `ADMIN` | Mengelola seluruh data surat, akun pengguna, role dinamis, departemen, tabel lacak, dan dashboard statistik. |
| `STAFF` | Mengelola data surat dan pelacakan dokumen sesuai *permission* yang diberikan oleh Admin. |
| `PKL` | Mengakses fitur operasional input, lihat, cetak, atau lacak surat sesuai batas *permission* dari Admin. |
| `Custom Role` | Role tambahan yang dibuat dan dikonfigurasi secara dinamis oleh Admin melalui menu Manajemen Role. |

Daftar *granular permission* yang dapat diatur per pengguna:

| Permission | Fungsi |
| --- | --- |
| `canViewDataSurat` | Mengizinkan melihat daftar data surat masuk. |
| `canCreate` | Mengizinkan menambahkan data surat baru. |
| `canEdit` | Mengizinkan mengubah data surat yang sudah ada. |
| `canDelete` | Mengizinkan menghapus data surat. |
| `canPrint` | Mengizinkan akses ke halaman preview dan cetak surat. |
| `canTrack` | Mengizinkan akses ke fitur tabel lacak dokumen. |

---

## Teknologi yang Digunakan

| Kategori | Teknologi |
| --- | --- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI / Shadcn UI, Recharts |
| **Backend & Auth** | Next.js Route Handlers, Better Auth, Zod Validation |
| **Database & ORM** | PostgreSQL, Prisma ORM 7 (`@prisma/adapter-pg`) |
| **DevOps & CI/CD** | Docker, Docker Compose, GitHub Actions, VPS Deployment |

---

## Kebutuhan Sistem

**Menjalankan Tanpa Docker (Lokal):**
- Node.js 22 atau lebih baru
- PostgreSQL
- npm

**Menjalankan dengan Container:**
- Docker & Docker Compose

---

## Konfigurasi Environment

Salin file contoh environment terlebih dahulu:

```bash
cp .env.example .env
```

Contoh konfigurasi `.env` untuk lingkungan lokal:

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
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3001
```

> **Catatan:**
> - Jika perintah Prisma dijalankan dari komputer *host*, gunakan host database `localhost`.
> - Jika aplikasi berjalan di dalam Docker Compose, service `app` otomatis terhubung ke host database internal `db`.

---

## Menjalankan Secara Lokal

1. **Install dependency:**
   ```bash
   npm install
   ```

2. **Generate Prisma Client dan jalankan migrasi database:**
   ```bash
   npx prisma generate
   npm run db:migrate:deploy
   ```

3. **Isi data awal (seed):**
   ```bash
   npm run seed
   ```

4. **Jalankan server development:**
   ```bash
   npm run dev
   ```

Aplikasi dapat diakses melalui `http://localhost:3001`.

---

## Menjalankan dengan Docker Compose

1. **Build dan jalankan container aplikasi beserta database:**
   ```bash
   docker compose up -d --build
   ```
   *(Saat container `app` berjalan, `prisma migrate deploy` akan dieksekusi secara otomatis).*

2. **Jalankan seed untuk membuat akun awal:**
   ```bash
   docker compose run --rm seed
   ```

3. **Kredensial akun awal hasil seed:**
   ```txt
   Username : admin
   Password : admin123
   ```

Perintah Docker tambahan yang sering digunakan:

```bash
# Melihat log aplikasi secara real-time
docker compose logs -f app

# Restart container aplikasi
docker compose restart app

# Menghentikan seluruh container
docker compose down

# Reset database volume dan mulai ulang dari awal
docker compose down -v
docker compose up -d --build
docker compose run --rm seed
```

---

## CI/CD & Deploy ke VPS

Repositori ini dilengkapi workflow **GitHub Actions** pada direktori `.github/workflows/`:
- `integration.yml`: Menjalankan validasi otomatis (`prisma generate`, `npm run lint`, `tsc --noEmit`, dan `npm run build`) pada setiap *push* dan *pull request*.
- `staging.yml`: Membangun image Docker, mengirimkannya ke Docker Hub, serta memperbarui container dan migrasi database di VPS secara otomatis.

### Langkah Deploy Manual di VPS
1. Clone repositori ke direktori server VPS.
2. Buat file `.env` dari `.env.example` dan sesuaikan kredensial serta domain/IP server:
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
   BETTER_AUTH_URL=https://domain-anda.com
   BETTER_AUTH_TRUSTED_ORIGINS=https://domain-anda.com
   ```
3. Jalankan container dan seed awal:
   ```bash
   docker compose up -d --build
   docker compose run --rm seed
   ```

---

## Script NPM

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server development di port `3001`. |
| `npm run build` | Generate Prisma Client dan build aplikasi untuk production. |
| `npm run start` | Menjalankan hasil build production di port `3001`. |
| `npm run seed` | Mengisi database dengan data awal (`prisma/seed.ts`). |
| `npm run db:push` | Sinkronisasi langsung schema Prisma ke database development. |
| `npm run db:migrate:deploy` | Menjalankan migrasi Prisma untuk lingkungan staging/production. |
| `npm run lint` | Memeriksa kualitas kode menggunakan ESLint. |

---

## Struktur Folder

```txt
.github/
  workflows/         Pipeline CI/CD GitHub Actions (validasi & staging deploy)
prisma/
  schema.prisma      Definisi model & relasi database PostgreSQL
  seed.ts            Script data awal aplikasi
  migrations/        Riwayat migrasi database Prisma
src/
  app/               Halaman Next.js App Router, layout per role, & API route handlers
  components/        Komponen UI modular (admin, surat, filter, auth, cetak)
  constants/         Konfigurasi rute, menu, & konstanta aplikasi
  domain/            Entitas, tipe, repository, & use case bisnis
  generated/         Prisma Client hasil generate
```

---

## Endpoint Penting

| Endpoint | Fungsi |
| --- | --- |
| `/login` | Halaman autentikasi pengguna. |
| `/admin/dashboard` | Dashboard admin (statistik surat & aktivitas login). |
| `/admin/users` | Manajemen akun pengguna dan *granular permissions*. |
| `/admin/roles` | Manajemen penambahan dan pengaturan *role* dinamis. |
| `/admin/departemen` | Manajemen departemen dan kustomisasi kolom surat. |
| `/admin/lacak-surat` | Manajemen tabel lacak, kategori, dan kolom pelacakan. |
| `/staff/data-surat` | Halaman operasional data surat untuk role `STAFF`. |
| `/pkl/data-surat` | Halaman operasional data surat untuk role `PKL`. |
| `/guest/lacak-surat` | Halaman pelacakan status surat untuk `Guest`. |