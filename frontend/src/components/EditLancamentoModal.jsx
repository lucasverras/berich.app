import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './EditLancamentoModal.css'

function EditLancamentoModal({ isOpen, lancamento, onClose, onSaved, categorias }) {
  const [formData, setFormData] = useState({
    data: '',
    valor: '',
    descricao: '',
    categoria: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && lancamento) {
      setFormData({
        data: lancamento.data,
        valor: lancamento.valor.toString(),
        descricao: lancamento.descricao || '',
        categoria: lancamento.categoria || '',
      })
    }
  }, [isOpen, lancamento])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    if (!formData.data || !formData.valor) {
      alert('Preencha data e valor')
      return
    }

    setLoading(true)
    try {
      await axios.put(`/api/lancamentos/${lancamento.id}`, {
        data: formData.data,
        valor: parseFloat(formData.valor),
        descricao: formData.descricao,
        categoria: formData.categoria || null,
      })
      onSaved()
      onClose()
    } catch (error) {
      console.error('Erro ao editar:', error)
      alert('Erro ao editar lançamento')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que quer deletar este lançamento?')) {
      return
    }

    setLoading(true)
    try {
      await axios.delete(`/api/lancamentos/${lancamento.id}`)
      onSaved()
      onClose()
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar lançamento')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !lancamento) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Lançamento</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Valor</label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select name="categoria" value={formData.categoria} onChange={handleChange}>
              <option value="">Sem categoria</option>
              {categorias && categorias.map(cat => (
                <option key={cat.id} value={cat.nome}>{cat.nome}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleDelete} className="delete-btn" disabled={loading}>
              Deletar
            </button>
            <div className="button-group">
              <button type="button" onClick={onClose} className="secondary" disabled={loading}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLancamentoModal
