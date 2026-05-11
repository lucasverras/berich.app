import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Home, CreditCard, User, Activity, Plus } from 'lucide-react'
import './BottomNav.css'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsAddModalOpen } = useContext(AppContext)

  const routes = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/fatura', icon: Activity, label: 'Fatura' },
    { path: '/conta', icon: CreditCard, label: 'Conta' },
    { path: '/config', icon: User, label: 'Perfil' },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className="bottom-nav-new">
      {routes.map(route => (
        <button
          key={route.path}
          className={`nav-btn ${isActive(route.path) ? 'active' : ''}`}
          onClick={() => navigate(route.path)}
          title={route.label}
        >
          <route.icon size={24} />
        </button>
      ))}

      <button
        className="nav-add-btn"
        onClick={() => setIsAddModalOpen(true)}
        title="Adicionar"
      >
        <Plus size={28} />
      </button>
    </nav>
  )
}

export default BottomNav
