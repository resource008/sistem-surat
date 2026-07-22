"use client"

import Image from "next/image"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { LogoutNotifier } from "@/components/auth/logout-notifier"
import styles from "./login.module.css"

const LOGO_WIDTH = 1523
const LOGO_HEIGHT = 1246

export function LoginPage() {
  return (
    <div className={styles.root}>
      <Suspense>
        <LogoutNotifier />
      </Suspense>

      <div className={styles.bgImage} />
      <div className={styles.bgOverlay} />

      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Image
              src="/sipef_logo.svg"
              alt="Logo SIPEF"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              className={styles.logo}
              priority
            />
            <h1 className={styles.cardTitle}>Sistem Registrasi Surat Masuk dan Lacak Surat</h1>
            <p className={styles.cardSubtitle}>Masukkan username dan password anda</p>
          </div>

          <div className={styles.divider} />

          <LoginForm />

          <div className={styles.cardFooter}>
            <span>PT Tolan Tiga Indonesia</span>
          </div>
        </div>
      </div>
    </div>
  )
}
