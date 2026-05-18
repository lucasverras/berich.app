import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Home, CreditCard, Wallet, TrendingUp, Eye, Settings, ChevronRight, X, Smartphone } from 'lucide-react'
import './Sidebar.css'

function Sidebar() {
  const [pendentes, setPendentes] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  )
  const location = useLocation()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      const width = sidebarOpen ? '160px' : '70px'
      document.documentElement.style.setProperty('--sidebar-w', width)
    }
  }, [sidebarOpen])

  useEffect(() => {
    fetchPendentes()
    const interval = setInterval(fetchPendentes, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchPendentes = async () => {
    try {
      const response = await axios.get('/api/import/pendentes')
      setPendentes(response.data.length)
    } catch (error) {
      console.error('Erro ao buscar pendentes:', error)
    }
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/home', icon: Home, label: 'Início' },
    { path: '/fatura', icon: CreditCard, label: 'Fatura' },
    { path: '/conta', icon: Wallet, label: 'Conta' },
    { path: '/investimentos', icon: TrendingUp, label: 'Investimentos' },
  ]

  const otherItems = [
    { path: '/revisar', icon: Eye, label: 'Revisar', badge: pendentes > 0 ? pendentes : null },
    { path: '/config', icon: Settings, label: 'Configurações' },
  ]

  return (
    <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">BE.RICH</span>
        </div>
        <button className="sidebar-close" onClick={() => setSidebarOpen(!sidebarOpen)} title={sidebarOpen ? 'Fechar' : 'Abrir'}>
          {sidebarOpen ? <X size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-label">PRINCIPAL</div>
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={24} className="nav-icon" />
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-section">
          <div className="nav-label">OUTROS</div>
          {otherItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={24} className="nav-icon" />
              <span className="nav-text">
                {item.label}
                {item.badge && <span className="badge">{item.badge}</span>}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <a href="/mobile" target="_blank" rel="noopener noreferrer" className="mobile-link">
          <Smartphone size={16} />
          <span>Versão Mobile</span>
        </a>
      </div>
    </aside>
  )
}

export default Sidebar
