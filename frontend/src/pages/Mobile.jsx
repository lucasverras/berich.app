import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import Icons from '../components/Icons'
import BankTabs from '../components/BankTabs'
import AddModal from '../components/AddModal'
import ImportModal from '../components/ImportModal'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import './Mobile.css'

function Mobile() {
  const { bancoAtivo, mesAno } = useContext(AppContext)
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0, por_categoria: {} })
  const [lancamentos, setLancamentos] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  useEffect(() => {
    fetchDados()
  }, [bancoAtivo, mesAno])

  const fetchDados = async () => {
    try {
      const [resumoRes, lancamentosRes] = await Promise.all([
        axios.get('/api/resumo', { params: { banco: bancoAtivo, mes: mesAno.mes, ano: mesAno.ano } }),
        axios.get('/api/lancamentos', { params: { banco: bancoAtivo, mes: mesAno.mes, ano: mesAno.ano } }),
      ])

      setResumo(resumoRes.data)
      setLancamentos(lancamentosRes.data.slice(0, 20))
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const dataGrafico = Object.entries(resumo.por_categoria || {})
    .map(([categoria, valor]) => ({ name: categoria, valor: parseFloat(valor) }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5)

  const cores = ['#3dba6a', '#1f7a42', '#3d6b47', '#a0c8aa', '#daf0e2']

  return (
    <div className="mobile-view">
      <div className="mobile-header">
        <h1>BE.RICH</h1>
      </div>

      <BankTabs />

      <div className="mobile-card card">
        <div className="balance-row">
          <div className="balance-item">
            <span className="label">Entradas</span>
            <span className="value positive">+R$ {resumo.entradas.toFixed(2)}</span>
          </div>
          <div className="balance-item">
            <span className="label">Saídas</span>
            <span className="value negative">-R$ {resumo.saidas.toFixed(2)}</span>
          </div>
        </div>
        <div className="balance-total">
          <span className="label">Saldo</span>
          <span className={`value ${resumo.saldo >= 0 ? 'positive' : 'negative'}`}>
            R$ {resumo.saldo.toFixed(2)}
          </span>
        </div>
      </div>

      {dataGrafico.length > 0 && (
        <div className="card">
          <h3>Principais Categorias</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(52,180,90,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
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

      <div className="card">
        <h3>Últimos Lançamentos</h3>
        <div className="mobile-lancamentos">
          {lancamentos.map(lancamento => (
            <div key={lancamento.id} className="mobile-lancamento">
              <div className="lancamento-left">
                <div className="lancamento-desc">{lancamento.descricao}</div>
                <div className="lancamento-date">{new Date(lancamento.data).toLocaleDateString('pt-BR')}</div>
              </div>
              <div className={`lancamento-valor ${lancamento.tipo === 'entrada' ? 'positive' : 'negative'}`}>
                {lancamento.tipo === 'entrada' ? '+' : '-'}R$ {lancamento.valor.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-actions">
        <button onClick={() => setIsImportModalOpen(true)} className="secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <Icons.ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
          Importar CSV
        </button>
      </div>

      <button className="fab" onClick={() => setIsAddModalOpen(true)}>+</button>

      <AddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onLancamentoAdded={fetchDados} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImportSuccess={fetchDados} />
    </div>
  )
}

export default Mobile
