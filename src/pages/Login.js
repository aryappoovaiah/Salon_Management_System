// src/pages/Login.js
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Auth.css'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Default Admin Credentials
  const ADMIN_EMAIL = 'admin@example.com'
  const ADMIN_PASSWORD = '123456'

  // Already logged in? Go to Home
  useEffect(() => {
    if (location?.state?.info) setMsg(location.state.info)

    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data?.session) navigate('/')
    })

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) navigate('/')
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [navigate, location])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    const { email, password } = formData

    // ----------------------------
    // 1️⃣ ADMIN DEFAULT LOGIN BYPASS
    // ----------------------------
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setMsg('Admin login successful. Redirecting...')
      setLoading(false)
      navigate('/admin')
      return
    }

    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMsg(error.message)
        setLoading(false)
        return
      }

      if (data?.session || data?.user) {
        setMsg('Signed in. Redirecting...')
        setLoading(false)
        navigate('/')
        return
      }

      setMsg('Signed in. Redirecting...')
      setLoading(false)
      navigate('/')
    } catch (err) {
      console.error(err)
      setMsg('Unexpected error: ' + (err?.message || String(err)))
      setLoading(false)
    }
  }

  // Autofill admin
  const fillAdmin = () => {
    setFormData({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    setMsg("Admin credentials autofilled.")
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Welcome back</p>

        {msg && (
          <div
            style={{
              marginBottom: 12,
              padding: '8px 10px',
              borderRadius: 6,
              background: '#eef6ff',
              color: '#111',
            }}
          >
            {msg}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>

          {/* ADMIN QUICK LOGIN BUTTON */}
          <button
            type="button"
            onClick={fillAdmin}
            style={{
              marginTop: 15,
              background: '#444',
              color: 'white',
              padding: '10px',
              width: '100%',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  )
}
