# Sistem Surat

# Development dengan Docker

Mode ini dibuat supaya developer lain tidak perlu install Node.js, PostgreSQL, atau setup environment manual.

## Menjalankan project

```bash
docker compose up --build
```

Aplikasi berjalan di:

```text
http://localhost:3001
```

Database PostgreSQL berjalan di container `db` dan dipublish ke host:

```text
localhost:5433
```

Compose development sudah mengatur environment default:

```text
DATABASE_URL=postgresql://postgres:password@db:5432/sistem_surat
BETTER_AUTH_URL=http://localhost:3001
```

Saat container app start, Prisma client akan dibuat dan schema database akan disinkronkan otomatis dengan:

```bash
npx prisma generate
npx prisma db push
```

## Seed data development

Kalau ingin mengisi data contoh, ubah `SEED_ON_START` di `docker-compose.yml` menjadi:

```yaml
SEED_ON_START: "true"
```

Lalu jalankan ulang:

```bash
docker compose up --build
```

Akun contoh dari seed:

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123. |
| Staff | staff1   | staff123. |
| PKL   | pkl1     | pkl123.   |

**Note**

Setelah dibuat nilai true di SEED_ON_START ketika container berhasil jalan, ubah kembali menjadi false agar seed nya tidak berjalan terus ketika menjalankan container.

## Reset database development

Kalau ingin mulai dari database kosong:

```bash
docker compose down -v
docker compose up --build
```

---

## API Routes

Semua endpoint memerlukan sesi yang valid (autentikasi via Better Auth). Request tanpa sesi akan mendapat respons `401 Unauthorized`.

---

## Surat

### `GET /api/surat`
Mengambil semua data surat (RegisterSurat atau RegisterPI).

**Query Parameters**

| Parameter | Tipe     | Wajib | Keterangan                                      |
|-----------|----------|-------|-------------------------------------------------|
| `type`    | `string` | Tidak | `"pi"` untuk RegisterPI, kosong untuk RegisterSurat |
| `ids`     | `string` | Tidak | ID dipisah koma, maks 100. Contoh: `1,2,3`     |
| `page`    | `number` | Tidak | Halaman saat ini (pagination)                   |
| `limit`   | `number` | Tidak | Jumlah data per halaman (default: 20)           |

**Response**

Tanpa pagination:
```json
[{ "id": 1, "nomor": "0001", "dept": {}, "detailSurat": [] }]
```

Dengan pagination:
```json
{ "data": [], "hasMore": true }
```

---

### `POST /api/surat`
Membuat data surat baru.

**Request Body**

```json
{
  "deptId": "string",
  "asalSurat": "string",
  "tanggalTerima": "string (ISO date)",
  "tujuan": "string",
  "isPIDept": false,
  "suratList": [
    {
      "perihal": "string",
      "noSurat": "string",
      "lampiran": "string",
      "tanggalSurat": "string (ISO date)"
    }
  ]
}
```

**Response** `201 Created`

```json
{ "id": 1, "nomor": "0001", "dept": {}, "detailSurat": [] }
```

**Error Codes**

| Status | Keterangan                  |
|--------|-----------------------------|
| `400`  | Body tidak valid            |
| `409`  | Nomor sudah ada             |
| `422`  | Validasi gagal              |

---

### `GET /api/surat/[dept]/[id]`
Mengambil satu data surat berdasarkan departemen dan ID.

**Path Parameters**

| Parameter | Keterangan                          |
|-----------|-------------------------------------|
| `dept`    | Kode departemen. Contoh: `"PI"`, `"IT"` |
| `id`      | ID surat (integer)                  |

**Response** `200 OK`

```json
{ "id": 1, "nomor": "0001", "dept": {}, "detailSurat": [] }
```

**Error Codes**

| Status | Keterangan        |
|--------|-------------------|
| `400`  | ID tidak valid    |
| `404`  | Data tidak ditemukan |

---

### `PATCH /api/surat/[dept]/[id]`
Mengubah data surat berdasarkan departemen dan ID.

**Path Parameters**

| Parameter | Keterangan              |
|-----------|-------------------------|
| `dept`    | Kode departemen         |
| `id`      | ID surat (integer)      |

**Request Body**

```json
{
  "asalSurat": "string",
  "tujuan": "string",
  "tanggalTerima": "string (ISO date)",
  "suratList": [
    {
      "perihal": "string",
      "noSurat": "string",
      "lampiran": "string",
      "tanggalSurat": "string (ISO date)"
    }
  ]
}
```

Untuk departemen PI, gunakan `piList` sebagai ganti `suratList`:

```json
{
  "asalSurat": "string",
  "tanggalTerima": "string (ISO date)",
  "piList": [
    {
      "namaSupplier": "string",
      "noInvoice": "string",
      "nomorSurat": "string",
      "tujuan": "string",
      "cc": "string",
      "tanggalSurat": "string (ISO date)"
    }
  ]
}
```

**Response** `200 OK` — data surat yang sudah diperbarui.

