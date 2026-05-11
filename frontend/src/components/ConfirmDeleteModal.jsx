import React from 'react'
import axios from 'axios'
import '../styles/ConfirmDeleteModal.css'

function ConfirmDeleteModal({ isOpen, lancamento, onClose, onDeleted }) {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState(null)

  const handleDelete = async () => {
    if (!lancamento) return

    setIsDeleting(true)
    setError(null)

    try {
      await axios.delete(`/api/lancamentos/${lancamento.id}`)
      setIsDeleting(false)
      onDeleted()
      onClose()
    } catch (err) {
      setIsDeleting(false)
      setError(err.response?.data?.message || 'Erro ao deletar lançamento. Tente novamente.')
    }
  }

  if (!isOpen || !lancamento) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar exclusão</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="delete-warning">
            <span className="warning-icon">⚠️</span>
            <p>Tem certeza que deseja deletar este lançamento?</p>
          </div>

          <div className="delete-preview">
            <div className="preview-row">
              <span className="preview-label">Descrição</span>
              <span className="preview-value">{lancamento.descricao}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Valor</span>
              <span className="preview-value">{lancamento.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Data</span>
              <span className="preview-value">{new Date(lancamento.data).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <p className="delete-notice">Esta ação não pode ser desfeita.</p>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
