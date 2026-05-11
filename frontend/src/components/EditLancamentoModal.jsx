import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, X, Check } from 'lucide-react'
import './EditLancamentoModal.css'

function EditLancamentoModal({ isOpen, lancamento, onClose, onSaved, categorias }) {
  const [formData, setFormData] = useState({
    data: '',
    valor: '',
    descricao: '',
    categoria: '',
  })
  const [categoriaSuggestions, setCategoriaSuggestions] = useState([])
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

    if (name === 'categoria') {
      // Filtrar categorias para autocomplete
      const filtered = categorias.filter(cat =>
        cat.nome.toLowerCase().includes(value.toLowerCase())
      )
      setCategoriaSuggestions(filtered)
    }

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
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="2"
              placeholder="O que foi comprado/recebido?"
            />
          </div>

          <div className="form-group">
            <label>Valor</label>
            <div className="valor-input-wrapper">
              <span className="valor-prefix">R$</span>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                step="0.01"
                placeholder="0,00"
              />
            </div>
          </div>

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
            <label>Categoria</label>
            <div className="categoria-input-wrapper">
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                placeholder="Digite uma categoria"
              />
              {formData.categoria && categoriaSuggestions.length > 0 && (
                <div className="categoria-suggestions">
                  {categoriaSuggestions.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className="categoria-suggestion"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, categoria: cat.nome }))
                        setCategoriaSuggestions([])
                      }}
                    >
                      {cat.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions-icons">
            <button
              type="button"
              onClick={handleDelete}
              className="action-icon-btn delete"
              disabled={loading}
              title="Deletar"
            >
              <Trash2 size={28} color="#ef4444" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="action-icon-btn cancel"
              disabled={loading}
              title="Cancelar"
            >
              <X size={28} color="#808080" />
            </button>
            <button
              type="submit"
              className="action-icon-btn save"
              disabled={loading}
              title="Salvar"
            >
              <Check size={28} color="#22c55e" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLancamentoModal
