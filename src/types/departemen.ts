export interface Departemen {
  id: string
  shortName: string
  tujuan: string
}

export type DepartemenFormState = {
  tujuan: string
  shortName: string
}

export const EMPTY_DEPARTEMEN_FORM: DepartemenFormState = {
  tujuan: "",
  shortName: "",
}
