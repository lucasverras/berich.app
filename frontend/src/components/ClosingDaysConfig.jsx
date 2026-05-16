import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import './ClosingDaysConfig.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function ClosingDaysConfig() {
  const { diasFechamento, updateFechamentoDia } = useContext(AppContext)

  const handleChange = (mes, value) => {
    const dia = parseInt(value, 10)
    if (dia >= 1 && dia <= 31) {
      updateFechamentoDia(mes, dia)
    }
  }

  return (
    <div className="closing-days-config">
      <div className="config-header">
        <h3>Dia de fechamento da fatura</h3>
        <p>Defina em que dia do mês sua fatura fecha para cada mês</p>
      </div>

      <div className="days-grid">
        {MESES.map((mes, idx) => {
          const mesNum = idx + 1
          const diaAtual = diasFechamento[mesNum] || 1

          return (
            <div key={mesNum} className="day-input-group">
              <label>{mes}</label>
              <div className="day-input-wrapper">
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={diaAtual}
                  onChange={(e) => handleChange(mesNum, e.target.value)}
                  className="day-input"
                />
                <span className="day-label">de cada mês</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ClosingDaysConfig
