// src/pages/Signup.js
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Auth.css'

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If already signed-in, go to Home
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
  }, [navigate])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const createProfileIfNeeded = async (userId, fullName) => {
    if (!userId) return
    try {
      const { error } = await supabase.from('profiles').insert([{ id: userId, full_name: fullName }])
      if (error) {
        console.warn('Profile insert failed', error)
      }
    } catch (err) {
      console.error('Unexpected profile error', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    try {
      // Try signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) {
        setMsg(signUpError.message)
        setLoading(false)
        return
      }

      // If signup returned a session/user (email confirm disabled), redirect to Home
      const possibleUser = signUpData?.user ?? signUpData?.session?.user ?? null
      const possibleSession = signUpData?.session ?? null

      if (possibleSession || possibleUser) {
        const userId = possibleUser?.id ?? possibleSession?.user?.id ?? null
        await createProfileIfNeeded(userId, formData.name)
        setMsg('Account created. Redirecting to Home...')
        setLoading(false)
        navigate('/')
        return
      }

      // Otherwise signup likely requires email confirmation: redirect to Login with message
      setMsg('Sign-up initiated. Please confirm your email. Check your inbox (and spam).')
      setLoading(false)
      // Redirect to login so user can attempt sign-in after confirmation
      navigate('/login', { replace: true, state: { info: 'Please confirm your email before logging in.' } })
    } catch (err) {
      console.error(err)
      setMsg('Unexpected error: ' + (err?.message || String(err)))
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Sign Up</h1>
        <p className="auth-subtitle">Create your account to book appointments</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: 12, color: msg?.toLowerCase().includes('error') ? 'crimson' : '#333' }}>{msg}</div>
      </div>
    </div>
  )
}
