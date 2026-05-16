import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { AppDialog } from './ui/AppDialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

function AddModal({ isOpen, onClose, onLancamentoAdded, defaultTipo = 'cartão' }) {
  const { bancoAtivo, mesAno } = useContext(AppContext)

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

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Adicionar Movimentação"
      size="sm"
      footer={
        <div className="flex gap-2 w-full">
          <Button type="button" variant="outline" onClick={onClose} className="h-8 text-xs">
            Cancelar
          </Button>
          <Button
            type="submit"
            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
            form="add-form"
          >
            Adicionar
          </Button>
        </div>
      }
    >
      <form id="add-form" onSubmit={handleSubmit} className="space-y-4">

        {/* Tipo Selector */}
        <div className="flex gap-2 mb-6">
          {['cartão', 'entrada', 'saída'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => handleTipoChange(t)}
              style={{
                background: tipo === t ? '#22c55e' : 'transparent',
                color: tipo === t ? '#fff' : '#22c55e',
                borderColor: tipo === t ? '#22c55e' : 'rgba(34, 197, 94, 0.4)',
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all border`}
            >
              {t === 'entrada' ? 'Entrada' : t === 'saída' ? 'Saída' : 'Cartão'}
            </button>
          ))}
        </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="O que foi comprado/recebido?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Valor</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">R$</span>
              <Input
                type="text"
                name="valor"
                value={formatCurrency(formData.valor)}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data</label>
            <Input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <div className="relative">
              <Input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                placeholder="Digite uma categoria"
              />
              {formData.categoria && categoriaSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 border border-green-500/30 bg-card rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                  {categoriaSuggestions.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-green-500/10 text-green-400 text-sm transition-colors"
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

          {tipo !== 'entrada' && (
            <label className="flex items-center gap-2 cursor-pointer">
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
              <span className="text-sm font-medium">Parcelado</span>
            </label>
          )}

          {formData.parcelado && tipo !== 'entrada' && (
            <div className="space-y-3">
              {!showCustomParcelas ? (
                <>
                  <div className="flex gap-2 flex-wrap">
                    {[2, 3, 5, 6, 12].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleParcelasSelect(p)}
                        className={`py-1 px-2 rounded text-xs font-medium transition-all ${
                          formData.parcelas === String(p)
                            ? 'bg-green-500 text-black shadow-lg shadow-green-500/50'
                            : 'bg-transparent text-green-400 hover:text-green-300'
                        }`}
                      >
                        {p}x
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCustomParcelas(true)}
                    className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-transparent border border-green-500/40 text-green-400 hover:border-green-500/60 transition-all"
                  >
                    Outro
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="number"
                    name="parcelas"
                    value={formData.parcelas}
                    onChange={handleChange}
                    min="1"
                    max="48"
                    placeholder="Digite a quantidade"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomParcelas(false)}
                    className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-green-500/10 border border-green-500/40 text-green-400 hover:border-green-500/60 transition-all"
                  >
                    Confirmar
                  </button>
                </div>
              )}

              {formData.parcelas && formData.valor && (
                <div className="text-sm space-y-1 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400">Valor por parcela: <strong>{formatCurrency(String(Math.round(parseInt(formData.valor) / parseInt(formData.parcelas))))}</strong></p>
                  <p className="text-green-600">Começa em: {new Date(formData.data).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
            </div>
          )}

      </form>
    </AppDialog>
  )
}

export default AddModal
