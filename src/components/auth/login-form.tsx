"use client"

import { Eye, EyeOff, Lock, Loader2, User } from "lucide-react"
import { useLoginForm } from "@/hooks/use-login-form"
import styles from "./login.module.css"

export function LoginForm() {
  const {
    username,
    password,
    loading,
    showPassword,
    setUsername,
    setPassword,
    setShowPassword,
    handleSubmit,
  } = useLoginForm()

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="username">
          Username
        </label>
        <div className={styles.inputWrapper}>
          <User className={styles.inputIcon} size={16} />
          <input
            id="username"
            name="username"
            className={styles.fieldInput}
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoComplete="username"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="password">
          Password
        </label>
        <div className={styles.inputWrapper}>
          <Lock className={styles.inputIcon} size={16} />
          <input
            id="password"
            name="password"
            className={styles.fieldInput}
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? <Loader2 size={16} className={styles.spinner} /> : "Masuk"}
      </button>
    </form>
  )
}
