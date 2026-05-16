import React, { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import './AddModal.css'

function AddModal({ isOpen, onClose, onLancamentoAdded, defaultTipo = 'cartão' }) {
  const { bancoAtivo, mesAno } = useContext(AppContext)
  const modalRef = useRef(null)

  const getInitialTipo = () => {
    if (isOpen) {
      const stored = sessionStorage.getItem('addModalDefaultTipo')
      if (stored) {
        sessionStorage.removeItem('addModalDefaultTipo')
        return stored
      }
    }
    return localStorage.getItem('lastAddedTipo') || defaultTipo
  }

  const [tipo, setTipo] = useState(getInitialTipo())
  const [categorias, setCategorias] = useState([])
  const [categoriaSuggestions, setCategoriaSuggestions] = useState([])
  const [showCustomParcelas, setShowCustomParcelas] = useState(false)
  const [formData, setFormData] = useState({
    valor: '',
    data: new Date().toISOString().split('T')[0],
    motivo: '',
    categoria: '',
    parcelado: false,
    parcelas: '1',
  })

  useEffect(() => {
    if (isOpen) {
      fetchCategorias()
      const initialTipo = getInitialTipo()
      setTipo(initialTipo)
      setFormData({
        valor: '',
        data: new Date().toISOString().split('T')[0],
        motivo: '',
        categoria: '',
        parcelado: false,
        parcelas: '1',
      })
      setShowCustomParcelas(false)
    }
  }, [isOpen, defaultTipo])

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/api/categorias')
      setCategorias(response.data)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  const formatCurrency = (value) => {
    if (!value) return ''
    const numValue = value.replace(/\D/g, '')
    if (numValue.length === 0) return ''
    const paddedValue = numValue.padStart(3, '0')
    const floatValue = parseInt(paddedValue, 10) / 100
    return floatValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'valor') {
      const numericValue = value.replace(/\D/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }))
    } else if (name === 'categoria') {
      const filtered = categorias.filter(cat =>
        cat.nome.toLowerCase().includes(value.toLowerCase())
      )
      setCategoriaSuggestions(filtered)
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleTipoChange = (novoTipo) => {
    setTipo(novoTipo)
    localStorage.setItem('lastAddedTipo', novoTipo)
  }

  const handleParcelasSelect = (parcelas) => {
    setFormData(prev => ({ ...prev, parcelas: String(parcelas) }))
    setShowCustomParcelas(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.valor || !formData.data) {
      alert('Preencha valor e data')
      return
    }

    if (formData.categoria && !categorias.find(cat => cat.nome === formData.categoria)) {
      alert('Categoria deve estar na lista de sugestões')
      return
    }

    try {
      const payload = {
        descricao: formData.motivo,
        valor: tipo === 'saída' ? -parseFloat(formData.valor) / 100 : parseFloat(formData.valor) / 100,
        categoria: formData.categoria || 'Sem categoria',
        data: formData.data,
        tipo: tipo === 'cartão' ? 'saída' : tipo,
        forma_pagamento: tipo === 'cartão' ? 'cartão' : 'pix',
        banco: bancoAtivo,
        parcelado: formData.parcelado,
        parcelas: formData.parcelado ? parseInt(formData.parcelas) : 1,
      }

      await axios.post('/api/lancamentos', payload)
      onLancamentoAdded()
      onClose()
    } catch (error) {
      console.error('Erro ao adicionar:', error)
      alert('Erro ao adicionar lançamento')
    }
  }

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

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal" ref={modalRef}>
          <div className="modal-header">
            <h2 className="modal-title">Adicionar Movimentação</h2>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            {/* Tipo Selector */}
            <div className="tipo-selector">
              {['cartão', 'entrada', 'saída'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTipoChange(t)}
                  className="tipo-btn"
                  style={{
                    background: tipo === t ? '#22c55e' : 'transparent',
                    color: tipo === t ? '#000' : '#22c55e',
                    borderColor: tipo === t ? '#22c55e' : 'rgba(34, 197, 94, 0.4)',
                  }}
                >
                  {t === 'entrada' ? 'Entrada' : t === 'saída' ? 'Saída' : 'Cartão'}
                </button>
              ))}
            </div>

            {/* Descrição */}
            <div className="form-group">
              <label htmlFor="motivo" className="form-label">Descrição</label>
              <textarea
                id="motivo"
                name="motivo"
                value={formData.motivo}
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
                  type="text"
                  name="valor"
                  value={formatCurrency(formData.valor)}
                  onChange={handleChange}
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

            {/* Parcelado */}
            {tipo !== 'entrada' && (
              <label className="parcelado-label">
                <input
                  type="checkbox"
                  name="parcelado"
                  checked={formData.parcelado}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, parcelado: e.target.checked }))
                    if (e.target.checked) {
                      setShowCustomParcelas(false)
                    }
                  }}
                />
                <span>Parcelado</span>
              </label>
            )}

            {/* Parcelas Options */}
            {formData.parcelado && tipo !== 'entrada' && (
              <div className="parcelas-section">
                {!showCustomParcelas ? (
                  <>
                    <div className="parcelas-quick-select">
                      {[2, 3, 5, 6, 12].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleParcelasSelect(p)}
                          className={`parcelas-btn ${
                            formData.parcelas === String(p) ? 'parcelas-btn-selected' : ''
                          }`}
                        >
                          {p}x
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCustomParcelas(true)}
                      className="parcelas-outro-btn"
                    >
                      Outro
                    </button>
                  </>
                ) : (
                  <div className="parcelas-custom-section">
                    <input
                      type="number"
                      name="parcelas"
                      value={formData.parcelas}
                      onChange={handleChange}
                      min="1"
                      max="48"
                      placeholder="Digite a quantidade"
                      autoFocus
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomParcelas(false)}
                      className="parcelas-confirm-btn"
                    >
                      Confirmar
                    </button>
                  </div>
                )}

                {formData.parcelas && formData.valor && (
                  <div className="parcelas-info">
                    <p className="parcelas-info-title">Valor por parcela: <strong>{formatCurrency(String(Math.round(parseInt(formData.valor) / parseInt(formData.parcelas))))}</strong></p>
                    <p className="parcelas-info-date">Começa em: {new Date(formData.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-submit">
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddModal
