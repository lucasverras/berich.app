import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import './BottomNav.css'
import homeIcon from '../assets/icons/home-1 1.svg'
import faturasIcon from '../assets/icons/cartões.svg'
import saldoIcon from '../assets/icons/saldo.svg'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsAddModalOpen } = useContext(AppContext)

  const routes = [
    { path: '/home', icon: homeIcon, label: 'Home' },
    { path: '/fatura', icon: faturasIcon, label: 'Fatura' },
    { path: '/conta', icon: saldoIcon, label: 'Saldo' },
    { path: '/investimentos', icon: '📈', label: 'Investimentos' },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
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
          <div className="nav-item-content">
            {typeof route.icon === 'string' && route.icon.includes('svg') ? (
              <img src={route.icon} alt={route.label} className="nav-icon-svg" />
            ) : (
              <span className="nav-icon">{route.icon}</span>
            )}
          </div>
        </button>
      ))}

      <button
        className="nav-item nav-add-btn"
        onClick={() => setIsAddModalOpen(true)}
        title="Adicionar"
      >
        <span className="add-icon">+</span>
      </button>
    </nav>
  )
}

export default BottomNav
