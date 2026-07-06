import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"
import {
  createDepartmentMutation,
  deleteDepartmentMutation,
  hardDeleteDepartmentMutation,
  showDepartmentMutation,
  updateDepartmentMutation,
} from "@/infrastructure/repositories/departemen/mutations"
import {
  findDepartmentByIdOrThrow,
  findDepartments,
} from "@/infrastructure/repositories/departemen/reads"

export class DepartemenRepository {
  async findAll({ includeInactive = false } = {}) {
    return findDepartments({ includeInactive })
  }

  async findById(id: string, { includeInactive = false } = {}) {
    return findDepartmentByIdOrThrow(id, { includeInactive })
  }

  async create(input: CreateDepartemenInput) {
    const departmentId = await createDepartmentMutation(input)
    return this.findById(departmentId)
  }

  async update(id: string, input: UpdateDepartemenInput) {
    const resolvedId = await updateDepartmentMutation(id, input)
    return this.findById(resolvedId)
  }

  async delete(id: string) {
    await deleteDepartmentMutation(id)
  }

  async show(id: string) {
    const departmentId = await showDepartmentMutation(id)
    return this.findById(departmentId, { includeInactive: true })
  }

  async hardDelete(id: string) {
    await hardDeleteDepartmentMutation(id)
  }
}
