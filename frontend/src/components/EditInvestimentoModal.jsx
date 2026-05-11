import React, { useState, useEffect } from 'react'
import './EditInvestimentoModal.css'

function EditInvestimentoModal({ isOpen, investimento, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    investido: '',
    valor_atual: '',
  })

  useEffect(() => {
    if (isOpen && investimento) {
      setFormData({
        investido: investimento.investido.toString(),
        valor_atual: investimento.valor_atual.toString(),
      })
    }
  }, [isOpen, investimento])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    const investido = parseFloat(formData.investido)
    const valor_atual = parseFloat(formData.valor_atual)
    const resultado = valor_atual - investido
    const percentual = ((resultado / investido) * 100).toFixed(2)

    // Aqui você pode fazer uma chamada à API se necessário
    // Por enquanto, apenas fechamos o modal
    onSaved({
      investido,
      valor_atual,
      resultado,
      percentual
    })
    onClose()
  }

  if (!isOpen || !investimento) return null

  const investido = parseFloat(formData.investido) || 0
  const valor_atual = parseFloat(formData.valor_atual) || 0
  const resultado = valor_atual - investido
  const percentual = investido > 0 ? ((resultado / investido) * 100).toFixed(2) : 0

  const fmt = (v) => {
    if (!v) return 'R$ 0,00'
    return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Investimento</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label>Valor Investido</label>
            <div className="input-currency">
              <span className="currency-prefix">R$</span>
              <input
                type="number"
                name="investido"
                value={formData.investido}
                onChange={handleChange}
                step="0.01"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Valor Atual</label>
            <div className="input-currency">
              <span className="currency-prefix">R$</span>
              <input
                type="number"
                name="valor_atual"
                value={formData.valor_atual}
                onChange={handleChange}
                step="0.01"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* RESULTADO */}
          <div className="resultado-section">
            <div className="resultado-item">
              <span className="resultado-label">Ganho/Perda</span>
              <span className={`resultado-valor ${resultado >= 0 ? 'positive' : 'negative'}`}>
                {resultado >= 0 ? '+' : '−'}{fmt(Math.abs(resultado))}
              </span>
            </div>
            <div className="resultado-item">
              <span className="resultado-label">Rentabilidade</span>
              <span className={`resultado-valor ${resultado >= 0 ? 'positive' : 'negative'}`}>
                {resultado >= 0 ? '+' : '−'}{percentual}%
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="secondary">Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditInvestimentoModal
