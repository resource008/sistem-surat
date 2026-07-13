import { z } from "zod"
import {
  DEFAULT_TRACK_CATEGORY_COLOR,
  normalizeTrackCategoryColor,
} from "@/lib/track-category-color"

const TrackCategoryColorSchema = z.string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Warna kategori tidak valid")
  .transform((color) => normalizeTrackCategoryColor(color))

const TrackFieldSchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().optional().default(""),
  category: z.string().max(80, "Kategori field maksimal 80 karakter").optional().default(""),
  categoryColor: TrackCategoryColorSchema.optional().default(DEFAULT_TRACK_CATEGORY_COLOR),
  region: z.string().max(80, "Region maksimal 80 karakter").optional().default(""),
  columnName: z.string().min(1, "Nama kolom wajib diisi").max(80, "Nama kolom maksimal 80 karakter").trim(),
  type: z.enum(["text", "date", "number", "category"]),
  defaultValue: z.string().max(120, "Isian awal maksimal 120 karakter").optional().default(""),
  categoryOptions: z.array(z.string().max(80, "Pilihan kategori maksimal 80 karakter")).optional().default([]),
  fillByHrd: z.boolean().optional().default(false),
  hiddenAt: z.union([z.string(), z.date(), z.null()]).optional().default(null),
  sortOrder: z.number().int().nonnegative().optional().default(0),
})

const TrackCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama kategori wajib diisi").max(80, "Nama kategori maksimal 80 karakter").trim(),
  color: TrackCategoryColorSchema.optional().default(DEFAULT_TRACK_CATEGORY_COLOR),
  fillByHrd: z.boolean().optional().default(false),
  sortOrder: z.number().int().nonnegative().optional().default(0),
})

export const TrackSheetSchema = z.object({
  name: z.string().min(1, "Nama sheet wajib diisi").max(100, "Nama sheet maksimal 100 karakter").trim(),
  sortOrder: z.number().int().nonnegative().optional().default(0),
  categories: z.array(TrackCategorySchema).optional().default([]),
  fields: z.array(TrackFieldSchema).min(1, "Tambahkan minimal satu field"),
}).superRefine((value, ctx) => {
  const categoryIds = new Set(value.categories.map((category) => category.id).filter(Boolean))
  const categoryNames = new Set(value.categories.map((category) => category.name.trim().toLowerCase()))

  if (categoryNames.size !== value.categories.length) {
    ctx.addIssue({
      code: "custom",
      message: "Nama kategori tidak boleh duplikat",
      path: ["categories"],
    })
  }

  value.fields.forEach((field, index) => {
    if (field.categoryId && !categoryIds.has(field.categoryId)) {
      ctx.addIssue({
        code: "custom",
        message: "Pilih kategori yang tersedia",
        path: ["fields", index, "categoryId"],
      })
    }

    const categoryOptions = field.categoryOptions.map((option) => option.trim()).filter(Boolean)
    const uniqueCategoryOptions = new Set(categoryOptions.map((option) => option.toLowerCase()))

    if (field.type === "category" && categoryOptions.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Tambahkan minimal satu pilihan kategori",
        path: ["fields", index, "categoryOptions"],
      })
    }

    if (uniqueCategoryOptions.size !== categoryOptions.length) {
      ctx.addIssue({
        code: "custom",
        message: "Pilihan kategori tidak boleh duplikat",
        path: ["fields", index, "categoryOptions"],
      })
    }
  })
})

export const TrackSheetOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string().min(1, "ID sheet wajib diisi"),
    sortOrder: z.number().int().nonnegative(),
  })).min(1, "Data urutan wajib diisi"),
})

export type TrackSheetInput = z.infer<typeof TrackSheetSchema>
export type TrackSheetOrderInput = z.infer<typeof TrackSheetOrderSchema>
