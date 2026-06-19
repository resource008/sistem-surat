import { getAllCetak } from "../route-utils"

export async function GET(req: Request) {
  return getAllCetak(req)
}
