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

  const [valorAtual, setValorAtual] = useState(investimento?.valor_atual || 2450)
  const [isEditingValor, setIsEditingValor] = useState(false)
  const [novoValor, setNovoValor] = useState(valorAtual)
  const [isEditingTotal, setIsEditingTotal] = useState(false)
  const [novoTotal, setNovoTotal] = useState(totalMontante)

  const totalMontante = entradas.reduce((sum, e) => sum + e.valor, 0)
  const totalInvestidoAtual = isEditingTotal ? parseFloat(novoTotal) || totalMontante : totalMontante
  const ganho = valorAtual - totalInvestidoAtual
  const percentual = totalInvestidoAtual > 0 ? ((ganho / totalInvestidoAtual) * 100).toFixed(2) : 0

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

  const handleSalvarValorAtual = () => {
    if (!novoValor || parseFloat(novoValor) < 0) {
      alert('Preencha um valor válido')
      return
    }
    setValorAtual(parseFloat(novoValor))
    setIsEditingValor(false)
  }

  const handleCancelarEdicao = () => {
    setNovoValor(valorAtual)
    setIsEditingValor(false)
  }

  const handleSalvarTotal = () => {
    if (!novoTotal || parseFloat(novoTotal) < 0) {
      alert('Preencha um valor válido')
      return
    }
    setNovoTotal(parseFloat(novoTotal))
    setIsEditingTotal(false)
  }

  const handleCancelarTotal = () => {
    setNovoTotal(totalMontante)
    setIsEditingTotal(false)
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

      {/* Cards de Valores */}
      <div className="valores-grid">
        {/* Total Investido */}
        <div className="montante-card card">
          <div className="valor-atual-header">
            <h3>Total Investido</h3>
            {!isEditingTotal && (
              <button
                className="btn-editar-valor"
                onClick={() => {
                  setIsEditingTotal(true)
                  setNovoTotal(totalMontante)
                }}
                title="Editar total investido"
              >
                ✎
              </button>
            )}
          </div>

          {isEditingTotal ? (
            <div className="valor-atual-edit">
              <input
                type="number"
                value={novoTotal}
                onChange={(e) => setNovoTotal(e.target.value)}
                step="0.01"
                placeholder="0,00"
                className="input-valor"
              />
              <div className="botoes-edit">
                <button className="btn-cancelar" onClick={handleCancelarTotal}>Cancelar</button>
                <button className="btn-salvar" onClick={handleSalvarTotal}>Salvar</button>
              </div>
            </div>
          ) : (
            <div className="montante-valor">
              R$ {totalMontante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>

        {/* Valor Atual */}
        <div className="montante-card card">
          <div className="valor-atual-header">
            <h3>Valor Atual</h3>
            {!isEditingValor && (
              <button
                className="btn-editar-valor"
                onClick={() => {
                  setIsEditingValor(true)
                  setNovoValor(valorAtual)
                }}
                title="Editar valor atual"
              >
                ✎
              </button>
            )}
          </div>

          {isEditingValor ? (
            <div className="valor-atual-edit">
              <input
                type="number"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
                step="0.01"
                placeholder="0,00"
                className="input-valor"
              />
              <div className="botoes-edit">
                <button className="btn-cancelar" onClick={handleCancelarEdicao}>Cancelar</button>
                <button className="btn-salvar" onClick={handleSalvarValorAtual}>Salvar</button>
              </div>
            </div>
          ) : (
            <div className="montante-valor">
              R$ {valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>

        {/* Ganho/Perda */}
        <div className={`montante-card card ${ganho >= 0 ? 'positivo' : 'negativo'}`}>
          <h3>Ganho/Perda</h3>
          <div className={`montante-valor ${ganho >= 0 ? 'positivo' : 'negativo'}`}>
            {ganho >= 0 ? '+' : '−'}R$ {Math.abs(ganho).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="percentual">
            {ganho >= 0 ? '+' : '−'}{percentual}%
          </div>
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
