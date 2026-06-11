# Dokumentasi API Routes

Dokumen ini merangkum API route yang tersedia di aplikasi Sistem Surat berdasarkan implementasi di `src/app/api`. Semua path memakai base URL aplikasi, misalnya `http://localhost:3001`.

## Aturan Umum

- Format request dan response utama adalah JSON.
- Route yang dilindungi membaca session Better Auth dari cookie/session request.
- Role yang tersedia: `ADMIN`, `STAFF`, dan `PKL`.
- Permission user: `canCreate`, `canEdit`, `canDelete`, `canPrint`, dan `canTrack`.
- User `ADMIN` dianggap memiliki semua permission. User non-admin dicek dari tabel permission, atau default sesuai role jika data permission belum ada.
- Response error umum:

```json
{ "error": "Pesan error" }
```

| Status | Arti |
| --- | --- |
| `400` | Request/body/query tidak valid |
| `401` | Belum login atau session tidak ada |
| `403` | Login valid, tetapi role/permission tidak cukup |
| `404` | Data tidak ditemukan |
| `409` | Konflik data, misalnya nomor sudah ada |
| `422` | Validasi field gagal |
| `500` | Error server |

Catatan validasi:
- Beberapa route mengembalikan `error` berupa string.
- `GET /api/users` dan `POST /api/users` mengembalikan `error` berupa object `fieldErrors`.
- `PATCH /api/surat/[dept]/[id]` mengembalikan `error` berupa hasil `zod.flatten()`.

## Auth

### `GET|POST /api/auth/[...all]`

Handler bawaan Better Auth.

Dipakai untuk login, logout, session, dan endpoint internal Better Auth lain. Implementasinya berasal dari:

```ts
toNextJsHandler(auth)
```

Catatan:
- Login aplikasi memakai username/password melalui plugin Better Auth `username`.
- Email/password aktif, sign-up dinonaktifkan.
- Plugin `bearer` juga aktif.
- `role` ditambahkan sebagai field user Better Auth dengan default `STAFF`.
- `trustedOrigins` saat ini berisi `http://localhost:3001`.

## Profile

Route profile dipakai user yang sedang login untuk melihat dan mengubah akun sendiri.

### `GET /api/profile`

Mengambil data akun user yang sedang login.

Auth: wajib login.

Response `200`:

```json
{
  "id": "user-id",
  "name": "Staff Satu",
  "email": "staff@staff.com",
  "username": "staff1",
  "image": null,
  "role": "STAFF",
  "createdAt": "2026-05-16T16:21:00.000Z",
  "updatedAt": "2026-06-01T16:49:00.000Z",
  "lastLogin": "2026-06-01T16:40:00.000Z",
  "status": "Sedang Aktif",
  "permissions": {
    "canCreate": true,
    "canEdit": true,
    "canDelete": false,
    "canPrint": true,
    "canTrack": false
  }
}
```

### `PATCH /api/profile`

Mengubah akun user yang sedang login.

Auth: wajib login.

Field yang boleh dikirim:

| Field | Tipe | Wajib | Catatan |
| --- | --- | --- | --- |
| `name` | string | tidak | Minimal 2, maksimal 100 karakter |
| `email` | string | tidak | Harus format email valid, disimpan lowercase |
| `username` | string | tidak | 3-30 karakter, huruf kecil/angka/underscore |
| `password` | string | tidak | 8-72 karakter |

Minimal satu field harus dikirim. Field `role` dan `permissions` tidak diterima di route ini.

Contoh request:

```json
{
  "name": "Staff Satu",
  "email": "staff@staff.com",
  "username": "staff1",
  "password": "passwordbaru"
}
```

Response `200`: object `User` terbaru.

## Me

Route `me` dipakai UI akun/permission untuk user saat ini.

### `GET /api/me/permissions`

Mengambil role dan permission user saat ini.

Auth: wajib login.

Response `200`:

```json
{
  "role": "STAFF",
  "permissions": {
    "canCreate": true,
    "canEdit": true,
    "canDelete": false,
    "canPrint": true,
    "canTrack": false
  }
}
```

### `GET /api/me/account`

Mengambil data akun Staff/PKL yang sedang login beserta permission efektifnya.

Auth: wajib login sebagai `STAFF` atau `PKL`. Role lain mendapat `403`.

Response `200`: object `User` ditambah `permissions`.

### `PATCH /api/me/account`

Mengubah data akun Staff/PKL yang sedang login.

Auth: wajib login sebagai `STAFF` atau `PKL`. Role lain mendapat `403`.

Field yang boleh dikirim:

| Field | Tipe | Wajib | Catatan |
| --- | --- | --- | --- |
| `name` | string | tidak | Minimal 2, maksimal 100 karakter |
| `email` | string | tidak | Harus format email valid, disimpan lowercase |
| `username` | string | tidak | 3-30 karakter, huruf kecil/angka/underscore |

