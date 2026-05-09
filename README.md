# 💰 BE.RICH — Controle Financeiro Pessoal

App moderno de controle financeiro pessoal com dark mode sofisticado, glassmorphism e suporte mobile.

## 🚀 Como Iniciar

### Backend (FastAPI)

```bash
cd backend
source venv/bin/activate  # ou venv\Scripts\activate no Windows
uvicorn main:app --reload --port 8000
```

O backend estará em `http://localhost:8000`

### Frontend (React + Vite)

Em outro terminal:

```bash
cd frontend
npm run dev
```

O frontend estará em `http://localhost:5173`

## 📱 Versão Mobile

Acesse `http://localhost:5173/mobile` ou clique em "📱 Versão Mobile" na sidebar.

## ✨ Funcionalidades

### 💳 Múltiplos Bancos
- C6 Bank
- VamoNessa SP
- Itaú
- Investimentos

Filtre todos os dados por banco selecionado.

### 📊 Dashboard Completo
- Cards de resumo (Entradas / Saídas / Saldo)
- Gráfico de barras por categoria
- Distribuição proporcional de gastos
- Tabela com todos os lançamentos
- Filtro por categoria

### 📥 Importação CSV/OFX
- Upload de arquivos do banco
- Detecção automática de duplicatas
- Categorização inteligente com regras
- Revisão de lançamentos pendentes

### 🤖 Aprendizado Automático
- Regras de categorização pré-carregadas (35+ palavras-chave)
- Aprender novas regras ao categorizar manualmente
- Prioridade manual > automática

### 🔍 Página de Revisão
- Lista de lançamentos sem categoria
- Categorização individual ou em lote
- Criação de regras com um clique

### ⚙️ Configurações
- CRUD de categorias
- CRUD de bancos
- Gerenciar regras de categorização
- Export/Import de backup JSON

### 📈 Relatórios
- Resumo do período
- Gráfico de pizza por categoria
- Tabela detalhada com percentuais

### 📅 Histórico
- Visualizar todos os lançamentos
- Filtrar por tipo (entrada/saída)
- Timeline completa

## 🎨 Design

**Dark Mode Sofisticado**
- Glassmorphism com backdrop-filter blur
- Cores Verde Premium: #3dba6a
- Tipografia Inter/SF Pro
- Border-radius: 14-20px
- Ícones emoji integrados

## 📦 Stack

- **Backend**: Python 3.9+ | FastAPI | SQLAlchemy | SQLite
- **Frontend**: React 18 | Vite | React Router | Recharts
- **Design**: CSS Grid/Flexbox | Glassmorphism | Dark Mode

## 🗄️ Banco de Dados

SQLite local (`financas.db`) com 4 tabelas:

- `lancamentos` — transações
- `categorias` — categoria editável
- `bancos` — contas de banco
- `regras_categorizacao` — regras automáticas

Seed automático com 35+ regras pré-carregadas.

## 🔗 Endpoints Principais

```
GET  /lancamentos?banco=&mes=&ano=
POST /lancamentos
PUT  /lancamentos/{id}
DELETE /lancamentos/{id}

GET  /categorias
POST /categorias

GET  /bancos
POST /bancos

GET  /resumo?banco=&mes=&ano=
GET  /import/pendentes
POST /import/csv
POST /import/categorizar/{id}

GET  /backup
POST /restore
```

## 💡 Dicas

- Use a aba do banco para filtrar dados
- Use o seletor de mês/ano no dashboard
- Botão "+" flutuante (canto inferior direito) para adicionar rápido
- Badge laranja "revisar" indica lançamentos sem categoria
- Sidebar com menu completo (desktop)

## 📱 Responsivo

- Desktop: layout com sidebar (240px) + conteúdo
- Tablet: layout ajustado
- Mobile: versão otimizada em `/mobile` ou DevTools

---

**Criado com ❤️ para controle financeiro pessoal**
