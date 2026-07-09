'use client'

import React from 'react'
import { Button } from '@/shared/ui/Button'
import { deleteIncome } from '../actions'
import { useRouter } from 'next/navigation'

interface IncomeListProps {
  incomes: Array<{
    id: string
    date: Date | string
    competence: Date | string
    description: string
    amount: number
    observation?: string | null | undefined
    person?: {
      id: string
      name: string
    }
  }>
}

export const IncomeList: React.FC<IncomeListProps> = ({ incomes }) => {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      await deleteIncome(id)
      router.refresh()
    }
  }

  const formatDate = (dateString: Date | string) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (incomes.length === 0) {
    return <p className="text-gray-500">Nenhuma receita cadastrada</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Data</th>
            <th className="text-left p-3">Competência</th>
            <th className="text-left p-3">Descrição</th>
            <th className="text-left p-3">Pessoa</th>
            <th className="text-left p-3">Valor</th>
            <th className="text-left p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{formatDate(income.date)}</td>
              <td className="p-3">{formatDate(income.competence)}</td>
              <td className="p-3">{income.description}</td>
              <td className="p-3">{income.person?.name || '-'}</td>
              <td className="p-3 text-green-600 font-medium">{formatCurrency(income.amount)}</td>
              <td className="p-3">
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(income.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}