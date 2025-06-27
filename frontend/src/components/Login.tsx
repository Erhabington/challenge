"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { login, register } from "../store/slices/authSlice"

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "viewer" as "hr" | "viewer",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegister) {
      dispatch(register(formData))
    } else {
      dispatch(login({ email: formData.email, password: formData.password }))
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Branding */}
        <div>
          <div className="login-logo">
          <img
            src="/PayScope.png" 
            alt="PayScope Logo"
            style={{
              height: "5rem",
              width: "5rem",
              objectFit: "contain",
            }}
          />
        </div>
          <h1 className="login-title">PayScope</h1>
          <p className="login-subtitle">
            {isRegister ? "Create a new account to get started" : "Manage payroll & time-off with ease"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field input-large"
              placeholder="you@example.com"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field input-large"
              placeholder="••••••••"
            />
          </div>

          {isRegister && (
            <div className="login-form-group">
              <label htmlFor="role" className="login-label">
                Select Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "hr" | "viewer" })}
                className="input-field input-large"
              >
                <option value="viewer">Viewer</option>
                <option value="hr">HR</option>
              </select>
            </div>
          )}

          {error && (
            <div className="login-error">
              <div className="login-error-content">
                <span className="login-error-icon">⚠</span>
                <span className="login-error-text">{error}</span>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary btn-large" style={{ width: "100%" }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="loading-spinner">⏳</span>
                Processing...
              </div>
            ) : isRegister ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-toggle">
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="login-toggle-button">
            {isRegister ? "Already have an account? Sign in" : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
