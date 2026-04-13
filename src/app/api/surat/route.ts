import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/databases/prisma-client";

export async function GET() {
  try {
    const data = await prisma.dataSurat.findMany({
      include: { dept: true },
      orderBy: { nomor: "asc" },
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      deptId,
      perihal,
      asalSurat,
      tujuan,
      noSurat,
      lampiran,
      tanggalSurat,
      tanggalTerima,
    } = body;

    if (!deptId || !perihal || !asalSurat || !tanggalSurat || !tanggalTerima) {
      return NextResponse.json(
        { error: "Field wajib tidak lengkap" },
        { status: 400 }
      );
    }

    const dept = await prisma.department.findUnique({
      where: { id: deptId },
    });

    if (!dept) {
      return NextResponse.json(
        { error: "Departemen tidak ditemukan" },
        { status: 404 }
      );
    }

    const counter = await prisma.nomorCounter.upsert({
      where: { deptId },
      update: { counter: { increment: 1 } },
      create: { deptId, counter: 1 },
    });

    const nomor = `${String(counter.counter).padStart(4, "0")}`;

    const created = await prisma.dataSurat.create({
      data: {
        nomor,
        dept: {
          connect: { id: deptId },
        },
        perihal,
        asalSurat,
        tujuan:        tujuan || dept.tujuan,
        noSurat:       noSurat   || null,
        lampiran:      lampiran  || null,
        tanggalSurat:  new Date(tanggalSurat),
        tanggalTerima: new Date(tanggalTerima),
      },
      include: { dept: true },
    });

    return NextResponse.json(created, { status: 201 });

  } catch (error) {
    console.error("Gagal menyimpan data surat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}