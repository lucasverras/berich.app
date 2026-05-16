import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import AddModal from '../components/AddModal'
import EditLancamentoModal from '../components/EditLancamentoModal'
import MonthCarousel from '../components/MonthCarousel'
import { getMockCartaoForMonth, calculateFaturaFromLancamentos } from '../utils/filterMockData'
import { getParcelText } from '../utils/formatParcel'
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
  const { bancoAtivo, mes, ano, updateMesAno, diasFechamento } = useContext(AppContext)
  const [fatura, setFatura] = useState(2650.75)
  const [lancamentos, setLancamentos] = useState([
    { id: 1, descricao: 'Supermercado Carrefour', valor: 285.40, categoria: 'Alimentação', data: '2026-05-16', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 2, descricao: 'Spotify Premium Anual', valor: 119.90, categoria: 'Assinatura', data: '2026-05-15', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 3, descricao: 'Farmácia Drogasil', valor: 127.50, categoria: 'Saúde', data: '2026-05-14', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 4, descricao: 'Restaurante Outback Steakhouse', valor: 156.80, categoria: 'Alimentação', data: '2026-05-13', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 9, descricao: 'Uber Viagem Centro', valor: 45.60, categoria: 'Transporte', data: '2026-05-12', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 10, descricao: 'Cinema 2 Ingressos', valor: 80.00, categoria: 'Lazer', data: '2026-05-11', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 11, descricao: 'Livraria Saraiva Livros', valor: 95.00, categoria: 'Educação', data: '2026-05-10', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 12, descricao: 'Padaria Doces da Vovó', valor: 52.30, categoria: 'Alimentação', data: '2026-05-09', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 17, descricao: 'iFood Delivery Almoço', valor: 68.90, categoria: 'Alimentação', data: '2026-05-08', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 18, descricao: 'Eletricista Reparo Casa', valor: 200.00, categoria: 'Moradia', data: '2026-05-07', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 21, descricao: 'Estacionamento Valet', valor: 75.00, categoria: 'Transporte', data: '2026-05-06', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 22, descricao: 'Barbearia Premium', valor: 85.00, categoria: 'Pessoal', data: '2026-05-05', tipo: 'saída', forma_pagamento: 'cartão' },
    { id: 23, descricao: 'Netflix + Amazon Prime', valor: 35.80, categoria: 'Assinatura', data: '2026-05-04', tipo: 'saída', forma_pagamento: 'cartão' },
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
    const cartaoMes = getMockCartaoForMonth(mes, ano, diaFechamento)
    setLancamentos(cartaoMes)

    // Calculate fatura from filtered transactions
    const faturaValue = calculateFaturaFromLancamentos(cartaoMes)
    setFatura(faturaValue)
  }, [bancoAtivo, mes, ano, diasFechamento])

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
          mes,
          ano,
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
          mes,
          ano,
          forma_pagamento: 'cartão',
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
            <p>Fatura do cartão — {MESES[mesSelecionado]} {ano}</p>
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
              {(() => {
                const parceladas = lancamentos.filter(l => l.parcelas_total);
                const normais = lancamentos.filter(l => !l.parcelas_total);

                return (
                  <>
                    {parceladas.map(l => {
                      const parcelText = getParcelText(l);
                      return (
                        <div key={l.id} className="transacao-item" onClick={() => handleEditLancamento(l)}>
                          <div className="tra-left">
                            <div className="tra-icon">📌</div>
                            <div className="tra-info">
                              <p className="tra-desc" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {l.descricao}
                                {parcelText && <span style={{ fontSize: '16px', color: 'var(--green-hero)', fontWeight: 'bold' }}>{parcelText}</span>}
                              </p>
                              <p className="tra-date">{new Date(l.data).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <div className="tra-value negative">{fmt(Math.abs(l.valor))}</div>
                        </div>
                      );
                    })}
                    {parceladas.length > 0 && normais.length > 0 && (
                      <div style={{ height: '1px', background: 'hsl(var(--border))', margin: '12px 0 12px 0', opacity: 0.3 }}></div>
                    )}
                    {normais.map(l => {
                      const parcelText = getParcelText(l);
                      return (
                        <div key={l.id} className="transacao-item" onClick={() => handleEditLancamento(l)}>
                          <div className="tra-left">
                            <div className="tra-icon">📌</div>
                            <div className="tra-info">
                              <p className="tra-desc" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {l.descricao}
                                {parcelText && <span style={{ fontSize: '11px', color: 'var(--green-hero)', fontWeight: 'bold' }}>{parcelText}</span>}
                              </p>
                              <p className="tra-date">{new Date(l.data).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <div className="tra-value negative">{fmt(Math.abs(l.valor))}</div>
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

export default Fatura
