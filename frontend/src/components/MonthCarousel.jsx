import React, { useRef, useEffect } from 'react'
import './MonthCarousel.css'

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function MonthCarousel({ mesSelecionado, onChange }) {
  const containerRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    // Centralizar mês ativo
    const el = itemRefs.current[mesSelecionado]
    const container = containerRef.current
    if (el && container) {
      const offset = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
      container.scrollTo({ left: offset, behavior: 'smooth' })
    }
  }, [mesSelecionado])

  const getStyle = (index) => {
    const dist = Math.abs(index - mesSelecionado)
    const opacity = dist === 0 ? 1 : dist === 1 ? 0.6 : dist === 2 ? 0.25 : 0.08
    const fontSize = dist === 0 ? '17px' : dist === 1 ? '15px' : dist === 2 ? '13px' : '12px'
    const fontWeight = dist === 0 ? '700' : dist === 1 ? '500' : '400'
    const color = dist === 0 ? '#ffffff' : '#86efac'
    return { opacity, fontSize, fontWeight, color, transition: 'all 0.3s ease' }
  }

  return (
    <div className="month-carousel-wrapper">
      <div className="month-carousel" ref={containerRef}>
        {MESES.map((mes, i) => (
          <div
            key={mes}
            ref={el => itemRefs.current[i] = el}
            className={`month-carousel-item ${i === mesSelecionado ? 'active' : ''}`}
            style={getStyle(i)}
            onClick={() => onChange(i)}
          >
            <span className="month-carousel-label">
              {mes.slice(0, 3)}
            </span>
            {i === mesSelecionado && <div className="month-carousel-dot" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthCarousel
