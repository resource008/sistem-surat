export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  PKL = "PKL",
  GUEST = "GUEST",
}

// Staff dan PKL memiliki hak akses yang sama
export const canEditSurat = (role: string) => 
  [Role.ADMIN, Role.STAFF, Role.PKL].includes(role as Role);

export const canDeleteSurat = (role: string) => 
  role === Role.ADMIN;