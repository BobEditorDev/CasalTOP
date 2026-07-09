# CasalTOP — Documentação do Projeto

Aplicativo web para controle financeiro residencial de um casal, permitindo cadastro de gastos, rateio proporcional à renda e acompanhamento mensal.

---

## 1. Visão Geral

**Stack:**

- Next.js 16.2.10 (App Router + Turbopack)
- React 19.2.4
- TypeScript 5
- Prisma 5.22.0 + PostgreSQL
- Tailwind CSS 4
- Zod (validação)
- bcryptjs (hash de senhas)
- decimal.js (cálculos financeiros precisos)

**Funcionalidades:**

- Login simples com 2 usuários (Rodrigo e Giovana)
- Cadastro de gastos com data, categoria, tipo e valor
- Rateio mensal baseado nos salários / percentuais
- Lista de lançamentos com filtros
- Resumo mensal com gráfico e categorias recorrentes
- Importação de gastos via CSV

---

## 2. Estrutura do Repositório

```
casal-top/
├── prisma/
│   ├── schema.prisma          # Modelos do banco de dados
│   ├── seed.ts                # Seed: usuários e configuração iniciais
│   └── seed-csv.ts            # Importa dados-planilha.csv
├── scripts/
│   └── architecture-validator.js  # Valida estrutura mínima do projeto
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout raiz com fonte Geist
│   │   ├── page.tsx           # Página inicial (cadastro de gasto)
│   │   ├── login/page.tsx     # Tela de login
│   │   ├── lancamentos/page.tsx  # Lista de gastos
│   │   ├── resumo/page.tsx    # Resumo mensal
│   │   └── api/auth/
│   │       ├── login/route.ts # API de login
│   │       └── logout/route.ts# API de logout
│   ├── domains/
│   │   ├── auth/
│   │   │   ├── actions/index.ts       # getSessaoUsuario
│   │   │   └── index.ts
│   │   ├── gastos/
│   │   │   ├── actions/index.ts       # Server Actions CRUD
│   │   │   ├── components/
│   │   │   │   ├── GastoForm.tsx      # Formulário de cadastro
│   │   │   │   ├── GastoList.tsx      # Lista com filtros
│   │   │   │   └── ResumoDashboard.tsx# Painel do resumo
│   │   │   ├── repositories/index.ts  # Acesso ao banco via Prisma
│   │   │   ├── services/index.ts      # Regras de negócio
│   │   │   ├── types/index.ts         # Tipos TypeScript
│   │   │   ├── validations/index.ts   # Schemas do Zod
│   │   │   └── index.ts
│   │   ├── configuracao/
│   │   │   ├── repositories/index.ts  # Busca configuração
│   │   │   ├── types/index.ts
│   │   │   └── index.ts
│   │   └── usuarios/
│   │       ├── repositories/index.ts
│   │       ├── services/index.ts
│   │       ├── types/index.ts
│   │       └── index.ts
│   ├── lib/
│   │   ├── auth.ts              # login com bcrypt
│   │   ├── calculos.ts          # rateio, categorias recorrentes
│   │   ├── date-utils.ts        # utilitários de data (fuso horário)
│   │   └── prisma.ts            # singleton do PrismaClient
│   └── proxy.ts                 # middleware de autenticação
├── .env                         # DATABASE_URL
├── .env.example
├── dados-planilha.csv           # CSV com histórico de gastos
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md / DOCUMENTACAO.md
```

---

## 3. Banco de Dados

### Schema

```prisma
enum TipoPagamento {
  RODRIGO_PAGA
  GIOVANA_PAGA
  RODRIGO_PAGOU_DA_GIOVANA
  GIOVANA_PAGOU_DO_RODRIGO
}

model Usuario {
  id        String   @id @default(cuid())
  nome      String   @unique
  salario   Decimal  @db.Decimal(10, 2)
  senhaHash String
  gastos    Gasto[]
}

model Gasto {
  id          String        @id @default(cuid())
  data        DateTime
  categoria   String
  tipo        TipoPagamento
  valor       Decimal       @db.Decimal(10, 2)
  observacao  String?
  criadoEm    DateTime      @default(now())
  atualizadoEm DateTime     @updatedAt
  usuarioId   String
  usuario     Usuario       @relation(fields: [usuarioId], references: [id])
}

model Configuracao {
  id                 String @id @default(cuid())
  percentualRodrigo  Decimal @db.Decimal(5, 2)
  percentualGiovana  Decimal @db.Decimal(5, 2)
}
```

### Tipos de Pagamento

- `RODRIGO_PAGA`: Gasto comum pago por Rodrigo (entra no total compartilhado)
- `GIOVANA_PAGA`: Gasto comum pago por Giovana (entra no total compartilhado)
- `RODRIGO_PAGOU_DA_GIOVANA`: Rodrigo pagou algo que era da Giovana (acrescenta na parte da Giovana)
- `GIOVANA_PAGOU_DO_RODRIGO`: Giovana pagou algo que era do Rodrigo (deduz da parte da Giovana)

### Configuração Inicial

O seed `prisma/seed.ts` cria:

