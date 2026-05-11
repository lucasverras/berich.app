import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import Icons from '../components/Icons'
import AddModal from '../components/AddModal'
import EditLancamentoModal from '../components/EditLancamentoModal'
import MonthCarousel from '../components/MonthCarousel'
import './Conta.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Conta() {
  const { bancoAtivo, mes, ano, updateMesAno } = useContext(AppContext)
  const navigate = useNavigate()
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0 })
  const [lancamentos, setLancamentos] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLancamento, setEditingLancamento] = useState(null)
  const [mesSelecionado, setMesSelecionado] = useState(mes - 1)
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetchCategorias()
    fetchResumo()
    fetchLancamentos()
  }, [bancoAtivo, mes, ano])

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/api/categorias')
      setCategorias(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  const fetchResumo = async () => {
    try {
      const response = await axios.get('/api/resumo', {
        params: {
          banco: bancoAtivo,
          mes,
          ano,
          forma_pagamento: 'pix',
        }
      })
      setResumo({
        entradas: response.data.entradas || 0,
        saidas: response.data.saidas || 0,
        saldo: response.data.saldo || 0,
      })
    } catch (error) {
      console.error('Erro ao buscar resumo:', error)
    }
  }

  const fetchLancamentos = async () => {
    try {
      const response = await axios.get('/api/lancamentos', {
        params: {
          banco: bancoAtivo,
          mes,
          ano,
          forma_pagamento: 'pix',
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
    updateMesAno(novoMes + 1, ano)
  }

  const handleAddLancamento = () => {
    fetchResumo()
    fetchLancamentos()
    setIsAddModalOpen(false)
  }

  const handleEditLancamento = (lancamento) => {
    setEditingLancamento(lancamento)
    setIsEditModalOpen(true)
  }

  const handleLancamentoSaved = () => {
    fetchResumo()
    fetchLancamentos()
  }

  return (
    <div className="conta-layout">
      <div className="conta-main">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <h1>
              <span className="header-icon">🏦</span>
              Conta
            </h1>
            <p>Movimentação da conta — {MESES[mesSelecionado]} {ano}</p>
          </div>
        </div>

        <MonthCarousel
          mesSelecionado={mesSelecionado}
          onChange={(novoMes) => handleMesChange(novoMes)}
        />

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-corner-decoration" style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }}></div>
            <div className="stat-icon stat-icon-green">↑</div>
            <div className="stat-label">Entradas</div>
            <div className="stat-value positive">{fmt(resumo.entradas)}</div>
            <div className="stat-sub">Receitas recebidas</div>
          </div>

          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-corner-decoration" style={{ background: 'radial-gradient(circle, #f87171, transparent)' }}></div>
            <div className="stat-icon stat-icon-red">↓</div>
            <div className="stat-label">Saídas</div>
            <div className="stat-value negative">{fmt(resumo.saidas)}</div>
            <div className="stat-sub">Débitos realizados</div>
          </div>

          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-corner-decoration" style={{ background: `radial-gradient(circle, ${resumo.saldo >= 0 ? '#3b82f6' : '#f87171'}, transparent)` }}></div>
            <div className={`stat-icon ${resumo.saldo >= 0 ? 'stat-icon-blue' : 'stat-icon-red'}`}>$</div>
            <div className="stat-label">Saldo</div>
            <div className={`stat-value ${resumo.saldo >= 0 ? 'positive' : 'negative'}`}>{fmt(resumo.saldo)}</div>
            <div className="stat-sub">Saldo disponível</div>
          </div>
        </div>

        {/* MOVIMENTAÇÕES */}
        <div className="movimentacoes-section">
          <div className="section-header">
            <h2 className="section-title">Movimentações</h2>
            <span className="section-count">{lancamentos.length} transações</span>
          </div>

          {lancamentos.length === 0 ? (
            <div className="card empty-state">
              <p>Sem movimentações para este período</p>
            </div>
          ) : (
            <div className="movimentacoes-list">
              {lancamentos.map(l => (
                <div key={l.id} className={`movimentacao-item ${l.tipo}`} onClick={() => handleEditLancamento(l)}>
                  <div className="mov-left">
                    <div className="mov-icon" style={{ background: l.tipo === 'entrada' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)' }}>
                      {l.tipo === 'entrada' ? '↓' : '↑'}
                    </div>
                    <div className="mov-info">
                      <p className="mov-desc">{l.descricao}</p>
                      <p className="mov-date">{new Date(l.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className={`mov-value ${l.tipo}`}>
                    {l.tipo === 'entrada' ? '+' : '−'}{fmt(Math.abs(l.valor))}
                  </div>
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

export default Conta
