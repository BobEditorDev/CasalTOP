'use client'

import React from 'react'
import { Button } from '@/shared/ui/Button'
import { deleteExpense } from '../actions'
import { useRouter } from 'next/navigation'

interface ExpenseListProps {
  expenses: Array<{
    id: string
    date: Date | string
    competence: Date | string
    description: string
    amount: number
    observation?: string | null | undefined
    type: 'UNIQUE' | 'INSTALLMENT' | 'RECURRING'
    person?: {
      id: string
      name: string
    }
    category?: {
      id: string
      name: string
      color?: string | null
    }
    paymentMethod?: {
      id: string
      name: string
    }
  }>
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      await deleteExpense(id)
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'UNIQUE': return 'Única'
      case 'INSTALLMENT': return 'Parcelada'
      case 'RECURRING': return 'Recorrente'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'UNIQUE': return 'bg-gray-100 text-gray-800'
      case 'INSTALLMENT': return 'bg-blue-100 text-blue-800'
      case 'RECURRING': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (expenses.length === 0) {
    return <p className="text-gray-500">Nenhuma despesa cadastrada</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Data</th>
            <th className="text-left p-3">Competência</th>
            <th className="text-left p-3">Descrição</th>
            <th className="text-left p-3">Tipo</th>
            <th className="text-left p-3">Pessoa</th>
            <th className="text-left p-3">Categoria</th>
            <th className="text-left p-3">Valor</th>
            <th className="text-left p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{formatDate(expense.date)}</td>
              <td className="p-3">{formatDate(expense.competence)}</td>
              <td className="p-3">{expense.description}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(expense.type)}`}>
                  {getTypeLabel(expense.type)}
                </span>
              </td>
              <td className="p-3">{expense.person?.name || '-'}</td>
              <td className="p-3">{expense.category?.name || '-'}</td>
              <td className="p-3 text-red-600 font-medium">{formatCurrency(expense.amount)}</td>
              <td className="p-3">
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
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