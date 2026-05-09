import sqlite3
from datetime import date

DB = "financas.db"
con = sqlite3.connect(DB)
cur = con.cursor()

# Limpar dados incorretos anteriores
cur.execute("DELETE FROM lancamentos WHERE descricao LIKE '%SNAPSHOT%'")
cur.execute("DELETE FROM lancamentos WHERE origem IN ('planilha-investimentos', 'seed', 'planilha-c6', 'planilha-c6-cartao', 'planilha-c6-pix', 'planilha-vamonessa')")
con.commit()

def add(data, valor, categoria, banco, forma, descricao):
    d = data if data else str(date.today())
    cur.execute("""
        INSERT INTO lancamentos
          (data, valor, tipo, categoria, banco, forma_pagamento, descricao, origem, importado)
        VALUES (?,?,?,?,?,?,?,'seed',1)
    """, (d, valor, 'entrada' if valor > 0 else 'saída',
          categoria, banco, forma, descricao))

# ── C6 Bank – CARTÃO DE CRÉDITO ──────────────────────────────────────────────
# Coluna esquerda da planilha: o que foi cobrado no cartão de crédito
cartao = [
    # Fevereiro 2026
    ('2026-02-27', -85.00,   'PRESENTES',     'óticas kauany 3/3'),
    ('2026-01-29', -55.04,   'PARA MIM',      'integral 1/2'),
    ('2026-01-29', -97.36,   'PRESENTES',     'vivara kau 2/3'),
    ('2026-02-03', -34.89,   'COMIDA',        'hippos'),
    ('2026-02-04', -82.17,   'NAVEGANDOSP',   'ALMOÇO NO JATOBAH COM O MATHEUS'),
    ('2026-02-05', -109.90,  'PRESENTES',     'ROSAS PRA KAU'),
    ('2026-02-06', -21.99,   'COMIDA',        'COCA COLA'),
    ('2026-02-07', -40.00,   'COMIDA',        'ESFIHAS JUVENTUS'),
    ('2026-02-08', -141.30,  'COMIDA',        'ANIV KAU CARNES + QUEIJOS'),
    ('2026-02-08', -8.15,    'UBER',          'UBER CAMISETA'),
    ('2026-02-10', -38.00,   'POD',           'TABACO'),
    ('2026-02-12', -60.23,   'NAVEGANDOSP',   'UBER NAVEGANDO JA PAGO'),
    ('2026-02-13', -185.60,  'FESTAS',        'ESTANDE DE TIRO + FRANCO GASTROBAR'),
    ('2026-02-16', -85.79,   'BEBIDAS',       'CARNAVAL JANETE + ABSOLUT'),
    ('2026-02-17', -69.00,   'COMIDA',        'JATOBAH PÃS GRAVAÇÃO'),
    ('2026-02-19', -39.84,   'OUTROS',        'TESTE KAU + DESODO'),
    ('2026-02-20', -85.60,   'COMIDA',        'JANTAR NO JOHNS'),
    ('2026-02-25', -71.92,   'UBER',          'vila beats reembolso'),
    ('2026-02-25', -40.00,   'COMIDA',        'almoço nova mooca'),
    ('2026-02-26', -89.90,   'MENSAL',        'totalpass'),
    ('2026-02-27', -51.92,   'UBER',          'uber para dom tugas'),
    ('2026-02-27', -61.87,   'BEBIDAS',       'adega 77'),
    ('2026-02-28', -41.88,   'PRESENTES',     'ifood pra kau'),
    # Março 2026
    ('2026-03-01', -356.80,  'BEBIDAS',       'motiro aniv do pardo'),
    ('2026-03-01', -231.38,  'BEBIDAS',       'jogo palmeiras x SP'),
    ('2026-03-02', -48.90,   'COMIDA',        'macdonalds'),
    ('2026-03-02', -19.94,   'UBER',          'uber'),
    ('2026-03-04', -23.00,   'OUTROS',        'NAO SEI'),
    ('2026-03-06', -12.99,   'COMIDA',        'COCA'),
    ('2026-03-08', -337.27,  'BEBIDAS',       'BOTECO DA MOOCA + JATOBAH + FRANCO'),
    ('2026-03-08', -23.95,   'UBER',          'KAUANY UBER'),
    ('2026-03-08', -124.30,  'COMIDA',        'TOCCO COM A KAU'),
    ('2026-03-11', -204.50,  'PARA MIM',      'DMZ 1/3 NICOLAS PAGAS 100'),
    ('2026-03-14', -90.98,   'UBER',          'UBER PARA GALPAO'),
    ('2026-03-14', -97.56,   'COMIDA',        'BEEFMAKERS CARNES CHURRASCO SALLES'),
    ('2026-03-14', -25.00,   'POD',           'TABACO'),
    ('2026-03-15', -97.20,   'BEBIDAS',       'COMBOS DE VODKA VÃO DO SALLES'),
    ('2026-03-15', -33.96,   'BEBIDAS',       'MCDONALDS + BREJA NO POSTO'),
    ('2026-03-20', -14.95,   'UBER',          'uber pro enzo'),
    ('2026-03-20', -11.00,   'COMIDA',        'pepsi'),
    ('2026-03-21', -283.33,  'BEBIDAS',       'franco gastrobar com rizzi'),
    ('2026-03-21', -50.00,   'GASOLINA',      'gasolina'),
    ('2026-03-21', -203.38,  'BEBIDAS',       'farol da mooca com lorenzo vitinho nick'),
    ('2026-03-22', -62.60,   'BEBIDAS',       'adega do pinho'),
    ('2026-03-22', -26.57,   'BEBIDAS',       'pepsi'),
    ('2026-03-24', -153.06,  'VESTUÁRIO',     'calca kaua ta pagando'),
    ('2026-03-26', -89.90,   'MENSAL',        'total pass'),
    ('2026-03-26', -156.94,  'VESTUÁRIO',     'calça fusion'),
    ('2026-03-26', -280.70,  'BEBIDAS',       'zé delivery c os mlks'),
    ('2026-03-28', -179.72,  'UBER',          'uber para casamento'),
    ('2026-03-29', -50.00,   'CARTÃO',        'tarifa anuidade'),
    ('2026-03-30', -50.64,   'UBER',          'uber'),
    # Abril 2026 (fatura de março)
    ('2026-04-02', -49.99,   'ESTACIONAMENTO','estacionamento'),
    ('2026-04-04', -75.00,   'COMIDA',        'pizzaria pianossa'),
    ('2026-04-04', -151.97,  'KAU',           'humorfobia bola e carioca'),
    ('2026-04-06', -470.00,  'KAU',           'nonna lasanha'),
    ('2026-04-06', -45.00,   'ESTACIONAMENTO','estacionamento'),
    ('2026-04-10', -145.00,  'COMIDA',        'primas kau'),
    ('2026-04-11', -13.90,   'ESTACIONAMENTO','zona azul'),
    ('2026-04-12', -121.15,  'COMIDA',        'jantar eu e kau'),
    ('2026-04-12', -22.00,   'OUTROS',        'MP'),
    ('2026-04-12', -75.00,   'OUTROS',        'palmeiras ingresso champions'),
    ('2026-04-13', -19.94,   'OUTROS',        'joarez'),
    ('2026-04-15', -198.03,  'COMIDA',        'burdog dia do humorfobia'),
    ('2026-04-16', -50.88,   'KAU',           'poke kau'),
    ('2026-04-16', -105.90,  'BEBIDAS',       'jogo palmeiras arredores'),
    ('2026-04-17', -54.60,   'UBER',          'uber agencia'),
    ('2026-04-17', -131.00,  'COMIDA',        'san gennato pizzas'),
    ('2026-04-19', -475.00,  'BEBIDAS',       'maru e festa eletrônica'),
    ('2026-04-19', -27.40,   'UBER',          'uber kau'),
    ('2026-04-19', -19.36,   'OUTROS',        'farmacia'),
    ('2026-04-20', -71.40,   'COMIDA',        'almoco com a kau'),
    ('2026-04-21', -13.99,   'BEBIDAS',       'coca'),
    ('2026-04-21', -329.03,  'FESTAS',        'dani 2 parcelas 1/2'),
    ('2026-04-22', -110.00,  'OUTROS',        'ingresso palmeiras bragança'),
    ('2026-04-24', -247.83,  'OUTROS',        'camisa retro amiga pagas'),
    ('2026-04-24', -34.50,   'BEBIDAS',       'naosei'),
    ('2026-04-25', -80.42,   'COMIDA',        'save the burger'),
    ('2026-04-25', -33.70,   'COMIDA',        'jupan'),
    ('2026-04-26', -89.90,   'MENSAL',        'totalpass'),
    ('2026-04-26', -47.98,   'BEBIDAS',       'indo pro jogo'),
    ('2026-04-29', -29.80,   'COMIDA',        'macdonalds'),
    # Maio 2026 (fatura de abril)
    ('2026-04-21', -329.03,  'FESTAS',        'dani 2 parcelas 2/2'),
    ('2026-03-11', -204.50,  'PARA MIM',      'DMZ 2/3'),
    ('2026-04-29', -29.80,   'COMIDA',        'macdonalds'),
    ('2026-05-01', -138.89,  'VIAGENS',       'PARATY'),
    ('2026-05-01', -23.70,   'VIAGENS',       'PARATY'),
    ('2026-05-02', -209.90,  'VIAGENS',       'PARATY'),
    ('2026-05-03', -21.00,   'VIAGENS',       'PARATY'),
    ('2026-05-04', -120.00,  'VIAGENS',       'PARATY'),
    ('2026-05-05', -28.88,   'VIAGENS',       'PARATY'),
    ('2026-05-06', -60.00,   'VIAGENS',       'PARATY'),
    ('2026-05-07', -75.00,   'VIAGENS',       'PARATY'),
    ('2026-05-08', -50.00,   'VIAGENS',       'PARATY'),
    ('2026-05-09', -80.00,   'VIAGENS',       'PARATY'),
    ('2026-05-05', -10.94,   'UBER',          'uber'),
    ('2026-05-05', -52.12,   'PARA MIM',      'FORMULA BKZ'),
    ('2026-05-08', -65.00,   'ESTACIONAMENTO','lavagem carro'),
    ('2026-05-08', -18.00,   'BEBIDAS',       'pepse'),
]
for d,v,c,m in cartao:
    add(d, v, c, 'C6 Bank', 'cartão', m)

