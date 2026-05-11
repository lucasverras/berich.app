import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import Icons from '../components/Icons'
import AddModal from '../components/AddModal'
import './Home.css'

ChartJS.register(ArcElement, Tooltip, Legend)

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const CORES_PIZZA = ['#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac', '#bbf7d0', '#052e16']

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
  const { bancoAtivo, mesAno, updateMesAno } = useContext(AppContext)
  const navigate = useNavigate()
  const [resumo, setResumo] = useState({
    entradas: 5400,
    saidas: 3200,
    saldo: 8750,
    por_categoria: {
      'Alimentação': 890,
      'Transporte': 340,
      'Moradia': 1200,
      'Saúde': 280,
      'Lazer': 420,
      'Educação': 70
    }
  })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [mesSelecionado, setMesSelecionado] = useState(mesAno.mes - 1)
  const [lancamentos, setLancamentos] = useState([])

  useEffect(() => {
    fetchResumo()
    fetchLancamentos()
  }, [bancoAtivo, mesAno.mes, mesAno.ano])

  const fetchResumo = async () => {
    try {
      const response = await axios.get('/api/resumo', {
        params: {
          banco: bancoAtivo,
          mes: mesAno.mes,
          ano: mesAno.ano,
        }
      })
      setResumo(response.data || { entradas: 0, saidas: 0, saldo: 0, por_categoria: {} })
    } catch (error) {
      console.error('Erro ao buscar resumo:', error)
    }
  }

  const fetchLancamentos = async () => {
    try {
      const response = await axios.get('/api/lancamentos', {
        params: {
          banco: bancoAtivo,
          mes: mesAno.mes,
          ano: mesAno.ano,
          limit: 5
        }
      })
      setLancamentos(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error)
      setLancamentos([])
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
    updateMesAno(novoMes + 1, mesAno.ano)
    setDropdownAberto(false)
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
            <h1>
              <span className="header-icon">👋</span>
              {getSaudacao()}, Lucas
            </h1>
            <p>Visão geral das suas finanças — {MESES[mesSelecionado]} {mesAno.ano}</p>
          </div>
          <div className="month-picker" onClick={() => setDropdownAberto(!dropdownAberto)}>
            <span>{MESES[mesSelecionado]} {mesAno.ano}</span>
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
        <div className="stats-grid">
          <div className="stat-card stat-card-glass stat-card-glow" onClick={() => navigate('/fatura')}>
            <div className="stat-corner-decoration" style={{ background: 'radial-gradient(circle, #f87171, transparent)' }}></div>
            <div className="stat-icon stat-icon-red">📊</div>
            <div className="stat-label">Fatura do Mês</div>
            <div className="stat-value negative">{fmt(Math.abs(resumo.saidas))}</div>
            <div className="stat-sub">{MESES[mesSelecionado]} · Sem gastos registrados</div>
          </div>

          <div className="stat-card stat-card-glass stat-card-glow" onClick={() => navigate('/conta')}>
            <div className="stat-corner-decoration" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}></div>
            <div className="stat-icon stat-icon-blue">$</div>
            <div className="stat-label">Saldo Atual</div>
            <div className="stat-value">{fmt(resumo.saldo)}</div>
            <div className="stat-sub">Movimentação total</div>
          </div>

          <div className="stat-card stat-card-glass stat-card-glow">
            <div className="stat-corner-decoration" style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }}></div>
            <div className="stat-icon stat-icon-green">↑</div>
            <div className="stat-label">Entradas</div>
            <div className="stat-value positive">+{fmt(resumo.entradas)}</div>
            <div className="stat-sub">Receitas do período</div>
          </div>
        </div>

        {/* FATURA SECTION */}
        <div className="fatura-section">
          <h2 className="section-title">FATURA</h2>
          <div className="fatura-indicators">
            {lancamentos.length > 0 ? (
              lancamentos.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="fatura-indicator"
                  style={{ opacity: i === 4 && lancamentos.length >= 5 ? 0.2 : 1 }}
                  title={item.descricao || 'Lançamento'}
                ></div>
              ))
            ) : (
              <div className="fatura-empty">Sem lançamentos neste período</div>
            )}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="bottom-grid">
          {/* CONTAS CARD */}
          <div className="card banks-card">
            <div className="card-header">
              <span className="card-title">Contas vinculadas</span>
              <span className="card-badge">{BANKS.length} bancos</span>
            </div>

            {BANKS.map((bank) => (
              <div key={bank.sigla} className="bank-item">
                <div className="bank-left">
                  <div className="bank-avatar" style={{ background: `linear-gradient(135deg, ${bank.bgColor}, ${bank.bgColor}dd)`, color: '#fff', border: `1px solid ${bank.bgColor}33` }}>
                    {bank.sigla}
                  </div>
                  <div>
                    <div className="bank-name">{bank.nome}</div>
                    <div className="bank-type">{bank.tipo}</div>
                  </div>
                </div>
                <div className="bank-value">{fmt(bank.saldo)}</div>
              </div>
            ))}
          </div>

          {/* GASTOS POR CATEGORIA */}
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
                  {chartData.map((item, i) => {
                    const pct = ((item.valor / totalGastos) * 100).toFixed(1)
                    const valorFmt = item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    const catColor = CORES_PIZZA[i] || '#052e16'
                    return (
                      <div key={item.name} className="legend-item">
                        <span className="legend-dot" style={{ background: catColor }}></span>
                        <span className="legend-name">{item.name}</span>
                        <span className="legend-info">{valorFmt} · {pct}%</span>
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

        {/* INVESTIMENTOS CARD */}
        <div className="investment-card">
          <div className="card-header">
            <span className="card-title">Investimentos</span>
            <span className="card-badge">+4.19%</span>
          </div>

          <div className="investment-main">
            <div className="inv-metric">
              <div className="inv-metric-label">Investido</div>
              <div className="inv-metric-value">R$ 16.000</div>
            </div>
            <div className="inv-metric">
              <div className="inv-metric-label">Valor atual</div>
              <div className="inv-metric-value green">R$ 16.670</div>
            </div>
            <div className="inv-metric">
              <div className="inv-metric-label">Resultado</div>
              <div className="inv-metric-value green">+R$ 670</div>
            </div>
          </div>

          <div className="inv-cta" onClick={() => navigate('/investimentos')}>
            Ver investimentos →
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setIsAddModalOpen(true)} title="Adicionar nova movimentação">
        +
      </button>

      {/* AddModal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLancamentoAdded={() => {
          fetchResumo()
          fetchLancamentos()
          setIsAddModalOpen(false)
        }}
      />
    </div>
  )
}

export default Home
