from sqlalchemy import Column, Integer, String, Float, Date, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Banco(Base):
    __tablename__ = "bancos"

    id = Column(Integer, primary_key=True)
    nome = Column(String(100), unique=True, nullable=False)
    ativo = Column(Boolean, default=True)

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True)
    nome = Column(String(100), unique=True, nullable=False)
    ordem = Column(Integer)
    ativo = Column(Boolean, default=True)

class RegraCategorização(Base):
    __tablename__ = "regras_categorizacao"

    id = Column(Integer, primary_key=True)
    palavra_chave = Column(String(100), nullable=False)
    categoria = Column(String(100), nullable=False)
    prioridade = Column(String(20), default="automatica")  # manual ou automatica

class Lancamento(Base):
    __tablename__ = "lancamentos"

    id = Column(Integer, primary_key=True)
    data = Column(Date, nullable=False)
    valor = Column(Float, nullable=False)
    tipo = Column(String(20), nullable=False)  # entrada ou saída
    categoria = Column(String(100))
    banco = Column(String(100), nullable=False)
    forma_pagamento = Column(String(20))  # cartão, pix, débito, transferência
    descricao = Column(String(500))
    origem = Column(String(100))  # manual, csv, ofx
    importado = Column(Boolean, default=False)
    criado_em = Column(DateTime, default=datetime.utcnow)
