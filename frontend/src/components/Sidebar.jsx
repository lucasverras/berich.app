import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import './Sidebar.css'

function Sidebar() {
  const [pendentes, setPendentes] = useState(0)
  const location = useLocation()

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
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <h1>BE.RICH</h1>
      </div>

      <nav className="sidebar-nav">
        <Link to="/fatura" className={`nav-item ${isActive('/fatura') ? 'active' : ''}`}>
          💳 Fatura
        </Link>
        <Link to="/conta" className={`nav-item ${isActive('/conta') ? 'active' : ''}`}>
          🏦 Conta
        </Link>
        <div className="sidebar-divider" />
        <Link to="/revisar" className={`nav-item ${isActive('/revisar') ? 'active' : ''}`}>
          🔍 Revisar {pendentes > 0 && <span className="counter">{pendentes}</span>}
        </Link>
        <Link to="/config" className={`nav-item ${isActive('/config') ? 'active' : ''}`}>
          ⚙️ Configurações
        </Link>
      </nav>

      <div className="sidebar-footer">
        <a href="/mobile" target="_blank" rel="noopener noreferrer" className="mobile-link">
          📱 Versão Mobile
        </a>
      </div>
    </aside>
  )
}

export default Sidebar
