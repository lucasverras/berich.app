import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import AddModal from '../components/AddModal'
import EditLancamentoModal from '../components/EditLancamentoModal'
import MonthCarousel from '../components/MonthCarousel'
import './Fatura.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const LIMITE_CARTAO = 4800
const DIA_FECHAMENTO = 1
const DIA_VENCIMENTO = 10

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

  const hoje = new Date()
  const diaHoje = hoje.getDate()
  const faturaFechada = diaHoje >= DIA_FECHAMENTO && diaHoje < DIA_VENCIMENTO
  const diasParaVencer = DIA_VENCIMENTO - diaHoje
  const percentualFatura = (fatura / LIMITE_CARTAO) * 100
  const limiteDisponivel = Math.max(0, LIMITE_CARTAO - fatura)

  let corProgresso = '#22c55e'
  if (percentualFatura > 90) corProgresso = '#ef4444'
  else if (percentualFatura > 70) corProgresso = '#eab308'

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
        </div>

        <MonthCarousel
          mesSelecionado={mesSelecionado}
          onChange={(novoMes) => handleMesChange(novoMes)}
        />

        {/* STATS GRID */}
        <div className="stats-grid single">
          <div className="stat-card stat-card-glass stat-card-glow fatura-card">
            <div className="stat-corner-decoration" style={{ background: 'radial-gradient(circle, #f87171, transparent)' }}></div>
            <div className="fatura-card-top">
              <div>
                <div className="stat-icon stat-icon-red">💳</div>
                <div className="stat-label">Fatura de {MESES[mesSelecionado]}</div>
              </div>
              <div className="fatura-badges">
                {faturaFechada && <span className="badge-orange">Fatura fechada</span>}
                {!faturaFechada && diasParaVencer > 0 && <span className="badge-red">Vence em {diasParaVencer} dia{diasParaVencer > 1 ? 's' : ''}</span>}
              </div>
            </div>
            <div className="stat-value negative">{fmt(Math.abs(fatura))}</div>

            <div className="fatura-progress-wrapper">
              <div className="fatura-progress-bar">
                <div className="fatura-progress-fill" style={{ width: `${Math.min(percentualFatura, 100)}%`, background: corProgresso }}></div>
              </div>
              <span className="fatura-progress-text">{percentualFatura.toFixed(0)}% do limite</span>
            </div>

            <div className="fatura-info">
              <div className="info-item">
                <span className="info-label">Limite disponível</span>
                <span className="info-value">{fmt(limiteDisponivel)}</span>
              </div>
              <div className="info-divider"></div>
              <div className="info-item">
                <span className="info-label">Fecha dia {DIA_FECHAMENTO} · Vence dia {DIA_VENCIMENTO}</span>
              </div>
            </div>
          </div>
        </div>

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

      {/* AddModal removed - use universal FAB from BottomNav */}
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
    </div>
  )
}

export default Fatura
