import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header({ onReload }) {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="brand">VibeCheck</div>
      <nav className="nav">
        <button className="ghost" onClick={onReload}>Refresh</button>
        {user ? (
          <>
            <span className="hello">Hi, {user.name}</span>
            <button className="ghost" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="ghost">Login</Link>
            <Link to="/signup" className="ghost">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  )
}
