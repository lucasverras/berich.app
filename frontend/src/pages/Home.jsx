import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import MonthDropdown from '../components/MonthDropdown'
import AddModal from '../components/AddModal'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import './Home.css'

function Home() {
  const { bancoAtivo, mesAno, updateMesAno } = useContext(AppContext)
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0, por_categoria: {} })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    fetchResumo()
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
      setResumo(response.data)
    } catch (error) {
      console.error('Erro ao buscar resumo:', error)
    }
  }

  const handleMesAnoChange = (novoMesAno) => {
    updateMesAno(novoMesAno.mes, novoMesAno.ano)
  }

  // Preparar dados para o gráfico donut
  const graficoData = Object.entries(resumo.por_categoria || {})
    .map(([categoria, valor]) => ({ name: categoria, value: parseFloat(valor) }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  // Paleta de verde escuro premium
  const coresVerde = [
    '#1b4d2a', // verde esmeralda escuro
    '#2d6a3e', // verde musgo
    '#3d8b52', // verde folha
    '#4a9d63', // verde neon suave
    '#5ab374', // verde claro
    '#1f5e33', // verde quase preto
    '#2a7a42', // verde acinzentado
    '#36905a', // verde escuro
    '#1a3d25', // verde muito escuro
    '#3a7a4f', // verde principal
  ]

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  return (
    <div className="home">
      <div className="home-header">
        <div className="header-content">
          <h1>💰 Início</h1>
          <p className="header-subtitle">Visão geral das suas finanças</p>
        </div>
        <MonthDropdown mesAno={mesAno} onMesAnoChange={handleMesAnoChange} />
      </div>

      {/* Cards principais */}
      <div className="main-cards-grid">
        <div className="card card-primary">
          <div className="card-header">
            <h3>Fatura do Mês</h3>
            <span className="card-icon">💳</span>
          </div>
          <div className="card-value">R$ {Math.round(resumo.saidas).toLocaleString('pt-BR')}</div>
          <p className="card-subtitle">{monthNames[mesAno.mes - 1]}</p>
        </div>

        <div className="card card-secondary">
          <div className="card-header">
            <h3>Saldo Atual</h3>
            <span className="card-icon">💵</span>
          </div>
          <div className={`card-value ${resumo.saldo >= 0 ? 'positive' : 'negative'}`}>
            R$ {Math.round(resumo.saldo).toLocaleString('pt-BR')}
          </div>
          <p className="card-subtitle">Movimentação total</p>
        </div>

        <div className="card card-accent">
          <div className="card-header">
            <h3>Entradas</h3>
            <span className="card-icon">📈</span>
          </div>
          <div className="card-value positive">+R$ {Math.round(resumo.entradas).toLocaleString('pt-BR')}</div>
          <p className="card-subtitle">Receitas do período</p>
        </div>
      </div>

      {/* Gráfico donut */}
      {graficoData.length > 0 && (
        <div className="home-chart-section">
          <div className="chart-wrapper">
            <h2>Distribuição de Gastos</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={graficoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => {
                      const total = graficoData.reduce((sum, item) => sum + item.value, 0)
                      const percent = ((value / total) * 100).toFixed(0)
                      return `${percent}%`
                    }}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {graficoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={coresVerde[index % coresVerde.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(61, 186, 106, 0.3)',
                      borderRadius: '10px',
                      color: '#fff',
                      backdropFilter: 'blur(10px)',
                    }}
                    formatter={(value) => `R$ ${Math.round(value).toLocaleString('pt-BR')}`}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: '20px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                    formatter={(value) => <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <div className="center-text">
                  <span className="center-label">Total</span>
                  <span className="center-value">R$ {Math.round(resumo.saidas).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumo por categoria */}
      {Object.entries(resumo.por_categoria || {}).length > 0 && (
        <div className="categories-summary">
          <h2>Gastos por Categoria</h2>
          <div className="categories-list">
            {Object.entries(resumo.por_categoria || {})
              .map(([categoria, valor]) => ({
                categoria,
                valor: parseFloat(valor),
              }))
              .filter(item => item.valor > 0)
              .sort((a, b) => b.valor - a.valor)
              .map((item, index) => {
                const percentual = (item.valor / resumo.saidas) * 100
                return (
                  <div key={item.categoria} className="category-row">
                    <div className="category-info">
                      <div className="category-color" style={{
                        backgroundColor: coresVerde[index % coresVerde.length]
                      }}></div>
                      <span className="category-name">{item.categoria}</span>
                    </div>
                    <div className="category-stats">
                      <span className="category-percent">{percentual.toFixed(1)}%</span>
                      <span className="category-value">R$ {Math.round(item.valor).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Card de Investimentos Resumido */}
      <Link to="/investimentos" className="investimentos-card-link">
        <div className="investimentos-card-home card">
          <div className="card-header">
            <h3>Investimentos</h3>
            <span className="card-icon">💼</span>
          </div>
          <div className="investments-grid">
            <div className="investment-stat">
              <span className="label">Total Investido</span>
              <span className="value">R$ 16.000,00</span>
            </div>
            <div className="investment-stat">
              <span className="label">Valor Atual</span>
              <span className="value destaque">R$ 16.670,00</span>
            </div>
            <div className="investment-stat">
              <span className="label">Resultado</span>
              <span className="value positive">+R$ 670,00</span>
            </div>
          </div>
          <button className="view-button">Ver Investimentos →</button>
        </div>
      </Link>

      <button className="fab" onClick={() => setIsAddModalOpen(true)}>+</button>
      <AddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onLancamentoAdded={fetchResumo} />
    </div>
  )
}

export default Home
