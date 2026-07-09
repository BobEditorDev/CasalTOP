# CasalTOP - Sistema Financeiro Residencial

Sistema financeiro residencial desenvolvido para substituir planilhas, mantendo a simplicidade e praticidade.

## 🚀 Tecnologias

- **Next.js 16** (App Router) - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Prisma ORM** - Acesso ao banco
- **PostgreSQL** - Banco de dados
- **Zod** - Validação

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas Next.js
├── domains/               # Domínios de negócio
│   ├── categories/       # Categorias
│   ├── people/          # Pessoas
│   ├── payment-methods/ # Formas de pagamento
│   ├── incomes/         # Receitas
│   ├── expenses/        # Despesas
│   ├── installments/    # Parcelamentos
│   ├── recurring/       # Recorrências
│   ├── dashboard/       # Dashboard
│   └── reports/         # Relatórios
├── shared/              # Recursos compartilhados
└── lib/                 # Configurações
```

## 🛠️ Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Validar arquitetura
npm run validate:architecture

# Validar TypeScript
npm run typecheck

# Executar linter
npm run lint

# Validação completa
npm run validate
```

## 🏗️ Arquitetura

O projeto segue **Feature First Architecture** com separação clara de responsabilidades:

### Camadas
- **Actions**: Server Actions para operações de escrita
- **Services**: Regras de negócio
- **Repositories**: Acesso ao banco via Prisma
- **Components**: Componentes React
- **Types**: Definições TypeScript
- **Validations**: Schemas Zod

### Padrão de Domínio
Cada domínio segue a estrutura padrão:
```
domain/
├── actions/          # Server Actions
├── components/       # Componentes React
├── repositories/     # Acesso Prisma
├── services/         # Regras de negócio
├── types/           # TypeScript types
├── validations/     # Zod schemas
├── utils/           # Utilitários
└── index.ts         # Exportações públicas
```

## 📖 Documentação para Agentes de IA

- **AGENTS.md** - Guia completo de arquitetura para agentes de IA
- **.ai-instructions.md** - Instruções rápidas para codificação
- **.ai-context.md** - Contexto do projeto para agentes

## 🎯 Funcionalidades

### Cadastros Básicos
- ✅ Categorias (com cores)
- ✅ Pessoas
- ✅ Formas de pagamento

### Lançamentos Financeiros
- ✅ Receitas (com competência mensal)
- ✅ Despesas (Única, Parcelada, Recorrente)
- ✅ Parcelamentos (geração automática)
- ✅ Recorrências (despesas fixas)

### Relatórios
- ✅ Dashboard (indicadores em tempo real)
- ✅ Relatórios mensais
- ✅ Gastos por categoria
- ✅ Gastos por pessoa
- ✅ Evolução receitas vs despesas

## 🚀 Como Começar

1. **Clone o repositório**
```bash
git clone <repository-url>
cd casal-top
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Editar .env com suas credenciais PostgreSQL
cp .env.example .env
```

4. **Execute as migrações**
```bash
npx prisma migrate dev
```

5. **Inicie o desenvolvimento**
```bash
npm run dev
```

Acesse `http://localhost:3000`

## 🧪 Validação

O projeto possui validação automática de arquitetura:

```bash
# Validar arquitetura antes de commits
npm run validate:architecture

# Validação completa
npm run validate
```

## 📝 Regras de Desenvolvimento

### ✅ Sempre fazer
- Seguir a estrutura de domínios
- Usar Server Actions para escrita
- Validar com Zod
- Usar TypeScript estrito
- Atualizar index.ts exports

### ❌ Nunca fazer
- Violar estrutura de domínios
- Misturar responsabilidades
- Usar `any` type
- Acessar Prisma fora de repositories
- Esquecer revalidatePath

## 🔧 Configuração

### Variáveis de Ambiente
```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

### Prisma
```bash
# Visualizar banco
npx prisma studio

# Criar migração
npx prisma migrate dev --name migration_name

# Gerar client
npx prisma generate
```

## 📊 Banco de Dados

### Entidades Principais
- User
- Person
- Category
- PaymentMethod
- Income
- Expense
- InstallmentGroup
- RecurringExpense

## 🤖 Desenvolvimento com Agentes de IA

Este projeto é otimizado para desenvolvimento com agentes de IA (Claude, GPT, Gemini, SWE-1.6).

### Para Agentes de IA:
1. Leia AGENTS.md primeiro
2. Siga os padrões estabelecidos
3. Execute validação de arquitetura
4. Mantenha a consistência

## 🚦 Status do Projeto

- ✅ Estrutura base
- ✅ Cadastros básicos
- ✅ Receitas e despesas
- ✅ Parcelamentos
- ✅ Recorrências
- ✅ Dashboard
- ✅ Relatórios
- ⏳ Autenticação (TODO)
- ⏳ Testes automatizados (TODO)
- ⏳ Exportação de dados (TODO)

## 📄 Licença

Este projeto é privado e confidencial.

---

**Desenvolvido com ❤️ para facilitar a vida financeira familiar**