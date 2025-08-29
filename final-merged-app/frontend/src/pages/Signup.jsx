import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true); setError('')
      await signup(name, email, password)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="title">Create your account</h1>
      <p className="subtitle">Join the battle arena</p>
      <form onSubmit={onSubmit} className="form">
        <input className="input" type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
      </form>
      <div className="switch">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  )
}
