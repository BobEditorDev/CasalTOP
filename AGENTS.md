# CasalTOP - Guia para Agentes de IA

## 🏗️ Arquitetura do Sistema

### Visão Geral
Este é um sistema financeiro residencial construído com:
- **Next.js 16** (App Router) - Framework React com Server Components
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Prisma ORM** - Acesso ao banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas

### Princípios Arquiteturais

1. **Feature First Architecture**: Cada domínio é independente e auto-contido
2. **Separação de Responsabilidades**: Actions, Services, Repositories, Components
3. **Server Actions**: Operações de escrita sempre via Server Actions
4. **Type Safety**: TypeScript estrito em todo o código
5. **Validação**: Zod para todas as entradas de dados

## 📁 Estrutura de Diretórios

```
src/
├── app/                    # Rotas Next.js (App Router)
│   ├── layout.tsx         # Layout raiz com Sidebar
│   ├── page.tsx           # Dashboard
│   ├── incomes/           # Página de receitas
│   ├── expenses/          # Página de despesas
│   ├── installments/      # Página de parcelamentos
│   ├── recurring/         # Página de recorrências
│   ├── categories/        # Página de categorias
│   ├── people/            # Página de pessoas
│   ├── payment-methods/   # Página de formas de pagamento
│   └── reports/           # Página de relatórios
│
├── domains/               # Domínios de negócio (Feature First)
│   ├── auth/             # Autenticação (pendente implementação)
│   ├── dashboard/       # Dashboard - leitura apenas
│   ├── expenses/        # Despesas - CRUD completo
│   ├── incomes/         # Receitas - CRUD completo
│   ├── installments/    # Parcelamentos - lógica complexa
│   ├── recurring/       # Recorrências - despesas fixas
│   ├── reports/         # Relatórios - consultas apenas
│   ├── categories/      # Categorias - CRUD simples
│   ├── people/          # Pessoas - CRUD simples
│   └── payment-methods/ # Formas de pagamento - CRUD simples
│
├── shared/              # Recursos compartilhados
│   ├── ui/             # Componentes UI reutilizáveis
│   ├── components/     # Componentes compartilhados (Sidebar)
│   ├── lib/            # Bibliotecas utilitárias (prisma)
│   ├── hooks/          # Hooks React personalizados
│   ├── utils/          # Funções utilitárias
│   ├── constants/      # Constantes globais
│   └── types/          # Tipos TypeScript compartilhados
│
└── lib/                # Configurações (prisma client)
```

## 🎯 Estrutura Padrão de Domínio

Cada domínio DEVE seguir exatamente esta estrutura:

```
domain-name/
├── actions/          # Server Actions (operações de escrita)
├── components/       # Componentes React específicos do domínio
├── repositories/     # Acesso ao banco via Prisma
├── services/         # Regras de negócio
├── types/           # Definições TypeScript
├── validations/     # Schemas Zod
├── utils/           # Funções utilitárias do domínio
└── index.ts         # Exportações públicas do domínio
```

## 📋 Regras de Ouro para Agentes de IA

### 1. NUNCA violar a estrutura de domínios
- ✅ SEMPRE seguir a estrutura padrão de domínios
- ❌ NUNCA criar arquivos fora da estrutura definida
- ❌ NUNCA misturar responsabilidades entre pastas

