import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import './ImportModal.css'

function ImportModal({ isOpen, onClose, onImportSuccess }) {
  const { bancoAtivo } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')

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

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Importar CSV</h2>
        <p>Selecione um arquivo CSV do seu banco para importar lançamentos.</p>

        <div className="import-area">
          <input
            type="file"
            id="csv-input"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
            style={{ display: 'none' }}
          />
          <label htmlFor="csv-input" className="import-label">
            {loading ? 'Importando...' : fileName || 'Selecionar arquivo CSV'}
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="secondary">Cancelar</button>
        </div>
      </div>
    </div>
  )
}

export default ImportModal
