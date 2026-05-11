import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import './InvestimentoDetalhe.css'

function InvestimentoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const investimento = location.state?.investimento

  const [entradas, setEntradas] = useState([
    { id: 1, valor: 2000, descricao: 'Aporte inicial', data: '2026-03-10' },
    { id: 2, valor: 450, descricao: 'Compra mensal', data: '2026-05-15' }
  ])

  const [novaEntrada, setNovaEntrada] = useState({
    valor: '',
    descricao: '',
    data: ''
  })

  const totalMontante = entradas.reduce((sum, e) => sum + e.valor, 0)

  const handleAdicionarEntrada = (e) => {
    e.preventDefault()

    if (!novaEntrada.valor || !novaEntrada.descricao || !novaEntrada.data) {
      alert('Preencha todos os campos')
      return
    }

    const novoRegistro = {
      id: entradas.length + 1,
      valor: parseFloat(novaEntrada.valor),
      descricao: novaEntrada.descricao,
      data: novaEntrada.data
    }

    setEntradas([...entradas, novoRegistro])
    setNovaEntrada({ valor: '', descricao: '', data: '' })
  }

  const handleRemoverEntrada = (id) => {
    setEntradas(entradas.filter(e => e.id !== id))
  }

  if (!investimento) {
    return (
      <div className="investimento-detalhe">
        <div className="header-voltar">
          <button onClick={() => navigate('/investimentos')} className="btn-voltar">
            ← Voltar
          </button>
        </div>
        <p>Investimento não encontrado</p>
      </div>
    )
  }

  return (
    <div className="investimento-detalhe">
      {/* Header com voltar */}
      <div className="header-voltar">
        <button onClick={() => navigate('/investimentos')} className="btn-voltar">
          ← Voltar
        </button>
      </div>

      {/* Título do investimento */}
      <div className="detalhe-header">
        <span className="icone-grande">{investimento.icone}</span>
        <div className="titulo-info">
          <h1>{investimento.nome}</h1>
          <p className="categoria">{investimento.categoria}</p>
        </div>
      </div>

      {/* Card de Total do Montante */}
      <div className="montante-card card">
        <h3>Total Investido</h3>
        <div className="montante-valor">
          R$ {totalMontante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Lista de Entradas Cadastradas */}
      <div className="entradas-section">
        <h2>Histórico de Aportes</h2>

        {entradas.length > 0 ? (
          <div className="entradas-list">
            {entradas.map((entrada) => (
              <div key={entrada.id} className="entrada-item">
                <div className="entrada-info">
                  <div className="entrada-data">
                    {new Date(entrada.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="entrada-descricao">
                    {entrada.descricao}
                  </div>
                </div>
                <div className="entrada-valor">
                  R$ {entrada.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <button
                  className="btn-remover"
                  onClick={() => handleRemoverEntrada(entrada.id)}
                  title="Remover"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Nenhum aporte cadastrado</p>
        )}
      </div>

      {/* Formulário para adicionar nova entrada */}
      <div className="formulario-section card">
        <h2>Adicionar Novo Aporte</h2>
        <form onSubmit={handleAdicionarEntrada} className="formulario-entrada">
          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={novaEntrada.valor}
              onChange={(e) => setNovaEntrada({ ...novaEntrada, valor: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              placeholder="Ex: Aporte mensal, Reinvestimento, etc"
              value={novaEntrada.descricao}
              onChange={(e) => setNovaEntrada({ ...novaEntrada, descricao: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              value={novaEntrada.data}
              onChange={(e) => setNovaEntrada({ ...novaEntrada, data: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-adicionar">
            + Adicionar Aporte
          </button>
        </form>
      </div>
    </div>
  )
}

export default InvestimentoDetalhe
