import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import BankTabs from '../components/BankTabs'
import './Historico.css'

function Historico() {
  const { bancoAtivo } = useContext(AppContext)
  const [lancamentos, setLancamentos] = useState([])
  const [filtroTipo, setFiltroTipo] = useState('all')

  useEffect(() => {
    fetchHistorico()
  }, [bancoAtivo])

  const fetchHistorico = async () => {
    try {
      const response = await axios.get('/api/lancamentos', {
        params: { banco: bancoAtivo }
      })
      setLancamentos(response.data)
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
    }
  }

  const lancamentosFiltrados = lancamentos.filter(l => {
    if (filtroTipo === 'all') return true
    return l.tipo === filtroTipo
  })

  return (
    <div className="historico-page">
      <h1>Histórico de Lançamentos</h1>
      <BankTabs />

      <div className="historico-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filtroTipo === 'all' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('all')}
          >
            Todos ({lancamentos.length})
          </button>
          <button
            className={`filter-btn ${filtroTipo === 'entrada' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('entrada')}
          >
            Entradas ({lancamentos.filter(l => l.tipo === 'entrada').length})
          </button>
          <button
            className={`filter-btn ${filtroTipo === 'saída' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('saída')}
          >
            Saídas ({lancamentos.filter(l => l.tipo === 'saída').length})
          </button>
        </div>
      </div>

      <div className="historico-list">
        {lancamentosFiltrados.length === 0 ? (
          <div className="card empty-state">
            <p>Nenhum lançamento encontrado</p>
          </div>
        ) : (
          lancamentosFiltrados.map(lancamento => (
            <div key={lancamento.id} className="historico-item card">
              <div className="item-header">
                <div className="item-date">
                  {new Date(lancamento.data).toLocaleDateString('pt-BR')}
                </div>
                <div className={`item-valor ${lancamento.tipo}`}>
                  {lancamento.tipo === 'entrada' ? '+' : '-'}R$ {lancamento.valor.toFixed(2)}
                </div>
              </div>

              <div className="item-details">
                <div className="item-desc">{lancamento.descricao}</div>
                {lancamento.categoria && (
                  <span className="badge green">{lancamento.categoria}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Historico
