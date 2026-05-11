from database import SessionLocal
from models import Lancamento, Categoria, Banco
from datetime import date

db = SessionLocal()

# Limpar tudo
db.query(Lancamento).delete()
db.commit()

# Dados de teste — maio 2026
lancamentos = [
    # C6 Bank — Cartão (fatura maio)
    Lancamento(data=date(2026,5,1), valor=89.90, tipo='saída', categoria='COMIDA', banco='C6 Bank', descricao='iFood - Burger King', forma_pagamento='cartão'),
    Lancamento(data=date(2026,5,1), valor=45.00, tipo='saída', categoria='UBER', banco='C6 Bank', descricao='Uber - Centro', forma_pagamento='cartão'),
    Lancamento(data=date(2026,5,1), valor=299.00, tipo='saída', categoria='VESTUÁRIO', banco='C6 Bank', descricao='Zara - Camiseta (1/3)', forma_pagamento='cartão'),
    Lancamento(data=date(2026,6,1), valor=299.00, tipo='saída', categoria='VESTUÁRIO', banco='C6 Bank', descricao='Zara - Camiseta (2/3)', forma_pagamento='cartão'),
    Lancamento(data=date(2026,7,1), valor=299.00, tipo='saída', categoria='VESTUÁRIO', banco='C6 Bank', descricao='Zara - Camiseta (3/3)', forma_pagamento='cartão'),
    Lancamento(data=date(2026,5,1), valor=59.90, tipo='saída', categoria='BEBIDAS', banco='C6 Bank', descricao='Bar do João', forma_pagamento='cartão'),
    Lancamento(data=date(2026,5,1), valor=120.00, tipo='saída', categoria='GASOLINA', banco='C6 Bank', descricao='Posto Shell', forma_pagamento='cartão'),

    # C6 Bank — PIX (conta maio)
    Lancamento(data=date(2026,5,5), valor=5000.00, tipo='entrada', categoria='GANHOS', banco='C6 Bank', descricao='Salário maio', forma_pagamento='pix'),
    Lancamento(data=date(2026,5,8), valor=150.00, tipo='saída', categoria='MENSAL', banco='C6 Bank', descricao='Conta de luz', forma_pagamento='pix'),
    Lancamento(data=date(2026,5,10), valor=200.00, tipo='saída', categoria='MENSAL', banco='C6 Bank', descricao='Internet', forma_pagamento='pix'),
    Lancamento(data=date(2026,5,15), valor=800.00, tipo='saída', categoria='INVESTIDO', banco='C6 Bank', descricao='Aporte Renda Fixa', forma_pagamento='pix'),

    # Itaú — PIX
    Lancamento(data=date(2026,5,3), valor=3200.00, tipo='entrada', categoria='GANHOS', banco='Itaú', descricao='Freelance projeto X', forma_pagamento='pix'),
    Lancamento(data=date(2026,5,12), valor=500.00, tipo='saída', categoria='MENSAL', banco='Itaú', descricao='Aluguel', forma_pagamento='pix'),
    Lancamento(data=date(2026,5,18), valor=250.00, tipo='saída', categoria='PARA MIM', banco='Itaú', descricao='Academia', forma_pagamento='pix'),

    # VamoNessa SP — PIX
    Lancamento(data=date(2026,5,7), valor=1500.00, tipo='entrada', categoria='GANHOS', banco='VamoNessa SP', descricao='Transferência recebida', forma_pagamento='pix'),
    Lancamento(data=date(2026,5,20), valor=320.00, tipo='saída', categoria='FESTAS', banco='VamoNessa SP', descricao='Aniversário amigo', forma_pagamento='pix'),
]

for l in lancamentos:
    db.add(l)
db.commit()
db.close()
print("Banco resetado e populado com sucesso!")
