import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import AddModal from '../components/AddModal'
import EditLancamentoModal from '../components/EditLancamentoModal'
import FecharFaturaModal from '../components/FecharFaturaModal'
import './Fatura.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Fatura() {
  const { bancoAtivo, mesAno, updateMesAno } = useContext(AppContext)
  const [fatura, setFatura] = useState(0)
  const [lancamentos, setLancamentos] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLancamento, setEditingLancamento] = useState(null)
  const [isFecharModalOpen, setIsFecharModalOpen] = useState(false)
  const [faturasFechadas, setFaturasFechadas] = useState({})
  const [isFechada, setIsFechada] = useState(false)
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [mesSelecionado, setMesSelecionado] = useState(mesAno.mes - 1)
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetchCategorias()
    fetchFatura()
    fetchLancamentos()
  }, [bancoAtivo, mesAno.mes, mesAno.ano])

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/api/categorias')
      setCategorias(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  const fetchFatura = async () => {
    try {
      const response = await axios.get('/api/resumo', {
        params: {
          banco: bancoAtivo,
          mes: mesAno.mes,
          ano: mesAno.ano,
          forma_pagamento: 'cartão',
        }
      })
      setFatura(response.data.saidas || 0)
    } catch (error) {
      console.error('Erro ao buscar fatura:', error)
    }
  }

  const fetchLancamentos = async () => {
    try {
      const response = await axios.get('/api/lancamentos', {
        params: {
          banco: bancoAtivo,
          mes: mesAno.mes,
          ano: mesAno.ano,
          forma_pagamento: 'cartão',
        }
      })
      setLancamentos(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error)
      setLancamentos([])
    }
  }

  const handleMesChange = (novoMes) => {
    setMesSelecionado(novoMes)
    updateMesAno(novoMes + 1, mesAno.ano)
    setDropdownAberto(false)
  }

  const handleAddLancamento = () => {
    fetchFatura()
    fetchLancamentos()
    setIsAddModalOpen(false)
  }

  const handleEditLancamento = (lancamento) => {
    setEditingLancamento(lancamento)
    setIsEditModalOpen(true)
  }

  const handleLancamentoSaved = () => {
    fetchFatura()
    fetchLancamentos()
  }

  const handleFecharFatura = () => {
    const chave = `${mesAno.ano}-${mesAno.mes}`
    setFaturasFechadas(prev => ({
      ...prev,
      [chave]: true
    }))
    setIsFechada(true)

    let proximoMes = mesAno.mes + 1
    let proximoAno = mesAno.ano
    if (proximoMes > 12) {
      proximoMes = 1
      proximoAno += 1
    }

    updateMesAno(proximoMes, proximoAno)
    setIsFecharModalOpen(false)
  }

  useEffect(() => {
    const chave = `${mesAno.ano}-${mesAno.mes}`
    setIsFechada(faturasFechadas[chave] || false)
  }, [mesAno, faturasFechadas])

  return (
    <div className="fatura-layout">
      <div className="fatura-main">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <h1>
              <span className="header-icon">💳</span>
              Fatura
            </h1>
            <p>Fatura do cartão — {MESES[mesSelecionado]} {mesAno.ano}</p>
          </div>
          <div className="month-picker" onClick={() => setDropdownAberto(!dropdownAberto)}>
            <span>{MESES[mesSelecionado].slice(0, 3)} {mesAno.ano}</span>
            <span className="chevron">⌄</span>
            {dropdownAberto && (
              <div className="month-dropdown">
                {MESES.map((m, i) => (
                  <button
                    key={m}
                    className={`month-option ${i === mesSelecionado ? 'selected' : ''}`}
                    onClick={() => handleMesChange(i)}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STATS GRID */}
        <div className="stats-grid single">
          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-corner-decoration" style={{ background: 'radial-gradient(circle, #f87171, transparent)' }}></div>
            <div className="stat-icon stat-icon-red">💳</div>
            <div className="stat-label">Fatura de {MESES[mesSelecionado]}</div>
            <div className="stat-value negative">{fmt(Math.abs(fatura))}</div>
            <div className="stat-sub">Total a pagar</div>
            {isFechada && <span className="badge-status fechada">Fechada</span>}
          </div>
        </div>

        {/* AÇÃO FECHAR */}
        {!isFechada && (
          <div className="fechar-fatura-card">
            <div className="fechar-card-content">
              <div className="fechar-card-text">
                <h3>Fechar Fatura</h3>
                <p>Encerrar este ciclo e iniciar o próximo mês</p>
              </div>
              <button
                className="fechar-card-btn"
                onClick={() => setIsFecharModalOpen(true)}
              >
                Fechar Fatura
              </button>
            </div>
          </div>
        )}

        {/* TRANSAÇÕES */}
        <div className="transacoes-section">
          <div className="section-header">
            <h2 className="section-title">Transações</h2>
            <span className="section-count">{lancamentos.length} itens</span>
          </div>

          {lancamentos.length === 0 ? (
            <div className="card empty-state">
              <p>Sem transações para este período</p>
            </div>
          ) : (
            <div className="transacoes-list">
              {lancamentos.map(l => (
                <div key={l.id} className="transacao-item" onClick={() => handleEditLancamento(l)}>
                  <div className="tra-left">
                    <div className="tra-icon">📌</div>
                    <div className="tra-info">
                      <p className="tra-desc">{l.descricao}</p>
                      <p className="tra-date">{new Date(l.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="tra-value negative">{fmt(Math.abs(l.valor))}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setIsAddModalOpen(true)} title="Adicionar transação">
        +
      </button>

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLancamentoAdded={handleAddLancamento}
        defaultTipo="cartão"
      />
      <EditLancamentoModal
        isOpen={isEditModalOpen}
        lancamento={editingLancamento}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingLancamento(null)
        }}
        onSaved={handleLancamentoSaved}
        categorias={categorias}
      />
      <FecharFaturaModal
        isOpen={isFecharModalOpen}
        mesAtual={mesAno.mes}
        onClose={() => setIsFecharModalOpen(false)}
        onConfirm={handleFecharFatura}
      />
    </div>
  )
}

export default Fatura
