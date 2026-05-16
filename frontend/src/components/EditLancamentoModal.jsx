import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Trash2 } from 'lucide-react'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import './EditLancamentoModal.css'

function EditLancamentoModal({ isOpen, lancamento, onClose, onSaved, categorias }) {
  const modalRef = useRef(null)
  const [formData, setFormData] = useState({
    data: '',
    valor: '',
    descricao: '',
    categoria: '',
  })
  const [categoriaSuggestions, setCategoriaSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

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

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirmed = () => {
    setIsDeleteModalOpen(false)
    onSaved()
    onClose()
  }

  if (!isOpen || !lancamento) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal" ref={modalRef}>
          <div className="modal-header">
            <h2 className="modal-title">Editar Lançamento</h2>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="modal-form">
            {/* Descrição */}
            <div className="form-group">
              <label htmlFor="descricao" className="form-label">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="O que foi comprado/recebido?"
                className="form-input textarea"
              />
            </div>

            {/* Valor */}
            <div className="form-group">
              <label htmlFor="valor" className="form-label">Valor</label>
              <div className="valor-input-group">
                <span className="currency-symbol">R$</span>
                <input
                  id="valor"
                  type="number"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="0,00"
                  className="form-input"
                />
              </div>
            </div>

            {/* Data */}
            <div className="form-group">
              <label htmlFor="data" className="form-label">Data</label>
              <input
                id="data"
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Categoria */}
            <div className="form-group">
              <label htmlFor="categoria" className="form-label">Categoria</label>
              <div className="categoria-wrapper">
                <input
                  id="categoria"
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  placeholder="Digite uma categoria"
                  className="form-input"
                />
                {formData.categoria && categoriaSuggestions.length > 0 && (
                  <div className="categoria-suggestions">
                    {categoriaSuggestions.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        className="suggestion-item"
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

            {/* Footer */}
            <div className="modal-footer modal-footer-edit">
              <button
                type="button"
                onClick={handleDeleteClick}
                className="btn-delete"
                disabled={loading}
              >
                <Trash2 size={16} />
              </button>
              <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        lancamento={lancamento}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleDeleteConfirmed}
      />
    </>
  )
}

export default EditLancamentoModal
