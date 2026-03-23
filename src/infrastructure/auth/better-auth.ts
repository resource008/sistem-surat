import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { bearer,username } from "better-auth/plugins"
import { prisma } from "../databases/prisma-client"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:3001"],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  plugins: [bearer(), username()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "GUEST",
        input: false,
      },
    },
  },
})