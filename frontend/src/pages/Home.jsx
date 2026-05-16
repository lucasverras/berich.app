import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import Icons from '../components/Icons'
import AddModal from '../components/AddModal'
import EditLancamentoModal from '../components/EditLancamentoModal'
import EditInvestimentoModal from '../components/EditInvestimentoModal'
import CategoryFilters from '../components/CategoryFilters'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import MonthCarousel from '../components/MonthCarousel'
import OutrosBancos from '../components/OutrosBancos'
import { UtensilsCrossed, Car, Home as HomeIcon, Heart, Gamepad2, BookOpen, ShoppingBag, Film, Plane, Zap } from 'lucide-react'
import logo from '../assets/logo/logo.svg'
import { getMockCartaoForMonth, getMockContaForMonth, calculateResumoFromLancamentos, calculateFaturaFromLancamentos } from '../utils/filterMockData'
import { getParcelText } from '../utils/formatParcel'
import './Home.css'

ChartJS.register(ArcElement, Tooltip, Legend)

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const CORES_PIZZA = ['#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac', '#bbf7d0', '#052e16']

const CATEGORY_ICONS = {
  'Alimentação': UtensilsCrossed,
  'Transporte': Car,
  'Moradia': HomeIcon,
  'Saúde': Heart,
  'Lazer': Gamepad2,
  'Educação': BookOpen,
  'Compras': ShoppingBag,
  'Diversão': Film,
  'Viagem': Plane,
  'Assinatura': Zap,
}

const BANKS = [
  { sigla: 'C6', nome: 'C6 Bank', tipo: 'Conta principal', saldo: 4250, bgColor: '#f59e0b' },
  { sigla: 'VN', nome: 'VamoNessa SP', tipo: 'Conta corrente', saldo: 2100.50, bgColor: '#a78bfa' },
  { sigla: 'IT', nome: 'Itaú', tipo: 'Conta corrente', saldo: 6400, bgColor: '#fb923c' },
]

