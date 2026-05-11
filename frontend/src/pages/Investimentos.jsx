import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icons from '../components/Icons'
import AddModal from '../components/AddModal'
import './Investimentos.css'

function Investimentos() {
  const navigate = useNavigate()

  const getIconForCategoria = (categoria) => {
    const iconMap = {
      'Criptomoedas': Icons.TrendingUp,
      'Renda Fixa': Icons.BarChart,
      'Títulos Públicos': Icons.Bank,
      'Poupança': Icons.DollarSign,
      'Fundos': Icons.PieChart,
      'Ações': Icons.TrendingUp,
      'Conta Corrente': Icons.CreditCard
    }
    return iconMap[categoria] || Icons.Briefcase
  }

  // Dados fictícios de investimentos
  const investimentos = [
    {
      id: 1,
      nome: 'Bitcoin',
      categoria: 'Criptomoedas',
      icone: '₿',
      investido: 2000,
      valor_atual: 2450,
      primeiro_aporte: '10/03/2026',
      ultimo_aporte: '15/05/2026',
      observacoes: 'Mantendo como ativo de longo prazo'
    },
    {
      id: 2,
      nome: 'CDB Itaú',
      categoria: 'Renda Fixa',
      icone: '📊',
      investido: 5000,
      valor_atual: 5180,
      primeiro_aporte: '02/01/2026',
      ultimo_aporte: '20/04/2026',
      observacoes: 'Vencimento em 12 meses'
    },
    {
      id: 3,
      nome: 'Tesouro Selic',
      categoria: 'Títulos Públicos',
      icone: '🏛️',
      investido: 3500,
      valor_atual: 3610,
      primeiro_aporte: '15/02/2026',
      ultimo_aporte: '30/05/2026',
      observacoes: 'Rendimento diário'
    },
    {
      id: 4,
      nome: 'Reserva de Emergência',
      categoria: 'Poupança',
      icone: '💾',
      investido: 4000,
      valor_atual: 4080,
      primeiro_aporte: '01/01/2026',
      ultimo_aporte: '25/05/2026',
      observacoes: '6 meses de gastos'
    },
    {
      id: 5,
      nome: 'Fundo Imobiliário',
      categoria: 'Fundos',
      icone: '🏢',
      investido: 2500,
      valor_atual: 2410,
      primeiro_aporte: '15/03/2026',
      ultimo_aporte: '10/05/2026',
      observacoes: 'Distribuição mensal de dividendos'
    },
    {
      id: 6,
      nome: 'Ações (IBOV)',
      categoria: 'Ações',
      icone: '📈',
      investido: 3000,
      valor_atual: 3150,
      primeiro_aporte: '01/04/2026',
      ultimo_aporte: '20/05/2026',
      observacoes: 'Carteira diversificada'
    },
    {
      id: 7,
      nome: 'C6 Bank',
      categoria: 'Conta Corrente',
      icone: '🟦',
      investido: 5000,
      valor_atual: 5000,
      primeiro_aporte: '15/01/2026',
      ultimo_aporte: '01/05/2026',
      observacoes: 'Reserva em conta corrente'
    },
    {
      id: 8,
      nome: 'Itaú',
      categoria: 'Conta Corrente',
      icone: '🟪',
      investido: 2500,
      valor_atual: 2500,
      primeiro_aporte: '10/02/2026',
      ultimo_aporte: '15/05/2026',
      observacoes: 'Conta do banco principal'
    },
    {
      id: 9,
      nome: 'Nubank',
      categoria: 'Conta Corrente',
      icone: '🟥',
      investido: 1500,
      valor_atual: 1500,
      primeiro_aporte: '20/03/2026',
      ultimo_aporte: '10/05/2026',
      observacoes: 'Cartão de crédito'
    }
  ]

  // Cálculos
  const totalInvestido = investimentos.reduce((sum, inv) => sum + inv.investido, 0)

  const handleInvestimentoClick = (investimento) => {
    navigate(`/investimentos/${investimento.id}`, { state: { investimento } })
  }

  return (
    <div className="investimentos">
      {/* Header */}
      <div className="investimentos-header">
        <div className="header-content">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icons.Briefcase size={32} style={{ color: 'var(--primary-light)' }} />
            Investimentos
          </h1>
          <p className="header-subtitle">Acompanhe seus ativos, aplicações e evolução patrimonial</p>
        </div>
      </div>

      {/* Card Principal - Resumo Geral */}
      <div className="resumo-geral card">
        <h2>Resumo de Investimentos</h2>
        <div className="resumo-grid">
          <div className="resumo-item">
            <span className="label">Total Investido</span>
            <span className="valor">R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Seção de Investimentos */}
      <div className="investimentos-section">
        <h2>Meus Investimentos</h2>
        <div className="investimentos-list">
          {investimentos.map((investimento) => {
            const IconComponent = getIconForCategoria(investimento.categoria)
            return (
              <button
                key={investimento.id}
                className="investimento-card"
                onClick={() => handleInvestimentoClick(investimento)}
              >
                <div className="header-left">
                  <div className="icone" style={{ color: 'var(--primary-light)' }}>
                    <IconComponent size={24} />
                  </div>
                  <div className="info">
                    <h3>{investimento.nome}</h3>
                    <span className="categoria">{investimento.categoria}</span>
                  </div>
                </div>
                <div className="header-right">
                  <div className="valor-atual">
                    R$ {investimento.investido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <Icons.ArrowRight size={20} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default Investimentos
