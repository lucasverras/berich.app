import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import MonthCarousel from '../components/MonthCarousel'
import { getCategoryColor, getCategoryEmoji } from '../data/categoriesStore'
import { transacoesData } from '../data/transacoes'
import './Home.css'

ChartJS.register(ArcElement, Tooltip, Legend)

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const fmt = (v) => {
  if (!v) return 'R$ 0,00'
  return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Home() {
  const { mes, ano, updateMesAno } = useContext(AppContext)
  const navigate = useNavigate()
  const [mesSelecionado, setMesSelecionado] = useState(mes - 1)
  const [dados, setDados] = useState({
    cartao: [],
    saldo: [],
    resumo: { fatura: 0, entradas: 0 },
    itau: 0,
    vamoNessa: 0
  })

  useEffect(() => {
    const mesNome = MESES[mes - 1]
    const cartaoKey = `${mesNome} Cartão 2026`
    const saldoKey = `${mesNome} Saldo 2026`

    const cartaoTransacoes = transacoesData[cartaoKey] || []
    const saldoTransacoes = transacoesData[saldoKey] || []

    // Processar cartão (apenas saídas)
    const cartaoProcessado = cartaoTransacoes
      .filter(t => t.tipo === 'saída')
      .sort((a, b) => new Date(b.data || '2000-01-01') - new Date(a.data || '2000-01-01'))
      .slice(0, 5)

    // Processar saldo
    let totalEntradas = 0
    const saldoProcessado = saldoTransacoes
      .filter(t => {
        if (t.motivo && t.motivo.toLowerCase().includes('mês') && !t.data) {
          return false
        }
        if (t.tipo === 'entrada') {
          totalEntradas += t.valor || 0
        }
        return true
      })
      .sort((a, b) => new Date(b.data || '2000-01-01') - new Date(a.data || '2000-01-01'))
      .slice(0, 5)

    // Calcular fatura
    const fatura = cartaoTransacoes
      .filter(t => t.tipo === 'saída')
      .reduce((sum, t) => sum + Math.abs(t.valor || 0), 0)

    // Itaú
    const itauTotal = (transacoesData['Itaú'] || []).reduce((sum, t) => sum + (t.valor || 0), 0)

    // Vamo Nessa
    const vamoNessaData = transacoesData['Vamo Nessa SP'] || []
    const vamoNessaSaldo = vamoNessaData.length > 0 ? vamoNessaData[0].valor : 0

    setDados({
      cartao: cartaoProcessado,
      saldo: saldoProcessado,
      resumo: {
        fatura,
        entradas: totalEntradas
      },
      itau: itauTotal,
      vamoNessa: vamoNessaSaldo
    })
  }, [mes])

  const handleMesChange = (novoMes) => {
    setMesSelecionado(novoMes)
    updateMesAno(novoMes + 1, ano)
  }

  // Gráfico GASTOS
  const chartDataGastos = {}
  dados.cartao.forEach(t => {
    const cat = t.categoria || 'Sem categoria'
    if (!chartDataGastos[cat]) chartDataGastos[cat] = 0
    chartDataGastos[cat] += Math.abs(t.valor || 0)
  })

  const chartArrayGastos = Object.entries(chartDataGastos)
    .map(([cat, val]) => ({ name: cat, valor: val }))
    .sort((a, b) => b.valor - a.valor)

  const doughnutDataGastos = {
    labels: chartArrayGastos.map(e => e.name),
    datasets: [{
      data: chartArrayGastos.map(e => e.valor),
      backgroundColor: chartArrayGastos.map(e => getCategoryColor(e.name)),
      borderWidth: 0,
      hoverOffset: 10,
    }]
  }

  // Gráfico GANHOS (por categoria no saldo)
  const chartDataGanhos = {}
  dados.saldo
    .filter(t => t.tipo === 'entrada')
    .forEach(t => {
      const cat = t.categoria || 'Sem categoria'
      if (!chartDataGanhos[cat]) chartDataGanhos[cat] = 0
      chartDataGanhos[cat] += t.valor || 0
    })

  const chartArrayGanhos = Object.entries(chartDataGanhos)
    .map(([cat, val]) => ({ name: cat, valor: val }))
    .sort((a, b) => b.valor - a.valor)

  const doughnutDataGanhos = {
    labels: chartArrayGanhos.map(e => e.name),
    datasets: [{
      data: chartArrayGanhos.map(e => e.valor),
      backgroundColor: chartArrayGanhos.map(e => getCategoryColor(e.name)),
      borderWidth: 0,
      hoverOffset: 10,
    }]
  }

  return (
    <div className="home-layout">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>

      <div className="home-main">
        <div className="header">
          <div className="header-left">
            <h1>💰 BE.RICH</h1>
            <p>Dashboard Financeiro</p>
          </div>
        </div>

        <MonthCarousel
          mesSelecionado={mesSelecionado}
          onChange={(novoMes) => handleMesChange(novoMes)}
        />

        {/* TRANSAÇÕES */}
        <div className="desktop-grid-2col">
          {/* CARTÃO */}
          <div className="desktop-col">
            <div className="card">
              <div className="card-label">FATURA DO CARTÃO</div>
              <div className="card-value negative">{fmt(dados.resumo.fatura)}</div>
              <div className="card-sub">{MESES[mesSelecionado]}</div>
            </div>

            <div className="card">
              <div className="card-header-row">
                <span>ÚLTIMAS TRANSAÇÕES</span>
                <span className="badge">{dados.cartao.length}</span>
              </div>
              {dados.cartao.length === 0 ? (
                <p className="empty-text">Sem transações</p>
              ) : (
                <div>
                  {dados.cartao.map((t, idx) => {
                    const color = getCategoryColor(t.categoria)
                    const emoji = getCategoryEmoji(t.categoria)
                    return (
                      <div key={idx} className="lancamento-row" style={{
                        backgroundColor: `${color}15`,
                        borderLeftColor: color,
                        borderLeftWidth: '3px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <span>{emoji}</span>
                          <div>
                            <span>{t.motivo}</span>
                            <span style={{ fontSize: '12px', color }}>{t.categoria}</span>
                          </div>
                        </div>
                        <span className="negative">{fmt(Math.abs(t.valor))}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* SALDO */}
          <div className="desktop-col">
            <div className="card">
              <div className="card-label">SALDO DA CONTA</div>
              <div className="card-value positive">R$ 0,00</div>
              <div className="card-sub">Veja na aba Conta</div>
            </div>

            <div className="card">
              <div className="card-header-row">
                <span>ÚLTIMAS TRANSAÇÕES</span>
                <span className="badge">{dados.saldo.length}</span>
              </div>
              {dados.saldo.length === 0 ? (
                <p className="empty-text">Sem transações</p>
              ) : (
                <div>
                  {dados.saldo.map((t, idx) => {
                    const color = getCategoryColor(t.categoria)
                    const emoji = getCategoryEmoji(t.categoria)
                    return (
                      <div key={idx} className="lancamento-row" style={{
                        backgroundColor: `${color}15`,
                        borderLeftColor: color,
                        borderLeftWidth: '3px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <span>{emoji}</span>
                          <div>
                            <span>{t.motivo}</span>
                            <span style={{ fontSize: '12px', color }}>{t.categoria}</span>
                          </div>
                        </div>
                        <span className={t.tipo === 'entrada' ? 'positive' : 'negative'}>
                          {t.tipo === 'entrada' ? '+' : '−'}{fmt(Math.abs(t.valor))}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="charts-section">
          {/* GASTOS POR CATEGORIA */}
          {chartArrayGastos.length > 0 && (
            <div className="card chart-card">
              <p className="card-title">📊 Gastos por Categoria</p>
              <div style={{ height: '300px' }}>
                <Doughnut data={doughnutDataGastos} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
              
              {/* TAGS COM VALORES */}
              <div className="category-tags">
                {chartArrayGastos.map((item, idx) => {
                  const color = getCategoryColor(item.name)
                  const emoji = getCategoryEmoji(item.name)
                  return (
                    <div key={idx} className="category-tag" style={{
                      backgroundColor: `${color}20`,
                      borderColor: color,
                      borderWidth: '1px'
                    }}>
                      <span style={{ fontSize: '14px' }}>{emoji}</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color, marginLeft: 'auto' }}>
                        {fmt(item.valor)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* GANHOS POR CATEGORIA */}
          {chartArrayGanhos.length > 0 && (
            <div className="card chart-card">
              <p className="card-title">💰 Ganhos por Categoria</p>
              <div style={{ height: '300px' }}>
                <Doughnut data={doughnutDataGanhos} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>

              {/* TAGS COM VALORES */}
              <div className="category-tags">
                {chartArrayGanhos.map((item, idx) => {
                  const color = getCategoryColor(item.name)
                  const emoji = getCategoryEmoji(item.name)
                  return (
                    <div key={idx} className="category-tag" style={{
                      backgroundColor: `${color}20`,
                      borderColor: color,
                      borderWidth: '1px'
                    }}>
                      <span style={{ fontSize: '14px' }}>{emoji}</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color, marginLeft: 'auto' }}>
                        {fmt(item.valor)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PLACEHOLDER GANHOS se vazio */}
          {chartArrayGanhos.length === 0 && (
            <div className="card chart-card">
              <p className="card-title">💰 Ganhos por Categoria</p>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Sem dados de ganhos neste mês
              </div>
            </div>
          )}
        </div>

        {/* BANCOS - APENAS ITAÚ E VAMO NESSA */}
        <div className="bancos-grid">
          <div className="banco-card" onClick={() => navigate('/itau')} style={{ cursor: 'pointer' }}>
            <div className="banco-icon">🏛️</div>
            <div className="banco-info">
              <div className="banco-label">Itaú</div>
              <div className="banco-valor positive">{fmt(dados.itau)}</div>
            </div>
          </div>

          <div className="banco-card" onClick={() => navigate('/vamonessa')} style={{ cursor: 'pointer' }}>
            <div className="banco-icon">💜</div>
            <div className="banco-info">
              <div className="banco-label">Vamo Nessa</div>
              <div className="banco-valor positive">{fmt(dados.vamoNessa)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
