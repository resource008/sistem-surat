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
})

export const metadata: Metadata = {
  title: "Sistem Surat",
  description: "Sistem Manajemen Surat",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${figtree.className} ${figtree.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster
            position="bottom-right"
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