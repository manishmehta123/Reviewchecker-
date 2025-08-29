import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true); setError('')
      await login(email, password)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="title">Welcome to VibeCheck</h1>
      <p className="subtitle">Login to continue</p>
      <form onSubmit={onSubmit} className="form">
        <input className="input" type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <div className="switch">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  )
}
