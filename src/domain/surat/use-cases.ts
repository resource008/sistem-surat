// domain/surat/use-cases.ts

import { PIItem, SuratItem, CreateSuratPayload } from "./types"

export const formatLampiran = (raw: string): string => {
  const num = raw.replace(/\D/g, "")
  return num ? `${num} SET` : ""
}

export const getLampiranNum = (formatted: string): string => {
  return formatted.replace(" SET", "")
}

export const applyTujuanToPIList = (list: PIItem[], tujuan: string): PIItem[] => {
  return list.map(item => ({ ...item, tujuan }))
}

export const applyTujuanToSuratList = (list: SuratItem[], tujuan: string): SuratItem[] => {
  return list.map(item => ({ ...item, tujuan }))
}

interface ValidateParams {
  deptId: string; asalSurat: string; tanggalTerima: string;
  isPIDept: boolean; piList: PIItem[]; suratList: SuratItem[]
}

export const validateTambahForm = (params: ValidateParams): string[] => {
  const missing: string[] = []

  if (!params.deptId) missing.push("Departemen")
  if (!params.asalSurat) missing.push("Asal Surat")
  if (!params.tanggalTerima) missing.push("Tanggal Terima")

  if (params.isPIDept) {
    params.piList.forEach((pi, i) => {
      if (!pi.namaSupplier) missing.push(`Nama Supplier (Invoice ${i + 1})`)
      if (!pi.tanggalSurat) missing.push(`Tanggal Surat (Invoice ${i + 1})`)
    })
  } else {
    params.suratList.forEach((surat, i) => {
      if (!surat.perihal) missing.push(`Perihal (Surat ${i + 1})`)
      if (!surat.tanggalSurat) missing.push(`Tanggal Surat (Surat ${i + 1})`)
    })
  }

  return missing
}

const formatToISODate = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString()
  return new Date(`${dateStr}T00:00:00.000Z`).toISOString()
}

// ✅ Rangkai payload dengan key piList & suratList
export const buildPayload = (params: ValidateParams & { tujuan: string }): CreateSuratPayload => {
  return {
    deptId: params.deptId,
    asalSurat: params.asalSurat,
    tanggalTerima: formatToISODate(params.tanggalTerima),
    tujuan: params.tujuan,
    isPIDept: params.isPIDept,
    
    piList: params.isPIDept ? params.piList.map(p => ({
      namaSupplier: p.namaSupplier,
      noInvoice: p.noInvoice || null,
      nomorSurat: p.nomorSurat || null,
      tanggalSurat: formatToISODate(p.tanggalSurat),
      tujuan: p.tujuan || null,
      cc: p.cc || null
    })) : undefined,

    suratList: !params.isPIDept ? params.suratList.map(s => ({
      perihal: s.perihal,
      noSurat: s.noSurat || null,
      lampiran: s.lampiran || null,
      tujuan: s.tujuan || null,
      tanggalSurat: formatToISODate(s.tanggalSurat)
    })) : undefined,
  }
}