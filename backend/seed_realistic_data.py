"""
Script para limpar banco de dados e criar dados fictícios realistas de uma pessoa média no Brasil.
Execute com: python seed_realistic_data.py
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Banco, Categoria, RegraCategorização, Lancamento
from datetime import date, timedelta
import random

DATABASE_URL = "sqlite:///./financas.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def reset_database():
    """Deleta e recriar todas as tabelas"""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("✓ Banco de dados resetado")

def seed_master_data(session):
    """Cria bancos e categorias"""

    # Bancos
    bancos = ["C6 Bank", "VamoNessa SP", "Itaú", "Investimentos"]
    for nome in bancos:
        if not session.query(Banco).filter(Banco.nome == nome).first():
            session.add(Banco(nome=nome, ativo=True))

    # Categorias novas e realistas
    categorias = [
        ("Moradia", 1),
        ("Alimentação", 2),
        ("Transporte", 3),
        ("Saúde", 4),
        ("Lazer", 5),
        ("Assinaturas", 6),
        ("Compras", 7),
        ("Outros", 8),
    ]
    for nome, ordem in categorias:
        if not session.query(Categoria).filter(Categoria.nome == nome).first():
            session.add(Categoria(nome=nome, ordem=ordem, ativo=True))

    session.commit()
    print("✓ Bancos e categorias criados")

def seed_realistic_data(session):
    """Cria dados fictícios realistas para maio de 2026"""

    mes = 5  # Maio
    ano = 2026
    banco_principal = "C6 Bank"

    # Data inicial de maio
    primeiro_dia = date(ano, mes, 1)

    # Entradas (salários e outras receitas)
    # Um salário de R$ 6.500 no dia 5
    session.add(Lancamento(
        data=date(ano, mes, 5),
        valor=6500.0,
        tipo="entrada",
        categoria="Outros",
        banco=banco_principal,
        descricao="Salário mensal",
        forma_pagamento="transferência",
        origem="manual"
    ))

    # Outras entradas pequenas
    session.add(Lancamento(
        data=date(ano, mes, 15),
        valor=450.0,
        tipo="entrada",
        categoria="Outros",
        banco=banco_principal,
        descricao="Freelance/bico",
        forma_pagamento="pix",
        origem="manual"
    ))

    # SAÍDAS - Moradia (aluguel, condomínio, água/luz)
    session.add(Lancamento(
        data=date(ano, mes, 1),
        valor=1800.0,
        tipo="saída",
        categoria="Moradia",
        banco=banco_principal,
        descricao="Aluguel mês",
        forma_pagamento="transferência",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 3),
        valor=350.0,
        tipo="saída",
        categoria="Moradia",
        banco=banco_principal,
        descricao="Condomínio/IPTU",
        forma_pagamento="transferência",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 8),
        valor=180.0,
        tipo="saída",
        categoria="Moradia",
        banco=banco_principal,
        descricao="Água e luz",
        forma_pagamento="transferência",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 12),
        valor=95.0,
        tipo="saída",
        categoria="Moradia",
        banco=banco_principal,
        descricao="Internet",
        forma_pagamento="transferência",
        origem="manual"
    ))

    # SAÍDAS - Alimentação (supermercado, restaurante, delivery)
    supermercado_dados = [
        (date(ano, mes, 2), 250.0, "Supermercado Carrefour"),
        (date(ano, mes, 9), 280.0, "Supermercado Pão de Açúcar"),
        (date(ano, mes, 16), 265.0, "Supermercado Carrefour"),
        (date(ano, mes, 23), 290.0, "Supermercado Pão de Açúcar"),
    ]

    for data, valor, desc in supermercado_dados:
        session.add(Lancamento(
            data=data,
            valor=valor,
            tipo="saída",
            categoria="Alimentação",
            banco=banco_principal,
            descricao=desc,
            forma_pagamento="cartão",
            origem="manual"
        ))

    # Deliveries e restaurantes
    alimentacao_fora = [
        (date(ano, mes, 4), 65.0, "iFood - Comida árabe"),
        (date(ano, mes, 11), 85.0, "Rappi - Sushi"),
        (date(ano, mes, 18), 55.0, "iFood - Hambúrguer"),
        (date(ano, mes, 25), 70.0, "Restaurante local"),
        (date(ano, mes, 29), 45.0, "Café da manhã"),
    ]

    for data, valor, desc in alimentacao_fora:
        session.add(Lancamento(
            data=data,
            valor=valor,
            tipo="saída",
            categoria="Alimentação",
            banco=banco_principal,
            descricao=desc,
            forma_pagamento="cartão",
            origem="manual"
        ))

    # SAÍDAS - Transporte (Uber, gasolina, estacionamento)
    session.add(Lancamento(
        data=date(ano, mes, 6),
        valor=120.0,
        tipo="saída",
        categoria="Transporte",
        banco=banco_principal,
        descricao="Uber/99 viagens",
        forma_pagamento="cartão",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 13),
        valor=150.0,
        tipo="saída",
        categoria="Transporte",
        banco=banco_principal,
        descricao="Gasolina",
        forma_pagamento="cartão",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 20),
        valor=85.0,
        tipo="saída",
        categoria="Transporte",
        banco=banco_principal,
        descricao="Estacionamento/zona azul",
        forma_pagamento="pix",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 27),
        valor=100.0,
        tipo="saída",
        categoria="Transporte",
        banco=banco_principal,
        descricao="Uber viagens trabalho",
        forma_pagamento="cartão",
        origem="manual"
    ))

    # SAÍDAS - Saúde (farmácia, médico)
    session.add(Lancamento(
        data=date(ano, mes, 7),
        valor=120.0,
        tipo="saída",
        categoria="Saúde",
        banco=banco_principal,
        descricao="Farmácia medicamentos",
        forma_pagamento="cartão",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 17),
        valor=300.0,
        tipo="saída",
        categoria="Saúde",
        banco=banco_principal,
        descricao="Dentista consulta",
        forma_pagamento="transferência",
        origem="manual"
    ))

    # SAÍDAS - Lazer (cinema, bar, shows, viagens)
    session.add(Lancamento(
        data=date(ano, mes, 10),
        valor=80.0,
        tipo="saída",
        categoria="Lazer",
        banco=banco_principal,
        descricao="Cinema ingressos",
        forma_pagamento="cartão",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 14),
        valor=150.0,
        tipo="saída",
        categoria="Lazer",
        banco=banco_principal,
        descricao="Bar com amigos",
        forma_pagamento="pix",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 22),
        valor=200.0,
        tipo="saída",
        categoria="Lazer",
        banco=banco_principal,
        descricao="Passeio/diversão",
        forma_pagamento="cartão",
        origem="manual"
    ))

    # SAÍDAS - Assinaturas (netflix, spotify, gym)
    session.add(Lancamento(
        data=date(ano, mes, 1),
        valor=65.0,
        tipo="saída",
        categoria="Assinaturas",
        banco=banco_principal,
        descricao="Netflix",
        forma_pagamento="cartão",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 1),
        valor=55.0,
        tipo="saída",
        categoria="Assinaturas",
        banco=banco_principal,
        descricao="Spotify Premium",
        forma_pagamento="cartão",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 5),
        valor=120.0,
        tipo="saída",
        categoria="Assinaturas",
        banco=banco_principal,
        descricao="Academia/musculação",
        forma_pagamento="débito",
        origem="manual"
    ))

    # SAÍDAS - Compras (roupas, eletrônicos, livros)
    session.add(Lancamento(
        data=date(ano, mes, 12),
        valor=350.0,
        tipo="saída",
        categoria="Compras",
        banco=banco_principal,
        descricao="Loja de roupas",
        forma_pagamento="cartão",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 19),
        valor=280.0,
        tipo="saída",
        categoria="Compras",
        banco=banco_principal,
        descricao="Eletrônicos/acessórios",
        forma_pagamento="cartão",
        origem="manual"
    ))

    session.add(Lancamento(
        data=date(ano, mes, 26),
        valor=95.0,
        tipo="saída",
        categoria="Compras",
        banco=banco_principal,
        descricao="Livros e materiais",
        forma_pagamento="pix",
        origem="manual"
    ))

    session.commit()
    print("✓ Dados fictícios realistas criados para Maio/2026")

def seed_regras(session):
    """Cria regras de categorização"""
    regras = [
        ("ifood", "Alimentação"),
        ("rappi", "Alimentação"),
        ("mcdonalds", "Alimentação"),
        ("restaurante", "Alimentação"),
        ("supermercado", "Alimentação"),
        ("carrefour", "Alimentação"),
        ("padaria", "Alimentação"),
        ("uber", "Transporte"),
        ("99pop", "Transporte"),
        ("shell", "Transporte"),
        ("ipiranga", "Transporte"),
        ("zona azul", "Transporte"),
        ("estapar", "Transporte"),
        ("netflix", "Assinaturas"),
        ("spotify", "Assinaturas"),
        ("academia", "Assinaturas"),
        ("farmacia", "Saúde"),
        ("drogaria", "Saúde"),
        ("dentista", "Saúde"),
        ("hospital", "Saúde"),
        ("cinema", "Lazer"),
        ("bar", "Lazer"),
        ("show", "Lazer"),
        ("viagem", "Lazer"),
        ("renner", "Compras"),
        ("shein", "Compras"),
        ("amazon", "Compras"),
        ("mercado livre", "Compras"),
        ("aluguel", "Moradia"),
        ("condomínio", "Moradia"),
        ("água", "Moradia"),
        ("luz", "Moradia"),
        ("internet", "Moradia"),
        ("salario", "Outros"),
        ("bonus", "Outros"),
    ]

    for palavra, categoria in regras:
        if not session.query(RegraCategorização).filter(RegraCategorização.palavra_chave == palavra).first():
            session.add(RegraCategorização(
                palavra_chave=palavra,
                categoria=categoria,
                prioridade="automatica"
            ))

    session.commit()
    print("✓ Regras de categorização criadas")

if __name__ == "__main__":
    reset_database()
    Session = sessionmaker(bind=engine)
    session = Session()

    seed_master_data(session)
    seed_realistic_data(session)
    seed_regras(session)

    session.close()
    print("\n✓ Database seed concluído com sucesso!")
