'use client'

import React from 'react'
import { Button } from '@/shared/ui/Button'
import { deleteInstallmentGroup, deleteFutureInstallments } from '../actions'
import { useRouter } from 'next/navigation'

interface InstallmentListProps {
  groups: Array<{
    id: string
    description: string
    totalAmount: number
    numberOfInstallments: number
    firstInstallmentDate: string
    createdAt: string
    expenses?: Array<{
      id: string
      date: string
      amount: number
      installmentNumber: number
    }>
  }>
}

export const InstallmentList: React.FC<InstallmentListProps> = ({ groups }) => {
  const router = useRouter()

  const handleDeleteGroup = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir todo o parcelamento? Todas as parcelas serão excluídas.')) {
      await deleteInstallmentGroup(id)
      router.refresh()
    }
  }

  const handleDeleteFuture = async (groupId: string, currentNumber: number) => {
    if (confirm(`Tem certeza que deseja excluir as parcelas futuras a partir da ${currentNumber + 1}?`)) {
      await deleteFutureInstallments(groupId, currentNumber)
      router.refresh()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (groups.length === 0) {
    return <p className="text-gray-500">Nenhum parcelamento cadastrado</p>
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{group.description}</h3>
              <p className="text-sm text-gray-600">
                {group.numberOfInstallments}x de {formatCurrency(group.totalAmount / group.numberOfInstallments)}
              </p>
              <p className="text-sm text-gray-600">
                Total: {formatCurrency(group.totalAmount)}
              </p>
            </div>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => handleDeleteGroup(group.id)}
            >
              Excluir Tudo
            </Button>
          </div>
          
          {group.expenses && group.expenses.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Parcelas</h4>
              <div className="space-y-2">
                {group.expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{expense.installmentNumber}/{group.numberOfInstallments}</span>
                      <span className="text-sm">{formatDate(expense.date)}</span>
                      <span className="text-sm font-medium">{formatCurrency(expense.amount)}</span>
                    </div>
                    {expense.installmentNumber < group.numberOfInstallments && (
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteFuture(group.id, expense.installmentNumber)}
                      >
                        Excluir Futuras
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}