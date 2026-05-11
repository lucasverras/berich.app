import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Icons from '../components/Icons'
import './Config.css'

function Config() {
  const [tabs, setTabs] = useState('categorias')
  const [categorias, setCategorias] = useState([])
  const [bancos, setBancos] = useState([])
  const [regras, setRegras] = useState([])
  const [novaCategoria, setNovaCategoria] = useState('')
  const [novoBanco, setNovoBanco] = useState('')

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      const [categoriasRes, bancosRes, regrasRes] = await Promise.all([
        axios.get('/api/categorias'),
        axios.get('/api/bancos'),
        axios.get('/api/regras'),
      ])
      setCategorias(categoriasRes.data)
      setBancos(bancosRes.data)
      setRegras(regrasRes.data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const handleAddCategoria = async () => {
    if (!novaCategoria.trim()) {
      alert('Digite um nome para a categoria')
      return
    }

    try {
      const ordem = categorias.length > 0 ? Math.max(...categorias.map(c => c.ordem || 0), 0) + 1 : 1
      const response = await axios.post('/api/categorias', {
        nome: novaCategoria.trim(),
        ordem: ordem
      })
      console.log('Categoria criada:', response.data)
      setNovaCategoria('')
      fetchDados()
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error.response?.data || error.message)
      alert(`Erro ao adicionar categoria: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleDeleteCategoria = async (id) => {
    if (!window.confirm('Desativar categoria?')) return

    try {
      await axios.delete(`/api/categorias/${id}`)
      fetchDados()
    } catch (error) {
      alert('Erro ao deletar categoria')
    }
  }

  const handleAddBanco = async () => {
    if (!novoBanco.trim()) {
      alert('Digite um nome para o banco')
      return
    }

    try {
      const response = await axios.post('/api/bancos', { nome: novoBanco.trim() })
      console.log('Banco criado:', response.data)
      setNovoBanco('')
      fetchDados()
    } catch (error) {
      console.error('Erro ao adicionar banco:', error.response?.data || error.message)
      alert(`Erro ao adicionar banco: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleDeleteRegra = async (id) => {
    if (!window.confirm('Deletar regra?')) return

    try {
      await axios.delete(`/api/regras/${id}`)
      fetchDados()
    } catch (error) {
      alert('Erro ao deletar regra')
    }
  }

  const handleExportBackup = async () => {
    try {
      const response = await axios.get('/api/backup')
      const elemento = document.createElement('a')
      elemento.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response.data, null, 2))
      elemento.download = `backup-${new Date().toISOString().split('T')[0]}.json`
      elemento.click()
    } catch (error) {
      alert('Erro ao exportar backup')
    }
  }

  const handleImportBackup = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const texto = await file.text()
      const backup = JSON.parse(texto)
      await axios.post('/api/restore', backup)
      alert('Backup importado com sucesso!')
      fetchDados()
    } catch (error) {
      alert('Erro ao importar backup')
    }
  }

  return (
    <div className="config-page">
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icons.Settings size={32} style={{ color: 'var(--primary-light)' }} />
        Configurações
      </h1>

      <div className="config-tabs">
        <button className={`tab ${tabs === 'categorias' ? 'active' : ''}`} onClick={() => setTabs('categorias')}>
          Categorias
        </button>
        <button className={`tab ${tabs === 'bancos' ? 'active' : ''}`} onClick={() => setTabs('bancos')}>
          Bancos
        </button>
        <button className={`tab ${tabs === 'regras' ? 'active' : ''}`} onClick={() => setTabs('regras')}>
          Regras
        </button>
        <button className={`tab ${tabs === 'backup' ? 'active' : ''}`} onClick={() => setTabs('backup')}>
          Backup
        </button>
      </div>

      {tabs === 'categorias' && (
        <div className="config-section card">
          <h3>Categorias</h3>

          <div className="add-section">
            <div className="form-group">
              <label>Adicionar categoria</label>
              <div className="input-group">
                <input
                  type="text"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategoria()}
                  placeholder="Nova categoria"
                />
                <button onClick={handleAddCategoria}>Adicionar</button>
              </div>
            </div>
          </div>

          <div className="list-section">
            {categorias.map(categoria => (
              <div key={categoria.id} className="list-item">
                <span>{categoria.nome}</span>
                <button onClick={() => handleDeleteCategoria(categoria.id)} className="delete-btn" title="Deletar">
                  <Icons.AlertCircle size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tabs === 'bancos' && (
        <div className="config-section card">
          <h3>Bancos</h3>

          <div className="add-section">
            <div className="form-group">
              <label>Adicionar banco</label>
              <div className="input-group">
                <input
                  type="text"
                  value={novoBanco}
                  onChange={(e) => setNovoBanco(e.target.value)}
                  placeholder="Novo banco"
                />
                <button onClick={handleAddBanco}>Adicionar</button>
              </div>
            </div>
          </div>

          <div className="list-section">
            {bancos.map(banco => (
              <div key={banco.id} className="list-item">
                <span>{banco.nome}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tabs === 'regras' && (
        <div className="config-section card">
          <h3>Regras de Categorização</h3>

          <div className="list-section">
            {regras.map(regra => (
              <div key={regra.id} className="regra-item">
                <div className="regra-info">
                  <div className="regra-palavra">{regra.palavra_chave}</div>
                  <div className="regra-categoria">→ {regra.categoria}</div>
                </div>
                <div className="regra-prioridade" title={regra.prioridade === 'manual' ? 'Manual' : 'Automático'}>
                  {regra.prioridade === 'manual' ? <Icons.Eye size={18} /> : <Icons.Settings size={18} />}
                </div>
                <button onClick={() => handleDeleteRegra(regra.id)} className="delete-btn" title="Deletar">
                  <Icons.AlertCircle size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tabs === 'backup' && (
        <div className="config-section card">
          <h3>Backup e Restauração</h3>

          <div className="backup-actions">
            <button onClick={handleExportBackup} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
              Exportar Backup
            </button>
            <div className="import-section">
              <input
                type="file"
                id="backup-input"
                accept=".json"
                onChange={handleImportBackup}
                style={{ display: 'none' }}
              />
              <label htmlFor="backup-input" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icons.ArrowRight size={18} />
                Importar Backup
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Config
