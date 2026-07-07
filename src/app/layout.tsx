import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "Sistem Surat",
  description: "Sistem Manajemen Surat",
  // Pastikan strukturnya bersih seperti ini
  other: {
    google: "notranslate",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster
            position="bottom-center"
            richColors
            toastOptions={{
              style: {
                fontFamily: "var(--font-figtree), sans-serif",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
