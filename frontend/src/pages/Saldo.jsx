import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import './Saldo.css'

function Saldo() {
  const { bancoAtivo } = useContext(AppContext)
  const [resumo, setResumo] = useState({
    saldoTotal: 15420.80,
    entradas: 10000.00,
    saidas: 2390.80,
    investimentos: 3030.00,
  })

  const fmt = (v) => {
    if (!v) return 'R$ 0,00'
    return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const contas = [
    {
      id: 1,
      banco: 'C6 Bank',
      tipo: 'Corrente',
      saldo: 5240.30,
      icon: '🏦',
      cor: '#22c55e',
    },
    {
      id: 2,
      banco: 'Nu Bank',
      tipo: 'Corrente',
      saldo: 8190.50,
      icon: '🟣',
      cor: '#a855f7',
    },
    {
      id: 3,
      banco: 'Itaú',
      tipo: 'Poupança',
      saldo: 1990.00,
      icon: '🏛️',
      cor: '#3b82f6',
    },
  ]

  return (
    <div className="saldo-layout">
      <div className="saldo-main">
        {/* HEADER */}
        <div className="saldo-header">
          <h1>💰 Saldo Total</h1>
          <p>Visão consolidada de todas as contas</p>
        </div>

        {/* HERO CARD */}
        <div className="saldo-hero">
          <div className="hero-card total">
            <div className="hero-label">Saldo Total</div>
            <div className="hero-value">{fmt(resumo.saldoTotal)}</div>
            <div className="hero-sub">Todas as contas</div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-icon stat-icon-green">↑</div>
            <div className="stat-label">Entradas</div>
            <div className="stat-value positive">{fmt(resumo.entradas)}</div>
            <div className="stat-sub">Mês atual</div>
          </div>

          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-icon stat-icon-red">↓</div>
            <div className="stat-label">Saídas</div>
            <div className="stat-value negative">{fmt(resumo.saidas)}</div>
            <div className="stat-sub">Mês atual</div>
          </div>

          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-icon stat-icon-blue">📈</div>
            <div className="stat-label">Investimentos</div>
            <div className="stat-value">{fmt(resumo.investimentos)}</div>
            <div className="stat-sub">Em produtos</div>
          </div>
        </div>

        {/* CONTAS */}
        <div className="contas-section">
          <h2 className="section-title">Contas</h2>
          <div className="contas-grid">
            {contas.map(conta => (
              <div key={conta.id} className="conta-card" style={{ borderTopColor: conta.cor }}>
                <div className="conta-header">
                  <span className="conta-icon">{conta.icon}</span>
                  <span className="conta-tipo">{conta.tipo}</span>
                </div>
                <div className="conta-banco">{conta.banco}</div>
                <div className="conta-saldo">{fmt(conta.saldo)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Saldo
