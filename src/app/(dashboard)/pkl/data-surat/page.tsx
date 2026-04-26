"use client"

import DataSuratPage from "@/components/surat/data-surat"

export default function Page() {
    return (
        <DataSuratPage
            role="PKL"
            basePath="/pkl/data-surat"
            printPath="/pkl/cetak"
        />
    )
}