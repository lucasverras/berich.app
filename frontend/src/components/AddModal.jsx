import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import './AddModal.css'

function AddModal({ isOpen, onClose, onLancamentoAdded, defaultTipo = 'saída' }) {
  const { bancoAtivo, mesAno } = useContext(AppContext)
  const [tipo, setTipo] = useState(defaultTipo)
  const [categorias, setCategorias] = useState([])
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
      setTipo(defaultTipo)
      setFormData({
        valor: '',
        data: new Date().toISOString().split('T')[0],
        motivo: '',
        categoria: '',
        parcelado: false,
        parcelas: '1',
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

  const formatCurrency = (value) => {
    if (!value) return ''
    const numValue = value.replace(/\D/g, '')
    const floatValue = parseInt(numValue, 10) / 100
    return floatValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const getNumericValue = (value) => {
    return value.replace(/\D/g, '')
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'valor') {
      const numericValue = value.replace(/\D/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleCheckChange = (e) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleTipoChange = (novoTipo) => {
    setTipo(novoTipo)
  }

  const calcularValorParcela = () => {
    if (!formData.valor || !formData.parcelas) return 'R$ 0,00'
    const valor = parseInt(formData.valor, 10) / 100
    const parcelas = parseInt(formData.parcelas, 10)
    return (valor / parcelas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.valor || !formData.motivo) {
      alert('Preencha valor e motivo')
      return
    }

    try {
      const valorCents = parseInt(formData.valor, 10)
      const valor = valorCents / 100
      const parcelas = parseInt(formData.parcelas, 10)

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

      // Se parcelado, criar múltiplos lançamentos
      if (formData.parcelado && parcelas > 1) {
        const valorParcela = lancamentoValor / parcelas
        for (let i = 0; i < parcelas; i++) {
          const dataParc = new Date(formData.data)
          dataParc.setMonth(dataParc.getMonth() + i)

          await axios.post('/api/lancamentos', {
            data: dataParc.toISOString().split('T')[0],
            valor: valorParcela,
            tipo: lancamentoTipo,
            categoria: formData.categoria || null,
            banco: bancoAtivo,
            descricao: `${formData.motivo} (${i + 1}/${parcelas})`,
            forma_pagamento: formaPagamento,
            parcelado: true,
            parcela_numero: i + 1,
            parcela_total: parcelas,
          })
        }
      } else {
        await axios.post('/api/lancamentos', {
          data: formData.data,
          valor: lancamentoValor,
          tipo: lancamentoTipo,
          categoria: formData.categoria || null,
          banco: bancoAtivo,
          descricao: formData.motivo,
          forma_pagamento: formaPagamento,
        })
      }

      setFormData({
        valor: '',
        data: new Date().toISOString().split('T')[0],
        motivo: '',
        categoria: '',
        parcelado: false,
        parcelas: '1',
      })

      onLancamentoAdded()
      onClose()
    } catch (error) {
      console.error('Erro ao criar lançamento:', error)
      alert('Erro ao criar lançamento')
    }
  }

  if (!isOpen) return null

  const displayValue = formatCurrency(formData.valor)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Movimentação</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="tipo-tags">
          <button
            type="button"
            className={`tipo-tag ${tipo === 'cartão' ? 'active' : ''}`}
            onClick={() => handleTipoChange('cartão')}
          >
            Cartão de Crédito
          </button>
          <button
            type="button"
            className={`tipo-tag ${tipo === 'entrada' ? 'active' : ''}`}
            onClick={() => handleTipoChange('entrada')}
          >
            Entrada
          </button>
          <button
            type="button"
            className={`tipo-tag ${tipo === 'saída' ? 'active' : ''}`}
            onClick={() => handleTipoChange('saída')}
          >
            Saída
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="O que foi comprado/recebido?"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Valor</label>
            <div className="input-currency">
              <span className="currency-prefix">R$</span>
              <input
                type="text"
                name="valor"
                value={displayValue}
                onChange={handleChange}
                placeholder="0,00"
                autoComplete="off"
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
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Digite ou selecione uma categoria"
              list="categorias-list"
            />
            <datalist id="categorias-list">
              {categorias && categorias.map(cat => (
                <option key={cat.id} value={cat.nome} />
              ))}
            </datalist>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="parcelado"
                checked={formData.parcelado}
                onChange={handleCheckChange}
              />
              <span>Parcelado</span>
            </label>
          </div>

          {formData.parcelado && (
            <div className="form-group">
              <label>Quantidade de parcelas</label>
              <input
                type="number"
                name="parcelas"
                min="1"
                max="48"
                value={formData.parcelas}
                onChange={handleChange}
              />
              {formData.parcelas && formData.valor && (
                <div className="installment-info">
                  <p>Valor por parcela: <strong>{calcularValorParcela()}</strong></p>
                  <p className="installment-start">Começa em: {new Date(formData.data).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
            </div>
          )}

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
