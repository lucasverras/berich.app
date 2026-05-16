export const getParcelText = (lancamento) => {
  if (lancamento.parcela && lancamento.parcelas_total) {
    return `${lancamento.parcela}/${lancamento.parcelas_total}`;
  }
  return null;
};
