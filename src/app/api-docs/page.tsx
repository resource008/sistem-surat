"use client"

import dynamic from "next/dynamic"
import "swagger-ui-react/swagger-ui.css"

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false })

export default function ApiDocsPage() {
  return (
    <div className="swagger-wrapper">
      <SwaggerUI url="http://localhost:3001/sistem-surat-api.yaml" />
    </div>
  )
}