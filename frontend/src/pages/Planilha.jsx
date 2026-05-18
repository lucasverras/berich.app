import React, { useState, useEffect } from 'react'
import './Planilha.css'

const ABAS = [
  { id: 'investimentos', nome: 'Investimentos' },
  { id: 'cartao', nome: 'Cartão' },
  { id: 'saldo', nome: 'Saldo' },
  { id: 'itau', nome: 'Itaú' }
]

function Planilha() {
  const [abaAtiva, setAbaAtiva] = useState('investimentos')
  const [dados, setDados] = useState({
    investimentos: [
      { id: 1, mes: 5, banco: 'C6 BANK', descricao: 'PAI LCA 91.5% JULHO 26', tipo: 'Aporte', valor: 148000.90 },
      { id: 2, mes: 5, banco: 'C6 BANK', descricao: 'C6 CRÉDITO', tipo: 'Investimento', valor: 5246.44 },
      { id: 3, mes: 5, banco: 'C6 BANK', descricao: 'CDB C6 APLICADO 20/3', tipo: 'Investimento', valor: 5000.00 },
      { id: 4, mes: 5, banco: 'C6 BANK', descricao: 'INVEST C6 CRÉDITO', tipo: 'Investimento', valor: 3300.00 },
      { id: 5, mes: 5, banco: 'C6 BANK', descricao: 'BONUS MOSAIC CDB', tipo: 'Investimento', valor: 3000.00 },
      { id: 6, mes: 5, banco: 'C6 BANK', descricao: 'BONUS MOSAIC CDB', tipo: 'Investimento', valor: 4000.00 },
      { id: 7, mes: 5, banco: 'ITAU', descricao: 'ITAU CDB', tipo: 'Investimento', valor: 20044.00 },
      { id: 8, mes: 5, banco: 'ITAU', descricao: 'LCL ECOM', tipo: 'Investimento', valor: 4510.00 },
      { id: 9, mes: 5, banco: 'VAMO NESSA', descricao: 'VAMO NESSA', tipo: 'Aporte', valor: 2207.29 },
      { id: 10, mes: 5, banco: 'MERCADO LIVRE', descricao: 'ML 106%', tipo: 'Investimento', valor: 11520.00 },
      { id: 11, mes: 5, banco: 'CRIPTOMOEDAS', descricao: 'BINANCE BTC', tipo: 'Investimento', valor: 10702.31 },
      { id: 12, mes: 5, banco: 'CRIPTOMOEDAS', descricao: 'WORLD COIN BTC', tipo: 'Investimento', valor: 391.00 },
      { id: 13, mes: 5, banco: 'POUPANÇA', descricao: 'COFRINHO 120% CDI', tipo: 'Aporte', valor: 10000.00 },
      { id: 14, mes: 5, banco: 'POUPANÇA', descricao: '110% cdi 6 meses', tipo: 'Aporte', valor: 4600.00 },
      { id: 15, mes: 5, banco: 'POUPANÇA', descricao: 'caixinha nu bank', tipo: 'Aporte', valor: 5000.00 },
      { id: 16, mes: 5, banco: 'POUPANÇA', descricao: 'reserva emergência', tipo: 'Aporte', valor: 5000.00 }
    ],
    cartao: [],
    saldo: [],
    itau: []
  })

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('berich_planilha', JSON.stringify(dados))
  }, [dados])

  const handleMudarCampo = (idx, campo, valor) => {
    const novosDados = { ...dados }
    novosDados[abaAtiva][idx][campo] = campo === 'valor' ? parseFloat(valor) || 0 : valor
    setDados(novosDados)
  }

  const handleAdicionarLinha = () => {
    const novosDados = { ...dados }
    const proximoId = Math.max(...novosDados[abaAtiva].map(d => d.id || 0)) + 1

    novosDados[abaAtiva].push({
      id: proximoId,
      mes: 5,
      banco: '',
      descricao: '',
      tipo: '',
      valor: 0
    })
    setDados(novosDados)
  }

  const handleDeletar = (idx) => {
    if (confirm('Deletar esta linha?')) {
      const novosDados = { ...dados }
      novosDados[abaAtiva].splice(idx, 1)
      setDados(novosDados)
    }
  }

  const handleExportar = () => {
    const dados_aba = dados[abaAtiva]
    const headers = Object.keys(dados_aba[0] || {})
    const csv = [
      headers.join(','),
      ...dados_aba.map(row =>
        headers.map(h => {
          const val = row[h]
          return typeof val === 'string' ? `"${val}"` : val
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${abaAtiva}.csv`
    a.click()
  }

  const dadosAba = dados[abaAtiva] || []
  const total = dadosAba.reduce((sum, d) => sum + (d.valor || 0), 0)

  return (
    <div className="planilha-layout">
      <div className="planilha-main">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <h1>📊 Planilha</h1>
            <p>Edite aqui, sincroniza com o site</p>
          </div>
          <div className="header-actions">
            <button className="btn-export" onClick={handleExportar}>📥 Exportar CSV</button>
            <button className="btn-adicionar" onClick={handleAdicionarLinha}>+ Adicionar</button>
          </div>
        </div>

        {/* ABAS */}
        <div className="abas">
          {ABAS.map(aba => (
            <button
              key={aba.id}
              className={`aba ${abaAtiva === aba.id ? 'active' : ''}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              {aba.nome}
            </button>
          ))}
        </div>

        {/* RESUMO */}
        <div className="resumo">
          <span className="resumo-item">Total: <strong>R$ {total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></span>
          <span className="resumo-item">Linhas: <strong>{dadosAba.length}</strong></span>
        </div>

        {/* TABELA */}
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th style={{width: '50px'}}>ID</th>
                <th style={{width: '60px'}}>MÊS</th>
                <th style={{width: '140px'}}>BANCO</th>
                <th style={{width: '250px'}}>DESCRIÇÃO</th>
                <th style={{width: '120px'}}>TIPO</th>
                <th style={{width: '120px'}}>VALOR</th>
                <th style={{width: '50px'}}>DEL</th>
              </tr>
            </thead>
            <tbody>
              {dadosAba.map((linha, idx) => (
                <tr key={idx}>
                  <td className="cell-id">{linha.id}</td>
                  <td>
                    <input
                      type="number"
                      value={linha.mes}
                      onChange={(e) => handleMudarCampo(idx, 'mes', e.target.value)}
                      className="input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={linha.banco}
                      onChange={(e) => handleMudarCampo(idx, 'banco', e.target.value)}
                      className="input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={linha.descricao}
                      onChange={(e) => handleMudarCampo(idx, 'descricao', e.target.value)}
                      className="input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={linha.tipo}
                      onChange={(e) => handleMudarCampo(idx, 'tipo', e.target.value)}
                      className="input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={linha.valor}
                      onChange={(e) => handleMudarCampo(idx, 'valor', e.target.value)}
                      className="input number"
                    />
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDeletar(idx)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Planilha
