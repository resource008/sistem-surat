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
    errors,
    setUsername,
    setPassword,
    setShowPassword,
    handleSubmit,
  } = useLoginForm()

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Username</label>
        <div className={styles.inputWrapper}>
          <User className={styles.inputIcon} size={16} />
          <input
            className={`${styles.fieldInput} ${errors.username ? styles.fieldInputError : ""}`}
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoComplete="username"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "login-username-error" : undefined}
          />
        </div>
        {errors.username && !errors.form ? (
          <p id="login-username-error" className={styles.fieldError}>{errors.username}</p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Password</label>
        <div className={styles.inputWrapper}>
          <Lock className={styles.inputIcon} size={16} />
          <input
            className={`${styles.fieldInput} ${errors.password ? styles.fieldInputError : ""}`}
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-password-error" : undefined}
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
        {errors.password && !errors.form ? (
          <p id="login-password-error" className={styles.fieldError}>{errors.password}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className={styles.formError}>{errors.form}</p>
      ) : null}

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? <Loader2 size={16} className={styles.spinner} /> : "Masuk"}
      </button>
    </form>
  )
}
