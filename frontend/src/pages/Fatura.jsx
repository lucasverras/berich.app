import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import MonthSelector from '../components/MonthSelector'
import CategoryGrid from '../components/CategoryGrid'
import AddModal from '../components/AddModal'
import './Fatura.css'

function Fatura() {
  const { bancoAtivo, mesAno, updateMesAno } = useContext(AppContext)
  const [fatura, setFatura] = useState(0)
  const [lancamentos, setLancamentos] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    fetchFatura()
    fetchLancamentos()
  }, [bancoAtivo, mesAno])

  const fetchFatura = async () => {
    try {
      const response = await axios.get('/api/resumo', {
        params: {
          banco: bancoAtivo,
          mes: mesAno.mes,
          ano: mesAno.ano,
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
          mes: mesAno.mes,
          ano: mesAno.ano,
          forma_pagamento: 'cartão',
        }
      })
      setLancamentos(response.data)
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error)
    }
  }

  const handleMesChange = (mes) => {
    updateMesAno({ mes, ano: mesAno.ano })
  }

  const handleAnoChange = (ano) => {
    updateMesAno({ mes: mesAno.mes, ano })
  }

  const handleAddLancamento = () => {
    fetchFatura()
    fetchLancamentos()
    setIsAddModalOpen(false)
  }

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  return (
    <div className="fatura">
      <div className="fatura-content">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>💳 Fatura</h1>
          </div>
        </div>

        <MonthSelector mesAno={mesAno} onMesChange={handleMesChange} onAnoChange={handleAnoChange} />

        <div className="cards-container">
          <div className="card negative">
            <h3>Fatura de {monthNames[mesAno.mes - 1]}</h3>
            <div className={`value negative`}>
              R$ {Math.abs(fatura).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <CategoryGrid banco={bancoAtivo} mes={mesAno.mes} ano={mesAno.ano} />

        <div className="lancamentos-container">
          <div className="lancamentos-header">
            <h3>Transações do Cartão</h3>
          </div>

          {lancamentos.length === 0 ? (
            <p className="no-data">Sem transações para este período</p>
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
                  <tr key={l.id} className="negative">
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
        defaultTipo="cartão"
      />
    </div>
  )
}

export default Fatura
