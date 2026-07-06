import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"
import {
  createDepartmentMutation,
  deleteDepartmentMutation,
  hardDeleteDepartmentMutation,
  updateDepartmentMutation,
} from "@/infrastructure/repositories/departemen/mutations"
import {
  findActiveDepartmentByIdOrThrow,
  findAllActiveDepartments,
} from "@/infrastructure/repositories/departemen/reads"

export class DepartemenRepository {
  async findAllActive() {
    return findAllActiveDepartments()
  }

  async findById(id: string) {
    return findActiveDepartmentByIdOrThrow(id)
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

  async hardDelete(id: string) {
    await hardDeleteDepartmentMutation(id)
  }
}
