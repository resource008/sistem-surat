import { getCetakByPrintColumnName } from "../route-utils"

type RouteContext = { params: Promise<{ printColumnName: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const { printColumnName } = await params
  return getCetakByPrintColumnName(req, decodeURIComponent(printColumnName))
}
