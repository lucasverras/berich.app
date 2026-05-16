// Dados fictícios para cada mês
export const mockLancamentosCartao = [
  // MAIO
  { id: 1, descricao: 'Supermercado Carrefour', valor: 285.40, categoria: 'Alimentação', data: '2026-05-16', tipo: 'saída' },
  { id: 2, descricao: 'Spotify Premium', valor: 119.90, categoria: 'Assinatura', data: '2026-05-15', tipo: 'saída' },
  { id: 3, descricao: 'Farmácia Drogasil', valor: 127.50, categoria: 'Saúde', data: '2026-05-14', tipo: 'saída' },
  { id: 4, descricao: 'Restaurante Outback', valor: 156.80, categoria: 'Alimentação', data: '2026-05-13', tipo: 'saída', parcela: 1, parcelas_total: 2 },
  { id: 9, descricao: 'Uber Viagem', valor: 45.60, categoria: 'Transporte', data: '2026-05-12', tipo: 'saída' },
  { id: 10, descricao: 'Cinema 2 Ingressos', valor: 80.00, categoria: 'Lazer', data: '2026-05-11', tipo: 'saída' },
  { id: 11, descricao: 'Livraria Saraiva', valor: 95.00, categoria: 'Educação', data: '2026-05-10', tipo: 'saída', parcela: 1, parcelas_total: 3 },
  { id: 12, descricao: 'Padaria Doces da Vovó', valor: 52.30, categoria: 'Alimentação', data: '2026-05-09', tipo: 'saída' },
  { id: 17, descricao: 'iFood Delivery', valor: 68.90, categoria: 'Alimentação', data: '2026-05-08', tipo: 'saída' },
  { id: 18, descricao: 'Eletricista Serviço', valor: 200.00, categoria: 'Moradia', data: '2026-05-07', tipo: 'saída', parcela: 1, parcelas_total: 4 },
  { id: 21, descricao: 'Estacionamento Valet', valor: 75.00, categoria: 'Transporte', data: '2026-05-06', tipo: 'saída' },
  { id: 22, descricao: 'Barbearia Premium', valor: 85.00, categoria: 'Pessoal', data: '2026-05-05', tipo: 'saída' },
  { id: 23, descricao: 'Netflix + Amazon Prime', valor: 35.80, categoria: 'Assinatura', data: '2026-05-04', tipo: 'saída' },

  // ABRIL
  { id: 101, descricao: 'Mercado Pão de Açúcar', valor: 320.15, categoria: 'Alimentação', data: '2026-04-28', tipo: 'saída' },
  { id: 102, descricao: 'Apple Music', valor: 12.90, categoria: 'Assinatura', data: '2026-04-27', tipo: 'saída' },
  { id: 103, descricao: 'Dentista Limpeza', valor: 350.00, categoria: 'Saúde', data: '2026-04-26', tipo: 'saída' },
  { id: 104, descricao: 'Churrascaria Plataforma', valor: 198.50, categoria: 'Alimentação', data: '2026-04-25', tipo: 'saída' },
  { id: 105, descricao: 'Táxi para Aeroporto', valor: 78.00, categoria: 'Transporte', data: '2026-04-24', tipo: 'saída' },
  { id: 106, descricao: 'Ingressos Teatro', valor: 120.00, categoria: 'Lazer', data: '2026-04-23', tipo: 'saída' },
  { id: 107, descricao: 'Curso Online Udemy', valor: 49.90, categoria: 'Educação', data: '2026-04-22', tipo: 'saída' },
  { id: 108, descricao: 'Confeitaria Doce Vida', valor: 62.40, categoria: 'Alimentação', data: '2026-04-21', tipo: 'saída' },
  { id: 109, descricao: 'Rappi Café', valor: 35.50, categoria: 'Alimentação', data: '2026-04-20', tipo: 'saída' },
  { id: 110, descricao: 'Encanador Reparo', valor: 180.00, categoria: 'Moradia', data: '2026-04-19', tipo: 'saída' },

  // JUNHO
  { id: 201, descricao: 'Hiper Carrefour', valor: 295.60, categoria: 'Alimentação', data: '2026-06-15', tipo: 'saída' },
  { id: 202, descricao: 'Disney+', valor: 27.90, categoria: 'Assinatura', data: '2026-06-14', tipo: 'saída' },
  { id: 203, descricao: 'Farmácia Droga Raia', valor: 95.30, categoria: 'Saúde', data: '2026-06-13', tipo: 'saída' },
  { id: 204, descricao: 'Barbecue Grill', valor: 210.00, categoria: 'Alimentação', data: '2026-06-12', tipo: 'saída' },
  { id: 205, descricao: 'Uber Black', valor: 105.50, categoria: 'Transporte', data: '2026-06-11', tipo: 'saída' },
];

