import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import './Cartao.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const LIMITE_CARTAO = 5000

function Cartao() {
  const { ano } = useContext(AppContext)
  const [mesSelecionado, setMesSelecionado] = useState(4) // Maio (índice 4)

  const meses = [
    {
      mes: 3,
      nome: 'Abril',
      fatura: 2890.50,
      transacoes: 18,
    },
    {
      mes: 4,
      nome: 'Maio',
      fatura: 3245.80,
      transacoes: 22,
    },
  ]

  const fmt = (v) => {
    if (!v) return 'R$ 0,00'
    return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const mesAtual = meses.find(m => m.mes === mesSelecionado)
  const percentual = (mesAtual.fatura / LIMITE_CARTAO) * 100
  let corProgresso = '#22c55e'
  if (percentual > 90) corProgresso = '#ef4444'
  else if (percentual > 70) corProgresso = '#eab308'

  return (
    <div className="cartao-layout">
      <div className="cartao-main">
        {/* HEADER */}
        <div className="cartao-header">
          <h1>💳 Cartão de Crédito</h1>
          <p>Acompanhe suas despesas no cartão</p>
        </div>

        {/* MONTH SELECTOR */}
        <div className="month-selector">
          {meses.map(m => (
            <button
              key={m.mes}
              className={`month-btn ${mesSelecionado === m.mes ? 'active' : ''}`}
              onClick={() => setMesSelecionado(m.mes)}
            >
              <span className="month-name">{m.nome}</span>
              <span className="month-value">{fmt(m.fatura)}</span>
            </button>
          ))}
        </div>

        {/* FATURA CARD */}
        <div className="fatura-card-big">
          <div className="card-top">
            <div>
              <div className="card-label">Fatura de {mesAtual.nome}</div>
              <div className="card-value">{fmt(mesAtual.fatura)}</div>
            </div>
            <div className="card-icon">💳</div>
          </div>

          <div className="progress-section">
            <div className="progress-info">
              <span className="progress-label">{percentual.toFixed(0)}% do limite</span>
              <span className="progress-disponivel">{fmt(LIMITE_CARTAO - mesAtual.fatura)} disponível</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(percentual, 100)}%`, background: corProgresso }}></div>
            </div>
          </div>

          <div className="card-details">
            <div className="detail-item">
              <span className="detail-label">Limite</span>
              <span className="detail-value">{fmt(LIMITE_CARTAO)}</span>
            </div>
            <div className="detail-divider"></div>
            <div className="detail-item">
              <span className="detail-label">Transações</span>
              <span className="detail-value">{mesAtual.transacoes}</span>
            </div>
            <div className="detail-divider"></div>
            <div className="detail-item">
              <span className="detail-label">Vencimento</span>
              <span className="detail-value">Dia 10</span>
            </div>
          </div>
        </div>

        {/* RESUMO */}
        <div className="resumo-section">
          <h2 className="section-title">Resumo por Categoria</h2>
          <div className="resumo-grid">
            <div className="resumo-item">
              <div className="resumo-icon">🍔</div>
              <div className="resumo-info">
                <div className="resumo-label">Alimentação</div>
                <div className="resumo-value">R$ 856,30</div>
              </div>
            </div>
            <div className="resumo-item">
              <div className="resumo-icon">🛍️</div>
              <div className="resumo-info">
                <div className="resumo-label">Compras</div>
                <div className="resumo-value">R$ 542,10</div>
              </div>
            </div>
            <div className="resumo-item">
              <div className="resumo-icon">🚗</div>
              <div className="resumo-info">
                <div className="resumo-label">Transporte</div>
                <div className="resumo-value">R$ 234,50</div>
              </div>
            </div>
            <div className="resumo-item">
              <div className="resumo-icon">⚡</div>
              <div className="resumo-info">
                <div className="resumo-label">Assinatura</div>
                <div className="resumo-value">R$ 189,90</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cartao
