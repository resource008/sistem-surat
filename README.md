# Dokumentasi API Sistem Surat

Base URL:

```txt
http://localhost:3001
```

Sebagian besar endpoint membutuhkan session login dari Better Auth. Untuk testing di Postman, login terlebih dahulu lalu pastikan cookie session tersimpan.

## Format Umum

Response sukses yang bersifat aksi biasanya memakai `message`.

```json
{
  "message": "Data berhasil diproses"
}
```

Response validasi akun dan departemen:

```json
{
  "message": "Request tidak sesuai",
  "errors": {
    "email": ["Format email tidak valid"]
  }
}
```

Response error umum:

```json
{
  "error": "Unauthorized"
}
```

Response data tidak ditemukan pada detail surat:

```json
{
  "message": "Data tidak ditemukan"
}
```

## Status Code

| Status | Keterangan |
| --- | --- |
| `200` | Request berhasil |
| `201` | Data berhasil dibuat |
| `400` | Request/body/query tidak valid |
| `401` | Belum login/session tidak ada |
| `403` | Tidak punya akses/permission |
| `404` | Data tidak ditemukan |
| `409` | Konflik data, misalnya nomor/username/email duplikat |
| `422` | Validasi field gagal |
| `500` | Error server |

## Ringkasan Endpoint

| Endpoint | Method | Auth | Keterangan |
| --- | --- | --- | --- |
| `/api/auth/sign-in/username` | `POST` | Public | Login username/password |
| `/api/profile` | `GET` | Login | Ambil profil user login |
| `/api/profile` | `PATCH` | Login | Update profil sendiri |
| `/api/me/account` | `GET` | Staff/PKL | Ambil akun Staff/PKL aktif |
| `/api/me/account` | `PATCH` | Staff/PKL | Ditolak, akun hanya dapat dilihat |
| `/api/me/permissions` | `GET` | Login | Ambil role dan permission aktif |
| `/api/users` | `GET` | Admin | Ambil daftar akun |
| `/api/users` | `POST` | Admin | Tambah akun |
| `/api/users/[id]` | `GET` | Admin | Detail akun |
| `/api/users/[id]` | `PATCH` | Admin | Edit akun |
| `/api/users/[id]` | `DELETE` | Admin | Hapus akun |
| `/api/dept` | `GET` | Login | Ambil daftar departemen |
| `/api/dept` | `POST` | Admin | Tambah departemen |
| `/api/dept/[id]` | `GET` | Admin | Detail departemen |
| `/api/dept/[id]` | `PATCH`/`PUT` | Admin | Edit departemen |
| `/api/dept/[id]` | `DELETE` | Admin | Hapus/nonaktifkan departemen |
| `/api/surat` | `GET` | Login | Ambil data surat/PI |
| `/api/surat` | `POST` | Admin atau `canCreate` | Tambah data surat/PI |
| `/api/surat/[dept]/[id]` | `GET` | Login | Detail surat/PI |
| `/api/surat/[dept]/[id]` | `PATCH` | Admin atau `canEdit` | Edit surat/PI |
| `/api/surat/[dept]/[id]` | `DELETE` | Admin atau `canDelete` | Hapus surat/PI |
| `/api/surat/preview-nomor` | `GET` | Login | Preview nomor berikutnya |
| `/api/cetak/all` | `GET` | Admin atau `canPrint` | Data cetak surat biasa |
| `/api/cetak/pi` | `GET` | Admin atau `canPrint` | Data cetak PI |
| `/api/login-activity` | `POST` | Login | Catat aktivitas login |
| `/api/admin/stats` | `GET` | Admin | Statistik dashboard admin |

## Auth

### Login

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/auth/sign-in/username` | `POST` | Body JSON username dan password | Response Better Auth dan cookie session |

Request:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response sukses mengikuti handler Better Auth. Di Postman, pastikan cookie session tersimpan setelah login.

## Profile dan Session

### Ambil Profile

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/profile` | `GET` | Tidak ada body | Object user login |

Response:

```json
{
  "id": "user-id",
  "name": "Admin",
  "email": "admin@example.com",
  "username": "admin",
  "role": "ADMIN"
}
```

