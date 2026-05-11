import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Revisar.css'

const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Revisar() {
  const [pendentes, setPendentes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [selecionados, setSelecionados] = useState({})
  const [regrasPendentes, setRegrasPendentes] = useState({})

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      const [pendentesRes, categoriasRes] = await Promise.all([
        axios.get('/api/import/pendentes'),
        axios.get('/api/categorias'),
      ])
      setPendentes(pendentesRes.data || [])
      setCategorias(categoriasRes.data || [])
    } catch (error) {
      console.error('Erro ao buscar pendentes:', error)
      setPendentes([])
      setCategorias([])
    }
  }

  const handleCategoriaChange = (id, categoria) => {
    setSelecionados(prev => ({
      ...prev,
      [id]: categoria
    }))
  }

  const handleRegraChange = (id, checked) => {
    setRegrasPendentes(prev => ({
      ...prev,
      [id]: checked
    }))
  }

  const handleCategorizar = async (id) => {
    const categoria = selecionados[id]
    if (!categoria) {
      alert('Selecione uma categoria')
      return
    }

    try {
      await axios.post(`/api/import/categorizar/${id}`, {
        categoria,
        criar_regra: regrasPendentes[id] || false
      })

      setPendentes(prev => prev.filter(p => p.id !== id))
      setSelecionados(prev => {
        const novo = { ...prev }
        delete novo[id]
        return novo
      })
    } catch (error) {
      console.error('Erro ao categorizar:', error)
      alert('Erro ao categorizar lançamento')
    }
  }

  const handleCategorizarSimilares = async (id) => {
    const pendente = pendentes.find(p => p.id === id)
    const categoria = selecionados[id]

    if (!categoria) {
      alert('Selecione uma categoria')
      return
    }

    try {
      const similares = pendentes.filter(p => p.descricao.includes(pendente.descricao.split(' ')[0]))

      for (const similar of similares) {
        await axios.post(`/api/import/categorizar/${similar.id}`, {
          categoria,
          criar_regra: true
        })
      }

      fetchDados()
    } catch (error) {
      console.error('Erro ao categorizar similares:', error)
    }
  }

  return (
    <div className="revisar-layout">
      <div className="revisar-main">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <h1>
              <span className="header-icon">👁️</span>
              Revisar
            </h1>
            <p>Categorize lançamentos pendentes</p>
          </div>
        </div>

        {/* STATUS */}
        {pendentes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h2>Nenhum lançamento pendente</h2>
            <p>Todos os lançamentos foram categorizados</p>
          </div>
        ) : (
          <>
            {/* COUNT BADGE */}
            <div className="pending-badge">
              <span className="badge-number">{pendentes.length}</span>
              <span className="badge-label">lançamentos pendentes</span>
            </div>

            {/* PENDENTES LIST */}
            <div className="pendentes-list">
              {pendentes.map(pendente => (
                <div key={pendente.id} className="pendente-card">
                  <div className="card-left">
                    <div className={`pendente-icon ${pendente.tipo}`}>
                      {pendente.tipo === 'entrada' ? '↓' : '↑'}
                    </div>
                    <div className="pendente-info">
                      <p className="pend-desc">{pendente.descricao}</p>
                      <div className="pend-meta">
                        <span className="pend-date">{new Date(pendente.data).toLocaleDateString('pt-BR')}</span>
                        <span className="pend-sep">•</span>
                        <span className="pend-banco">{pendente.banco}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-right">
                    <span className={`pend-valor ${pendente.tipo}`}>
                      {pendente.tipo === 'entrada' ? '+' : '−'}{fmt(Math.abs(pendente.valor))}
                    </span>
                  </div>

                  <div className="card-actions">
                    <div className="form-group">
                      <select
                        value={selecionados[pendente.id] || ''}
                        onChange={(e) => handleCategoriaChange(pendente.id, e.target.value)}
                      >
                        <option value="">Selecione categoria</option>
                        {categorias.map(cat => (
                          <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                        ))}
                      </select>
                    </div>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={regrasPendentes[pendente.id] || false}
                        onChange={(e) => handleRegraChange(pendente.id, e.target.checked)}
                      />
                      <span>Criar regra</span>
                    </label>

                    <div className="action-buttons">
                      <button
                        className="btn-primary"
                        onClick={() => handleCategorizar(pendente.id)}
                      >
                        Categorizar
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => handleCategorizarSimilares(pendente.id)}
                      >
                        Similares
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Revisar
