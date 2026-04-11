"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  collapsed?: boolean;
}

function applyThemeWithoutFlicker(setTheme: (t: string) => void, next: string) {
  const style = document.documentElement.style;
  style.setProperty("--transition-override", "none");
  document.documentElement.classList.add("no-transition");
  setTheme(next);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("no-transition");
      style.removeProperty("--transition-override");
    });
  });
}

export function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false)

  // Tunggu sampai client mount agar resolvedTheme tersedia
  // dan output server == client (hindari hydration mismatch)
  useEffect(() => { setMounted(true) }, [])

  // Sebelum mount: render placeholder dengan ukuran sama tapi konten netral
  // supaya tidak ada mismatch antara server dan client
  if (!mounted) {
    return (
      <button
        aria-label="Toggle tema"
        disabled
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: collapsed ? "10px 0" : "10px 14px",
          borderRadius: "10px",
          color: "var(--sidebar-foreground)",
          fontSize: "14px",
          fontWeight: 500,
          width: "100%",
          cursor: "pointer",
          background: "transparent",
          border: "1px solid transparent",
          justifyContent: collapsed ? "center" : "flex-start",
          opacity: 0, // invisible tapi tetap occupy space
        }}
      >
        <span style={{ width: 18, height: 18, flexShrink: 0 }} />
        {!collapsed && <span style={{ whiteSpace: "nowrap" }}>Mode</span>}
      </button>
    )
  }

  const isDark = resolvedTheme === "dark"

  const handleToggle = () => {
    applyThemeWithoutFlicker(setTheme, isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: collapsed ? "10px 0" : "10px 14px",
        borderRadius: "10px",
        color: "var(--sidebar-foreground)",
        fontSize: "14px",
        fontWeight: 500,
        width: "100%",
        cursor: "pointer",
        background: "transparent",
        border: "1px solid transparent",
        justifyContent: collapsed ? "center" : "flex-start",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--sidebar-accent)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent"
      }}
    >
      <span style={{ position: "relative", width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Sun
          size={18}
          strokeWidth={1.8}
          style={{
            position: "absolute",
            opacity: isDark ? 0 : 1,
            transform: isDark ? "scale(0.6)" : "scale(1)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        />
        <Moon
          size={18}
          strokeWidth={1.8}
          style={{
            position: "absolute",
            opacity: isDark ? 1 : 0,
            transform: isDark ? "scale(1)" : "scale(0.6)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        />
      </span>

      {!collapsed && (
        <span style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {isDark ? "Mode Terang" : "Mode Gelap"}
        </span>
      )}
    </button>
  )
}