### Update Profile

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/profile` | `PATCH` | Body JSON field akun | Object user terbaru |

Request:

```json
{
  "name": "Admin Sistem",
  "email": "admin@example.com",
  "username": "admin",
  "password": "passwordbaru"
}
```

### Akun Staff/PKL Aktif

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/me/account` | `GET` | Tidak ada body | Object user dan permissions |
| `/api/me/account` | `PATCH` | Tidak dipakai | `403` |

Response `GET`:

```json
{
  "id": "user-id",
  "name": "Staff Satu",
  "email": "staff@example.com",
  "username": "staff1",
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

### Permission User Aktif

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/me/permissions` | `GET` | Tidak ada body | Role dan permissions |

Response:

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

## Akun/User

### Ambil Daftar Akun

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/users?page=1&limit=10&search=staff&role=STAFF` | `GET` | Query opsional | Data user dan meta pagination |

Query:

| Query | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `page` | number | tidak | Default `1` |
| `limit` | number | tidak | Default `10`, maksimal `100` |
| `search` | string | tidak | Cari nama/email/username |
| `role` | string | tidak | `ADMIN`, `STAFF`, atau `PKL` |

Response:

```json
{
  "data": [
    {
      "id": "user-id",
      "name": "Staff Satu",
      "email": "staff@example.com",
      "username": "staff1",
      "role": "STAFF"
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

### Tambah Akun

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/users` | `POST` | Body JSON data akun | Message sukses dan id akun |

Request:

```json
{
  "name": "Staff Satu",
  "email": "staff@example.com",
  "username": "staff1",
  "password": "password123",
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

Response `201`:

```json
{
  "message": "Akun berhasil ditambahkan",
  "id": "user-id"
}
```

Response validasi `422`:

```json
{
  "message": "Request tidak sesuai",
  "errors": {
    "email": ["Format email tidak valid"],
    "password": ["Password minimal 8 karakter"]
  }
}
```

### Detail Akun

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/users/[id]` | `GET` | Path param `id` | Object user |

### Edit Akun

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/users/[id]` | `PATCH` | Body JSON field yang diubah | Message sukses |

Request:

```json
{
  "name": "Staff Satu Update",
  "email": "staff.update@example.com",
  "username": "staff_update",
  "role": "STAFF",
  "permissions": {
    "canCreate": true,
    "canEdit": true
  }
}
```

Response `200`:

```json
{
  "message": "Data akun berhasil diubah"
}
```

Response validasi `422`:

```json
{
  "message": "Request tidak sesuai",
  "errors": {
    "username": ["Username hanya boleh huruf kecil, angka, dan underscore"]
  }
}
```

### Hapus Akun

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/users/[id]` | `DELETE` | Path param `id` | Message sukses |

Response:

```json
{
  "message": "Akun berhasil dihapus"
}
```

## Departemen

### Ambil Daftar Departemen

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/dept` | `GET` | Tidak ada body | Array departemen aktif |

Response:

```json
[
  {
    "id": "HRD",
    "shortName": "HRD",
    "tujuan": "HRD"
  }
]
```

### Tambah Departemen

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/dept` | `POST` | Body JSON departemen | Message sukses dan id departemen |

Request:

```json
{
  "shortName": "LEGAL",
  "tujuan": "Legal",
  "printColumnName": "LEGAL",
  "columnMode": "new",
  "columns": []
}
```

Response `201`:

```json
{
  "message": "Departemen berhasil ditambahkan",
  "id": "LEGAL"
}
```

Response validasi:

```json
{
  "message": "Request tidak sesuai",
  "errors": {
    "shortName": ["Singkatan minimal 2 karakter"]
  }
}
```

### Detail Departemen

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/dept/[id]` | `GET` | Path param `id` | Object departemen |

### Edit Departemen

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/dept/[id]` | `PATCH` atau `PUT` | Body JSON departemen | Message sukses dan data terbaru |

Request:

```json
{
  "shortName": "LEGAL",
  "tujuan": "Legal Corporate",
  "printColumnName": "LEGAL",
  "columnMode": "new",
  "sourceDepartmentId": "",
  "columns": [
    {
      "label": "Keterangan",
      "type": "text",
      "defaultValue": "",
      "isDefault": false,
      "isRequired": false,
      "showInDataSurat": true,
      "showInPrint": true,
      "sortOrder": 0
    }
  ]
}
```

Response:

```json
{
  "message": "Data departemen berhasil diubah",
  "data": {
    "id": "1",
    "shortName": "LEGAL",
    "fullName": "Legal Corporate",
    "tujuan": "Legal Corporate",
    "printColumnName": "LEGAL",
    "columns": []
  }
}
```

### Hapus Departemen

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/dept/[id]` | `DELETE` | Path param `id` | Message sukses |

Response:

```json
{
  "message": "Departemen berhasil dihapus"
}
```

## Surat dan PI

### Ambil Daftar Surat

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/surat` | `GET` | Query opsional | Array data atau object pagination |

Query:

| Query | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `type` | string | tidak | Isi `pi` untuk data PI |
| `ids` | string | tidak | Comma separated id, contoh `1,2,3` |
| `page` | number | tidak | Jika dikirim, response pakai pagination |
| `limit` | number | tidak | Jumlah data per page |
| `date` | string | tidak | Format `YYYY-MM-DD` |
| `dept` | string | tidak | Satu atau banyak dept, contoh `HRD,OMD` |

Response tanpa pagination:

```json
[
  {
    "id": 17,
    "nomor": "0001",
    "deptId": "HRD",
    "dept": {
      "id": "HRD",
      "shortName": "HRD"
    },
    "asalSurat": "PT. Maju Mundur",
    "tujuan": "HRD",
    "tanggalTerima": "2026-04-01T00:00:00.000Z",
    "detailSurat": [
      {
        "id": 68,
        "perihal": "Permohonan Cuti Massal Karyawan Q2 2026",
        "noSurat": "092/HRD/III/2026",
        "lampiran": "2 Set",
        "tujuan": "",
        "tanggalSurat": "2026-03-28T00:00:00.000Z"
      }
    ]
  }
]
```

Response dengan pagination:

```json
{
  "data": [],
  "hasMore": false
}
```

### Tambah Surat Biasa

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/surat` | `POST` | Body JSON surat | Message sukses dan id surat |

Request:

```json
{
  "deptId": "HRD",
  "asalSurat": "PT. Maju Mundur",
  "tujuan": "HRD",
  "tanggalTerima": "2026-04-01",
  "isPIDept": false,
  "suratList": [
    {
      "perihal": "Permohonan Cuti",
      "noSurat": "001/HRD/IV/2026",
      "lampiran": "1 Set",
      "tujuan": "HRD",
      "tanggalSurat": "2026-04-01"
    }
  ]
}
```

Response `201`:

```json
{
  "message": "Data surat berhasil ditambahkan",
  "id": 17
}
```

### Tambah Data PI

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/surat` | `POST` | Body JSON PI | Message sukses dan id PI |

Request:

```json
{
  "deptId": "PI",
  "asalSurat": "Supplier A",
  "tanggalTerima": "2026-04-01",
  "isPIDept": true,
  "piList": [
    {
      "namaSupplier": "Supplier A",
      "noInvoice": "INV-001",
      "nomorSurat": "PI/001/IV/2026",
      "tujuan": "Finance",
      "cc": "Manager",
      "tanggalSurat": "2026-04-01"
    }
  ]
}
```

Response:

```json
{
  "message": "Data surat berhasil ditambahkan",
  "id": 1
}
```

### Detail Surat atau PI

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/surat/[dept]/[id]` | `GET` | Path param `dept` dan `id` | Object surat/PI |

Contoh:

```txt
GET /api/surat/HRD/17
GET /api/surat/PI/1
```

Response jika data tidak ditemukan:

```json
{
  "message": "Data tidak ditemukan"
}
```

### Edit Surat atau PI

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/surat/[dept]/[id]` | `PATCH` | Body JSON field surat/PI | Message sukses |

Request surat:

```json
{
  "deptId": "HRD",
  "asalSurat": "PT. Maju Mundur",
  "tujuan": "HRD",
  "tanggalTerima": "2026-04-02",
  "suratList": [
    {
      "perihal": "Permohonan Cuti Update",
      "noSurat": "001/HRD/IV/2026",
      "lampiran": "1 Set",
      "tujuan": "HRD",
      "tanggalSurat": "2026-04-02"
    }
  ]
}
```

Response:

```json
{
  "message": "Data surat berhasil diubah"
}
```

### Hapus Surat atau PI

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/surat/[dept]/[id]` | `DELETE` | Path param `dept` dan `id` | Message sukses |

Response:

```json
{
  "message": "Data surat berhasil dihapus"
}
```

### Preview Nomor Surat

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/surat/preview-nomor?deptId=HRD` | `GET` | Query `deptId` | Nomor berikutnya |

Response:

```json
{
  "nomor": "0004"
}
```

## Cetak

### Cetak Surat Biasa

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/cetak/all` | `GET` | Query opsional `ids` | Array data surat untuk cetak |

Contoh:

```txt
GET /api/cetak/all
GET /api/cetak/all?ids=1,2,3
```

Response:

```json
[
  {
    "id": 30,
    "nomor": "0002",
    "deptId": "OMD",
    "tanggalTerima": "2026-04-08T00:00:00.000Z",
    "asalSurat": "Lembaga Sertifikasi Profesi",
    "tujuan": "OMD",
    "dept": {
      "id": "OMD",
      "shortName": "OMD"
    },
    "detailSurat": [
      {
        "id": 41,
        "perihal": "Jadwal Sertifikasi Kompetensi Manajerial Karyawan",
        "noSurat": "LSP/OMD/IV/2026/044",
        "lampiran": "-",
        "tanggalSurat": "2026-04-06T00:00:00.000Z",
        "tujuan": ""
      }
    ]
  }
]
```

### Cetak PI

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/cetak/pi` | `GET` | Query opsional `ids` | Array data PI untuk cetak |

Contoh:

```txt
GET /api/cetak/pi
GET /api/cetak/pi?ids=1,2,3
```

Response:

```json
[
  {
    "id": 1,
    "nomor": "0001",
    "deptId": "PI",
    "tanggalTerima": "2026-04-01T00:00:00.000Z",
    "asalSurat": "Supplier A",
    "dept": {
      "id": "PI",
      "shortName": "PI"
    },
    "detailPI": [
      {
        "id": 1,
        "namaSupplier": "Supplier A",
        "noInvoice": "INV-001",
        "nomorSurat": "PI/001/IV/2026",
        "tujuan": "Finance",
        "cc": "Manager",
        "tanggalSurat": "2026-04-01T00:00:00.000Z"
      }
    ]
  }
]
```

## Login Activity

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/login-activity` | `POST` | Tidak ada body | Status pencatatan aktivitas |

Response:

```json
{
  "ok": true
}
```

## Dashboard Admin

### Statistik Dashboard

| Endpoint | Method | Request | Response |
| --- | --- | --- | --- |
| `/api/admin/stats?deptId=HRD` | `GET` | Query statistik | Object statistik dashboard |

Query:

| Query | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `deptId` | string | ya | Departemen yang dihitung |
| `tipeWaktu` | string | tidak | `mingguan`, `bulanan`, atau `tahunan` |
| `bulan` | number | tidak | Bulan, contoh `6` |
| `tahun` | number | tidak | Tahun, contoh `2026` |

Contoh:

```txt
GET /api/admin/stats?deptId=HRD
GET /api/admin/stats?deptId=HRD&tipeWaktu=bulanan&bulan=6&tahun=2026
```

Response berupa object statistik dashboard, termasuk ringkasan aktivitas, surat per departemen, statistik surat, dan riwayat aktivitas pengguna.

## Catatan Testing Postman

1. Login dahulu melalui `POST /api/auth/sign-in/username`.
2. Pastikan cookie session tersimpan di Postman.
3. Gunakan `Content-Type: application/json` untuk request `POST` dan `PATCH`.
4. Untuk endpoint yang butuh permission, gunakan akun admin atau akun dengan permission yang sesuai.
5. Jika response `401`, cookie session belum terkirim atau sudah expired.
6. Jika response `403`, akun login tidak punya role/permission yang sesuai.
