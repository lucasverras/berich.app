import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Icons from '../components/Icons'
import ClosingDaysConfig from '../components/ClosingDaysConfig'
import { AppDialog } from '../components/ui/AppDialog'
import { Button } from '../components/ui/button'
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../data/categoriesStore'
import './Config.css'

const EMOJI_BANK = {
  'Comida': ['🍔', '🍕', '🍣', '🌮', '🍜', '🥗', '🍱', '🥩', '🍗', '🍞', '🧁', '🍰', '🍦', '🥐', '🧆'],
  'Bebidas': ['🍷', '🍺', '🥂', '🍸', '🥃', '☕', '🧃', '🥤', '🍵', '🧋'],
  'Transporte': ['🚗', '🚕', '🏎️', '✈️', '🚢', '⛽', '🅿️', '🛵', '🚲', '🛺'],
  'Dinheiro': ['💰', '💵', '💳', '📈', '📉', '🎰', '💹', '🏦', '🪙', '💎'],
  'Lazer': ['🎮', '🎬', '🎵', '🏋️', '🎯', '⚽', '🎭', '🎪', '🎸', '🎲'],
  'Pessoas': ['👤', '👥', '💇', '👰', '🤵', '🧑‍💻', '🧑‍🎤'],
  'Outros': ['📌', '🎁', '🛍️', '👕', '🏠', '⚡', '📅', '🎉', '🔧', '📦', '✂️', '🌿'],
}

