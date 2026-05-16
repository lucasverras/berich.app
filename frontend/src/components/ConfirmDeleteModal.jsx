import React from 'react'
import axios from 'axios'
import { AppDialog } from './ui/AppDialog'
import { Button } from './ui/button'

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
    <AppDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Deletar Lançamento"
      description="Esta ação não pode ser desfeita."
      size="sm"
      footer={
        <div className="flex gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="h-8 text-xs flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja deletar este lançamento?
        </p>

        <div className="space-y-2 bg-accent/30 p-3 rounded-lg">
          <div className="flex justify-between items-start text-sm">
            <span className="text-muted-foreground">Descrição:</span>
            <span className="text-foreground font-medium">{lancamento.descricao}</span>
          </div>
          <div className="flex justify-between items-start text-sm">
            <span className="text-muted-foreground">Valor:</span>
            <span className="text-foreground font-medium">
              {lancamento.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex justify-between items-start text-sm">
            <span className="text-muted-foreground">Data:</span>
            <span className="text-foreground font-medium">
              {new Date(lancamento.data).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
      </div>
    </AppDialog>
  )
}

export default ConfirmDeleteModal