const fmt = (v) => {
  if (!v) return 'R$ 0'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Home() {
  const { bancoAtivo, mes, ano, updateMesAno, isAddModalOpen, setIsAddModalOpen, diasFechamento } = useContext(AppContext)
  const navigate = useNavigate()
  const [resumo, setResumo] = useState({
    entradas: 8500,
    saidas: 3240.50,
    saldo: 5259.50,
    por_categoria: {
      'Alimentação': 850,
      'Transporte': 320,
      'Moradia': 1200,
      'Saúde': 450,
      'Lazer': 320,
      'Educação': 100
    }
  })
  const [fatura, setFatura] = useState(2450.75)
  const [saldoAtual, setSaldoAtual] = useState(12450.00)
  const [lancamentosCartao, setLancamentosCartao] = useState([
    { id: 1, descricao: 'Supermercado Carrefour', valor: 285.40, categoria: 'Alimentação', data: '2026-05-16', tipo: 'saída' },
    { id: 2, descricao: 'Spotify Premium Anual', valor: 119.90, categoria: 'Assinatura', data: '2026-05-15', tipo: 'saída' },
    { id: 3, descricao: 'Farmácia Drogasil', valor: 127.50, categoria: 'Saúde', data: '2026-05-14', tipo: 'saída' },
    { id: 4, descricao: 'Restaurante Outback Steakhouse', valor: 156.80, categoria: 'Alimentação', data: '2026-05-13', tipo: 'saída' },
    { id: 9, descricao: 'Uber Viagem', valor: 45.60, categoria: 'Transporte', data: '2026-05-12', tipo: 'saída' },
    { id: 10, descricao: 'Cinema 2 Ingressos', valor: 80.00, categoria: 'Lazer', data: '2026-05-11', tipo: 'saída' },
    { id: 11, descricao: 'Livraria Saraiva Livros', valor: 95.00, categoria: 'Educação', data: '2026-05-10', tipo: 'saída' },
    { id: 12, descricao: 'Padaria Doces da Vovó', valor: 52.30, categoria: 'Alimentação', data: '2026-05-09', tipo: 'saída' },
    { id: 17, descricao: 'iFood Delivery', valor: 68.90, categoria: 'Alimentação', data: '2026-05-08', tipo: 'saída' },
    { id: 18, descricao: 'Eletricista Serviço Casa', valor: 200.00, categoria: 'Moradia', data: '2026-05-07', tipo: 'saída' },
  ])
  const [lancamentosConta, setLancamentosConta] = useState([
    { id: 5, descricao: 'Salário Empresa XYZ', valor: 5500.00, categoria: 'Entrada', data: '2026-05-01', tipo: 'entrada' },
    { id: 6, descricao: 'Aluguel Apartamento 3Q', valor: -1800.00, categoria: 'Moradia', data: '2026-05-02', tipo: 'saída' },
    { id: 7, descricao: 'Freelance Design Gráfico', valor: 2000.00, categoria: 'Entrada', data: '2026-05-05', tipo: 'entrada' },
    { id: 8, descricao: 'Academia Smart Fit', valor: -99.90, categoria: 'Saúde', data: '2026-05-03', tipo: 'saída' },
    { id: 13, descricao: 'Cashback Cartão Crédito', valor: 156.30, categoria: 'Entrada', data: '2026-05-06', tipo: 'entrada' },
    { id: 14, descricao: 'Venda Livro OLX', valor: 45.00, categoria: 'Entrada', data: '2026-05-07', tipo: 'entrada' },
    { id: 15, descricao: 'Conta Telefone Claro', valor: -89.90, categoria: 'Assinatura', data: '2026-05-08', tipo: 'saída' },
    { id: 16, descricao: 'Dividendos Investimento', valor: 298.70, categoria: 'Entrada', data: '2026-05-09', tipo: 'entrada' },
    { id: 19, descricao: 'Seguro Carro Anual', valor: -450.00, categoria: 'Transporte', data: '2026-05-10', tipo: 'saída' },
    { id: 20, descricao: 'Venda Produto Ebay', valor: 320.00, categoria: 'Entrada', data: '2026-05-12', tipo: 'entrada' },
  ])
  const [categorias, setCategorias] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLancamento, setEditingLancamento] = useState(null)
  const [mesSelecionado, setMesSelecionado] = useState(mes - 1)
  const [lancamentos, setLancamentos] = useState([])
  const [isEditInvestimentoModalOpen, setIsEditInvestimentoModalOpen] = useState(false)
  const [investimentoData, setInvestimentoData] = useState({
    investido: 15000,
    valor_atual: 17850,
  })
  const [selectedCategoryCartao, setSelectedCategoryCartao] = useState('Todas')
  const [selectedCategoryConta, setSelectedCategoryConta] = useState('Todas')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [lancamentoToDelete, setLancamentoToDelete] = useState(null)
  const [resumoItau, setResumoItau] = useState({ entradas: 0, saidas: 0, saldo: 6400 })
  const [resumoVamoNessa, setResumoVamoNessa] = useState({ entradas: 0, saidas: 0, saldo: 2100.50 })

  useEffect(() => {
    fetchCategorias()

    // Filter mock data by selected month/year and closing day
    const diaFechamento = diasFechamento[mes] || 1
    const cartaoMes = getMockCartaoForMonth(mes, ano, diaFechamento)
    const contaMes = getMockContaForMonth(mes, ano, diaFechamento)

    setLancamentosCartao(cartaoMes)
    setLancamentosConta(contaMes)

    // Calculate fatura from filtered cartão transactions
    const faturaValue = calculateFaturaFromLancamentos(cartaoMes)
    setFatura(faturaValue)

    // Calculate resumo from filtered conta transactions
    const resumoValue = calculateResumoFromLancamentos(contaMes)
    setSaldoAtual(resumoValue.saldo)
    setResumo(prev => ({
      ...prev,
      ...resumoValue
    }))

    fetchResumoItau()
    fetchResumoVamoNessa()
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

  const fetchSaldo = async () => {
    try {
      const response = await axios.get('/api/resumo', {
        params: {
          banco: bancoAtivo,
          mes,
          ano,
          forma_pagamento: 'pix',
        }
      })
      setSaldoAtual(response.data.saldo || 0)
    } catch (error) {
      console.error('Erro ao buscar saldo:', error)
    }
  }

  const fetchLancamentosCartao = async () => {
    try {
      const response = await axios.get('/api lancamentos', {
        params: {
          banco: bancoAtivo,
          forma_pagamento: 'cartão',
          mes,
          ano,
          limit: 5
        }
      })
      setLancamentosCartao(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar lançamentos cartão:', error)
      // Manter dados fictícios em caso de erro
    }
  }

  const fetchLancamentosConta = async () => {
    try {
      const response = await axios.get('/api/lancamentos', {
        params: {
          banco: bancoAtivo,
          forma_pagamento: 'pix',
          mes,
          ano,
          limit: 5
        }
      })
      setLancamentosConta(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar lançamentos conta:', error)
      // Manter dados fictícios em caso de erro
    }
  }

  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/lancamentos', {
        params: {
          banco: bancoAtivo,
          mes,
          ano,
        }
      })
      const lancamentos = response.data || []
      const byCategory = {}
      lancamentos.forEach(l => {
        if (l.categoria) {
          byCategory[l.categoria] = (byCategory[l.categoria] || 0) + Math.abs(l.valor)
        }
      })
      setResumo(prev => ({
        ...prev,
        por_categoria: byCategory
      }))
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error)
    }
  }

  const fetchResumoItau = async () => {
    try {
      const response = await axios.get('/api/resumo', {
        params: {
          banco: 'Itaú',
          mes,
          ano,
          forma_pagamento: 'pix',
        }
      })
      setResumoItau({
        entradas: response.data.entradas || 0,
        saidas: response.data.saidas || 0,
        saldo: response.data.saldo || 0,
      })
    } catch (error) {
      console.error('Erro ao buscar resumo Itaú:', error)
    }
  }

  const fetchResumoVamoNessa = async () => {
    try {
      const response = await axios.get('/api/resumo', {
        params: {
          banco: 'VamoNessa SP',
          mes,
          ano,
          forma_pagamento: 'pix',
        }
      })
      setResumoVamoNessa({
        entradas: response.data.entradas || 0,
        saidas: response.data.saidas || 0,
        saldo: response.data.saldo || 0,
      })
    } catch (error) {
      console.error('Erro ao buscar resumo VamoNessa:', error)
    }
  }

  const getSaudacao = () => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12) return 'Bom dia'
    if (h >= 12 && h < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const handleMesChange = (novoMes) => {
    setMesSelecionado(novoMes)
    updateMesAno(novoMes + 1, ano)
  }

  const handleEditLancamento = (lancamento) => {
    setEditingLancamento(lancamento)
    setIsEditModalOpen(true)
  }

  const handleLancamentoSaved = () => {
    fetchFatura()
    fetchSaldo()
    fetchLancamentosCartao()
    fetchLancamentosConta()
  }

  const getCategoriesByUsage = () => {
    const allLancamentos = [...lancamentosCartao, ...lancamentosConta]
    const categoryCount = {}
    allLancamentos.forEach(l => {
      if (l.categoria) {
        categoryCount[l.categoria] = (categoryCount[l.categoria] || 0) + 1
      }
    })
    const sorted = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat)
    return sorted
  }

  const getFilteredTransactions = (category, type = 'all') => {
    let allLancamentos
    if (type === 'cartao') {
      allLancamentos = lancamentosCartao
    } else if (type === 'conta') {
      allLancamentos = lancamentosConta
    } else {
      allLancamentos = [...lancamentosCartao, ...lancamentosConta]
    }
    allLancamentos = allLancamentos.sort((a, b) => new Date(b.data) - new Date(a.data))
    if (category === 'Todas') return allLancamentos
    return allLancamentos.filter(l => l.categoria === category)
  }

  const getTransactionsByCategory = (type = 'cartao') => {
    const lancamentos = type === 'cartao' ? lancamentosCartao : lancamentosConta
    const grouped = {}
    lancamentos.forEach(l => {
      const cat = l.categoria || 'Sem categoria'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(l)
    })

    // Calcular total por categoria e ordenar
    const categoriesWithTotal = Object.entries(grouped).map(([cat, items]) => {
      const total = items.reduce((sum, item) => sum + Math.abs(item.valor), 0)
      return { cat, items: items.sort((a, b) => new Date(b.data) - new Date(a.data)), total }
    }).sort((a, b) => b.total - a.total)

    return categoriesWithTotal
  }

  const chartData = resumo.por_categoria
    ? Object.entries(resumo.por_categoria)
        .filter(([cat]) => cat !== 'Entrada') // Exclude income entries
        .map(([cat, val]) => ({
          name: cat,
          valor: parseFloat(val)
        })).sort((a, b) => b.valor - a.valor)
    : []

  const totalGastos = chartData.reduce((sum, item) => sum + item.valor, 0)

  const doughnutChartData = {
    labels: chartData.map(e => e.name),
    datasets: [
      {
        data: chartData.map(e => e.valor),
        backgroundColor: chartData.map((e, i) => CORES_PIZZA[i] || '#052e16'),
        borderWidth: 0,
        hoverOffset: 10,
      }
    ]
  }

  const tooltipOpts = {
    backgroundColor: '#071007',
    borderColor: 'rgba(34,197,94,0.4)',
    borderWidth: 1,
    titleColor: '#f0fdf4',
    bodyColor: '#86efac',
    padding: 14,
    cornerRadius: 10,
    displayColors: true,
    callbacks: {
      title: (items) => items[0].label,
      label: (ctx) => {
        const val = ctx.parsed
        const pct = ((val / totalGastos) * 100).toFixed(1)
        const formatted = val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        return `  ${formatted}  ·  ${pct}%`
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: tooltipOpts,
      legend: { display: false }
    }
  }

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768)
  const isMobile = windowWidth < 768

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="home-layout">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>

      <div className="home-main">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <img src={logo} alt="BE.RICH" className="logo-icon" />
            <div>
              <h1>
                <span className="header-icon">👋</span>
                {getSaudacao()}, Lucas
              </h1>
              <p>Visão geral das suas finanças — {MESES[mesSelecionado]} {ano}</p>
            </div>
          </div>
        </div>

        <MonthCarousel
          mesSelecionado={mesSelecionado}
          onChange={(novoMes) => {
            setMesSelecionado(novoMes)
            updateMesAno(novoMes + 1, ano)
          }}
        />

        {isMobile ? (
        /* MOBILE LAYOUT */
        <div className="mobile-home-section">
          {/* A) CARD DE SALDO ATUAL */}
          <div className="mobile-saldo-card">
            <div className="mobile-label">Saldo Atual</div>
            <div className="mobile-amount">{fmt(saldoAtual)}</div>
          </div>

          {/* B) CARD DE FATURA DO CARTÃO (separado) */}
          <div className="mobile-fatura-card" onClick={() => navigate('/fatura')}>
            <div className="mobile-fatura-left">
              <span className="mobile-fatura-label">Fatura do Cartão</span>
              <span className="mobile-fatura-amount">{fmt(Math.abs(fatura))}</span>
            </div>
            <div className="mobile-fatura-right">
              <span className="mobile-fatura-month">{MESES[mesSelecionado]}</span>
            </div>
          </div>

          {/* C) SEÇÃO TRANSAÇÕES */}
          {lancamentosCartao.length > 0 && (
            <div className="mobile-transactions-section">
              <div className="mobile-section-header">
                <h3>Transações</h3>
                <a href="/fatura" className="mobile-see-all">Ver todos →</a>
              </div>

              <CategoryFilters
                categories={getCategoriesByUsage()}
                selectedCategory={selectedCategoryCartao}
                onCategoryChange={setSelectedCategoryCartao}
              />

              <div className="mobile-transactions">
                {getFilteredTransactions(selectedCategoryCartao, 'cartao').length > 0 ? (
                  getFilteredTransactions(selectedCategoryCartao, 'cartao').map(l => {
                    const IconComponent = CATEGORY_ICONS[l.categoria];
                    const parcelText = getParcelText(l);
                    return (
                      <div
                        key={l.id}
                        className="mobile-trans-item"
                        onClick={() => handleEditLancamento(l)}
                      >
                        <div className="mobile-trans-left">
                          <div className={`mobile-trans-icon ${l.tipo}`}>
                            {IconComponent ? <IconComponent size={20} /> : <span>{l.tipo === 'entrada' ? '↑' : '↓'}</span>}
                          </div>
                          <div className="mobile-trans-info">
                            <div className="mobile-trans-desc" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {l.descricao}
                              {parcelText && <span style={{ fontSize: '11px', color: 'var(--green-hero)', fontWeight: 'bold' }}>{parcelText}</span>}
                            </div>
                            <div className="mobile-trans-meta">{l.categoria} • {new Date(l.data).toLocaleDateString('pt-BR')}</div>
                          </div>
                        </div>
                        <div className={`mobile-trans-value ${l.tipo}`}>
                          {l.tipo === 'entrada' ? '+' : '−'}{fmt(Math.abs(l.valor))}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="empty-state-text">Nenhuma transação. Toque em + para criar uma.</div>
                )}
              </div>
            </div>
          )}

          {/* D) SEÇÃO OUTROS BANCOS */}
          <div className="outros-bancos-mobile">
            <h3>Outros Bancos</h3>

            <div className="banco-card-item" onClick={() => navigate('/banco/Itaú')}>
              <div className="banco-avatar" style={{ background: '#fb923c' }}>IT</div>
              <div className="banco-info">
                <span className="banco-nome">Itaú</span>
                <span className="banco-sub">Conta corrente</span>
              </div>
              <span className={resumoItau.saldo >= 0 ? 'saldo-pos' : 'saldo-neg'}>
                {fmt(resumoItau.saldo)}
              </span>
            </div>

            <div className="banco-card-item" onClick={() => navigate('/banco/VamoNessa SP')}>
              <div className="banco-avatar" style={{ background: '#a78bfa' }}>VN</div>
              <div className="banco-info">
                <span className="banco-nome">VamoNessa SP</span>
                <span className="banco-sub">Conta corrente</span>
              </div>
              <span className={resumoVamoNessa.saldo >= 0 ? 'saldo-pos' : 'saldo-neg'}>
                {fmt(resumoVamoNessa.saldo)}
              </span>
            </div>
          </div>
        </div>
        ) : (
        /* DESKTOP LAYOUT */
        <>
          {/* LINHA 1 — Cartão e Conta lado a lado */}
          <div className="desktop-grid-2col">
            {/* Coluna esquerda — Cartão */}
            <div className="desktop-col">
              <div className="card">
                <div className="card-label">FATURA DO CARTÃO</div>
                <div className="card-value negative">{fmt(Math.abs(fatura))}</div>
                <div className="card-sub">{MESES[mesSelecionado]} · Pague manualmente</div>
              </div>
              <div className="card">
                <div className="card-header-row">
                  <span>ÚLTIMOS LANÇAMENTOS</span>
                  <span className="badge">{lancamentosCartao.length}</span>
                </div>
                {lancamentosCartao.length === 0 ? (
                  <p className="empty-text">Nenhum lançamento no cartão. Use o botão + para adicionar.</p>
                ) : (
                  <>
                    {lancamentosCartao.slice(0, 5).map((l, idx) => {
                      const parcelText = getParcelText(l);
                      return (
                        <div
                          key={l.id}
                          className="lancamento-row"
                          onClick={() => handleEditLancamento(l)}
                          style={{ opacity: 1 - (idx * 0.15) }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                            <span>{l.descricao}</span>
                            {parcelText && <span style={{ fontSize: '12px', color: 'var(--green-hero)', fontWeight: 'bold', minWidth: 'fit-content', marginLeft: '8px' }}>{parcelText}</span>}
                          </div>
                          <span className="negative">{fmt(Math.abs(l.valor))}</span>
                        </div>
                      );
                    })}
                    {lancamentosCartao.length > 5 && (
                      <div
                        className="lancamento-row"
                        onClick={() => navigate('/fatura')}
                        style={{ textAlign: 'center', cursor: 'pointer', color: 'var(--green-hero)', fontWeight: '500', marginTop: '8px' }}
                      >
                        Ver todos {lancamentosCartao.length} →
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Coluna direita — Conta */}
            <div className="desktop-col">
              <div className="card">
                <div className="card-label">SALDO DA CONTA</div>
                <div className={`card-value ${saldoAtual >= 0 ? 'positive' : 'negative'}`}>{fmt(saldoAtual)}</div>
                <div className="card-sub">Saldo disponível</div>
              </div>
              <div className="card">
                <div className="card-header-row">
                  <span>ÚLTIMOS LANÇAMENTOS</span>
                  <span className="badge">{lancamentosConta.length}</span>
                </div>
                {lancamentosConta.length === 0 ? (
                  <p className="empty-text">Nenhum lançamento na conta. Use o botão + para adicionar.</p>
                ) : (
                  <>
                    {lancamentosConta.slice(0, 5).map((l, idx) => {
                      const parcelText = getParcelText(l);
                      return (
                        <div
                          key={l.id}
                          className="lancamento-row"
                          onClick={() => handleEditLancamento(l)}
                          style={{ opacity: 1 - (idx * 0.15) }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                            <span>{l.descricao}</span>
                            {parcelText && <span style={{ fontSize: '12px', color: 'var(--green-hero)', fontWeight: 'bold', minWidth: 'fit-content', marginLeft: '8px' }}>{parcelText}</span>}
                          </div>
                          <span className={l.tipo === 'entrada' ? 'positive' : 'negative'}>
                            {l.tipo === 'entrada' ? '+' : '-'}{fmt(Math.abs(l.valor))}
                          </span>
                        </div>
                      );
                    })}
                    {lancamentosConta.length > 5 && (
                      <div
                        className="lancamento-row"
                        onClick={() => navigate('/conta')}
                        style={{ textAlign: 'center', cursor: 'pointer', color: 'var(--green-hero)', fontWeight: '500', marginTop: '8px' }}
                      >
                        Ver todos {lancamentosConta.length} →
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* LINHA 2 — Gráfico largura total */}
          <div className="chart-card-section">
            <div className="card chart-card">
              <p className="card-title">Gastos por categoria</p>
              {chartData.length > 0 ? (
                <>
                  <div className="chart-wrapper">
                    <Doughnut data={doughnutChartData} options={doughnutOptions} />
                    <div className="chart-center">
                      <span className="chart-center-val">{fmt(totalGastos)}</span>
                      <span className="chart-center-label">gasto no mês</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    {chartData.filter(item => item.valor > 0).map((item, i) => {
                      const pct = ((item.valor / totalGastos) * 100).toFixed(1)
                      const valorFmt = item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      const catColor = CORES_PIZZA[i] || '#052e16'
                      return (
                        <div key={item.name} className="legend-tag" style={{ borderColor: catColor }}>
                          <span className="legend-tag-name">{item.name}</span>
                          <span className="legend-tag-info"> - {valorFmt} - {pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="chart-empty">
                  <p>Sem dados para este período</p>
                </div>
              )}
            </div>
          </div>

          {/* LINHA 3 — Outros Bancos e Investimentos lado a lado */}
          <div className="desktop-grid-2col">
            <div className="desktop-col">
              <OutrosBancos />
            </div>
            <div className="desktop-col">
              <div className="investment-card" onClick={() => setIsEditInvestimentoModalOpen(true)}>
                <div className="card-header">
                  <span className="card-title">Investimentos</span>
                  <span className="card-badge">{((((investimentoData.valor_atual - investimentoData.investido) / investimentoData.investido) * 100).toFixed(2))}%</span>
                </div>

                <div className="investment-main">
                  <div className="inv-metric">
                    <div className="inv-metric-label">Investido</div>
                    <div className="inv-metric-value">{fmt(investimentoData.investido)}</div>
                  </div>
                  <div className="inv-metric">
                    <div className="inv-metric-label">Valor atual</div>
                    <div className="inv-metric-value green">{fmt(investimentoData.valor_atual)}</div>
                  </div>
                  <div className="inv-metric">
                    <div className="inv-metric-label">Resultado</div>
                    <div className={`inv-metric-value ${investimentoData.valor_atual - investimentoData.investido >= 0 ? 'green' : 'red'}`}>
                      {investimentoData.valor_atual - investimentoData.investido >= 0 ? '+' : '−'}R$ {Math.abs(investimentoData.valor_atual - investimentoData.investido).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="inv-cta" onClick={(e) => { e.stopPropagation(); navigate('/investimentos'); }}>
                  Ver investimentos →
                </div>
              </div>
            </div>
          </div>
        </>
        )}
      </div>

      {/* AddModal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLancamentoAdded={() => {
          handleLancamentoSaved()
          setIsAddModalOpen(false)
        }}
      />

      {/* EditLancamentoModal */}
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

      {/* EditInvestimentoModal */}
      <EditInvestimentoModal
        isOpen={isEditInvestimentoModalOpen}
        investimento={investimentoData}
        onClose={() => setIsEditInvestimentoModalOpen(false)}
        onSaved={(dados) => {
          setInvestimentoData({
            investido: dados.investido,
            valor_atual: dados.valor_atual,
          })
        }}
      />

      {/* ConfirmDeleteModal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        lancamento={lancamentoToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setLancamentoToDelete(null)
        }}
        onDeleted={() => {
          handleLancamentoSaved()
          setLancamentoToDelete(null)
        }}
      />
    </div>
  )
}

export default Home
