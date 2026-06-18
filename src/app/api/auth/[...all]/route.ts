import { auth } from "@/infrastructure/auth/better-auth"

export function GET(request: Request) {
  return auth.handler(request)
}

export function POST(request: Request) {
  return auth.handler(request)
}