export const mockLancamentosConta = [
  // MAIO
  { id: 5, descricao: 'Salário Empresa XYZ', valor: 5500.00, categoria: 'Entrada', data: '2026-05-01', tipo: 'entrada' },
  { id: 6, descricao: 'Aluguel Apartamento', valor: -1800.00, categoria: 'Moradia', data: '2026-05-02', tipo: 'saída' },
  { id: 7, descricao: 'Freelance Design', valor: 2000.00, categoria: 'Entrada', data: '2026-05-05', tipo: 'entrada' },
  { id: 8, descricao: 'Academia Smart Fit', valor: -99.90, categoria: 'Saúde', data: '2026-05-03', tipo: 'saída' },
  { id: 13, descricao: 'Cashback Cartão', valor: 156.30, categoria: 'Entrada', data: '2026-05-06', tipo: 'entrada' },
  { id: 14, descricao: 'Venda Livro OLX', valor: 45.00, categoria: 'Entrada', data: '2026-05-07', tipo: 'entrada' },
  { id: 15, descricao: 'Conta Telefone', valor: -89.90, categoria: 'Assinatura', data: '2026-05-08', tipo: 'saída' },
  { id: 16, descricao: 'Dividendos Investimento', valor: 298.70, categoria: 'Entrada', data: '2026-05-09', tipo: 'entrada' },
  { id: 19, descricao: 'Seguro Carro', valor: -450.00, categoria: 'Transporte', data: '2026-05-10', tipo: 'saída' },
  { id: 20, descricao: 'Venda Produto Ebay', valor: 320.00, categoria: 'Entrada', data: '2026-05-12', tipo: 'entrada' },
  { id: 24, descricao: 'Consultoria Financeira', valor: 1000.00, categoria: 'Entrada', data: '2026-05-13', tipo: 'entrada' },
  { id: 25, descricao: 'Conta Água', valor: -150.00, categoria: 'Moradia', data: '2026-05-14', tipo: 'saída' },
  { id: 26, descricao: 'Internet Fibra', valor: -99.90, categoria: 'Assinatura', data: '2026-05-15', tipo: 'saída' },
  { id: 27, descricao: 'Bônus Gerente', valor: 680.00, categoria: 'Entrada', data: '2026-05-16', tipo: 'entrada' },

  // ABRIL
  { id: 105, descricao: 'Salário Empresa XYZ', valor: 5500.00, categoria: 'Entrada', data: '2026-04-01', tipo: 'entrada' },
  { id: 106, descricao: 'Aluguel Apartamento', valor: -1800.00, categoria: 'Moradia', data: '2026-04-02', tipo: 'saída' },
  { id: 107, descricao: 'Freelance Marketing', valor: 1500.00, categoria: 'Entrada', data: '2026-04-05', tipo: 'entrada' },
  { id: 108, descricao: 'Academia Smart Fit', valor: -99.90, categoria: 'Saúde', data: '2026-04-03', tipo: 'saída' },
  { id: 109, descricao: 'Cashback Cartão', valor: 198.50, categoria: 'Entrada', data: '2026-04-06', tipo: 'entrada' },
  { id: 110, descricao: 'Venda Computador', valor: 800.00, categoria: 'Entrada', data: '2026-04-07', tipo: 'entrada' },

  // JUNHO
  { id: 205, descricao: 'Salário Empresa XYZ', valor: 5500.00, categoria: 'Entrada', data: '2026-06-01', tipo: 'entrada' },
  { id: 206, descricao: 'Aluguel Apartamento', valor: -1800.00, categoria: 'Moradia', data: '2026-06-02', tipo: 'saída' },
  { id: 207, descricao: 'Freelance Vídeo', valor: 2500.00, categoria: 'Entrada', data: '2026-06-05', tipo: 'entrada' },
  { id: 208, descricao: 'Academia Smart Fit', valor: -99.90, categoria: 'Saúde', data: '2026-06-03', tipo: 'saída' },
];
