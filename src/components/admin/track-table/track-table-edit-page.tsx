"use client"

import { useParams } from "next/navigation"
import { TrackTableFormPage } from "./track-table-form-page"

export default function TrackTableEditPage() {
  const { id } = useParams<{ id: string }>()
  return <TrackTableFormPage mode="edit" sheetId={id} />
}
