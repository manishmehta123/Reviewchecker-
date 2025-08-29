import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import UploadBattle from './components/UploadBattle.jsx'
import Header from './components/Header.jsx'
import BattleCard from './components/BattleCard.jsx'
import { useAuth } from './context/AuthContext.jsx'
import api from './api.js'
import { useEffect, useState } from 'react'

export default function App() {
  const { user } = useAuth()
  const [battles, setBattles] = useState([])

  const loadBattles = async () => {
    const { data } = await api.get('/battles')
    setBattles(data)
  }

  useEffect(() => {
    loadBattles()
  }, [])

  return (
    <div className="app">
      <Header onReload={loadBattles} />
      <Routes>
        <Route path="/" element={
          <div className="container">
            {user && <UploadBattle onUploaded={loadBattles} />}
            <h2 className="section-title">Live Battles</h2>
            <div className="battle-list">
              {battles.map(b => (
                <BattleCard key={b._id} battle={b} onChange={loadBattles} />
              ))}
            </div>
            {battles.length === 0 && (
              <div className="empty">No battles yet. {user ? 'Upload your first one!' : <Link to="/signup">Sign up to upload.</Link>}</div>
            )}
          </div>
        } />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      </Routes>
    </div>
  )
}
