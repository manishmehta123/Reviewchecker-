import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import OwnerPanel from "./pages/OwnerPanel";
import api from "./api";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };
  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/">Home</Link>
      {user && <Link to="/dashboard">Dashboard</Link>}
      {user?.role === "owner" && <Link to="/owner">Owner</Link>}
      <div style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <span style={{ marginRight: 8 }}>Hello, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            {" | "}
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.get("/auth/me").then(res => setUser(res.data)).catch(()=>{});
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/owner" element={user?.role === "owner" ? <OwnerPanel /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