Minimal satu field harus dikirim. Route ini tidak menerima `password`, `role`, atau `permissions`.

Response `200`: object `User` terbaru ditambah `permissions`.

## Users Admin

Route user admin hanya boleh diakses role `ADMIN`.

### `GET /api/users`

Mengambil daftar user dengan pagination.

Auth: wajib `ADMIN`.

Query params:

| Param | Default | Catatan |
| --- | --- | --- |
| `page` | `1` | Minimal 1 |
| `limit` | `10` | Minimal 1, maksimal 100 |
| `search` | - | Maksimal 100 karakter, cari pada `name`, `email`, `username` |
| `role` | - | `ADMIN`, `STAFF`, atau `PKL` |

Contoh:

```http
GET /api/users?page=1&limit=10&search=staff&role=STAFF
```

Response `200`:

```json
{
  "data": [
    {
      "id": "user-id",
      "name": "Staff Satu",
      "email": "staff@staff.com",
      "username": "staff1",
      "image": null,
      "role": "STAFF",
      "createdAt": "2026-05-16T16:21:00.000Z",
      "updatedAt": "2026-06-01T16:49:00.000Z",
      "lastLogin": "2026-06-01T16:40:00.000Z",
      "status": "Sedang Aktif",
      "permissions": {
        "canCreate": true,
        "canEdit": true,
        "canDelete": false,
        "canPrint": true,
        "canTrack": false
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### `POST /api/users`

Membuat user baru.

Auth: wajib `ADMIN`.

Body:

| Field | Tipe | Wajib | Catatan |
| --- | --- | --- | --- |
| `name` | string | ya | Minimal 2, maksimal 100 karakter |
| `email` | string | ya | Harus unik, format email valid, disimpan lowercase |
| `username` | string | ya | Harus unik, 3-30 karakter, huruf kecil/angka/underscore |
| `password` | string | ya | 8-72 karakter |
| `role` | string | ya | `ADMIN`, `STAFF`, atau `PKL` |

Permission dibuat otomatis dari default role:

| Role | Default permission |
| --- | --- |
| `ADMIN` | Semua true |
| `STAFF` | `canCreate`, `canEdit`, `canPrint` true; `canDelete`, `canTrack` false |
| `PKL` | Semua false |

Contoh request:

```json
{
  "name": "PKL Satu",
  "email": "pkl@pkl.com",
  "username": "pkl1",
  "password": "pkl12345",
  "role": "PKL"
}
```

Response `201`: object `User`.

### `GET /api/users/[id]`

Mengambil detail satu user.

Auth: wajib `ADMIN`.

Response `200`: object `User`.

### `PATCH /api/users/[id]`

Mengubah data user oleh admin.

Auth: wajib `ADMIN`.

Body:

| Field | Tipe | Wajib | Catatan |
| --- | --- | --- | --- |
| `name` | string | tidak | Minimal 2, maksimal 100 karakter |
| `email` | string | tidak | Harus format email valid, disimpan lowercase |
| `username` | string | tidak | 3-30 karakter, huruf kecil/angka/underscore |
| `password` | string | tidak | 8-72 karakter |
| `role` | string | tidak | `ADMIN`, `STAFF`, atau `PKL` |
| `permissions` | object | tidak | Partial permission user |

Minimal satu field harus dikirim.

Contoh request:

```json
{
  "name": "Staff Satu",
  "role": "STAFF",
  "permissions": {
    "canCreate": true,
    "canEdit": true,
    "canDelete": false,
    "canPrint": true,
    "canTrack": false
  }
}
```

Response `200`: object `User` terbaru.

Catatan:
- Admin tidak bisa menurunkan role akun dirinya sendiri dari `ADMIN`.
- Admin tidak bisa menghapus akun dirinya sendiri.
- Username dan email dicek agar tidak duplikat.
- Jika `permissions` dikirim dan record permission belum ada, route melakukan upsert memakai default role lalu menimpa field yang dikirim.

### `DELETE /api/users/[id]`

Menghapus user.

Auth: wajib `ADMIN`.

Response `200`:

```json
{ "message": "User berhasil dihapus" }
```

## Surat

### `GET /api/surat`

Mengambil daftar surat biasa atau PI.

Auth: wajib login.

Query params:

| Param | Default | Catatan |
| --- | --- | --- |
| `type` | surat biasa | Isi `pi` untuk data PI |
| `ids` | - | Comma separated id, hanya integer positif, maksimal 100 id |
| `page` | - | Jika dikirim, response menjadi paginated |
| `limit` | `20` | Dipakai jika `page` dikirim |
| `date` | - | Filter `tanggalTerima` pada tanggal tertentu |
| `dept` | - | Comma separated department id, contoh `HRD,IT` |

Contoh:

```http
GET /api/surat?type=pi&page=1&limit=20&date=2026-06-01&dept=PI
```

Response tanpa pagination `200`:

```json
[
  {
    "id": 1,
    "nomor": "0001",
    "deptId": "HRD",
    "asalSurat": "PT. Maju Mundur",
    "tujuan": "HRD",
    "tanggalTerima": "2026-04-01T00:00:00.000Z",
    "dept": {
      "id": "HRD",
      "shortName": "HRD",
      "tujuan": "HRD",
      "isActive": true
    },
    "detailSurat": []
  }
]
```

Response dengan pagination `200`:

```json
{
  "data": [],
  "hasMore": false
}
```

### `POST /api/surat`

Membuat register surat biasa atau PI.

Auth: wajib login dan permission `canCreate`.

Body untuk surat biasa:

```json
{
  "deptId": "HRD",
  "asalSurat": "PT. Maju Mundur",
  "tanggalTerima": "2026-06-01",
  "tujuan": "HRD",
  "isPIDept": false,
  "suratList": [
    {
      "perihal": "Permohonan Cuti",
      "noSurat": "001/HRD/VI/2026",
      "lampiran": "1 SET",
      "tujuan": "HRD",
      "tanggalSurat": "2026-06-01"
    }
  ]
}
```

Body untuk PI:

```json
{
  "deptId": "PI",
  "asalSurat": "PT. Investama Nusantara",
  "tanggalTerima": "2026-06-01",
  "isPIDept": true,
  "piList": [
    {
      "namaSupplier": "PT. Investama Nusantara",
      "noInvoice": "INV/2026/06/001",
      "nomorSurat": "IN/VI/2026/001",
      "tanggalSurat": "2026-06-01",
      "tujuan": "PI",
      "cc": null
    }
  ]
}
```

Validasi utama:
- `deptId`, `asalSurat`, `tanggalTerima`, dan `isPIDept` wajib.
- Jika `isPIDept: true`, minimal satu item `piList` wajib.
- Jika `isPIDept: false`, minimal satu item `suratList` wajib.
- Item PI wajib memiliki `namaSupplier` dan `tanggalSurat`.
- Item surat biasa wajib memiliki `perihal` dan `tanggalSurat`.

Response `201`: object surat/PI yang dibuat.

### `GET /api/surat/[dept]/[id]`

Mengambil detail surat berdasarkan department dan id.

Auth: wajib login.

Contoh:

```http
GET /api/surat/HRD/1
GET /api/surat/PI/1
```

Response `200`: object surat biasa jika `dept` bukan PI, atau object register PI jika `dept` adalah PI.

Error khusus:
- `400` jika `id` bukan angka valid.
- `404` jika data tidak ditemukan.

### `PATCH /api/surat/[dept]/[id]`

Mengubah surat berdasarkan department dan id.

Auth: wajib login dan permission `canEdit`.

Body untuk surat biasa:

```json
{
  "deptId": "HRD",
  "asalSurat": "PT. Maju Mundur",
  "tanggalTerima": "2026-06-01",
  "tujuan": "HRD",
  "suratList": [
    {
      "perihal": "Permohonan Cuti Revisi",
      "noSurat": "001/HRD/VI/2026",
      "lampiran": null,
      "tujuan": "HRD",
      "tanggalSurat": "2026-06-01"
    }
  ]
}
```

Body untuk PI:

```json
{
  "deptId": "PI",
  "asalSurat": "PT. Investama Nusantara",
  "tanggalTerima": "2026-06-01",
  "piList": [
    {
      "namaSupplier": "PT. Investama Nusantara",
      "noInvoice": "INV/2026/06/001",
      "nomorSurat": "IN/VI/2026/001",
      "tanggalSurat": "2026-06-01",
      "tujuan": "PI",
      "cc": null
    }
  ]
}
```

Catatan:
- `deptId`, `asalSurat`, dan `tanggalTerima` opsional pada update.
- `suratList` atau `piList` wajib ada dan minimal 1 item sesuai tipe route.
- Jika `deptId` berubah, nomor register akan digenerate ulang untuk department baru.

Response `200`: object surat/PI terbaru.

### `DELETE /api/surat/[dept]/[id]`

Menghapus surat berdasarkan department dan id.

Auth: wajib login dan permission `canDelete`.

Response `200`:

```json
{ "success": true }
```

### `GET /api/surat/preview-nomor`

Melihat nomor register berikutnya untuk department.

Auth: wajib login.

Query params:

| Param | Wajib | Catatan |
| --- | --- | --- |
| `deptId` | ya | Id department, contoh `HRD` atau `PI` |

Contoh:

```http
GET /api/surat/preview-nomor?deptId=HRD
```

Response `200`:

```json
{ "nomor": "0003" }
```

Error khusus:
- `400` jika `deptId` tidak dikirim.

## Cetak

### `GET /api/cetak/all`

Mengambil data surat biasa untuk kebutuhan cetak.

Auth: wajib login dan permission `canPrint`.

Query params:

| Param | Catatan |
| --- | --- |
| `ids` | Comma separated id, hanya integer positif, maksimal 100 id. Jika kosong, mengambil semua data surat biasa. |

Contoh:

```http
GET /api/cetak/all?ids=1,2,3
```

Response `200`: array register surat biasa dengan `dept` dan `detailSurat`, diurutkan berdasarkan `nomor` ascending.

### `GET /api/cetak/pi`

Mengambil data PI untuk kebutuhan cetak.

Auth: wajib login dan permission `canPrint`.

Query params:

| Param | Catatan |
| --- | --- |
| `ids` | Comma separated id, hanya integer positif, maksimal 100 id. Jika kosong, mengambil semua data PI. |

Contoh:

```http
GET /api/cetak/pi?ids=1,2,3
```

Response `200`: array register PI dengan `dept` dan `detailPI`, diurutkan berdasarkan `nomor` ascending.

## Departemen

### `GET /api/dept`

Mengambil daftar departemen aktif.

Auth: wajib login.

Response `200`:

```json
[
  {
    "id": "HRD",
    "shortName": "HRD",
    "tujuan": "HRD"
  }
]
```

## Login Activity

### `POST /api/login-activity`

Mencatat aktivitas login user saat ini.

Auth: wajib login.

Efek:
- Mengisi `users.lastLoginAt` dengan waktu saat ini.
- Mengupdate `sessions.updatedAt` untuk token session saat ini.

Response `200`:

```json
{ "ok": true }
```

## Admin Dashboard

### `GET /api/admin/stats`

Mengambil statistik dashboard admin.

Auth: wajib `ADMIN`.

Query params:

| Param | Wajib | Default | Catatan |
| --- | --- | --- | --- |
| `deptId` | ya | - | Department yang dipakai untuk statistik |
| `tipeWaktu` | tidak | `mingguan` | `mingguan`, `bulanan`, atau `tahunan` |
| `bulan` | tidak | - | Angka bulan, nilai non-angka diabaikan |
| `tahun` | tidak | - | Angka tahun, nilai non-angka diabaikan |

Contoh:

```http
GET /api/admin/stats?deptId=HRD&tipeWaktu=bulanan&bulan=6&tahun=2026
```

Response `200`:

```json
{
  "aktivitas": {
    "jumlahAkun": 3,
    "totalDepartemen": 17,
    "totalSuratMasuk": 12,
    "totalSuratPI": 2,
    "perubahanSuratMasuk": null,
    "perubahanSuratPI": null
  },
  "suratPerDepartemen": [
    {
      "departemenId": "HRD",
      "departemen": "HRD",
      "jumlah": 2,
      "persen": 16.67
    }
  ],
  "statistikSurat": {
    "departemenId": "HRD",
    "departemen": "HRD",
    "tipeWaktu": "bulanan",
    "labels": ["Minggu 1", "Minggu 2"],
    "data": [1, 1],
    "total": 2
  },
  "riwayatAktivitasPengguna": [
    {
      "id": "user-id",
      "fotoProfil": null,
      "nama": "Staff Satu",
      "terakhirMasuk": "2026-06-01T16:40:00.000Z",
      "status": "Sedang aktif"
    }
  ]
}
```

Error khusus:
- `400` jika `deptId` tidak dikirim.

## Ringkasan Permission

| Route | Auth |
| --- | --- |
| `/api/auth/[...all]` | Public/Better Auth handler |
| `/api/profile` | Login |
| `/api/me/permissions` | Login |
| `/api/me/account` | Login sebagai `STAFF` atau `PKL` |
| `/api/users` | `ADMIN` |
| `/api/users/[id]` | `ADMIN` |
| `GET /api/surat` | Login |
| `POST /api/surat` | Login + `canCreate` |
| `GET /api/surat/[dept]/[id]` | Login |
| `PATCH /api/surat/[dept]/[id]` | Login + `canEdit` |
| `DELETE /api/surat/[dept]/[id]` | Login + `canDelete` |
| `/api/surat/preview-nomor` | Login |
| `/api/cetak/all` | Login + `canPrint` |
| `/api/cetak/pi` | Login + `canPrint` |
| `/api/dept` | Login |
| `/api/login-activity` | Login |
| `/api/admin/stats` | `ADMIN` |
