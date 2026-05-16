import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import Icons from '../components/Icons'
import AddModal from '../components/AddModal'
import EditLancamentoModal from '../components/EditLancamentoModal'
import MonthCarousel from '../components/MonthCarousel'
import { getMockContaForMonth, calculateResumoFromLancamentos } from '../utils/filterMockData'
import { getParcelText } from '../utils/formatParcel'
import './Conta.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const CATEGORY_EMOJIS = {
  'Alimentação': '🍔',
  'Bebidas': '🍷',
  'Transporte': '🚗',
  'Moradia': '🏠',
  'Saúde': '⚕️',
  'Lazer': '🎮',
  'Educação': '📚',
  'Compras': '🛍️',
  'Diversão': '🎬',
  'Viagem': '✈️',
  'Assinatura': '⚡',
  'Entrada': '💰',
  'Renda': '💵',
  'Cashback': '🎁',
  'Freelance': '💼',
  'Investimento': '📈',
  'Pessoal': '💇',
  'Sem categoria': '📌',
}

const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Conta() {
  const { bancoAtivo, mes, ano, updateMesAno, diasFechamento } = useContext(AppContext)
  const navigate = useNavigate()
  const [resumo, setResumo] = useState({ entradas: 10000.00, saidas: 2390.80, saldo: 12450.00 })
  const [lancamentos, setLancamentos] = useState([
    { id: 5, descricao: 'Salário Empresa XYZ', valor: 5500.00, categoria: 'Entrada', data: '2026-05-01', tipo: 'entrada', forma_pagamento: 'pix' },
    { id: 6, descricao: 'Aluguel Apartamento 3Q', valor: -1800.00, categoria: 'Moradia', data: '2026-05-02', tipo: 'saída', forma_pagamento: 'pix' },
    { id: 7, descricao: 'Freelance Design Gráfico', valor: 2000.00, categoria: 'Entrada', data: '2026-05-05', tipo: 'entrada', forma_pagamento: 'pix' },
    { id: 8, descricao: 'Academia Smart Fit', valor: -99.90, categoria: 'Saúde', data: '2026-05-03', tipo: 'saída', forma_pagamento: 'pix' },
    { id: 13, descricao: 'Cashback Cartão Crédito', valor: 156.30, categoria: 'Entrada', data: '2026-05-06', tipo: 'entrada', forma_pagamento: 'pix' },
    { id: 14, descricao: 'Venda Livro OLX', valor: 45.00, categoria: 'Entrada', data: '2026-05-07', tipo: 'entrada', forma_pagamento: 'pix' },
    { id: 15, descricao: 'Conta Telefone Claro', valor: -89.90, categoria: 'Assinatura', data: '2026-05-08', tipo: 'saída', forma_pagamento: 'pix' },
    { id: 16, descricao: 'Dividendos Investimento', valor: 298.70, categoria: 'Entrada', data: '2026-05-09', tipo: 'entrada', forma_pagamento: 'pix' },
    { id: 19, descricao: 'Seguro Carro Anual', valor: -450.00, categoria: 'Transporte', data: '2026-05-10', tipo: 'saída', forma_pagamento: 'pix' },
    { id: 20, descricao: 'Venda Produto Ebay', valor: 320.00, categoria: 'Entrada', data: '2026-05-12', tipo: 'entrada', forma_pagamento: 'pix' },
    { id: 24, descricao: 'Consultoria Financeira', valor: 1000.00, categoria: 'Entrada', data: '2026-05-13', tipo: 'entrada', forma_pagamento: 'pix' },
    { id: 25, descricao: 'Conta Água e Esgoto', valor: -150.00, categoria: 'Moradia', data: '2026-05-14', tipo: 'saída', forma_pagamento: 'pix' },
    { id: 26, descricao: 'Internet Fibra Óptica', valor: -99.90, categoria: 'Assinatura', data: '2026-05-15', tipo: 'saída', forma_pagamento: 'pix' },
    { id: 27, descricao: 'Bônus Gerente - Trabalho', valor: 680.00, categoria: 'Entrada', data: '2026-05-16', tipo: 'entrada', forma_pagamento: 'pix' },
  ])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLancamento, setEditingLancamento] = useState(null)
  const [mesSelecionado, setMesSelecionado] = useState(mes - 1)
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetchCategorias()

    // Filter mock data by selected month/year and closing day
    const diaFechamento = diasFechamento[mes] || 1
    const contaMes = getMockContaForMonth(mes, ano, diaFechamento)
    setLancamentos(contaMes)

    // Calculate resumo from filtered transactions
    const resumoValue = calculateResumoFromLancamentos(contaMes)
    setResumo({
      entradas: resumoValue.entradas,
      saidas: resumoValue.saidas,
      saldo: resumoValue.saldo
    })
  }, [bancoAtivo, mes, ano, diasFechamento])

  const getCategoryEmoji = (lancamento) => {
    if (lancamento.parcelado) {
      return '📌'
    }
    const categoria = lancamento.categoria || 'Sem categoria'
    return CATEGORY_EMOJIS[categoria] || '📌'
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
                      const emoji = getCategoryEmoji(l);
                      return (
                        <div key={l.id} className={`movimentacao-item ${l.tipo}`} onClick={() => handleEditLancamento(l)}>
                          <div className="mov-left">
                            <div className="mov-icon-emoji">
                              {emoji}
                            </div>
                            <div className="mov-info">
                              <p className="mov-desc" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {l.descricao}
                                {parcelText && <span style={{ fontSize: '11px', color: 'var(--green-hero)', fontWeight: 'bold' }}>{parcelText}</span>}
                              </p>
                              <p className="mov-category">{l.categoria || 'Sem categoria'}</p>
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
                      return (
                        <div key={l.id} className={`movimentacao-item ${l.tipo}`} onClick={() => handleEditLancamento(l)}>
                          <div className="mov-left">
                            <div className="mov-icon-emoji">
                              {emoji}
                            </div>
                            <div className="mov-info">
                              <p className="mov-desc" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {l.descricao}
                                {parcelText && <span style={{ fontSize: '11px', color: 'var(--green-hero)', fontWeight: 'bold' }}>{parcelText}</span>}
                              </p>
                              <p className="mov-category">{l.categoria || 'Sem categoria'}</p>
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
