import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import BankTabs from '../components/BankTabs'
import AddModal from '../components/AddModal'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import './Dashboard.css'

function Dashboard() {
  const { bancoAtivo, mesAno, updateMesAno } = useContext(AppContext)
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0, por_categoria: {} })
  const [lancamentos, setLancamentos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filtroCategoria, setFiltroCategoria] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    fetchDados()
  }, [bancoAtivo, mesAno, filtroCategoria])

  const fetchDados = async () => {
    try {
      const [resumoRes, lancamentosRes, categoriasRes] = await Promise.all([
        axios.get('/api/resumo', { params: { banco: bancoAtivo, mes: mesAno.mes, ano: mesAno.ano } }),
        axios.get('/api/lancamentos', { params: { banco: bancoAtivo, mes: mesAno.mes, ano: mesAno.ano, categoria: filtroCategoria } }),
        axios.get('/api/categorias'),
      ])

      setResumo(resumoRes.data)
      setLancamentos(lancamentosRes.data)
      setCategorias(categoriasRes.data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const handleMesAnoChange = (mes) => {
    updateMesAno(mes, mesAno.ano)
  }

  const handleAnoChange = (direction) => {
    updateMesAno(mesAno.mes, mesAno.ano + direction)
  }

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  const dataGrafico = Object.entries(resumo.por_categoria || {})
    .map(([categoria, valor]) => ({ name: categoria, valor: parseFloat(valor) }))
    .sort((a, b) => b.valor - a.valor)

  const categoriasGrid = Object.entries(resumo.por_categoria || {})
    .map(([categoria, valor]) => ({ categoria, valor: parseFloat(valor) }))
    .filter(item => item.valor > 0)
    .sort((a, b) => b.valor - a.valor)

  const totalCategories = categoriasGrid.reduce((sum, item) => sum + item.valor, 0)

  const cores = ['#4caf50', '#2e7d32', '#81c784', '#a5d6a7', '#c8e6c9', '#2e7d32', '#66bb6a', '#43a047']

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Controle Financeiro</h1>
          <div className="month-selector">
            <button className="month-nav" onClick={() => handleAnoChange(-1)}>{'<'}</button>
            <span className="year-display">{mesAno.ano}</span>
            <button className="month-nav" onClick={() => handleAnoChange(1)}>{'>'}</button>
            <div className="months-grid">
              {meses.map((mes, index) => (
                <button
                  key={index}
                  className={`month-pill ${mesAno.mes === index + 1 ? 'active' : ''}`}
                  onClick={() => handleMesAnoChange(index + 1)}
                >
                  {mes}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BankTabs />

      <div className="cards-container">
        <div className="card positive">
          <h3>Entradas</h3>
          <div className="value">+R$ {Math.round(resumo.entradas).toLocaleString('pt-BR')}</div>
        </div>
        <div className="card negative">
          <h3>Saídas</h3>
          <div className="value">-R$ {Math.round(resumo.saidas).toLocaleString('pt-BR')}</div>
        </div>
        <div className="card">
          <h3>Saldo</h3>
          <div className={`value ${resumo.saldo >= 0 ? 'positive' : 'negative'}`}>
            R$ {Math.round(resumo.saldo).toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {dataGrafico.length > 0 && (
        <div className="chart-container card">
          <h3>Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(52,180,90,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                {dataGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {categoriasGrid.length > 0 && (
        <div className="categories-grid">
          {categoriasGrid.map((item, index) => {
            const percentual = (item.valor / totalCategories) * 100
            return (
              <div key={item.categoria} className="category-card card">
                <div className="category-header">
                  <span className="category-name">{item.categoria}</span>
                  <span className="category-value">R$ {Math.round(item.valor).toLocaleString('pt-BR')}</span>
                </div>
                <div className="category-progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${percentual}%`,
                      backgroundColor: cores[index % cores.length]
                    }}
                  />
                </div>
                <span className="category-percent">{percentual.toFixed(1)}%</span>
              </div>
            )
          })}
        </div>
      )}

      <div className="lancamentos-container card">
        <div className="lancamentos-header">
          <h3>Lançamentos</h3>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="all">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.nome}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map(lancamento => (
              <tr key={lancamento.id}>
                <td>{new Date(lancamento.data).toLocaleDateString('pt-BR')}</td>
                <td>{lancamento.descricao}</td>
                <td>
                  {lancamento.categoria ? (
                    <span className="badge green">{lancamento.categoria}</span>
                  ) : (
                    <span className="badge warn">revisar</span>
                  )}
                </td>
                <td className={lancamento.tipo === 'entrada' ? 'positive' : 'negative'}>
                  {lancamento.tipo === 'entrada' ? '+' : '-'}R$ {lancamento.valor.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="fab" onClick={() => setIsAddModalOpen(true)}>+</button>
      <AddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onLancamentoAdded={fetchDados} />
    </div>
  )
}

export default Dashboard
