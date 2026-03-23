import { auth } from "@/infrastructure/auth/better-auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)