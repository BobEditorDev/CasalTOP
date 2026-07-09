'use client'

import React from 'react'
import { Button } from '@/shared/ui/Button'
import { deletePaymentMethod } from '../actions'
import { useRouter } from 'next/navigation'

interface PaymentMethodListProps {
  paymentMethods: Array<{
    id: string
    name: string
  }>
}

export const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ paymentMethods }) => {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta forma de pagamento?')) {
      await deletePaymentMethod(id)
      router.refresh()
    }
  }

  if (paymentMethods.length === 0) {
    return <p className="text-gray-500">Nenhuma forma de pagamento cadastrada</p>
  }

  return (
    <ul className="space-y-2">
      {paymentMethods.map((method) => (
        <li key={method.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span>{method.name}</span>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleDelete(method.id)}
          >
            Excluir
          </Button>
        </li>
      ))}
    </ul>
  )
}