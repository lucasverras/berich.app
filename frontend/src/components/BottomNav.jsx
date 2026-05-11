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

  // Determinar defaultTipo baseado na página atual
  const getDefaultTipo = () => {
    if (location.pathname.startsWith('/fatura')) return 'cartão'
    if (location.pathname.startsWith('/conta')) return 'saída'
    return 'cartão' // padrão: cartão para /home e outras
  }

  const handleAddClick = () => {
    // Armazenar o defaultTipo na sessão para o AddModal usar
    sessionStorage.setItem('addModalDefaultTipo', getDefaultTipo())
    setIsAddModalOpen(true)
  }

  return (
    <nav className="bottom-nav-new">
      {routes.map(route => (
        <button
          key={route.path}
          className={`nav-btn ${isActive(route.path) ? 'active' : ''}`}
          onClick={() => navigate(route.path)}
          title={route.label}
        >
          <route.icon size={28} />
        </button>
      ))}

      <button
        className="nav-add-btn"
        onClick={handleAddClick}
        title="Adicionar"
      >
        <Plus size={28} />
      </button>
    </nav>
  )
}

export default BottomNav
