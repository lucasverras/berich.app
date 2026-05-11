import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import Icons from '../components/Icons'
import MonthSelector from '../components/MonthSelector'
import CategoryGrid from '../components/CategoryGrid'
import AddModal from '../components/AddModal'
import FecharFaturaModal from '../components/FecharFaturaModal'
import './Fatura.css'

function Fatura() {
  const { bancoAtivo, mesAno, updateMesAno } = useContext(AppContext)
  const [fatura, setFatura] = useState(0)
  const [lancamentos, setLancamentos] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isFecharModalOpen, setIsFecharModalOpen] = useState(false)
  const [faturasFechadas, setFaturasFechadas] = useState({})
  const [isFechada, setIsFechada] = useState(false)

  useEffect(() => {
    fetchFatura()
    fetchLancamentos()
  }, [bancoAtivo, mesAno.mes, mesAno.ano])

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
    updateMesAno(mes, mesAno.ano)
  }

  const handleAnoChange = (ano) => {
    updateMesAno(mesAno.mes, ano)
  }

  const handleAddLancamento = () => {
    fetchFatura()
    fetchLancamentos()
    setIsAddModalOpen(false)
  }

  const handleFecharFatura = () => {
    // Marcar fatura como fechada
    const chave = `${mesAno.ano}-${mesAno.mes}`
    setFaturasFechadas(prev => ({
      ...prev,
      [chave]: true
    }))
    setIsFechada(true)

    // Calcular próximo mês
    let proximoMes = mesAno.mes + 1
    let proximoAno = mesAno.ano
    if (proximoMes > 12) {
      proximoMes = 1
      proximoAno += 1
    }

    // Atualizar para próximo mês
    updateMesAno(proximoMes, proximoAno)

    // Fechar o modal
    setIsFecharModalOpen(false)
  }

  // Verificar se fatura está fechada ao carregar
  useEffect(() => {
    const chave = `${mesAno.ano}-${mesAno.mes}`
    setIsFechada(faturasFechadas[chave] || false)
  }, [mesAno, faturasFechadas])

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  return (
    <div className="fatura">
      <div className="fatura-content">
        <div className="dashboard-header">
          <div className="header-left">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icons.CreditCard size={32} style={{ color: 'var(--primary-light)' }} />
              Fatura
            </h1>
          </div>
        </div>

        <MonthSelector mesAno={mesAno} onMesChange={handleMesChange} onAnoChange={handleAnoChange} />

        <div className="cards-container">
          <div className="card negative">
            <div className="card-header-row">
              <h3>Fatura de {monthNames[mesAno.mes - 1]}</h3>
              {isFechada && <span className="badge-fechada">Fechada</span>}
            </div>
            <div className={`value negative`}>
              R$ {Math.abs(fatura).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {!isFechada && (
          <div className="fechar-fatura-card card">
            <div className="fechar-card-content">
              <div className="fechar-card-text">
                <h3>Fechar Fatura</h3>
                <p>Encerrar este ciclo e iniciar o próximo mês</p>
              </div>
              <button
                className="fechar-card-btn"
                onClick={() => setIsFecharModalOpen(true)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}

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
      <FecharFaturaModal
        isOpen={isFecharModalOpen}
        mesAtual={mesAno.mes}
        onClose={() => setIsFecharModalOpen(false)}
        onConfirm={handleFecharFatura}
      />
    </div>
  )
}

export default Fatura
