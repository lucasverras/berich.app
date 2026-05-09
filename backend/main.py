from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List, Optional
import csv
import json
from io import StringIO

from models import Lancamento, Categoria, Banco, RegraCategorização
from database import init_db, get_db

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB
init_db()

# ============ LANCAMENTOS ============

@app.get("/lancamentos")
def get_lancamentos(
    banco: Optional[str] = None,
    mes: Optional[int] = None,
    ano: Optional[int] = None,
    categoria: Optional[str] = None,
    forma_pagamento: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Lancamento)

    if banco:
        query = query.filter(Lancamento.banco == banco)
    if categoria and categoria != "all":
        query = query.filter(Lancamento.categoria == categoria)
    if forma_pagamento:
        query = query.filter(Lancamento.forma_pagamento == forma_pagamento)

    if mes and ano:
        query = query.filter(
            (Lancamento.data >= date(ano, mes, 1)) &
            (Lancamento.data < date(ano if mes < 12 else ano + 1, mes + 1 if mes < 12 else 1, 1))
        )

    lancamentos = query.order_by(Lancamento.data.desc()).all()
    return [{
        "id": l.id,
        "data": l.data.isoformat(),
        "valor": l.valor,
        "tipo": l.tipo,
        "categoria": l.categoria,
        "banco": l.banco,
        "descricao": l.descricao,
        "forma_pagamento": l.forma_pagamento,
        "origem": l.origem,
        "importado": l.importado,
    } for l in lancamentos]

@app.post("/lancamentos")
def create_lancamento(
    data: str,
    valor: float,
    tipo: str,
    categoria: Optional[str],
    banco: str,
    descricao: str,
    forma_pagamento: Optional[str] = None,
    db: Session = Depends(get_db)
):
    lancamento = Lancamento(
        data=datetime.fromisoformat(data).date(),
        valor=valor,
        tipo=tipo,
        categoria=categoria,
        banco=banco,
        descricao=descricao,
        forma_pagamento=forma_pagamento,
        origem="manual"
    )
    db.add(lancamento)
    db.commit()
    db.refresh(lancamento)
    return {
        "id": lancamento.id,
        "data": lancamento.data.isoformat(),
        "valor": lancamento.valor,
        "tipo": lancamento.tipo,
        "categoria": lancamento.categoria,
        "banco": lancamento.banco,
        "descricao": lancamento.descricao,
    }

@app.put("/lancamentos/{id}")
def update_lancamento(
    id: int,
    data: Optional[str] = None,
    valor: Optional[float] = None,
    categoria: Optional[str] = None,
    descricao: Optional[str] = None,
    db: Session = Depends(get_db)
):
    lancamento = db.query(Lancamento).filter(Lancamento.id == id).first()
    if not lancamento:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")

    if data:
        lancamento.data = datetime.fromisoformat(data).date()
    if valor:
        lancamento.valor = valor
    if categoria:
        lancamento.categoria = categoria
    if descricao:
        lancamento.descricao = descricao

    db.commit()
    return {"id": lancamento.id, "categoria": lancamento.categoria}

@app.delete("/lancamentos/{id}")
def delete_lancamento(id: int, db: Session = Depends(get_db)):
    lancamento = db.query(Lancamento).filter(Lancamento.id == id).first()
    if not lancamento:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    db.delete(lancamento)
    db.commit()
    return {"deleted": True}

# ============ CATEGORIAS ============

@app.get("/categorias")
def get_categorias(db: Session = Depends(get_db)):
    categorias = db.query(Categoria).filter(Categoria.ativo == True).order_by(Categoria.ordem).all()
    return [{"id": c.id, "nome": c.nome, "ordem": c.ordem} for c in categorias]

@app.post("/categorias")
def create_categoria(nome: str, ordem: int, db: Session = Depends(get_db)):
    if db.query(Categoria).filter(Categoria.nome == nome).first():
        raise HTTPException(status_code=400, detail="Categoria já existe")
    categoria = Categoria(nome=nome, ordem=ordem, ativo=True)
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return {"id": categoria.id, "nome": categoria.nome}

