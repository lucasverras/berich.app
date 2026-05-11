import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ChevronLeft } from 'lucide-react'
import AddModal from '../components/AddModal'
import EditLancamentoModal from '../components/EditLancamentoModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import './BancoDetalhe.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function BancoDetalhe() {
  const { banco } = useParams()
  const navigate = useNavigate()
  const [lancamentos, setLancamentos] = useState([])
  const [resumo, setResumo] = useState({ total_entradas: 0, total_saidas: 0, saldo: 0 })
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth())
  const [ano, setAno] = useState(new Date().getFullYear())
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLancamento, setEditingLancamento] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [lancamentoToDelete, setLancamentoToDelete] = useState(null)
  const [categorias, setCategorias] = useState([])

  const fmt = (v) => {
    if (!v) return 'R$ 0'
    return parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  useEffect(() => {
    fetchData()
    fetchCategorias()
  }, [banco, mesSelecionado, ano])

  const fetchData = async () => {
    try {
      const [resumoRes, lancamentosRes] = await Promise.all([
        axios.get(`/api/bancos/${banco}/resumo`, {
          params: { mes: mesSelecionado + 1, ano, forma_pagamento: 'pix' }
        }),
        axios.get(`/api/bancos/${banco}/lancamentos`, {
          params: { mes: mesSelecionado + 1, ano, forma_pagamento: 'pix' }
        })
      ])
      setResumo(resumoRes.data)
      setLancamentos(lancamentosRes.data || [])
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/api/categorias')
      setCategorias(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  const handleEditLancamento = (lancamento) => {
    setEditingLancamento(lancamento)
    setIsEditModalOpen(true)
  }

  const handleLancamentoSaved = () => {
    fetchData()
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
  }

  return (
    <div className="banco-detalhe">
      {/* Header */}
      <div className="banco-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <h1>{banco}</h1>
        <div className="spacer" />
      </div>

      {/* Month Selector */}
      <div className="month-selector">
        <button onClick={() => setDropdownAberto(!dropdownAberto)}>
          {MESES[mesSelecionado]} {ano}
        </button>
        {dropdownAberto && (
          <div className="month-dropdown">
            {MESES.map((m, i) => (
              <button
                key={m}
                className={i === mesSelecionado ? 'selected' : ''}
                onClick={() => {
                  setMesSelecionado(i)
                  setDropdownAberto(false)
                }}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resumo Cards */}
      <div className="resumo-cards">
        <div className="resumo-card entrada">
          <span className="resumo-label">Entradas</span>
          <span className="resumo-value">{fmt(resumo.total_entradas)}</span>
        </div>
        <div className="resumo-card saida">
          <span className="resumo-label">Saídas</span>
          <span className="resumo-value">{fmt(resumo.total_saidas)}</span>
        </div>
        <div className="resumo-card saldo">
          <span className="resumo-label">Saldo</span>
          <span className={`resumo-value ${resumo.saldo >= 0 ? 'positivo' : 'negativo'}`}>
            {fmt(resumo.saldo)}
          </span>
        </div>
      </div>

      {/* Lançamentos */}
      <div className="lancamentos-section">
        <h2>Transações do mês</h2>
        {lancamentos.length > 0 ? (
          <div className="lancamentos-list">
            {lancamentos.map(l => (
              <div
                key={l.id}
                className="lancamento-item"
                onClick={() => handleEditLancamento(l)}
              >
                <div className="lancamento-left">
                  <div className="lancamento-date">
                    {new Date(l.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="lancamento-info">
                    <p className="lancamento-desc">{l.descricao}</p>
                    <p className="lancamento-categoria">{l.categoria}</p>
                  </div>
                </div>
                <div className={`lancamento-value ${l.tipo}`}>
                  {l.tipo === 'entrada' ? '+' : '−'}{fmt(Math.abs(l.valor))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">Nenhuma transação neste mês</div>
        )}
      </div>

      {/* AddModal removed - use universal FAB from BottomNav */}

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

export default BancoDetalhe
