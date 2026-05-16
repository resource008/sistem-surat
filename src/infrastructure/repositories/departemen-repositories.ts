// src/infrastructure/repositories/departemen-repository.ts

import { prisma } from "@/infrastructure/databases/prisma-client"

export class DepartemenRepository {
  findAllActive() {
    return prisma.department.findMany({
      where  : { isActive: true },
      select : { id: true, shortName: true, tujuan: true },
      orderBy: { shortName: "asc" },
    })
  }
}