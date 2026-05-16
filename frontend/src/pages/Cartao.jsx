import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { transacoesData } from '../data/transacoes'
import { getCategoryColor, getCategoryEmoji } from '../data/categoriesStore'
import './Cartao.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const LIMITE_CARTAO = 5000

function Cartao() {
  const { ano } = useContext(AppContext)
  const [mesSelecionado, setMesSelecionado] = useState(4) // Maio (índice 4)
  const [meses, setMeses] = useState([
    { mes: 3, nome: 'Abril', fatura: 0, transacoes: 0 },
    { mes: 4, nome: 'Maio', fatura: 0, transacoes: 0 },
  ])
  const [resumoPorCategoria, setResumoPorCategoria] = useState({})

  useEffect(() => {
    // Calculate fatura for each month
    const novosMeses = MESES.slice(0, 2).map((nome, idx) => {
      const mesNum = idx + 3 // Abril = 3, Maio = 4
      const sheetKey = `${nome} Cartão ${ano}`
      const transacoes = transacoesData[sheetKey] || []

      const saidas = transacoes
        .filter(t => t.tipo === 'saída')
        .reduce((sum, t) => sum + Math.abs(t.valor), 0)

      return {
        mes: mesNum,
        nome,
        fatura: saidas,
        transacoes: transacoes.filter(t => t.tipo === 'saída').length,
      }
    })

    setMeses(novosMeses)

    // Calculate resumo by category for selected month
    const mesNome = MESES[mesSelecionado - 1]
    const sheetKey = `${mesNome} Cartão ${ano}`
    const transacoes = transacoesData[sheetKey] || []

    const categorias = {}
    transacoes
      .filter(t => t.tipo === 'saída')
      .forEach(t => {
        const cat = t.categoria || 'Sem categoria'
        if (!categorias[cat]) {
          categorias[cat] = 0
        }
        categorias[cat] += Math.abs(t.valor)
      })

    setResumoPorCategoria(categorias)
  }, [ano, mesSelecionado])

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
            {Object.entries(resumoPorCategoria)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(([categoria, valor]) => {
                const emojis = {
                  'PARA MIM': '💇',
                  'PRESENTES': '🎁',
                  'OUTROS': '📌',
                  'COMIDA': '🍔',
                  'BEBIDAS': '🍷',
                  'UBER': '🚗',
                  'ESTACIONAMENTO': '🅿️',
                  'GASOLINA': '⛽',
                  'VIAGENS': '✈️',
                  'FESTAS': '🎉',
                  'VESTUÁRIO': '👕',
                  'APOSTAS': '🎰',
                  'INVESTIDO': '📈',
                  'GANHOS': '💰',
                  'MENSAL': '📅',
                  'KAU': '👤',
                  'LCL': '👤',
                  'POD': '🎙️',
                  'CARTÃO': '💳',
                  'NAVEGANDOSP': '💻',
                }
                const catColor = getCategoryColor(categoria)
                return (
                  <div key={categoria} className="resumo-item" style={{
                    backgroundColor: `${catColor}15`,
                    borderTopColor: catColor,
                    borderTopWidth: '3px'
                  }}>
                    <div className="resumo-icon" style={{ color: catColor }}>{emojis[categoria] || '📌'}</div>
                    <div className="resumo-info">
                      <div className="resumo-label" style={{ color: catColor }}>{categoria}</div>
                      <div className="resumo-value">{fmt(valor)}</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cartao
