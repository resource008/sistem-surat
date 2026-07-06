import type { TrackSheetInput } from "@/app/validation/track-table"
import {
  createTrackSheetMutation,
  hardDeleteTrackSheetMutation,
  hideTrackSheetMutation,
  showTrackSheetMutation,
  updateTrackSheetOrderMutation,
  updateTrackSheetMutation,
} from "./track-table/mutations"
import { findAllTrackTables, findTrackSheetByIdOrThrow } from "./track-table/reads"
import type { TrackSheetOrderInput } from "@/app/validation/track-table"

export class TrackTableRepository {
  async findAll() {
    return findAllTrackTables()
  }

  async findById(id: string) {
    return findTrackSheetByIdOrThrow(id)
  }

  async create(input: TrackSheetInput) {
    const id = await createTrackSheetMutation(input)
    return this.findById(id)
  }

  async update(id: string, input: TrackSheetInput) {
    await updateTrackSheetMutation(id, input)
    return this.findById(id)
  }

  async delete(id: string, mode: "hide" | "hard" = "hide") {
    if (mode === "hard") {
      await hardDeleteTrackSheetMutation(id)
      return
    }

    await hideTrackSheetMutation(id)
  }

  async show(id: string) {
    await showTrackSheetMutation(id)
    return this.findById(id)
  }

  async updateOrder(input: TrackSheetOrderInput) {
    await updateTrackSheetOrderMutation(input)
    return this.findAll()
  }
}
