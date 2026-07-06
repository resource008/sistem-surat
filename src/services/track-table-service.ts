import type { TrackSheetInput, TrackSheetOrderInput } from "@/app/validation/track-table"
import { TrackTableRepository } from "@/infrastructure/repositories/track-table-repositories"

const repository = new TrackTableRepository()

export function fetchTrackTables() {
  return repository.findAll()
}

export function fetchTrackSheetById(id: string) {
  return repository.findById(id)
}

export function createTrackSheet(input: TrackSheetInput) {
  return repository.create(input)
}

export function updateTrackSheet(id: string, input: TrackSheetInput) {
  return repository.update(id, input)
}

export function deleteTrackSheet(id: string, mode: "hide" | "hard" = "hide") {
  return repository.delete(id, mode)
}

export function showTrackSheet(id: string) {
  return repository.show(id)
}

export function updateTrackSheetOrder(input: TrackSheetOrderInput) {
  return repository.updateOrder(input)
}
