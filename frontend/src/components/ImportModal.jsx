import React, { useContext, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { AppDialog } from './ui/AppDialog'
import { Button } from './ui/button'

function ImportModal({ isOpen, onClose, onImportSuccess }) {
  const { bancoAtivo } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('banco', bancoAtivo)

      await axios.post('/api/import/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      alert('Arquivo importado com sucesso!')
      setFileName('')
      onImportSuccess()
      onClose()
    } catch (error) {
      console.error('Erro ao importar:', error)
      alert('Erro ao importar arquivo')
    } finally {
      setLoading(false)
    }
  }

  const handleClickFile = () => {
    fileInputRef.current?.click()
  }

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Importar CSV"
      description="Selecione um arquivo CSV do seu banco para importar lançamentos"
      size="sm"
      footer={
        <div className="flex gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="h-8 text-xs"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleClickFile}
            disabled={loading}
            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white flex-1"
          >
            {loading ? 'Importando...' : fileName ? 'Outra arquivo' : 'Selecionar'}
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={loading}
          style={{ display: 'none' }}
        />

        {fileName && (
          <div className="text-sm bg-green-50 border border-green-200 rounded-lg p-3 text-green-800">
            ✓ Arquivo selecionado: <strong>{fileName}</strong>
          </div>
        )}

        {!fileName && (
          <div className="text-sm text-muted-foreground text-center py-4">
            Clique no botão abaixo para escolher um arquivo CSV
          </div>
        )}
      </div>
    </AppDialog>
  )
}

export default ImportModal
