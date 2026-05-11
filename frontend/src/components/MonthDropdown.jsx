import React, { useState, useRef, useEffect } from 'react'
import './MonthDropdown.css'

function MonthDropdown({ mesAno, onMesAnoChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Detectar mês atual do sistema
  const mesAtual = new Date().getMonth() + 1 // retorna 1-12 (janeiro=1, maio=5, etc)

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const monthNamesShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  const handleMonthSelect = (mes) => {
    onMesAnoChange({ mes, ano: mesAno.ano })
    setIsOpen(false)
  }

  const handleYearChange = (direction) => {
    onMesAnoChange({ mes: mesAno.mes, ano: mesAno.ano + direction })
  }

  const displayText = monthNames[mesAno.mes - 1]

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="month-dropdown-container" ref={dropdownRef}>
      <button
        className="month-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="dropdown-text">{displayText}</span>
        <svg className={`dropdown-icon ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="month-dropdown-menu">
          <div className="dropdown-year-selector">
            <button className="year-nav-btn" onClick={() => handleYearChange(-1)}>←</button>
            <span className="dropdown-year">{mesAno.ano}</span>
            <button className="year-nav-btn" onClick={() => handleYearChange(1)}>→</button>
          </div>

          <div className="months-grid">
            {monthNamesShort.map((month, index) => (
              <button
                key={month}
                className={`month-option ${mesAtual === index + 1 ? 'active' : ''}`}
                onClick={() => handleMonthSelect(index + 1)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MonthDropdown