### 2. Separação de Responsabilidades
- **actions/**: Apenas Server Actions (`'use server'`)
- **repositories/**: Apenas acesso ao Prisma, sem lógica de negócio
- **services/**: Apenas regras de negócio, sem acesso direto ao Prisma
- **components/**: Apenas componentes React, sem lógica de negócio
- **types/**: Apenas definições TypeScript
- **validations/**: Apenas schemas Zod

### 3. Server Actions Obrigatórios
- TODAS operações de escrita DEVEM usar Server Actions
- NUNCA usar mutações diretas em componentes
- SEMPRE usar `revalidatePath` após mutações

### 4. Validação com Zod
- TODAS entradas de dados DEVEM ser validadas com Zod
- NUNCA confiar em dados não validados
- SEMPRE usar schemas tipados (`z.infer<>`)

### 5. TypeScript Estrito
- NUNCA usar `any`
- SEMPRE tipar todas as funções e parâmetros
- NUNCA ignorar erros de TypeScript

### 6. Componentes React
- Componentes de domínio em `domains/*/components/`
- Componentes compartilhados em `shared/ui/` ou `shared/components/`
- NUNCA colocar lógica de negócio em componentes
- SEMPRE usar `'use client'` em componentes interativos

### 7. Acesso ao Banco
- Apenas repositories podem acessar o Prisma
- Services usam repositories, nunca Prisma diretamente
- Actions usam services, nunca repositories diretamente

### 8. Navegação e Rotas
- Rotas em `app/` seguem estrutura do Next.js App Router
- NUNCA criar rotas fora de `app/`
- SEMPRE usar Server Components por padrão

## 🚫 Regras de Não Regressão

### 1. Testes antes de alterações
- Antes de modificar um domínio, verificar dependências
- Testar fluxos completos após alterações
- NUNCA modificar estrutura de domínios sem revisão

### 2. Mudanças de Schema
- TODAS mudanças no Prisma schema DEVEM ser migradas
- NUNCA modificar schema sem executar `npx prisma migrate`
- SEMPRE manter histórico de migrações

### 3. Breaking Changes
- NUNCA remover campos sem verificar uso
- SEMPRE marcar como deprecated antes de remover
- NUNCA alterar assinaturas de funções públicas sem revisão

### 4. Performance
- NUNCA fazer N+1 queries no Prisma
- SEMPRE usar `include` ou `select` para otimizar queries
- NUNCA carregar dados desnecessários

### 5. Segurança
- NUNCA expor credenciais no código
- SEMPRE validar inputs no servidor
- NUNCA confiar apenas em validação client-side

## 🤖 Otimizações para Agentes de IA

### 1. Contexto Claro
- Cada domínio tem `index.ts` com exportações organizadas
- Types e validations são importados de forma consistente
- Nomes de arquivos e funções são descritivos

### 2. Padrões Consistentes
- Todos os domínios seguem a mesma estrutura
- Nomes de funções seguem convenção: `get*`, `create*`, `update*`, `delete*`
- Estrutura de tipos é consistente entre domínios

### 3. Documentação Inline
- Types são auto-documentados
- Schemas Zod têm mensagens de erro claras
- Funções complexas têm comentários explicativos

### 4. Separação Clara
- Regras de negócio isoladas em services
- Lógica de UI isolada em components
- Acesso a dados isolado em repositories

### 5. Importações Padronizadas
```typescript
// Sempre usar esta ordem:
import React from 'react'
import { Component } from '@/shared/ui/Component'
import { action } from '@/domains/my-domain/actions'
import { type } from '@/domains/my-domain/types'
```

## 🛠️ Padrões de Código

### Server Actions Pattern
```typescript
'use server'

import { service } from '../services'
import { schema } from '../validations'
import { revalidatePath } from 'next/cache'

export async function createAction(formData: FormData) {
  const data = {
    // extrair dados do formData
  }
  
  const validated = schema.parse(data)
  await service.create(validated)
  revalidatePath('/route')
}
```

### Service Pattern
```typescript
import { repository } from '../repositories'
import { InputType } from '../validations'

export class Service {
  async create(data: InputType) {
    return repository.create(data)
  }
  
  async update(id: string, data: Partial<InputType>) {
    const existing = await repository.findById(id)
    if (!existing) {
      throw new Error('Entidade não encontrada')
    }
    return repository.update(id, data)
  }
}
```

### Repository Pattern
```typescript
import { prisma } from '@/lib/prisma'
import { EntityType, CreateInput, UpdateInput } from '../types'

export class Repository {
  async findAll(): Promise<EntityType[]> {
    return prisma.entity.findMany({
      include: { relations: true },
      orderBy: { field: 'desc' }
    })
  }
  
  async findById(id: string): Promise<EntityType | null> {
    return prisma.entity.findUnique({
      where: { id },
      include: { relations: true }
    })
  }
}
```

### Component Pattern
```typescript
'use client'

