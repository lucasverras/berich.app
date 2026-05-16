import { mockLancamentosCartao, mockLancamentosConta } from '../data/mockData'

export const filterByStatementPeriod = (lancamentos, mes, ano, diaFechamento = 1) => {
  if (!lancamentos || !mes || !ano) return []

  // Statement period: from diaFechamento of current month to day before diaFechamento of next month
  // JS months are 0-11, so we subtract 1 from user's mes (1-12)
  const startDate = new Date(ano, mes - 1, diaFechamento)

  // End date is the day before the next month's closing
  const nextMonthClosing = new Date(ano, mes, diaFechamento)
  const endDate = new Date(nextMonthClosing.getTime() - 24 * 60 * 60 * 1000)

  return lancamentos.filter(l => {
    const transDate = new Date(l.data)
    return transDate >= startDate && transDate <= endDate
  })
}

export const filterByMonth = (lancamentos, mes, ano) => {
  if (!lancamentos || !mes || !ano) return []

  return lancamentos.filter(l => {
    const [year, month] = l.data.split('-')
    return parseInt(year) === ano && parseInt(month) === mes
  })
}

export const getMockCartaoForMonth = (mes, ano, diaFechamento = 1) => {
  return filterByStatementPeriod(mockLancamentosCartao, mes, ano, diaFechamento).sort((a, b) => new Date(b.data) - new Date(a.data))
}

export const getMockContaForMonth = (mes, ano, diaFechamento = 1) => {
  return filterByStatementPeriod(mockLancamentosConta, mes, ano, diaFechamento).sort((a, b) => new Date(b.data) - new Date(a.data))
}

export const calculateResumoFromLancamentos = (lancamentos) => {
  let entradas = 0
  let saidas = 0
  const por_categoria = {}

  lancamentos.forEach(l => {
    const valor = parseFloat(l.valor)
    if (l.tipo === 'entrada') {
      entradas += valor
    } else {
      saidas += Math.abs(valor)
      // Only add to por_categoria if it's a saída (expense), not entrada
      if (l.categoria && l.categoria !== 'Entrada') {
        por_categoria[l.categoria] = (por_categoria[l.categoria] || 0) + Math.abs(valor)
      }
    }
  })

  return {
    entradas,
    saidas,
    saldo: entradas - saidas,
    por_categoria
  }
}

export const calculateFaturaFromLancamentos = (lancamentos) => {
  return lancamentos.reduce((sum, l) => sum + Math.abs(l.valor), 0)
}
