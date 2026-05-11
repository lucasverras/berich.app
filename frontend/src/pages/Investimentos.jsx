import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Investimentos.css'

const CATEGORIAS_ICONS = {
  'Criptomoedas': '₿',
  'Renda Fixa': '📊',
  'Títulos Públicos': '🏛️',
  'Poupança': '💾',
  'Fundos': '🏢',
  'Ações': '📈',
  'Conta Corrente': '🏦'
}

const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Investimentos() {
  const navigate = useNavigate()

  const investimentosInitial = [
    {
      id: 1,
      nome: 'Bitcoin',
      categoria: 'Criptomoedas',
      investido: 2000,
      valor_atual: 2450,
      primeiro_aporte: '10/03/2026',
      ultimo_aporte: '15/05/2026',
      observacoes: 'Mantendo como ativo de longo prazo'
    },
    {
      id: 2,
      nome: 'CDB Itaú',
      categoria: 'Renda Fixa',
      investido: 5000,
      valor_atual: 5180,
      primeiro_aporte: '02/01/2026',
      ultimo_aporte: '20/04/2026',
      observacoes: 'Vencimento em 12 meses'
    },
    {
      id: 3,
      nome: 'Tesouro Selic',
      categoria: 'Títulos Públicos',
      investido: 3500,
      valor_atual: 3610,
      primeiro_aporte: '15/02/2026',
      ultimo_aporte: '30/05/2026',
      observacoes: 'Rendimento diário'
    },
    {
      id: 4,
      nome: 'Reserva de Emergência',
      categoria: 'Poupança',
      investido: 4000,
      valor_atual: 4080,
      primeiro_aporte: '01/01/2026',
      ultimo_aporte: '25/05/2026',
      observacoes: '6 meses de gastos'
    },
    {
      id: 5,
      nome: 'Fundo Imobiliário',
      categoria: 'Fundos',
      investido: 2500,
      valor_atual: 2410,
      primeiro_aporte: '15/03/2026',
      ultimo_aporte: '10/05/2026',
      observacoes: 'Distribuição mensal de dividendos'
    },
    {
      id: 6,
      nome: 'Ações (IBOV)',
      categoria: 'Ações',
      investido: 3000,
      valor_atual: 3150,
      primeiro_aporte: '01/04/2026',
      ultimo_aporte: '20/05/2026',
      observacoes: 'Carteira diversificada'
    },
    {
      id: 7,
      nome: 'C6 Bank',
      categoria: 'Conta Corrente',
      investido: 5000,
      valor_atual: 5000,
      primeiro_aporte: '15/01/2026',
      ultimo_aporte: '01/05/2026',
      observacoes: 'Reserva em conta corrente'
    },
    {
      id: 8,
      nome: 'Itaú',
      categoria: 'Conta Corrente',
      investido: 2500,
      valor_atual: 2500,
      primeiro_aporte: '10/02/2026',
      ultimo_aporte: '15/05/2026',
      observacoes: 'Conta do banco principal'
    },
    {
      id: 9,
      nome: 'Nubank',
      categoria: 'Conta Corrente',
      investido: 1500,
      valor_atual: 1500,
      primeiro_aporte: '20/03/2026',
      ultimo_aporte: '10/05/2026',
      observacoes: 'Cartão de crédito'
    }
  ]

  const [investimentos] = useState(investimentosInitial.map(inv => ({
    ...inv,
    icone: CATEGORIAS_ICONS[inv.categoria] || '📈'
  })))

  const totalInvestido = investimentos.reduce((sum, inv) => sum + inv.investido, 0)
  const totalAtual = investimentos.reduce((sum, inv) => sum + inv.valor_atual, 0)
  const rendimento = totalAtual - totalInvestido

  const handleInvestimentoClick = (investimento) => {
    navigate(`/investimentos/${investimento.id}`, { state: { investimento } })
  }

  return (
    <div className="investimentos-layout">
      <div className="investimentos-main">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <h1>
              <span className="header-icon">📈</span>
              Investimentos
            </h1>
            <p>Acompanhe seus ativos e evolução patrimonial</p>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-corner-decoration" style={{ background: 'radial-gradient(circle, #9c27b0, transparent)' }}></div>
            <div className="stat-icon stat-icon-purple">💰</div>
            <div className="stat-label">Total Investido</div>
            <div className="stat-value">{fmt(totalInvestido)}</div>
            <div className="stat-sub">Capital inicial</div>
          </div>

          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-corner-decoration" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}></div>
            <div className="stat-icon stat-icon-blue">💎</div>
            <div className="stat-label">Valor Atual</div>
            <div className="stat-value">{fmt(totalAtual)}</div>
            <div className="stat-sub">Patrimônio total</div>
          </div>

          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-corner-decoration" style={{ background: `radial-gradient(circle, ${rendimento >= 0 ? '#4ade80' : '#f87171'}, transparent)` }}></div>
            <div className={`stat-icon ${rendimento >= 0 ? 'stat-icon-green' : 'stat-icon-red'}`}>📊</div>
            <div className="stat-label">Rendimento</div>
            <div className={`stat-value ${rendimento >= 0 ? 'positive' : 'negative'}`}>{rendimento >= 0 ? '+' : '−'}{fmt(Math.abs(rendimento))}</div>
            <div className="stat-sub">{((rendimento / totalInvestido) * 100).toFixed(2)}% ganho</div>
          </div>
        </div>

        {/* INVESTIMENTOS */}
        <div className="investimentos-section">
          <div className="section-header">
            <h2 className="section-title">Meus Investimentos</h2>
            <span className="section-count">{investimentos.length} ativos</span>
          </div>

          <div className="investimentos-grid">
            {investimentos.map((inv) => {
              const rendInv = inv.valor_atual - inv.investido
              const pctInv = ((rendInv / inv.investido) * 100).toFixed(2)
              return (
                <div
                  key={inv.id}
                  className="investimento-card"
                  onClick={() => handleInvestimentoClick(inv)}
                  role="button"
                >
                  <div className="inv-icon">{CATEGORIAS_ICONS[inv.categoria] || '📈'}</div>
                  <h3 className="inv-nome">{inv.nome}</h3>
                  <p className="inv-categoria">{inv.categoria}</p>

                  <div className="inv-valores">
                    <div className="inv-val">
                      <span className="inv-label">Investido</span>
                      <span className="inv-number">{fmt(inv.investido)}</span>
                    </div>
                    <div className="inv-val">
                      <span className="inv-label">Atual</span>
                      <span className={`inv-number ${rendInv >= 0 ? 'positive' : 'negative'}`}>{fmt(inv.valor_atual)}</span>
                    </div>
                  </div>

                  <div className={`inv-badge ${rendInv >= 0 ? 'positive' : 'negative'}`}>
                    {rendInv >= 0 ? '+' : '−'}{fmt(Math.abs(rendInv))} ({pctInv}%)
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

export default Investimentos
