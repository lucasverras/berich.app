import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { transacoesData } from '../data/transacoes'
import { getCategoryColor } from '../data/categoriesStore'
import './Itau.css'

const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Itau() {
  const { mes, ano } = useContext(AppContext)
  const [abaSelecionada, setAbaSelecionada] = useState('transacoes')
  const [transacoes, setTransacoes] = useState([])
  const [resumo, setResumo] = useState({ entradas: 0, mensal: 0, pontual: 0 })

  useEffect(() => {
    const itauTransacoes = transacoesData['Itaú'] || []

    const transacoesMes = itauTransacoes
      .sort((a, b) => new Date(b.data || '2000-01-01') - new Date(a.data || '2000-01-01'))

    setTransacoes(transacoesMes)

    let mensal = 0
    let pontual = 0
    let total = 0

    transacoesMes.forEach(t => {
      if (t.categoria === 'MENSAL') {
        mensal += t.valor || 0
      } else if (t.categoria === 'PONTUAL') {
        pontual += t.valor || 0
      }
      total += t.valor || 0
    })

    setResumo({
      entradas: total,
      mensal,
      pontual
    })
  }, [mes, ano])

  return (
    <div className="itau-layout">
      <div className="itau-main">
        {/* HEADER */}
        <div className="itau-header">
          <h1>🏛️ Itaú Unibanco</h1>
          <p>Conta gerenciada</p>
        </div>

        {/* SALDO TOTAL */}
        <div className="saldo-total-card">
          <div className="saldo-label">Renda Total</div>
          <div className="saldo-valor positive">{fmt(resumo.entradas)}</div>
          <div className="saldo-sub">{transacoes.length} transações</div>
        </div>

        {/* ABAS */}
        <div className="tabs">
          <button
            className={`tab-btn ${abaSelecionada === 'resumo' ? 'active' : ''}`}
            onClick={() => setAbaSelecionada('resumo')}
          >
            Resumo
          </button>
          <button
            className={`tab-btn ${abaSelecionada === 'transacoes' ? 'active' : ''}`}
            onClick={() => setAbaSelecionada('transacoes')}
          >
            Transações
          </button>
        </div>

        {/* CONTEÚDO */}
        {abaSelecionada === 'resumo' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <div className="stat-label">Mensal</div>
                  <div className="stat-value positive">{fmt(resumo.mensal)}</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <div className="stat-label">Pontual</div>
                  <div className="stat-value positive">{fmt(resumo.pontual)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'transacoes' && (
          <div className="tab-content">
            <h3 className="section-title">Todas as Transações</h3>
            {transacoes.length === 0 ? (
              <div className="card empty-state">
                <p>Sem transações</p>
              </div>
            ) : (
              <div className="transacoes-list">
                {transacoes.map((t, idx) => {
                  const catColor = getCategoryColor(t.categoria)
                  const emoji = t.categoria === 'MENSAL' ? '📅' : t.categoria === 'PONTUAL' ? '⚡' : '📌'

                  return (
                    <div
                      key={idx}
                      className="transacao-item"
                      style={{
                        backgroundColor: `${catColor}15`,
                        borderLeftColor: catColor,
                        borderLeftWidth: '3px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '16px', minWidth: 'fit-content' }}>{emoji}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                          <span>{t.motivo}</span>
                          <span style={{ fontSize: '12px', color: catColor }}>{t.categoria}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'fit-content' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {t.data}
                        </span>
                        <span className="positive">{fmt(t.valor)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Itau
