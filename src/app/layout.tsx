import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-plus-jakarta-sans",
})

export const metadata: Metadata = {
  title: "Sistem Surat",
  description: "Sistem Manajemen Surat",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${plusJakartaSans.className} ${plusJakartaSans.variable}`}>
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
                fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}