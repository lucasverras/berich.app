import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { transacoesData } from '../data/transacoes'
import './Itau.css'

const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function VamoNessa() {
  const { mes, ano } = useContext(AppContext)
  const [saldoDisponivel, setSaldoDisponivel] = useState(0)

  useEffect(() => {
    const vamoNessaData = transacoesData['Vamo Nessa SP'] || []
    
    if (vamoNessaData.length > 0) {
      const saldoInicial = vamoNessaData[0].valor || 0
      setSaldoDisponivel(saldoInicial)
    }
  }, [mes, ano])

  return (
    <div className="itau-layout">
      <div className="itau-main">
        {/* HEADER */}
        <div className="itau-header">
          <h1>💜 Vamo Nessa SP</h1>
          <p>Conta gerenciada</p>
        </div>

        {/* SALDO DISPONÍVEL */}
        <div className="saldo-total-card">
          <div className="saldo-label">Saldo Disponível</div>
          <div className="saldo-valor positive">{fmt(saldoDisponivel)}</div>
          <div className="saldo-sub">Saldo em conta</div>
        </div>

        {/* INFORMAÇÕES */}
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">💜</div>
              <div className="stat-info">
                <div className="stat-label">Status</div>
                <div className="stat-value">Ativa</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-label">Saldo Total</div>
                <div className="stat-value positive">{fmt(saldoDisponivel)}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Gerencie suas finanças na Vamo Nessa SP. Seu saldo atual é de <strong>{fmt(saldoDisponivel)}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VamoNessa
