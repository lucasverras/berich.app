import React, { useState } from 'react'
import './Itau.css'

function Itau() {
  const [abaSelecionada, setAbaSelecionada] = useState('visao-geral')

  const fmt = (v) => {
    if (!v) return 'R$ 0,00'
    return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const contas = [
    {
      id: 1,
      tipo: 'Conta Corrente',
      numero: '12345-6',
      agencia: '1234',
      saldo: 3890.50,
      icon: '💼',
    },
    {
      id: 2,
      tipo: 'Poupança',
      numero: '12345-8',
      agencia: '1234',
      saldo: 12500.00,
      icon: '🏦',
    },
  ]

  const transacoes = [
    { id: 1, desc: 'Transferência Enviada', valor: -500.00, data: '2026-05-15', icon: '📤' },
    { id: 2, desc: 'Depósito Recebido', valor: 2000.00, data: '2026-05-14', icon: '📥' },
    { id: 3, desc: 'Saque', valor: -300.00, data: '2026-05-13', icon: '💵' },
    { id: 4, desc: 'DOC Enviado', valor: -1500.00, data: '2026-05-12', icon: '📄' },
  ]

  return (
    <div className="itau-layout">
      <div className="itau-main">
        {/* HEADER */}
        <div className="itau-header">
          <h1>🏛️ Itaú Unibanco</h1>
          <p>Saldo consolidado de suas contas</p>
        </div>

        {/* SALDO TOTAL */}
        <div className="saldo-total-card">
          <div className="saldo-label">Saldo Total</div>
          <div className="saldo-valor">{fmt(3890.50 + 12500.00)}</div>
          <div className="saldo-sub">2 contas</div>
        </div>

        {/* ABAS */}
        <div className="tabs">
          <button
            className={`tab-btn ${abaSelecionada === 'visao-geral' ? 'active' : ''}`}
            onClick={() => setAbaSelecionada('visao-geral')}
          >
            Visão Geral
          </button>
          <button
            className={`tab-btn ${abaSelecionada === 'contas' ? 'active' : ''}`}
            onClick={() => setAbaSelecionada('contas')}
          >
            Contas
          </button>
          <button
            className={`tab-btn ${abaSelecionada === 'transacoes' ? 'active' : ''}`}
            onClick={() => setAbaSelecionada('transacoes')}
          >
            Transações
          </button>
        </div>

        {/* CONTEÚDO */}
        {abaSelecionada === 'visao-geral' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">💼</div>
                <div className="stat-info">
                  <div className="stat-label">Conta Corrente</div>
                  <div className="stat-value">{fmt(3890.50)}</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🏦</div>
                <div className="stat-info">
                  <div className="stat-label">Poupança</div>
                  <div className="stat-value">{fmt(12500.00)}</div>
                </div>
              </div>
            </div>

            <h3 className="section-title">Últimas Movimentações</h3>
            <div className="transacoes-list">
              {transacoes.map(t => (
                <div key={t.id} className="transacao-item">
                  <div className="transacao-left">
                    <span className="transacao-icon">{t.icon}</span>
                    <div className="transacao-info">
                      <div className="transacao-desc">{t.desc}</div>
                      <div className="transacao-data">{t.data}</div>
                    </div>
                  </div>
                  <div className={`transacao-valor ${t.valor > 0 ? 'positivo' : 'negativo'}`}>
                    {t.valor > 0 ? '+' : ''}{fmt(t.valor)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'contas' && (
          <div className="tab-content">
            <div className="contas-lista">
              {contas.map(conta => (
                <div key={conta.id} className="conta-item">
                  <div className="conta-header">
                    <span className="conta-icon">{conta.icon}</span>
                    <div className="conta-details">
                      <div className="conta-tipo">{conta.tipo}</div>
                      <div className="conta-numero">Ag. {conta.agencia} · CC {conta.numero}</div>
                    </div>
                  </div>
                  <div className="conta-saldo">{fmt(conta.saldo)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'transacoes' && (
          <div className="tab-content">
            <div className="transacoes-list">
              {transacoes.map(t => (
                <div key={t.id} className="transacao-item">
                  <div className="transacao-left">
                    <span className="transacao-icon">{t.icon}</span>
                    <div className="transacao-info">
                      <div className="transacao-desc">{t.desc}</div>
                      <div className="transacao-data">{t.data}</div>
                    </div>
                  </div>
                  <div className={`transacao-valor ${t.valor > 0 ? 'positivo' : 'negativo'}`}>
                    {t.valor > 0 ? '+' : ''}{fmt(t.valor)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Itau
