export interface Departemen {
  id: string
  shortName: string
  fullName: string
}

export type DepartemenFormState = {
  fullName: string
  shortName: string
}

export const EMPTY_DEPARTEMEN_FORM: DepartemenFormState = {
  fullName: "",
  shortName: "",
}