@app.put("/categorias/{id}")
def update_categoria(id: int, nome: Optional[str] = None, ordem: Optional[int] = None, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")

    if nome:
        categoria.nome = nome
    if ordem is not None:
        categoria.ordem = ordem

    db.commit()
    return {"id": categoria.id, "nome": categoria.nome}

@app.delete("/categorias/{id}")
def delete_categoria(id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    categoria.ativo = False
    db.commit()
    return {"deleted": True}

# ============ BANCOS ============

@app.get("/bancos")
def get_bancos(db: Session = Depends(get_db)):
    bancos = db.query(Banco).filter(Banco.ativo == True).all()
    return [{"id": b.id, "nome": b.nome} for b in bancos]

@app.post("/bancos")
def create_banco(nome: str, db: Session = Depends(get_db)):
    if db.query(Banco).filter(Banco.nome == nome).first():
        raise HTTPException(status_code=400, detail="Banco já existe")
    banco = Banco(nome=nome, ativo=True)
    db.add(banco)
    db.commit()
    db.refresh(banco)
    return {"id": banco.id, "nome": banco.nome}

@app.put("/bancos/{id}")
def update_banco(id: int, nome: Optional[str] = None, db: Session = Depends(get_db)):
    banco = db.query(Banco).filter(Banco.id == id).first()
    if not banco:
        raise HTTPException(status_code=404, detail="Banco não encontrado")

    if nome:
        banco.nome = nome

    db.commit()
    return {"id": banco.id, "nome": banco.nome}

# ============ REGRAS ============

@app.get("/regras")
def get_regras(db: Session = Depends(get_db)):
    regras = db.query(RegraCategorização).all()
    return [{"id": r.id, "palavra_chave": r.palavra_chave, "categoria": r.categoria, "prioridade": r.prioridade} for r in regras]

@app.post("/regras")
def create_regra(palavra_chave: str, categoria: str, prioridade: str = "automatica", db: Session = Depends(get_db)):
    regra = RegraCategorização(palavra_chave=palavra_chave, categoria=categoria, prioridade=prioridade)
    db.add(regra)
    db.commit()
    db.refresh(regra)
    return {"id": regra.id, "palavra_chave": regra.palavra_chave}

@app.put("/regras/{id}")
def update_regra(id: int, palavra_chave: Optional[str] = None, categoria: Optional[str] = None, db: Session = Depends(get_db)):
    regra = db.query(RegraCategorização).filter(RegraCategorização.id == id).first()
    if not regra:
        raise HTTPException(status_code=404, detail="Regra não encontrada")

    if palavra_chave:
        regra.palavra_chave = palavra_chave
    if categoria:
        regra.categoria = categoria

    db.commit()
    return {"id": regra.id}

@app.delete("/regras/{id}")
def delete_regra(id: int, db: Session = Depends(get_db)):
    regra = db.query(RegraCategorização).filter(RegraCategorização.id == id).first()
    if not regra:
        raise HTTPException(status_code=404, detail="Regra não encontrada")
    db.delete(regra)
    db.commit()
    return {"deleted": True}

# ============ RESUMO ============

@app.get("/resumo")
def get_resumo(banco: Optional[str] = None, mes: Optional[int] = None, ano: Optional[int] = None, forma_pagamento: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Lancamento)

    if banco:
        query = query.filter(Lancamento.banco == banco)
    if forma_pagamento:
        query = query.filter(Lancamento.forma_pagamento == forma_pagamento)

    if mes and ano:
        query = query.filter(
            (Lancamento.data >= date(ano, mes, 1)) &
            (Lancamento.data < date(ano if mes < 12 else ano + 1, mes + 1 if mes < 12 else 1, 1))
        )

    lancamentos = query.all()

    entradas = sum(l.valor for l in lancamentos if l.tipo == "entrada")
    saidas = sum(l.valor for l in lancamentos if l.tipo == "saída")
    saldo = entradas - saidas

    por_categoria = {}
    for l in lancamentos:
        if l.categoria:
            if l.categoria not in por_categoria:
                por_categoria[l.categoria] = 0
            por_categoria[l.categoria] += l.valor

    return {
        "entradas": round(entradas, 2),
        "saidas": round(saidas, 2),
        "saldo": round(saldo, 2),
        "por_categoria": {k: round(v, 2) for k, v in por_categoria.items()},
        "total_lancamentos": len(lancamentos)
    }

@app.get("/resumo/categorias")
def get_resumo_categorias(banco: Optional[str] = None, mes: Optional[int] = None, ano: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Lancamento)

    if banco:
        query = query.filter(Lancamento.banco == banco)

    if mes and ano:
        query = query.filter(
            (Lancamento.data >= date(ano, mes, 1)) &
            (Lancamento.data < date(ano if mes < 12 else ano + 1, mes + 1 if mes < 12 else 1, 1))
        )

    lancamentos = query.all()

    por_categoria = {}
    for l in lancamentos:
        if l.categoria and l.categoria != "CARTÃO":
            if l.categoria not in por_categoria:
                por_categoria[l.categoria] = 0
            por_categoria[l.categoria] += l.valor

    return {
        "por_categoria": {k: round(v, 2) for k, v in sorted(por_categoria.items(), key=lambda x: abs(x[1]), reverse=True)},
        "total_lancamentos": len(lancamentos)
    }

# ============ IMPORTAÇÃO ============

@app.get("/import/pendentes")
def get_pendentes(db: Session = Depends(get_db)):
    pendentes = db.query(Lancamento).filter(Lancamento.categoria == None).all()
    return [{
        "id": l.id,
        "data": l.data.isoformat(),
        "valor": l.valor,
        "descricao": l.descricao,
        "banco": l.banco,
        "tipo": l.tipo,
    } for l in pendentes]

@app.post("/import/csv")
def import_csv(file: UploadFile = File(...), banco: str = "", db: Session = Depends(get_db)):
    try:
        contents = file.file.read().decode()
        reader = csv.DictReader(StringIO(contents))

        for row in reader:
            data_str = row.get("Data", row.get("date", ""))
            valor_str = row.get("Valor", row.get("amount", "")).replace(",", ".")
            descricao = row.get("Descrição", row.get("description", ""))

            if not data_str or not valor_str:
                continue

            try:
                valor = float(valor_str)
                data_obj = datetime.strptime(data_str, "%d/%m/%Y").date()
            except:
                continue

            tipo = "saída" if valor < 0 else "entrada"
            valor = abs(valor)

            duplicata = db.query(Lancamento).filter(
                Lancamento.banco == banco,
                Lancamento.data == data_obj,
                Lancamento.valor == valor,
                Lancamento.descricao == descricao
            ).first()

            if duplicata:
                continue

            categoria = None
            for regra in db.query(RegraCategorização).all():
                if regra.palavra_chave.lower() in descricao.lower():
                    categoria = regra.categoria
                    break

            lancamento = Lancamento(
                data=data_obj,
                valor=valor,
                tipo=tipo,
                categoria=categoria,
                banco=banco,
                descricao=descricao,
                origem="csv",
                importado=True
            )
            db.add(lancamento)

        db.commit()
        return {"importado": True, "mensagem": "CSV importado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/import/categorizar/{id}")
def categorizar_lancamento(id: int, categoria: str, criar_regra: bool = False, db: Session = Depends(get_db)):
    lancamento = db.query(Lancamento).filter(Lancamento.id == id).first()
    if not lancamento:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")

    lancamento.categoria = categoria
    db.commit()

    if criar_regra:
        palavras = lancamento.descricao.lower().split()
        for palavra in palavras:
            if len(palavra) > 4:
                regra = RegraCategorização(
                    palavra_chave=palavra,
                    categoria=categoria,
                    prioridade="manual"
                )
                db.add(regra)
        db.commit()

    return {"categorizado": True}

# ============ BACKUP ============

@app.get("/backup")
def get_backup(db: Session = Depends(get_db)):
    lancamentos = db.query(Lancamento).all()
    categorias = db.query(Categoria).all()
    bancos = db.query(Banco).all()
    regras = db.query(RegraCategorização).all()

    backup = {
        "lancamentos": [{
            "data": l.data.isoformat(),
            "valor": l.valor,
            "tipo": l.tipo,
            "categoria": l.categoria,
            "banco": l.banco,
            "descricao": l.descricao,
            "forma_pagamento": l.forma_pagamento,
            "origem": l.origem,
        } for l in lancamentos],
        "categorias": [{"nome": c.nome, "ordem": c.ordem} for c in categorias],
        "bancos": [{"nome": b.nome} for b in bancos],
        "regras": [{"palavra_chave": r.palavra_chave, "categoria": r.categoria, "prioridade": r.prioridade} for r in regras],
    }

    return backup

@app.post("/restore")
def restore_backup(backup_data: dict, db: Session = Depends(get_db)):
    try:
        for cat in backup_data.get("categorias", []):
            if not db.query(Categoria).filter(Categoria.nome == cat["nome"]).first():
                db.add(Categoria(nome=cat["nome"], ordem=cat["ordem"], ativo=True))

        for banco in backup_data.get("bancos", []):
            if not db.query(Banco).filter(Banco.nome == banco["nome"]).first():
                db.add(Banco(nome=banco["nome"], ativo=True))

        for regra in backup_data.get("regras", []):
            if not db.query(RegraCategorização).filter(RegraCategorização.palavra_chave == regra["palavra_chave"]).first():
                db.add(RegraCategorização(
                    palavra_chave=regra["palavra_chave"],
                    categoria=regra["categoria"],
                    prioridade=regra["prioridade"]
                ))

        db.commit()
        return {"restaurado": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