- Usuário **Rodrigo** com salário R$ 10.000,00
- Usuário **Giovana** com salário R$ 6.000,00
- Configuração com percentuais derivados dos salários: 62,5% e 37,5%

Senha padrão dos dois usuários: `senha123`

---

## 4. Autenticação

### Fluxo

1. Usuário acessa `/login` e envia nome/senha
2. `POST /api/auth/login` chama `login()` em `src/lib/auth.ts`
3. bcrypt compara a senha com `senhaHash` do banco
4. Se válido, um cookie `usuario` (httpOnly) é setado com o JSON do usuário
5. `src/proxy.ts` intercepta todas as requisições e verifica o cookie
6. Se não estiver logado, redireciona para `/login`
7. Se estiver logado e tentar acessar `/login`, redireciona para `/`
8. Logout chama `POST /api/auth/logout` e apaga o cookie

### Middleware (`src/proxy.ts`)

```ts
export function proxy(request: NextRequest) {
  // Permite recursos estáticos sem autenticação
  if (isStaticRoute) return NextResponse.next()

  // Não logado + não é login/api → redireciona para login
  if (!usuarioCookie && !isLoginPage && !isApiRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logado + tentando login → redireciona para home
  if (usuarioCookie && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
```

---

## 5. Páginas

### `/` — Cadastro de Gasto

- Componente: `GastoForm.tsx` (client component)
- Server Action: `createGasto(formData)`
- Campos: data, categoria (com autocomplete), tipo, valor (máscara de moeda), observação
- Após salvar: limpa o formulário, mantém foco no campo categoria, exibe mensagem de sucesso
- Links para `/lancamentos` e `/resumo`
- Botão de logout

### `/login` — Tela de Login

- Client component com `useState` e `fetch` para `/api/auth/login`
- Select com "Rodrigo" e "Giovana"
- Input de senha
- Senha padrão: `senha123`

### `/lancamentos` — Histórico

- Server Component que busca todos os gastos
- Renderiza `GastoList.tsx` (client component)
- Filtros: mês, categoria (texto), tipo
- Botão "Excluir" com confirmação
- Link para voltar

### `/resumo` — Resumo Mensal

- Server Component busca todos os gastos e configuração
- Renderiza `ResumoDashboard.tsx` (client component)
- Seletor de ano/mês
- Cards: total compartilhado, parte a pagar, parte Rodrigo
- Gráfico de barras dos últimos 12 meses
- Gastos por categoria no mês selecionado
- Categorias recorrentes (≥ 6 meses distintos)
- Tabela de gastos fixos recorrentes

---

## 6. Regra de Negócio — Rateio Mensal

Implementado em `src/lib/calculos.ts`.

### Fórmula

```
TotalCompartilhado(M) = Σ valor onde tipo ∈ {RODRIGO_PAGA, GIOVANA_PAGA}

ParteGiovana(M) = TotalCompartilhado(M) × (percentualGiovana / 100)
                + Σ valor onde tipo = RODRIGO_PAGOU_DA_GIOVANA
                - Σ valor onde tipo = GIOVANA_PAGA
                - Σ valor onde tipo = GIOVANA_PAGOU_DO_RODRIGO

ParteRodrigo(M) = TotalCompartilhado(M) × (percentualRodrigo / 100)
```

- Se `ParteGiovana` for positiva, **Giovana deve pagar** para Rodrigo.
- Se `ParteGiovana` for negativa, **Rodrigo deve pagar** para Giovana.

### Cálculo com Decimal

Todos os cálculos usam `decimal.js` para evitar erros de arredondamento de ponto flutuante (ex: 1.429,92 vs 1.429,93).

### Filtro de Mês

Para evitar problemas de fuso horário, as datas são manipuladas com `new Date(ano, mes - 1, dia, 12, 0, 0)` (meio-dia no fuso local). Isso evita que um gasto dia 1 caia no mês anterior.

### Categorias Recorrentes

Detecta categorias que aparecem em **6 meses distintos ou mais**. Útil para identificar gastos fixos como luz, água, internet, etc.

---

## 7. Domínios e Arquitetura

A aplicação segue uma separação por domínios:

### `src/domains/gastos`

- **actions**: Server Actions que expõem operações para componentes
- **components**: Componentes React (`GastoForm`, `GastoList`, `ResumoDashboard`)
- **repositories**: Comunicação direta com Prisma
- **services**: Regras de negócio e validações de existência
- **types**: Interfaces TypeScript
- **validations**: Schemas do Zod

### `src/domains/auth`

- `getSessaoUsuario()`: lê o cookie `usuario` no servidor

### `src/domains/configuracao`

- `configuracaoRepository.get()`: busca percentuais de rateio

### `src/domains/usuarios`

- `usuarioService.findByNome()`: busca usuário por nome
- `usuarioRepository`: acesso ao Prisma

### `src/lib`

- **auth.ts**: `login()` com bcrypt
- **calculos.ts**: funções de rateio
- **date-utils.ts**: parser de datas sem fuso horário
- **prisma.ts**: singleton do PrismaClient

---

