'use client'

import React, { useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { createRecurringExpense, updateRecurringExpense } from '../actions'

interface RecurringExpenseFormProps {
  recurringExpense?: {
    id: string
    description: string
    amount: number
    day: number
    active: boolean
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export const RecurringExpenseForm: React.FC<RecurringExpenseFormProps> = ({
  recurringExpense,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    description: recurringExpense?.description || '',
    amount: recurringExpense?.amount ? recurringExpense.amount.toString() : '',
    day: recurringExpense?.day?.toString() || '1',
    active: recurringExpense?.active ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('description', formData.description)
      data.append('amount', formData.amount)
      data.append('day', formData.day)
      data.append('active', formData.active.toString())

      if (recurringExpense) {
        await updateRecurringExpense(recurringExpense.id, data)
      } else {
        await createRecurringExpense(data)
      }

      onSuccess?.()
      setFormData({
        description: '',
        amount: '',
        day: '1',
        active: true,
      })
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ form: error.message })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Descrição"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        required
      />

      <Input
        label="Valor"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        error={errors.amount}
        required
      />

      <Input
        label="Dia do Vencimento"
        type="number"
        min="1"
        max="31"
        value={formData.day}
        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
        error={errors.day}
        required
      />

      {recurringExpense && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-700">
            Ativo
          </label>
        </div>
      )}

      {errors.form && (
        <div className="text-red-600 text-sm">{errors.form}</div>
      )}

      <div className="flex space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : recurringExpense ? 'Atualizar' : 'Criar'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}