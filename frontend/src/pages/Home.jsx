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
  const { bancoAtivo, mes, ano, updateMesAno, isAddModalOpen, setIsAddModalOpen } = useContext(AppContext)
  const navigate = useNavigate()
  const [resumo, setResumo] = useState({
    entradas: 0,
    saidas: 0,
    saldo: 0,
    por_categoria: {}
  })
  const [fatura, setFatura] = useState(0)
  const [saldoAtual, setSaldoAtual] = useState(0)
  const [lancamentosCartao, setLancamentosCartao] = useState([])
  const [lancamentosConta, setLancamentosConta] = useState([])
  const [categorias, setCategorias] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLancamento, setEditingLancamento] = useState(null)
  const [mesSelecionado, setMesSelecionado] = useState(mes - 1)
  const [lancamentos, setLancamentos] = useState([])
  const [isEditInvestimentoModalOpen, setIsEditInvestimentoModalOpen] = useState(false)
  const [investimentoData, setInvestimentoData] = useState({
    investido: 16000,
    valor_atual: 16670,
  })
  const [selectedCategoryCartao, setSelectedCategoryCartao] = useState('Todas')
  const [selectedCategoryConta, setSelectedCategoryConta] = useState('Todas')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [lancamentoToDelete, setLancamentoToDelete] = useState(null)
  const [resumoItau, setResumoItau] = useState({ entradas: 0, saidas: 0, saldo: 0 })
  const [resumoVamoNessa, setResumoVamoNessa] = useState({ entradas: 0, saidas: 0, saldo: 0 })

  useEffect(() => {
    fetchCategorias()
    fetchFatura()
    fetchSaldo()
    fetchChartData()
    fetchLancamentosCartao()
    fetchLancamentosConta()
    fetchResumoItau()
    fetchResumoVamoNessa()
  }, [bancoAtivo, mes, ano])

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
      const response = await axios.get('/api/lancamentos', {
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
      setLancamentosCartao([])
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
      setLancamentosConta([])
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
    ? Object.entries(resumo.por_categoria).map(([cat, val]) => ({
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

        {/* MOBILE LAYOUT */}
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
                    const IconComponent = CATEGORY_ICONS[l.categoria]
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
                            <div className="mobile-trans-desc">{l.descricao}</div>
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


        {/* GASTOS POR CATEGORIA */}
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

        {/* OUTROS BANCOS */}
        <OutrosBancos />

        {/* INVESTIMENTOS CARD */}
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
