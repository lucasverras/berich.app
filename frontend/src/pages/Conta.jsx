import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import MonthSelector from '../components/MonthSelector'
import CategoryGrid from '../components/CategoryGrid'
import AddModal from '../components/AddModal'
import './Conta.css'

function Conta() {
  const { bancoAtivo, mesAno, updateMesAno } = useContext(AppContext)
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0 })
  const [lancamentos, setLancamentos] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

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
          mes: mesAno.mes,
          ano: mesAno.ano,
          forma_pagamento: 'pix',
        }
      })
      setLancamentos(response.data)
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error)
    }
  }

  const handleMesChange = (mes) => {
    updateMesAno(mes, mesAno.ano)
  }

  const handleAnoChange = (ano) => {
    updateMesAno(mesAno.mes, ano)
  }

  const handleAddLancamento = () => {
    fetchResumo()
    fetchLancamentos()
    setIsAddModalOpen(false)
  }

  return (
    <div className="conta">
      <div className="conta-content">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>🏦 Conta</h1>
          </div>
        </div>

        <MonthSelector mesAno={mesAno} onMesChange={handleMesChange} onAnoChange={handleAnoChange} />

        <div className="cards-container">
          <div className="card positive">
            <h3>Entradas</h3>
            <div className="value positive">
              R$ {resumo.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="card negative">
            <h3>Saídas</h3>
            <div className="value negative">
              R$ {resumo.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="card">
            <h3>Saldo</h3>
            <div className={`value ${resumo.saldo >= 0 ? 'positive' : 'negative'}`}>
              R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <CategoryGrid banco={bancoAtivo} mes={mesAno.mes} ano={mesAno.ano} />

        <div className="lancamentos-container">
          <div className="lancamentos-header">
            <h3>Movimentações da Conta</h3>
          </div>

          {lancamentos.length === 0 ? (
            <p className="no-data">Sem movimentações para este período</p>
          ) : (
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
                {lancamentos.map(l => (
                  <tr key={l.id} className={l.tipo}>
                    <td>{new Date(l.data).toLocaleDateString('pt-BR')}</td>
                    <td>{l.descricao}</td>
                    <td>{l.categoria || '—'}</td>
                    <td>R$ {Math.abs(l.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <button className="fab" onClick={() => setIsAddModalOpen(true)}>+</button>
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLancamentoAdded={handleAddLancamento}
        defaultTipo="saída"
      />
    </div>
  )
}

export default Conta
