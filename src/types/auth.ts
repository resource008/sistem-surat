import { z }            from "zod"
import type { Session } from "better-auth/types"
import type { User }    from "better-auth/types"

export const RoleSchema = z.string().min(1)

export type ExtendedSession = Session & {
  user: User & { role: z.infer<typeof RoleSchema> }
}