# ── C6 Bank – PIX / SALDO (saída definitiva da conta) ──────────────────────────
# Coluna direita da planilha: movimentações reais que saíram/entraram no PIX
pix = [
    # Março 2026
    ('2026-03-01', -617.56,  'MENSAL',      'CONVÊNIO'),
    ('2026-03-01', -135.00,  'APOSTAS',     'APOSTAS'),
    ('2026-03-02',  3371.92, 'GANHOS',      'NAVEGANDO FEVEREIRO + UBER'),
    ('2026-03-02',    50.00, 'GANHOS',      'PALMEIRAS REEMBOLSO'),
    ('2026-03-04',  -150.00, 'APOSTAS',     'APOSTAS'),
    ('2026-03-05',   300.00, 'GANHOS',      'COMISSAO FELIPE RADIAL'),
    ('2026-03-05',  5444.80, 'GANHOS',      'SALÁRIO MOSAIC'),
    ('2026-03-05',    19.90, 'GANHOS',      'PALMEIRAS'),
    ('2026-03-06',   600.00, 'GANHOS',      'NAVEGANDO MKT COMISSAO'),
    ('2026-03-08',  -263.90, 'APOSTAS',     'APOSTAS'),
    ('2026-03-08',   100.00, 'GANHOS',      'rafa dr espeto'),
    ('2026-03-08',   300.00, 'APOSTAS',     'apostas ganhou'),
    ('2026-03-09',  -250.00, 'APOSTAS',     'apostas'),
    ('2026-03-09',  -283.28, 'OUTROS',      'fatura nu bank mensais + carro'),
    ('2026-03-10',  -202.50, 'OUTROS',      'pagamento gustavo'),
    ('2026-03-10',  -100.00, 'COMIDA',      'CHURRASCO KAU BANCO'),
    ('2026-03-10',   100.00, 'APOSTAS',     'apostas'),
    ('2026-03-10', -2396.36, 'CARTÃO',      'FATURA C6'),
    ('2026-03-10',  -495.00, 'OUTROS',      'mercado pago bateria flores'),
    ('2026-03-11',   306.00, 'APOSTAS',     'apostas'),
    ('2026-03-12',    26.97, 'GANHOS',      'CAMISETA PALMEIRAS vendeu corinthians'),
    ('2026-03-14',   -36.72, 'BEBIDAS',     'nao sei'),
    ('2026-03-15',   106.00, 'APOSTAS',     'apostas'),
    ('2026-03-15', -3000.00, 'INVESTIDO',   'aplicou cdb'),
    ('2026-03-19',  1350.00, 'GANHOS',      'LARI PAGOU COMISSOES E 20% VERA'),
    ('2026-03-20', -4000.00, 'INVESTIDO',   'APLICOU CDB'),
    ('2026-03-22',   200.00, 'APOSTAS',     'leozinho apostas'),
    ('2026-03-25',  -176.05, 'APOSTAS',     'apostas'),
    ('2026-03-26',  -500.00, 'APOSTAS',     'superbet'),
    ('2026-03-26',   961.59, 'APOSTAS',     'apostas ganhou'),
    ('2026-03-27',    22.00, 'GANHOS',      'rafae'),
    ('2026-03-28',  -155.00, 'OUTROS',      'cidinha e gravata'),
    ('2026-03-29',  -100.00, 'APOSTAS',     'bet'),
    ('2026-03-31',   975.00, 'NAVEGANDOSP', 'navegando comissoes'),
    # Abril 2026
    ('2026-04-01',  -679.19, 'MENSAL',      'superrmed boleto'),
    ('2026-04-01',   100.00, 'GANHOS',      'kau'),
    ('2026-04-02',  -215.00, 'COMIDA',      'páscoa'),
    ('2026-04-02',  3000.00, 'NAVEGANDOSP', 'mensal navegando'),
    ('2026-04-02', -2500.00, 'OUTROS',      'dentista lentes'),
    ('2026-04-03',   -50.00, 'APOSTAS',     'apostas'),
    ('2026-04-03',   -80.00, 'BEBIDAS',     'combo salles'),
    ('2026-04-05',  -380.00, 'APOSTAS',     'apostas'),
    ('2026-04-06',  5444.80, 'GANHOS',      'salario mosaic'),
    ('2026-04-06',   -98.00, 'KAU',         '1 ano kau'),
    ('2026-04-07',   400.00, 'APOSTAS',     'apostas'),
    ('2026-04-09',  -915.23, 'APOSTAS',     'apostas'),
    ('2026-04-10', -2780.86, 'CARTÃO',      'FATURA'),
    ('2026-04-10', -3300.00, 'INVESTIDO',   'INVESTIU C6 CARTAO'),
    ('2026-04-10',   200.00, 'APOSTAS',     'APOSTAS'),
    ('2026-04-10',   190.00, 'GANHOS',      'NMAO SEI'),
    ('2026-04-11',  -100.00, 'APOSTAS',     'APOSTAS'),
    ('2026-04-12',   -20.00, 'POD',         'TABACO'),
    ('2026-04-13',    78.34, 'GANHOS',      'AYALA PAGOU'),
    ('2026-04-14',   100.00, 'APOSTAS',     'APOSTAS'),
    ('2026-04-16',  -400.00, 'APOSTAS',     'APOSTAS'),
    ('2026-04-19',   870.00, 'APOSTAS',     'APOSTAS'),
    ('2026-04-19',  -114.78, 'OUTROS',      'TXA CAMISAS PALMEIRAS'),
    ('2026-04-20',   100.00, 'GANHOS',      'ganhos'),
    ('2026-04-21',  -495.00, 'APOSTAS',     'apostas'),
    ('2026-04-22',  2798.79, 'NAVEGANDOSP', 'comissao FELIPE RADIAL'),
    ('2026-04-22', -1000.00, 'APOSTAS',     'bet'),
    ('2026-04-23',  1100.00, 'APOSTAS',     'apostas'),
    ('2026-04-23', -3360.00, 'LCL',         'investiu lcl'),
    ('2026-04-24',   -20.00, 'OUTROS',      'lalamove'),
    ('2026-04-24',  1000.00, 'NAVEGANDOSP', 'navegandosp comissao'),
    ('2026-04-25',   152.99, 'OUTROS',      'churrasco mlks'),
    ('2026-04-25',  -100.00, 'APOSTAS',     'apostas'),
    ('2026-04-27',   150.00, 'GANHOS',      'kau pagou'),
    ('2026-04-27',   200.00, 'NAVEGANDOSP', 'franco cardapio'),
    ('2026-04-28',     3.00, 'APOSTAS',     'apostas'),
    ('2026-04-30',   -50.00, 'BEBIDAS',     'rafael'),
    ('2026-04-30',  -679.19, 'MENSAL',      'segurosaude'),
    ('2026-04-30',   755.00, 'APOSTAS',     'apostas'),
    # Maio 2026
    ('2026-05-04',   -47.40, 'OUTROS',      'olx'),
    ('2026-05-05',  5444.80, 'GANHOS',      'salario mosaic'),
    ('2026-05-05', -3515.25, 'CARTÃO',      'FATURA CARTÃO'),
    ('2026-05-05',    50.00, 'APOSTAS',     'APOSTAS'),
    ('2026-05-05',    70.00, 'GANHOS',      'RATAO PAGOU'),
    ('2026-05-06',  -235.00, 'LCL',         'CONTABILIDADE LCL INVEST'),
    ('2026-05-06',  -242.30, 'VIAGENS',     'VIAGEM PARATY'),
    ('2026-05-07',  3000.00, 'NAVEGANDOSP', 'NAVEGANDO MENSAL'),
    ('2026-05-09',   650.00, 'APOSTAS',     'APOSTAS'),
]
for d,v,c,m in pix:
    add(d, v, c, 'C6 Bank', 'pix', m)

