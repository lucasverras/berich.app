import React, { useState } from 'react'
import './NuBank.css'

function NuBank() {
  const [abaSelecionada, setAbaSelecionada] = useState('visao-geral')

  const fmt = (v) => {
    if (!v) return 'R$ 0,00'
    return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const contas = [
    {
      id: 1,
      tipo: 'Conta Corrente',
      numero: '98765-4',
      saldo: 8190.50,
      icon: '💜',
    },
  ]

  const transacoes = [
    { id: 1, desc: 'Pix Enviado', valor: -450.00, data: '2026-05-15', icon: '📤' },
    { id: 2, desc: 'Cashback Recebido', valor: 125.50, data: '2026-05-14', icon: '🎁' },
    { id: 3, desc: 'Compra no Débito', valor: -89.90, data: '2026-05-13', icon: '🛒' },
    { id: 4, desc: 'Salário Recebido', valor: 5500.00, data: '2026-05-12', icon: '💰' },
    { id: 5, desc: 'Pix Recebido', valor: 320.00, data: '2026-05-11', icon: '📥' },
  ]

  return (
    <div className="nubank-layout">
      <div className="nubank-main">
        {/* HEADER */}
        <div className="nubank-header">
          <h1>🟣 Nu Bank</h1>
          <p>Sua conta digital do Nu Bank</p>
        </div>

        {/* SALDO TOTAL */}
        <div className="saldo-total-card purple">
          <div className="saldo-label">Saldo em Conta</div>
          <div className="saldo-valor">{fmt(8190.50)}</div>
          <div className="saldo-sub">Disponível para usar</div>
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
            className={`tab-btn ${abaSelecionada === 'transacoes' ? 'active' : ''}`}
            onClick={() => setAbaSelecionada('transacoes')}
          >
            Transações
          </button>
          <button
            className={`tab-btn ${abaSelecionada === 'info' ? 'active' : ''}`}
            onClick={() => setAbaSelecionada('info')}
          >
            Informações
          </button>
        </div>

        {/* CONTEÚDO */}
        {abaSelecionada === 'visao-geral' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">💜</div>
                <div className="stat-info">
                  <div className="stat-label">Conta Corrente</div>
                  <div className="stat-value">{fmt(8190.50)}</div>
                </div>
              </div>
            </div>

            <h3 className="section-title">Últimas Movimentações</h3>
            <div className="transacoes-list">
              {transacoes.slice(0, 3).map(t => (
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

            <h3 className="section-title">Benefícios</h3>
            <div className="beneficios-grid">
              <div className="beneficio-item">
                <div className="beneficio-icon">🎁</div>
                <div className="beneficio-title">Cashback</div>
                <div className="beneficio-desc">Ganhe em suas compras</div>
              </div>
              <div className="beneficio-item">
                <div className="beneficio-icon">📱</div>
                <div className="beneficio-title">100% Digital</div>
                <div className="beneficio-desc">Tudo na palma da mão</div>
              </div>
              <div className="beneficio-item">
                <div className="beneficio-icon">🔒</div>
                <div className="beneficio-title">Segurança</div>
                <div className="beneficio-desc">Proteção total 24/7</div>
              </div>
              <div className="beneficio-item">
                <div className="beneficio-icon">🆓</div>
                <div className="beneficio-title">Sem Taxas</div>
                <div className="beneficio-desc">Conta e cartão grátis</div>
              </div>
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

        {abaSelecionada === 'info' && (
          <div className="tab-content">
            <div className="info-card">
              <h3 className="info-title">Dados da Conta</h3>
              <div className="info-item">
                <span className="info-label">Banco</span>
                <span className="info-value">Nu Banco de Pagamentos S.A.</span>
              </div>
              <div className="info-item">
                <span className="info-label">Agência</span>
                <span className="info-value">0001</span>
              </div>
              <div className="info-item">
                <span className="info-label">Conta</span>
                <span className="info-value">98765-4</span>
              </div>
              <div className="info-item">
                <span className="info-label">CPF</span>
                <span className="info-value">000.000.000-00</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NuBank
