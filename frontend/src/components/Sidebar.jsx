import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import Icons from './Icons'
import './Sidebar.css'

function Sidebar() {
  const [pendentes, setPendentes] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  )
  const location = useLocation()

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', sidebarOpen ? '214px' : '64px')
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

  return (
    <aside className={`sidebar glass ${!sidebarOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {sidebarOpen ? (
            <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
              <text x="10" y="48" fontFamily="Space Grotesk, sans-serif" fontSize="48" fontWeight="700" letterSpacing="-2" fill="url(#logoGradient)">BE.RICH</text>
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%">
                  <stop offset="0%" stopColor="#5df575" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <div className="logo-short">B</div>
          )}
        </div>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} title={sidebarOpen ? 'Recolher' : 'Expandir'}>
          {sidebarOpen ? <Icons.ChevronDown size={18} /> : <Icons.Menu size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-label">Principal</div>

          <Link to="/home" className={`nav-item ${isActive('/home') ? 'active' : ''}`} data-label="Início">
            <div className="nav-icon">🏠</div>
            <span className="nav-label">Início</span>
          </Link>
          <Link to="/fatura" className={`nav-item ${isActive('/fatura') ? 'active' : ''}`} data-label="Fatura">
            <div className="nav-icon">💳</div>
            <span className="nav-label">Fatura</span>
          </Link>
          <Link to="/conta" className={`nav-item ${isActive('/conta') ? 'active' : ''}`} data-label="Conta">
            <div className="nav-icon">💰</div>
            <span className="nav-label">Conta</span>
          </Link>
          <Link to="/investimentos" className={`nav-item ${isActive('/investimentos') ? 'active' : ''}`} data-label="Investimentos">
            <div className="nav-icon">📈</div>
            <span className="nav-label">Investimentos</span>
          </Link>

          <div className="sidebar-divider" />
          <div className="nav-label">Outros</div>

          <Link to="/revisar" className={`nav-item ${isActive('/revisar') ? 'active' : ''}`} data-label="Revisar">
            <div className="nav-icon">👁️</div>
            <span className="nav-label">Revisar {pendentes > 0 && <span className="counter">{pendentes}</span>}</span>
          </Link>
          <Link to="/config" className={`nav-item ${isActive('/config') ? 'active' : ''}`} data-label="Configurações">
            <div className="nav-icon">⚙️</div>
            <span className="nav-label">Configurações</span>
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        <a href="/mobile" target="_blank" rel="noopener noreferrer" className="mobile-link">
          <Icons.Smartphone size={18} />
          Versão Mobile
        </a>
      </div>
    </aside>
  )
}

export default Sidebar
