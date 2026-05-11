import React from 'react'
import './FecharFaturaModal.css'

function FecharFaturaModal({ isOpen, mesAtual, onClose, onConfirm }) {
  if (!isOpen) return null

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const proximoMes = mesAtual === 12 ? 1 : mesAtual + 1
  const nomeProximoMes = monthNames[proximoMes - 1]

  return (
    <div className="fechar-fatura-overlay">
      <div className="fechar-fatura-modal">
        <div className="modal-header">
          <h2>Fechar Fatura</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="icon-info">💳</div>
          <h3>Tem certeza que deseja fechar a fatura?</h3>
          <p className="modal-message">
            As transações de {monthNames[mesAtual - 1]} serão arquivadas e uma nova fatura será iniciada para {nomeProximoMes}.
          </p>

          <div className="info-box">
            <span className="label">Mês atual:</span>
            <span className="value">{monthNames[mesAtual - 1]}</span>
            <span className="label">Próximo mês:</span>
            <span className="value">{nomeProximoMes}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Fechar Fatura
          </button>
        </div>
      </div>
    </div>
  )
}

export default FecharFaturaModal
