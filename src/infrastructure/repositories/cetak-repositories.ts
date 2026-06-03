// src/infrastructure/repositories/cetak-repository.ts

import { prisma } from "@/infrastructure/databases/prisma-client"

export class CetakRepository {
  findAll(ids?: number[]) {
    return prisma.registerSurat.findMany({
      where  : ids ? { id: { in: ids } } : undefined,
      include: { dept: true, detailSurat: true },
      orderBy: { nomor: "asc" },
    })
  }

  findPI(ids?: number[]) {
    return prisma.registerPI.findMany({
      where  : ids ? { id: { in: ids } } : undefined,
      include: { dept: true, detailPI: true },
      orderBy: { nomor: "asc" },
    })
  }
}