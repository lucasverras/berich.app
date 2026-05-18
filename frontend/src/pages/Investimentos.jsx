import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Investimentos.css'

const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const BANCOS = [
  'C6 BANK',
  'ITAU',
  'VAMO NESSA',
  'MERCADO LIVRE',
  'CRIPTOMOEDAS',
  'POUPANÇA',
  'TESOURO'
]

function Investimentos() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [investimentos, setInvestimentos] = useState([
    { id: 1, banco: 'C6 BANK', descricao: 'PAI LCA 91.5% JULHO 26', valor: 148000.90 },
    { id: 2, banco: 'C6 BANK', descricao: 'C6 CRÉDITO', valor: 5246.44 },
    { id: 3, banco: 'C6 BANK', descricao: 'CDB C6 APLICADO 20/3', valor: 5000.00 },
    { id: 4, banco: 'C6 BANK', descricao: 'INVEST C6 CRÉDITO', valor: 3300.00 },
    { id: 5, banco: 'C6 BANK', descricao: 'BONUS MOSAIC CDB C6 APLICADO 21/3', valor: 3000.00 },
    { id: 6, banco: 'C6 BANK', descricao: 'BONUS MOSAIC CDB C6 APLICADO 21/3', valor: 4000.00 },
    { id: 7, banco: 'ITAU', descricao: 'ITAU CDB', valor: 20044.00 },
    { id: 8, banco: 'ITAU', descricao: 'LCL ECOM', valor: 4510.00 },
    { id: 9, banco: 'VAMO NESSA', descricao: 'VAMO NESSA', valor: 2207.29 },
    { id: 10, banco: 'MERCADO LIVRE', descricao: 'ML 106% +14/7/2026', valor: 11520.00 },
    { id: 11, banco: 'CRIPTOMOEDAS', descricao: 'BINANCE BTC', valor: 10702.31 },
    { id: 12, banco: 'CRIPTOMOEDAS', descricao: 'WORLD COIN BTC', valor: 391.00 },
    { id: 13, banco: 'POUPANÇA', descricao: 'COFRINHO 120% CDI', valor: 10000.00 },
    { id: 14, banco: 'POUPANÇA', descricao: '110% cdi 6 meses - 16/03/2026', valor: 4600.00 },
    { id: 15, banco: 'POUPANÇA', descricao: '19/11 2025 caixinha nu bank turbo 115', valor: 5000.00 },
    { id: 16, banco: 'POUPANÇA', descricao: '19/11/2025 reserva de emergência', valor: 5000.00 }
  ])

  const [novoInvestimento, setNovoInvestimento] = useState({
    banco: BANCOS[0],
    descricao: '',
    valor: ''
  })

  // Agrupar por banco
  const investPorBanco = {}
  BANCOS.forEach(banco => {
    investPorBanco[banco] = investimentos.filter(i => i.banco === banco)
  })

  // Total geral
  const totalGeral = investimentos.reduce((sum, i) => sum + i.valor, 0)

  const handleAddInvestimento = () => {
    if (!novoInvestimento.descricao || !novoInvestimento.valor) {
      alert('Preencha descrição e valor')
      return
    }
    const novo = {
      id: Math.max(...investimentos.map(i => i.id), 0) + 1,
      banco: novoInvestimento.banco,
      descricao: novoInvestimento.descricao,
      valor: parseFloat(novoInvestimento.valor)
    }
    setInvestimentos([...investimentos, novo])
    setNovoInvestimento({ banco: BANCOS[0], descricao: '', valor: '' })
    setShowModal(false)
  }

  return (
    <div className="investimentos-layout">
      <div className="investimentos-main">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <h1>💼 Investimentos</h1>
            <p>Total: {fmt(totalGeral)}</p>
          </div>
          <button className="btn-adicionar" onClick={() => setShowModal(true)}>
            + Adicionar
          </button>
        </div>

        {/* INVESTIMENTOS POR BANCO */}
        <div className="investimentos-container">
          {BANCOS.map((banco) => {
            const itens = investPorBanco[banco]
            if (itens.length === 0) return null

            const totalBanco = itens.reduce((sum, i) => sum + i.valor, 0)

            return (
              <div key={banco} className="banco-card">
                <div className="banco-titulo">
                  <h2>{banco}</h2>
                  <span className="banco-total">{fmt(totalBanco)}</span>
                </div>

                <div className="investimentos-lista">
                  {itens.map((inv) => (
                    <div key={inv.id} className="investimento-row">
                      <div className="inv-valor">{fmt(inv.valor)}</div>
                      <div className="inv-banco">{inv.banco}</div>
                      <div className="inv-descricao">{inv.descricao}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar Investimento</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>BANCO</label>
                <select
                  value={novoInvestimento.banco}
                  onChange={(e) => setNovoInvestimento({...novoInvestimento, banco: e.target.value})}
                >
                  {BANCOS.map(banco => (
                    <option key={banco} value={banco}>{banco}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>DESCRIÇÃO</label>
                <input
                  type="text"
                  placeholder="Ex: CDB 120%"
                  value={novoInvestimento.descricao}
                  onChange={(e) => setNovoInvestimento({...novoInvestimento, descricao: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>VALOR</label>
                <input
                  type="number"
                  placeholder="0,00"
                  value={novoInvestimento.valor}
                  onChange={(e) => setNovoInvestimento({...novoInvestimento, valor: e.target.value})}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={handleAddInvestimento}>Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Investimentos
