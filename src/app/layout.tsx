import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-figtree",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sistem Registrasi Surat Masuk dan Lacak Surat",
  description: "Sistem Registrasi Surat Masuk dan Lacak Surat",
  // Pastikan strukturnya bersih seperti ini
  other: {
    google: "notranslate",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={figtree.variable} suppressHydrationWarning>
      <body className={figtree.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                fontFamily: 'var(--font-figtree, "Figtree", sans-serif)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
