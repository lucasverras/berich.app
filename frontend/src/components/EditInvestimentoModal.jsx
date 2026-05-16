import React, { useState, useEffect } from 'react'
import { AppDialog } from './ui/AppDialog'
import { Button } from './ui/button'
import { Input } from './ui/input'

function EditInvestimentoModal({ isOpen, investimento, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    investido: '',
    valor_atual: '',
  })

  useEffect(() => {
    if (isOpen && investimento) {
      setFormData({
        investido: investimento.investido.toString(),
        valor_atual: investimento.valor_atual.toString(),
      })
    }
  }, [isOpen, investimento])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    const investido = parseFloat(formData.investido)
    const valor_atual = parseFloat(formData.valor_atual)
    const resultado = valor_atual - investido
    const percentual = ((resultado / investido) * 100).toFixed(2)

    // Aqui você pode fazer uma chamada à API se necessário
    // Por enquanto, apenas fechamos o modal
    onSaved({
      investido,
      valor_atual,
      resultado,
      percentual
    })
    onClose()
  }

  if (!isOpen || !investimento) return null

  const investido = parseFloat(formData.investido) || 0
  const valor_atual = parseFloat(formData.valor_atual) || 0
  const resultado = valor_atual - investido
  const percentual = investido > 0 ? ((resultado / investido) * 100).toFixed(2) : 0

  const fmt = (v) => {
    if (!v) return 'R$ 0,00'
    return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Editar Investimento"
      size="sm"
      footer={
        <div className="flex gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-8 text-xs flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
            form="invest-form"
          >
            Salvar
          </Button>
        </div>
      }
    >
      <form id="invest-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Valor Investido</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">R$</span>
            <Input
              type="number"
              name="investido"
              value={formData.investido}
              onChange={handleChange}
              step="0.01"
              placeholder="0,00"
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Valor Atual</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">R$</span>
            <Input
              type="number"
              name="valor_atual"
              value={formData.valor_atual}
              onChange={handleChange}
              step="0.01"
              placeholder="0,00"
              className="text-sm"
            />
          </div>
        </div>

        {/* Resultado */}
        <div className="space-y-2 bg-accent/40 p-3 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Ganho/Perda:</span>
            <span className={`font-medium ${resultado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {resultado >= 0 ? '+' : '−'}{fmt(Math.abs(resultado))}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Rentabilidade:</span>
            <span className={`font-medium ${resultado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {resultado >= 0 ? '+' : '−'}{percentual}%
            </span>
          </div>
        </div>
      </form>
    </AppDialog>
  )
}

export default EditInvestimentoModal
