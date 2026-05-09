import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import './AddModal.css'

function AddModal({ isOpen, onClose, onLancamentoAdded, defaultTipo = 'saída' }) {
  const { bancoAtivo } = useContext(AppContext)
  const [tipo, setTipo] = useState(defaultTipo)
  const [categorias, setCategorias] = useState([])
  const [formData, setFormData] = useState({
    valor: '',
    data: new Date().toISOString().split('T')[0],
    motivo: '',
    categoria: '',
  })

  useEffect(() => {
    if (isOpen) {
      fetchCategorias()
      setTipo(defaultTipo)
      setFormData({
        valor: '',
        data: new Date().toISOString().split('T')[0],
        motivo: '',
        categoria: '',
      })
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTipoChange = (novoTipo) => {
    setTipo(novoTipo)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.valor || !formData.motivo) {
      alert('Preencha valor e motivo')
      return
    }

    try {
      const valor = parseFloat(formData.valor)
      let lancamentoTipo, formaPagamento, lancamentoValor

      if (tipo === 'cartão') {
        lancamentoTipo = 'saída'
        formaPagamento = 'cartão'
        lancamentoValor = Math.abs(valor)
      } else if (tipo === 'entrada') {
        lancamentoTipo = 'entrada'
        formaPagamento = 'pix'
        lancamentoValor = Math.abs(valor)
      } else {
        lancamentoTipo = 'saída'
        formaPagamento = 'pix'
        lancamentoValor = Math.abs(valor)
      }

      await axios.post('/api/lancamentos', {
        data: formData.data,
        valor: lancamentoValor,
        tipo: lancamentoTipo,
        categoria: formData.categoria || null,
        banco: bancoAtivo,
        descricao: formData.motivo,
        forma_pagamento: formaPagamento,
      })

      setFormData({
        valor: '',
        data: new Date().toISOString().split('T')[0],
        motivo: '',
        categoria: '',
      })

      onLancamentoAdded()
      onClose()
    } catch (error) {
      console.error('Erro ao criar lançamento:', error)
      alert('Erro ao criar lançamento')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Adicionar Lançamento</h2>

        <div className="tipo-tags">
          <button
            type="button"
            className={`tipo-tag ${tipo === 'cartão' ? 'active' : ''}`}
            onClick={() => handleTipoChange('cartão')}
          >
            💳 CARTÃO DE CRÉDITO
          </button>
          <button
            type="button"
            className={`tipo-tag ${tipo === 'entrada' ? 'active' : ''}`}
            onClick={() => handleTipoChange('entrada')}
          >
            💰 ENTRADA
          </button>
          <button
            type="button"
            className={`tipo-tag ${tipo === 'saída' ? 'active' : ''}`}
            onClick={() => handleTipoChange('saída')}
          >
            📤 SAÍDA
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Valor</label>
            <input
              type="number"
              name="valor"
              step="0.01"
              value={formData.valor}
              onChange={handleChange}
              placeholder="0.00"
            />
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
            <label>Motivo/Descrição</label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Descrição do lançamento"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select name="categoria" value={formData.categoria} onChange={handleChange}>
              <option value="">Sem categoria</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nome}>{cat.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="secondary">Cancelar</button>
            <button type="submit">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddModal
