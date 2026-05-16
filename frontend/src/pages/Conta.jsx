import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import Icons from '../components/Icons'
import AddModal from '../components/AddModal'
import EditLancamentoModal from '../components/EditLancamentoModal'
import MonthCarousel from '../components/MonthCarousel'
import { getParcelText } from '../utils/formatParcel'
import { transacoesData } from '../data/transacoes'
import { getCategoryColor, getCategoryEmoji } from '../data/categoriesStore'
import './Conta.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']


const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const converterParaLancamento = (transacao, id) => ({
  id,
  descricao: transacao.motivo,
  valor: transacao.tipo === 'entrada' ? transacao.valor : Math.abs(transacao.valor),
  categoria: transacao.categoria || 'Sem categoria',
  data: transacao.data,
  tipo: transacao.tipo,
  forma_pagamento: 'pix',
  parcelas_total: null,
})

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

    // Get real data from transacoes (Saldo sheet)
    const mesNome = MESES[mes - 1]
    const sheetKey = `${mesNome} Saldo ${ano}`
    const transacoes = transacoesData[sheetKey] || []

    // Convert transacoes to lancamentos format
    const novoLancamentos = transacoes
      .map((t, idx) => converterParaLancamento(t, idx + 1))
      .sort((a, b) => new Date(b.data) - new Date(a.data))

    setLancamentos(novoLancamentos)

    // Calculate resumo
    let entradas = 0
    let saidas = 0
    novoLancamentos.forEach(l => {
      if (l.tipo === 'entrada') {
        entradas += l.valor
      } else {
        saidas += l.valor
      }
    })

    setResumo({
      entradas,
      saidas,
      saldo: entradas - saidas
    })
  }, [mes, ano])

  const getCatEmoji = (lancamento) => {
    if (lancamento.parcelado) {
      return getCategoryEmoji('Sem categoria')
    }
    return getCategoryEmoji(lancamento.categoria || 'Sem categoria')
  }

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
      // Manter dados fictícios em caso de erro
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
              {(() => {
                const parceladas = lancamentos.filter(l => l.parcelas_total);
                const normais = lancamentos.filter(l => !l.parcelas_total);

                return (
                  <>
                    {parceladas.map(l => {
                      const parcelText = getParcelText(l);
                      const emoji = getCatEmoji(l);
                      const catColor = getCategoryColor(l.categoria);
                      return (
                        <div key={l.id} className={`movimentacao-item ${l.tipo}`} onClick={() => handleEditLancamento(l)} style={{
                          backgroundColor: `${catColor}15`,
                          borderLeftColor: catColor,
                          borderLeftWidth: '3px'
                        }}>
                          <div className="mov-left">
                            <div className="mov-icon-emoji">
                              {emoji}
                            </div>
                            <div className="mov-info">
                              <p className="mov-desc" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {l.descricao}
                                {parcelText && <span style={{ fontSize: '11px', color: 'var(--green-hero)', fontWeight: 'bold' }}>{parcelText}</span>}
                              </p>
                              <p className="mov-category" style={{ color: catColor }}>{l.categoria || 'Sem categoria'}</p>
                              <p className="mov-date">{new Date(l.data).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <div className={`mov-value ${l.tipo}`}>
                            {l.tipo === 'entrada' ? '+' : '−'}{fmt(Math.abs(l.valor))}
                          </div>
                        </div>
                      );
                    })}
                    {parceladas.length > 0 && normais.length > 0 && (
                      <div style={{ height: '1px', background: 'hsl(var(--border))', margin: '12px 0 12px 0', opacity: 0.3 }}></div>
                    )}
                    {normais.map(l => {
                      const parcelText = getParcelText(l);
                      const emoji = getCategoryEmoji(l);
                      const catColor = getCategoryColor(l.categoria);
                      return (
                        <div key={l.id} className={`movimentacao-item ${l.tipo}`} onClick={() => handleEditLancamento(l)} style={{
                          backgroundColor: `${catColor}15`,
                          borderLeftColor: catColor,
                          borderLeftWidth: '3px'
                        }}>
                          <div className="mov-left">
                            <div className="mov-icon-emoji">
                              {emoji}
                            </div>
                            <div className="mov-info">
                              <p className="mov-desc" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {l.descricao}
                                {parcelText && <span style={{ fontSize: '11px', color: 'var(--green-hero)', fontWeight: 'bold' }}>{parcelText}</span>}
                              </p>
                              <p className="mov-category" style={{ color: catColor }}>{l.categoria || 'Sem categoria'}</p>
                              <p className="mov-date">{new Date(l.data).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <div className={`mov-value ${l.tipo}`}>
                            {l.tipo === 'entrada' ? '+' : '−'}{fmt(Math.abs(l.valor))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
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
