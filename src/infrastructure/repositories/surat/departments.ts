import { prisma } from "@/infrastructure/databases/prisma-client"

export async function findActiveDepartmentByRef(reference: string) {
  if (!reference?.trim()) return null

  return prisma.department.findFirst({
    where: {
      isActive: true,
      OR: [
        { id: reference },
        { shortName: reference },
      ],
    },
    select: {
      id: true,
      shortName: true,
    },
  })
}
