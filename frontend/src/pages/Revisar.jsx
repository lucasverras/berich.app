import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BankTabs from '../components/BankTabs'
import './Revisar.css'

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
      setPendentes(pendentesRes.data)
      setCategorias(categoriasRes.data)
    } catch (error) {
      console.error('Erro ao buscar pendentes:', error)
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
    <div className="revisar-page">
      <h1>Revisar Lançamentos</h1>
      <BankTabs />

      {pendentes.length === 0 ? (
        <div className="card empty-state">
          <p>✅ Nenhum lançamento pendente</p>
        </div>
      ) : (
        <div className="pendentes-list">
          {pendentes.map(pendente => (
            <div key={pendente.id} className="pendente-card card">
              <div className="pendente-info">
                <div className="info-row">
                  <span className="label">Data:</span>
                  <span>{new Date(pendente.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="info-row">
                  <span className="label">Banco:</span>
                  <span>{pendente.banco}</span>
                </div>
                <div className="info-row">
                  <span className="label">Valor:</span>
                  <span className={pendente.tipo === 'entrada' ? 'positive' : 'negative'}>
                    {pendente.tipo === 'entrada' ? '+' : '-'}R$ {pendente.valor.toFixed(2)}
                  </span>
                </div>
                <div className="info-row description">
                  <span className="label">Descrição:</span>
                  <span>{pendente.descricao}</span>
                </div>
              </div>

              <div className="pendente-actions">
                <div className="form-group">
                  <label>Categoria</label>
                  <select value={selecionados[pendente.id] || ''} onChange={(e) => handleCategoriaChange(pendente.id, e.target.value)}>
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id={`regra-${pendente.id}`}
                    checked={regrasPendentes[pendente.id] || false}
                    onChange={(e) => handleRegraChange(pendente.id, e.target.checked)}
                  />
                  <label htmlFor={`regra-${pendente.id}`}>Sempre usar essa regra</label>
                </div>

                <div className="button-group">
                  <button onClick={() => handleCategorizar(pendente.id)}>Categorizar</button>
                  <button onClick={() => handleCategorizarSimilares(pendente.id)} className="secondary">
                    Categorizar similares
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Revisar
