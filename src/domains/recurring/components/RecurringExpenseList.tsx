'use client'

import React from 'react'
import { Button } from '@/shared/ui/Button'
import { deactivateRecurringExpense, deleteRecurringExpense } from '../actions'
import { useRouter } from 'next/navigation'

interface RecurringExpenseListProps {
  recurringExpenses: Array<{
    id: string
    description: string
    amount: number
    day: number
    active: boolean
    createdAt: string
    expenses?: Array<{
      id: string
      date: string
      amount: number
    }>
  }>
}

export const RecurringExpenseList: React.FC<RecurringExpenseListProps> = ({ recurringExpenses }) => {
  const router = useRouter()

  const handleDeactivate = async (id: string) => {
    if (confirm('Tem certeza que deseja desativar esta despesa recorrente? Os lançamentos anteriores serão mantidos.')) {
      await deactivateRecurringExpense(id)
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa recorrente? Ela será desativada e os lançamentos anteriores serão mantidos.')) {
      await deleteRecurringExpense(id)
      router.refresh()
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (recurringExpenses.length === 0) {
    return <p className="text-gray-500">Nenhuma despesa recorrente cadastrada</p>
  }

  return (
    <div className="space-y-4">
      {recurringExpenses.map((recurring) => (
        <div key={recurring.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-lg">{recurring.description}</h3>
                {!recurring.active && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    Inativo
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Dia {recurring.day} • {formatCurrency(recurring.amount)}
              </p>
              {recurring.expenses && recurring.expenses.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {recurring.expenses.length} lançamento(s) gerado(s)
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              {recurring.active ? (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleDeactivate(recurring.id)}
                >
                  Desativar
                </Button>
              ) : (
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(recurring.id)}
                >
                  Excluir
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}