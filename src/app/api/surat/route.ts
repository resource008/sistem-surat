  import { NextResponse } from "next/server";
  import { prisma } from "@/infrastructure/databases/prisma-client";

  export async function GET() {
    try {
      // Mengambil semua data surat beserta data departemennya
      const data = await prisma.dataSurat.findMany({
        include: {
          dept: true,
        },
        orderBy: {
          nomor: "asc", // Urutkan dari yang terbaru
        },
      });

      return NextResponse.json(data);
    } catch (error) {
      console.error("Gagal mengambil data surat:", error);
      return NextResponse.json(
        { error: "Internal Server Error" }, 
        { status: 500 }
      );
    }
  }