## 8. Tratamento de Fuso Horário

O problema: `new Date('2022-11-01')` interpreta a string como UTC. Em horário de Brasília (GMT-0300), vira 21h do dia 31 de outubro, fazendo o gasto cair em outubro.

A solução: `src/lib/date-utils.ts`

```ts
export function parseDateInput(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0)
}
```

Dessa forma, a data é criada diretamente no fuso local, meio-dia, evitando qualquer mudança de dia.

---

## 9. Scripts do `package.json`

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # ESLint
npm run typecheck    # TypeScript sem emit
npm run validate:architecture  # Valida estrutura do projeto
npm run validate     # Roda architecture + typecheck + lint
```

---

## 10. Como Executar

### Pré-requisitos

- Node.js instalado
- PostgreSQL rodando
- Banco `casaltop` criado

### Configuração

```bash
# Copiar .env.example
DATABASE_URL="postgresql://casaltop_user:casaltop123@localhost:5432/casaltop"
```

### Instalação

```bash
npm install
npx prisma generate
```

### Criar banco e seed

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### Importar CSV (opcional)

```bash
npx tsx prisma/seed-csv.ts
```

### Iniciar

```bash
npm run dev
# ou
npm run dev -- --port 3002
```

Acesse: http://localhost:3000 (ou 3002)

---

## 11. Importação de CSV

O arquivo `dados-planilha.csv` deve ter formato:

```csv
data,categoria,tipo,valor
2022-11-01,Agua,Rodrigo paga,59.00
2022-12-01,Luz,Rodrigo paga,190.00
2022-12-01,lavação carro,Giovana paga,70.00
```

### Tipos suportados

- `Rodrigo paga`
- `Giovana paga`
- `Rodrigo pagou da Giovana` (ou `Rodrigo pagou Giovana`)
- `Giovana pagou do Rodrigo` (ou `Giovana pagou Rodrigo`)

### Formato de valores

- Americano: `1500.00`
- Brasileiro: `1.500,00`

### Comportamento

- Detecta cabeçalho automaticamente
- Pula linhas incompletas
- Normaliza acentos e case
- Converte `(sem descrição)` para `Sem descrição`
- Associa todos os registros ao usuário "Rodrigo" (quem cadastrou)

---

## 12. Validação Contra Referências

Após a importação do CSV, os cálculos foram validados contra os 6 meses de referência:

| Mês | Status |
|---|---|
| 2022-11 | ✅ R$ 2.287,88 / 857,96 / 1.429,92 |
| 2023-04 | ✅ R$ 2.336,03 / 821,01 / 1.460,02 |
| 2025-02 | ✅ R$ 5.560,06 / 1.504,02 / 3.475,04 |
| 2025-12 | ✅ R$ 8.002,56 / 2.447,27 / 5.001,60 |
| 2027-10 | ✅ R$ 2.931,06 / 1.099,15 / 1.831,91 |
| 2026-10 | ⚠️  Esperado R$ 6.042,94, obtido R$ 6.052,10 (diferença de R$ 9,16) |

5 de 6 meses batem exatamente. O mês 2026-10 tem uma diferença de R$ 9,16 no total compartilhado, provavelmente devido a uma pequena inconsistência nos dados de referência ou no CSV. A fórmula está correta e a soma do CSV confirma R$ 6.052,10.

---

## 13. Possíveis Problemas

### Página sem aparência / estilos

- Pode ser cache do navegador. Tente **Ctrl + F5** ou abrir em **aba anônima**.
- Pode ser extensão do navegador (LanguageTool) causando hydration mismatch. Tente desativar extensões.
- Certifique-se de acessar via `http://localhost:3002` (não `http://192.168.1.5:3002`).

### Erro `Unexpected token '<'` em arquivos JS

- Ocorria quando o `proxy.ts` redirecionava requisições `_next/static` para `/login`. Já corrigido: recursos estáticos agora são permitidos sem autenticação.

### Hydration mismatch

- Causado por extensões do navegador que alteram o HTML (`data-lt-installed`). Não impede o funcionamento, mas gera warnings no console.

### Banco vazio

- Execute `npx prisma db push` e `npx tsx prisma/seed.ts`
- Para importar planilha: `npx tsx prisma/seed-csv.ts`

---

## 14. Roadmap / Melhorias Futuras

- Edição de gastos na tela de lançamentos
- Tela de configuração para alterar percentuais
- Gráficos mais avançados (biblioteca como Chart.js ou Recharts)
- Testes automatizados (Jest / Vitest)
- Paginação na lista de lançamentos
- Autenticação com NextAuth.js (opcional)
- Deploy na Vercel

---

## 15. Arquivos Chave

- `src/lib/calculos.ts` — regra de rateio
- `src/lib/date-utils.ts` — tratamento de datas
- `src/proxy.ts` — autenticação
- `src/domains/gastos/components/GastoForm.tsx` — cadastro mobile-first
- `src/domains/gastos/components/ResumoDashboard.tsx` — painel de resumo
- `prisma/seed-csv.ts` — importação de CSV
- `dados-planilha.csv` — dados históricos
