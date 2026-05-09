from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Banco, Categoria, RegraCategorização
import os

DATABASE_URL = "sqlite:///./financas.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed bancos
    bancos = ["C6 Bank", "VamoNessa SP", "Itaú", "Investimentos"]
    for nome in bancos:
        if not db.query(Banco).filter(Banco.nome == nome).first():
            db.add(Banco(nome=nome, ativo=True))

    # Seed categorias
    categorias = [
        ("GANHOS", 1), ("REAJUSTE", 2), ("MENSAL", 3), ("CARTÃO", 4), ("INVESTIDO", 5),
        ("POD", 6), ("COMIDA", 7), ("BEBIDAS", 8), ("UBER", 9), ("GASOLINA", 10),
        ("ESTACIONAMENTO", 11), ("NAVEGANDOSP", 12), ("FESTAS", 13), ("APOSTAS", 14),
        ("VIAGENS", 15), ("PARA MIM", 16), ("VESTUÁRIO", 17), ("PRESENTES", 18),
        ("KAU", 19), ("LCL", 20), ("OUTROS", 21)
    ]
    for nome, ordem in categorias:
        if not db.query(Categoria).filter(Categoria.nome == nome).first():
            db.add(Categoria(nome=nome, ordem=ordem, ativo=True))

    # Seed regras de categorização
    regras = [
        ("ifood", "COMIDA", "automatica"), ("rappi", "COMIDA", "automatica"),
        ("mcdonalds", "COMIDA", "automatica"), ("burger", "COMIDA", "automatica"),
        ("restaurante", "COMIDA", "automatica"), ("padaria", "COMIDA", "automatica"),
        ("supermercado", "COMIDA", "automatica"), ("carrefour", "COMIDA", "automatica"),
        ("ze delivery", "COMIDA", "automatica"), ("madero", "COMIDA", "automatica"),
        ("açai", "COMIDA", "automatica"), ("sushi", "COMIDA", "automatica"),
        ("uber", "UBER", "automatica"), ("99pop", "UBER", "automatica"),
        ("shell", "GASOLINA", "automatica"), ("ipiranga", "GASOLINA", "automatica"),
        ("zona azul", "ESTACIONAMENTO", "automatica"), ("estapar", "ESTACIONAMENTO", "automatica"),
        ("netflix", "MENSAL", "automatica"), ("spotify", "MENSAL", "automatica"),
        ("totalpass", "MENSAL", "automatica"), ("balboa", "MENSAL", "automatica"),
        ("meli+", "MENSAL", "automatica"), ("academia", "MENSAL", "automatica"),
        ("farmacia", "PARA MIM", "automatica"), ("drogaria", "PARA MIM", "automatica"),
        ("renner", "VESTUÁRIO", "automatica"), ("shein", "VESTUÁRIO", "automatica"),
        ("salario", "GANHOS", "automatica"), ("bonus", "GANHOS", "automatica"),
        ("fgts", "GANHOS", "automatica"), ("rescisao", "GANHOS", "automatica"),
        ("aposta", "APOSTAS", "automatica"), ("bet", "APOSTAS", "automatica"),
        ("breja", "BEBIDAS", "automatica"), ("jatobah", "BEBIDAS", "automatica"),
        ("caixinha", "INVESTIDO", "automatica"), ("cdb", "INVESTIDO", "automatica"),
    ]
    for palavra, categoria, prioridade in regras:
        if not db.query(RegraCategorização).filter(RegraCategorização.palavra_chave == palavra).first():
            db.add(RegraCategorização(palavra_chave=palavra, categoria=categoria, prioridade=prioridade))

    db.commit()
    db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