# ── VamoNessa SP ──────────────────────────────────────────────────────────────
vamonessa = [
    ('2026-02-27',  -500.00, 'APOSTAS',     'BET NEYMAR COPA'),
    ('2026-03-17',   -20.00, 'NAVEGANDOSP', 'CLARO PAGAMENTO SALLES N PAGOU'),
    ('2026-03-18',   300.00, 'NAVEGANDOSP', 'RECANTO'),
    ('2026-03-26',   190.00, 'NAVEGANDOSP', '1445 BURG'),
    ('2026-03-27',   195.00, 'NAVEGANDOSP', 'PRIME GOURMET'),
    ('2026-04-04',  -288.46, 'CARTÃO',      'fatura cartão'),
    ('2026-04-08',   130.00, 'NAVEGANDOSP', 'the best açai waffle'),
    ('2026-04-09',  -291.01, 'CARTÃO',      'fatura cartão'),
    ('2026-04-17',   -35.00, 'MENSAL',      'fatura claro'),
    ('2026-05-24',   574.50, 'NAVEGANDOSP', 'açai frooty'),
]
for d,v,c,m in vamonessa:
    add(d, v, c, 'VamoNessa SP', 'pix', m)

# ── Investimentos – posições atuais ────────────────────────────────────────────
hoje = str(date.today())
investimentos = [
    (148000.90, 'Investimentos', 'PAI LCA 91.5% JULHO 26'),
    (  5246.44, 'C6 Bank',       'C6 CRÉDITO'),
    ( 10835.08, 'Investimentos', 'BINANCE BTC'),
    (   391.00, 'Investimentos', 'WORLD COIN BTC'),
    ( 20044.00, 'Itaú',          'ITAU CDB'),
    ( 11520.00, 'Investimentos', 'ML 106% venc 14/07/2026'),
    ( 10000.00, 'Investimentos', 'COFRINHO 120% CDI'),
    (  4600.00, 'Investimentos', 'CDB 110% CDI 6m'),
    (  5000.00, 'Investimentos', 'Caixinha Nubank Turbo 115%'),
    (  5000.00, 'Investimentos', 'Reserva de emergência'),
    (  2207.29, 'VamoNessa SP',  'VamoNessa investido'),
    (  5000.00, 'C6 Bank',       'CDB C6 20/03'),
    (  3000.00, 'C6 Bank',       'Bônus Mosaic CDB C6 21/03 1/2'),
    (  4000.00, 'C6 Bank',       'Bônus Mosaic CDB C6 21/03 2/2'),
    (  3300.00, 'C6 Bank',       'INVEST C6 CRÉDITO'),
    (  4510.00, 'Investimentos', 'LCL ECOM'),
]
for v, banco, nome in investimentos:
    add(hoje, v, 'INVESTIDO', banco, 'transferência', nome)

con.commit()
con.close()
print("✅ Seed concluída com sucesso.")
print(f"  Cartão:        {len(cartao)} lançamentos")
print(f"  PIX:           {len(pix)} lançamentos")
print(f"  VamoNessa:     {len(vamonessa)} lançamentos")
print(f"  Investimentos: {len(investimentos)} posições")