function Config() {
  const [tabs, setTabs] = useState('categorias')
  const [categoriasLocal, setCategoriasLocal] = useState([])
  const [bancos, setBancos] = useState([])
  const [regras, setRegras] = useState([])
  const [novaCategoria, setNovaCategoria] = useState('')
  const [novaCorCategoria, setNovaCorCategoria] = useState('#22c55e')
  const [novoEmojiCategoria, setNovoEmojiCategoria] = useState('📌')
  const [novoBanco, setNovoBanco] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(null)
  const [colorPickerOpen, setColorPickerOpen] = useState(null)

  useEffect(() => {
    carregarCategorias()
    fetchOutrosDados()
  }, [])

  const carregarCategorias = () => {
    setCategoriasLocal(getAllCategories())
  }

  const fetchOutrosDados = async () => {
    try {
      const [bancosRes, regrasRes] = await Promise.all([
        axios.get('/api/bancos'),
        axios.get('/api/regras'),
      ])
      setBancos(bancosRes.data)
      setRegras(regrasRes.data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const handleAddCategoria = () => {
    if (!novaCategoria.trim()) {
      alert('Digite um nome para a categoria')
      return
    }

    addCategory(novaCategoria.trim(), novaCorCategoria, novoEmojiCategoria)
    setNovaCategoria('')
    setNovaCorCategoria('#22c55e')
    setNovoEmojiCategoria('📌')
    carregarCategorias()
  }

  const handleUpdateCategoria = (nome, cor, emoji) => {
    updateCategory(nome, cor, emoji)
    carregarCategorias()
  }

  const handleDeleteCategoria = (nome) => {
    setConfirmDelete({
      type: 'categoria',
      id: nome,
      label: nome,
      message: 'Tem certeza que deseja deletar esta categoria?'
    })
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return

    setIsDeleting(true)
    try {
      if (confirmDelete.type === 'categoria') {
        deleteCategory(confirmDelete.id)
        carregarCategorias()
      } else if (confirmDelete.type === 'regra') {
        await axios.delete(`/api/regras/${confirmDelete.id}`)
        fetchOutrosDados()
      }
      setConfirmDelete(null)
    } catch (error) {
      alert('Erro ao deletar')
    } finally {
      setIsDeleting(false)
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

  const handleDeleteRegra = (id) => {
    const regra = regras.find(r => r.id === id)
    setConfirmDelete({
      type: 'regra',
      id,
      label: regra?.palavra_chave,
      message: 'Tem certeza que deseja deletar esta regra de categorização?'
    })
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
        <button className={`tab ${tabs === 'cartoes' ? 'active' : ''}`} onClick={() => setTabs('cartoes')}>
          Cartões
        </button>
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

      {tabs === 'cartoes' && (
        <div className="config-section">
          <ClosingDaysConfig />
        </div>
      )}

      {tabs === 'categorias' && (
        <div className="config-section card">
          <h3>Categorias</h3>

          {/* Adicionar nova categoria */}
          <div className="add-section">
            <div className="form-group">
              <label>Adicionar Nova Categoria</label>
              <div className="categoria-form">
                <div className="color-dot-input">
                  <div
                    className="color-preview"
                    style={{ backgroundColor: novaCorCategoria }}
                    onClick={() => {
                      const input = document.querySelector('#new-cat-color-input')
                      input?.click()
                    }}
                  />
                  <input
                    id="new-cat-color-input"
                    type="color"
                    value={novaCorCategoria}
                    onChange={(e) => setNovaCorCategoria(e.target.value)}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="emoji-input" onClick={() => setEmojiPickerOpen('new')}>
                  {novoEmojiCategoria}
                </div>
                <input
                  type="text"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  placeholder="Nome da categoria"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategoria()}
                />
                <button onClick={handleAddCategoria} className="btn-add">Adicionar</button>
              </div>
              {emojiPickerOpen === 'new' && (
                <div className="emoji-picker">
                  {Object.entries(EMOJI_BANK).map(([categoria, emojis]) => (
                    <div key={categoria} className="emoji-categoria">
                      <div className="emoji-categoria-label">{categoria}</div>
                      <div className="emoji-grid">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            className="emoji-btn"
                            onClick={() => {
                              setNovoEmojiCategoria(emoji)
                              setEmojiPickerOpen(null)
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Lista de categorias existentes */}
          <div className="list-section">
            {categoriasLocal.map((cat) => (
              <div key={cat.nome} className="categoria-item">
                <div className="categoria-left">
                  <div
                    className="color-dot"
                    style={{ backgroundColor: cat.cor }}
                    onClick={() => {
                      const colorInput = document.createElement('input')
                      colorInput.type = 'color'
                      colorInput.value = cat.cor
                      colorInput.onchange = (e) => {
                        handleUpdateCategoria(cat.nome, e.target.value, cat.emoji)
                      }
                      colorInput.click()
                    }}
                  />
                  <div className="categoria-emoji">{cat.emoji}</div>
                  <div className="categoria-nome">{cat.nome}</div>
                </div>
                <div className="categoria-actions">
                  <button
                    className="emoji-edit-btn"
                    onClick={() => setEmojiPickerOpen(cat.nome)}
                    title="Editar emoji"
                  >
                    😀
                  </button>
                  <button
                    className="color-edit-btn"
                    onClick={() => {
                      const colorInput = document.createElement('input')
                      colorInput.type = 'color'
                      colorInput.value = cat.cor
                      colorInput.onchange = (e) => {
                        handleUpdateCategoria(cat.nome, e.target.value, cat.emoji)
                      }
                      colorInput.click()
                    }}
                    title="Editar cor"
                  >
                    🎨
                  </button>
                  <button
                    onClick={() => handleDeleteCategoria(cat.nome)}
                    className="delete-btn"
                    title="Deletar"
                  >
                    <Icons.AlertCircle size={18} />
                  </button>
                </div>
                {emojiPickerOpen === cat.nome && (
                  <div className="emoji-picker">
                    {Object.entries(EMOJI_BANK).map(([categoria, emojis]) => (
                      <div key={categoria} className="emoji-categoria">
                        <div className="emoji-categoria-label">{categoria}</div>
                        <div className="emoji-grid">
                          {emojis.map((emoji) => (
                            <button
                              key={emoji}
                              className="emoji-btn"
                              onClick={() => {
                                handleUpdateCategoria(cat.nome, cat.cor, emoji)
                                setEmojiPickerOpen(null)
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      <AppDialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
        title={confirmDelete?.type === 'categoria' ? 'Desativar Categoria' : 'Deletar Regra'}
        description="Esta ação não pode ser desfeita."
        size="sm"
        footer={
          <div className="flex gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDelete(null)}
              disabled={isDeleting}
              className="h-8 text-xs flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deletando...' : 'Deletar'}
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">{confirmDelete?.message}</p>
          {confirmDelete?.label && (
            <div className="bg-accent/30 p-3 rounded-lg">
              <span className="text-foreground font-medium">{confirmDelete.label}</span>
            </div>
          )}
        </div>
      </AppDialog>
    </div>
  )
}

export default Config
