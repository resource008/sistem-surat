// domain/surat/types.ts

export interface DeptOption {
  id: string
  shortName: string
  tujuan: string
}

export interface PIItem {
  id: string
  namaSupplier: string
  noInvoice: string | null
  nomorSurat: string | null
  tujuan: string
  cc: string | null
  tanggalSurat: string
}

export interface SuratItem {
  id: string
  perihal: string
  noSurat: string | null
  lampiran: string | null
  tujuan: string
  tanggalSurat: string
}

// Payload yang dikirim dari Frontend ke Backend API
export interface CreateSuratPayload {
  deptId: string
  asalSurat: string
  tanggalTerima: string // Format ISO Date String
  tujuan: string
  isPIDept: boolean
  
  // ✅ Mengubah nama properti agar sesuai dengan Backend (piList & suratList)
  piList?: Array<{
    namaSupplier: string
    noInvoice: string | null
    nomorSurat: string | null
    tanggalSurat: string // Format ISO
    tujuan: string | null
    cc: string | null
  }>
  
  suratList?: Array<{
    perihal: string
    noSurat: string | null
    lampiran: string | null
    tujuan: string | null
    tanggalSurat: string
  }>
}