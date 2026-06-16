import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { bearer, username } from "better-auth/plugins"
import { prisma } from "../databases/prisma-client"

const splitOrigins = (value?: string) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? []

const baseURL = process.env.BETTER_AUTH_URL
const trustedOrigins = [
  ...(baseURL ? [baseURL] : []),
  ...splitOrigins(process.env.BETTER_AUTH_TRUSTED_ORIGINS),
  ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:3001"]),
]

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  plugins: [bearer(), username()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STAFF",
        input: false,
      },
    },
  },
})
