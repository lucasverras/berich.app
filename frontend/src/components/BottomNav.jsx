import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './BottomNav.css'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const routes = [
    { path: '/home', icon: '🏠', label: 'Home' },
    { path: '/fatura', icon: '💳', label: 'Fatura' },
    { path: '/conta', icon: '💰', label: 'Conta' },
    { path: '/investimentos', icon: '📈', label: 'Investimentos' },
    { path: '/config', icon: '⚙️', label: 'Config' },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className="bottom-nav">
      {routes.map(route => (
        <button
          key={route.path}
          className={`nav-item ${isActive(route.path) ? 'active' : ''}`}
          onClick={() => navigate(route.path)}
          title={route.label}
        >
          <span className="nav-icon">{route.icon}</span>
          <span className="nav-label">{route.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
