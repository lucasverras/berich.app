import React from 'react'
import './MonthSelector.css'

function MonthSelector({ mesAno, onMesChange, onAnoChange }) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const monthsFullNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  // Detectar mês atual do sistema
  const mesAtual = new Date().getMonth() + 1 // retorna 1-12 (janeiro=1, maio=5, etc)

  // Apenas mostrar meses a partir de abril (índice 3)
  const startMonth = 3 // Abril = índice 3
  const visibleMonths = months.slice(startMonth)

  const handlePrevYear = () => {
    onAnoChange(mesAno.ano - 1)
  }

  const handleNextYear = () => {
    onAnoChange(mesAno.ano + 1)
  }

  const handleMonthClick = (monthIndex) => {
    onMesChange(monthIndex + startMonth + 1) // Ajusta para o índice real (1-12)
  }

  return (
    <div className="month-selector">
      <div className="month-selector-header">
        <button className="month-nav" onClick={handlePrevYear}>&lt;</button>
        <span className="year-display">{mesAno.ano}</span>
        <button className="month-nav" onClick={handleNextYear}>&gt;</button>
      </div>
      <div className="months-grid">
        {visibleMonths.map((month, index) => {
          const realMonthIndex = index + startMonth + 1 // Mês real (1-12)
          return (
            <button
              key={month}
              className={`month-pill ${mesAtual === realMonthIndex ? 'active' : ''}`}
              onClick={() => handleMonthClick(index)}
            >
              {month}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthSelector
