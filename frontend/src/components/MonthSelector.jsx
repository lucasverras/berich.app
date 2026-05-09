import React from 'react'
import './MonthSelector.css'

function MonthSelector({ mesAno, onMesChange, onAnoChange }) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  const handlePrevYear = () => {
    onAnoChange(mesAno.ano - 1)
  }

  const handleNextYear = () => {
    onAnoChange(mesAno.ano + 1)
  }

  const handleMonthClick = (monthIndex) => {
    onMesChange(monthIndex + 1)
  }

  return (
    <div className="month-selector">
      <div className="month-selector-header">
        <button className="month-nav" onClick={handlePrevYear}>&lt;</button>
        <span className="year-display">{mesAno.ano}</span>
        <button className="month-nav" onClick={handleNextYear}>&gt;</button>
      </div>
      <div className="months-grid">
        {months.map((month, index) => (
          <button
            key={month}
            className={`month-pill ${mesAno.mes === index + 1 ? 'active' : ''}`}
            onClick={() => handleMonthClick(index)}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MonthSelector