import React, { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { action } from '../actions'

export const Component: React.FC<Props> = ({ prop }) => {
  const [state, setState] = useState(initial)
  
  const handleSubmit = async () => {
    await action(data)
    // handle success
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  )
}
```

## 📊 Fluxo de Dados Padrão

```
User Input (Form)
    ↓
Component (Client)
    ↓
Server Action
    ↓
Validation (Zod)
    ↓
Service (Business Logic)
    ↓
Repository (Prisma)
    ↓
Database (PostgreSQL)
```

## ⚠️ Pontos de Atenção

### 1. Autenticação
- Atualmente usando usuário hardcoded 'default-user'
- TODO: Implementar autenticação real (NextAuth ou similar)
- TODO: Adicionar middleware de autenticação

### 2. Tratamento de Erros
- Erros são lançados como strings simples
- TODO: Implementar sistema de erros estruturado
- TODO: Adicionar logging de erros

### 3. Testes
- Sem testes automatizados
- TODO: Adicionar testes unitários para services
- TODO: Adicionar testes de integração para actions

### 4. Performance
- Sem otimizações de cache
- TODO: Implementar cache onde apropriado
- TODO: Adicionar loading states

### 5. Internacionalização
- Textos em português hardcoded
- TODO: Implementar i18n se necessário

## 🎯 Checklist para Novas Features

Antes de implementar uma nova feature:

- [ ] Identificar o domínio correto ou criar novo
- [ ] Seguir estrutura padrão de domínios
- [ ] Criar types primeiro
- [ ] Criar validations com Zod
- [ ] Implementar repository
- [ ] Implementar service com regras de negócio
- [ ] Implementar server actions
- [ ] Criar componentes React
- [ ] Adicionar rota em app/
- [ ] Atualizar sidebar se necessário
- [ ] Testar fluxo completo
- [ ] Atualizar documentação

## 🔄 Padrões de Refatoração

### Adicionar campo a entidade existente:
1. Adicionar campo ao type em `types/`
2. Adicionar validação em `validations/`
3. Atualizar schema Prisma
4. Executar migração
5. Atualizar repository se necessário
6. Atualizar service se necessário
7. Atualizar actions se necessário
8. Atualizar components

### Criar novo domínio:
1. Criar estrutura de pastas padrão
2. Definir types em `types/`
3. Criar validations em `validations/`
4. Implementar repository
5. Implementar service
6. Implementar actions
7. Criar components
8. Criar rota em app/
9. Adicionar ao sidebar
10. Testar integração

## 📞 Suporte e Manutenção

### Debugging
- Logs de erros aparecem no console do servidor
- Verificar network tab para requests falhando
- Usar Prisma Studio para inspecionar banco: `npx prisma studio`

### Comandos Úteis
```bash
# Desenvolvimento
npm run dev

# Banco de dados
npx prisma studio
npx prisma migrate dev
npx prisma generate

# TypeScript
npx tsc --noEmit

# Lint
npm run lint
```

### Problemas Comuns
- **Erro de Prisma**: Verificar se DATABASE_URL está correto
- **Erro de TypeScript**: Verificar imports e types
- **Erro de Build**: Limpar cache: `rm -rf .next`
- **Erro de Banco**: Verificar se PostgreSQL está rodando

## 🎓 Convenções de Nomenclatura

### Arquivos
- Components: PascalCase (e.g., `IncomeForm.tsx`)
- Services: PascalCase + Service (e.g., `IncomeService`)
- Repositories: PascalCase + Repository (e.g., `IncomeRepository`)
- Types: camelCase (e.g., `index.ts`)
- Actions: camelCase (e.g., `index.ts`)

### Variáveis e Funções
- camelCase para variáveis e funções
- PascalCase para classes e interfaces
- UPPER_CASE para constantes

### Componentes
- PascalCase para componentes
- Descritivo e claro (e.g., `IncomeForm` não `Form`)

## 🚀 Deploy e Produção

### Variáveis de Ambiente
- `DATABASE_URL`: String de conexão PostgreSQL
- Nunca commitar `.env`
- Usar variáveis de ambiente no deploy

### Build
```bash
npm run build
npm start
```

### Vercel
- Projeto configurado para Vercel
- Adicionar variáveis de ambiente no dashboard
- Deploy automático via git push

---

**IMPORTANTE**: Este guia é VIVO. Sempre que adicionar ou modificar padrões, atualize este documento.

**Última atualização**: 2026-07-09
**Versão**: 1.0.0