**Error Codes**

| Status | Keterangan           |
|--------|----------------------|
| `400`  | ID tidak valid       |
| `404`  | Data tidak ditemukan |
| `422`  | Validasi gagal       |

---

### `DELETE /api/surat/[dept]/[id]`
Menghapus data surat berdasarkan departemen dan ID.

**Path Parameters**

| Parameter | Keterangan         |
|-----------|--------------------|
| `dept`    | Kode departemen    |
| `id`      | ID surat (integer) |

**Response** `200 OK`

```json
{ "success": true }
```

**Error Codes**

| Status | Keterangan           |
|--------|----------------------|
| `400`  | ID tidak valid       |
| `404`  | Data tidak ditemukan |

---

### `GET /api/surat/preview-nomor`
Mengambil preview nomor surat berikutnya untuk departemen tertentu.

**Query Parameters**

| Parameter | Tipe     | Wajib | Keterangan      |
|-----------|----------|-------|-----------------|
| `deptId`  | `string` | Ya    | Kode departemen |

**Response** `200 OK`

```json
{ "nomor": "0042" }
```

---

## Cetak

### `GET /api/cetak/all`
Mengambil data RegisterSurat untuk keperluan cetak.

**Query Parameters**

| Parameter | Tipe     | Wajib | Keterangan                              |
|-----------|----------|-------|-----------------------------------------|
| `ids`     | `string` | Tidak | ID dipisah koma, maks 100. Contoh: `1,2,3` |

**Response** `200 OK` — array RegisterSurat dengan `detailSurat`, diurutkan berdasarkan nomor.

---

### `GET /api/cetak/pi`
Mengambil data RegisterPI untuk keperluan cetak.

**Query Parameters**

| Parameter | Tipe     | Wajib | Keterangan                              |
|-----------|----------|-------|-----------------------------------------|
| `ids`     | `string` | Tidak | ID dipisah koma, maks 100. Contoh: `1,2,3` |

**Response** `200 OK` — array RegisterPI dengan `detailPI`, diurutkan berdasarkan nomor.

---

## Departemen

### `GET /api/dept`
Mengambil semua data departemen.

**Response** `200 OK`

```json
[{ "id": "IT", "shortName": "IT", "name": "Information Technology" }]
```

---

## Users

### `POST /api/users`
Membuat user baru. Hanya bisa diakses oleh role `ADMIN`.

**Request Body**

```json
{
  "name": "string",
  "email": "string",
  "username": "string",
  "password": "string",
  "role": "ADMIN | STAFF"
}
```

**Response** `201 Created`

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "username": "string",
  "role": "STAFF"
}
```

**Error Codes**

| Status | Keterangan             |
|--------|------------------------|
| `400`  | Username/email sudah dipakai |
| `403`  | Bukan ADMIN            |
| `422`  | Validasi gagal         |

---

## Admin

### `GET /api/admin/stats`
Mengambil statistik dashboard admin. Hanya bisa diakses oleh role `ADMIN`.

**Query Parameters** — opsional, sesuai kebutuhan filter dashboard.

**Response** `200 OK` — data statistik dashboard.

**Error Codes**

| Status | Keterangan  |
|--------|-------------|
| `403`  | Bukan ADMIN |

---

## Login Activity

### `POST /api/login-activity`
Mencatat waktu login terakhir user dan memperbarui sesi.

**Response** `200 OK`

```json
{ "ok": true }
```

---

## Autentikasi

### `/api/auth/[...all]`
Endpoint autentikasi dikelola oleh **Better Auth**. Mencakup login, logout, dan manajemen sesi.

---

## Ringkasan

| Method   | Endpoint                      | Keterangan                        | Role           |
|----------|-------------------------------|-----------------------------------|----------------|
| `GET`    | `/api/surat`                  | Ambil semua surat                 | PKL and Staff  |
| `POST`   | `/api/surat`                  | Buat surat baru                   | PKL and Staff  |
| `GET`    | `/api/surat/[dept]/[id]`      | Ambil satu surat                  | PKL and Staff  |
| `PATCH`  | `/api/surat/[dept]/[id]`      | Edit surat                        | PKL and Staff  |
| `DELETE` | `/api/surat/[dept]/[id]`      | Hapus surat                       | PKL and Staff  |
| `GET`    | `/api/surat/preview-nomor`    | Preview nomor berikutnya          | PKL and Staff  |
| `GET`    | `/api/cetak/all`              | Data cetak RegisterSurat          | PKL and Staff  |
| `GET`    | `/api/cetak/pi`               | Data cetak RegisterPI             | PKL and Staff  |
| `GET`    | `/api/dept`                   | Ambil semua departemen            | PKL and Staff  |
| `POST`   | `/api/users`                  | Buat user baru                    | ADMIN only     |
| `GET`    | `/api/admin/stats`            | Statistik dashboard admin         | ADMIN only     |
| `POST`   | `/api/login-activity`         | Catat aktivitas login             | ADMIN only     |
