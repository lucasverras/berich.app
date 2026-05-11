import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './BottomNav.css'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showAddMenu, setShowAddMenu] = React.useState(false)

  const routes = [
    { path: '/home', icon: '🏠', label: 'Home' },
    { path: '/fatura', icon: '💳', label: 'Fatura' },
    { path: '/conta', icon: '💰', label: 'Saldo' },
    { path: '/investimentos', icon: '📈', label: 'Investimentos' },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <>
      <nav className="bottom-nav-glass">
        {routes.map(route => (
          <button
            key={route.path}
            className={`nav-item ${isActive(route.path) ? 'active' : ''}`}
            onClick={() => {
              navigate(route.path)
              setShowAddMenu(false)
            }}
            title={route.label}
          >
            <span className="nav-icon">{route.icon}</span>
          </button>
        ))}
      </nav>

      <button
        className="nav-add-floating"
        onClick={() => setShowAddMenu(!showAddMenu)}
        title="Adicionar"
      >
        <span>➕</span>
      </button>

      {showAddMenu && (
        <div className="add-menu">
          <button
            className="add-option entrada"
            onClick={() => {
              navigate('/home')
              setShowAddMenu(false)
            }}
          >
            <span>↓</span> Entrada
          </button>
          <button
            className="add-option saida"
            onClick={() => {
              navigate('/home')
              setShowAddMenu(false)
            }}
          >
            <span>↑</span> Saída
          </button>
        </div>
      )}
    </>
  )
}

export default BottomNav
