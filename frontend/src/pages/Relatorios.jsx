import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import BankTabs from '../components/BankTabs'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import './Relatorios.css'

function Relatorios() {
  const { bancoAtivo, mesAno } = useContext(AppContext)
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0, por_categoria: {} })

  useEffect(() => {
    fetchDados()
  }, [bancoAtivo, mesAno])

  const fetchDados = async () => {
    try {
      const response = await axios.get('/api/resumo', {
        params: { banco: bancoAtivo, mes: mesAno.mes, ano: mesAno.ano }
      })
      setResumo(response.data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const dataGrafico = Object.entries(resumo.por_categoria || {})
    .map(([categoria, valor]) => ({ name: categoria, value: parseFloat(valor) }))
    .sort((a, b) => b.value - a.value)

  const cores = ['#3dba6a', '#1f7a42', '#3d6b47', '#a0c8aa', '#daf0e2', '#60d976', '#2a9d5f', '#14532a']

  return (
    <div className="relatorios-page">
      <h1>Relatórios</h1>
      <BankTabs />

      <div className="relatorios-container">
        <div className="card summary">
          <h3>Resumo do Período</h3>
          <div className="summary-rows">
            <div className="summary-row">
              <span>Total de Entradas:</span>
              <span className="positive">+R$ {resumo.entradas.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Total de Saídas:</span>
              <span className="negative">-R$ {resumo.saidas.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Saldo Final:</span>
              <span className={resumo.saldo >= 0 ? 'positive' : 'negative'}>
                R$ {resumo.saldo.toFixed(2)}
              </span>
            </div>
            <div className="summary-row">
              <span>Total de Lançamentos:</span>
              <span>{resumo.total_lancamentos || 0}</span>
            </div>
          </div>
        </div>

        {dataGrafico.length > 0 && (
          <div className="card pie-chart">
            <h3>Distribuição de Gastos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataGrafico}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: R$ ${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="card categories">
          <h3>Detalhamento por Categoria</h3>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Percentual</th>
              </tr>
            </thead>
            <tbody>
              {dataGrafico.map((item) => {
                const total = dataGrafico.reduce((a, b) => a + b.value, 0)
                const percentual = (item.value / total) * 100
                return (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>R$ {item.value.toFixed(2)}</td>
                    <td>{percentual.toFixed(1)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Relatorios
