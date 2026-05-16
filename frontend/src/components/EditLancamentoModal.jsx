import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2 } from 'lucide-react'
import { AppDialog } from './ui/AppDialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import ConfirmDeleteModal from './ConfirmDeleteModal'

function EditLancamentoModal({ isOpen, lancamento, onClose, onSaved, categorias }) {
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

  return (
    <>
      <AppDialog
        open={isOpen && !!lancamento}
        onOpenChange={onClose}
        title="Editar Lançamento"
        size="sm"
        footer={
          <div className="flex gap-2 items-center w-full">
            <Button
              type="button"
              onClick={handleDeleteClick}
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
              disabled={loading}
            >
              <Trash2 size={16} />
            </Button>
            <div className="flex-1" />
            <Button type="button" variant="outline" onClick={onClose} className="h-8 text-xs" disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
              form="edit-form"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        }
      >
        <form id="edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="O que foi comprado/recebido?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Valor</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">R$</span>
              <Input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                step="0.01"
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
                <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-card rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                  {categoriaSuggestions.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
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

        </form>
      </AppDialog>

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
